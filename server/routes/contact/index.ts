import { KeystoneContext } from '@keystone-6/core/types';
import { NextFunction, Request, Response } from 'express';

import { EmailClient } from '../../clients/EmailClient';
import { TranslationRepository } from '../../repositories/TranslationRepository';
import { ContactRequestRepository } from '../../repositories/ContactRequestRepository';
import { CouldNotSendMail } from '../../errors/CouldNotSendMail';
import { InvalidRecaptchaError } from '../../errors/InvalidRecaptchaError';
import { verifyRecaptchaToken } from '../../lib/verifyRecaptchaToken';
import { ContactFormData } from '../../types/email';
import Logger from '../../Logger';

export function createContactRequest(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const formData = req.body as ContactFormData;

			const remoteIp =
				(typeof req.headers['x-forwarded-for'] === 'string'
					? req.headers['x-forwarded-for'].split(',')[0]?.trim()
					: undefined) || req.socket.remoteAddress;

			if (
				!(await verifyRecaptchaToken(formData.recaptcha_token, {
					remoteIp,
					userAgent: req.get('user-agent') ?? undefined
				}))
			) {
				throw new InvalidRecaptchaError();
			}

			const { recaptcha_token, ...storedFormData } = formData;

			Logger.info({ body: storedFormData }, 'Contact request received');

			const context = (await commonContext.withRequest(req, res)).sudo();

			const translationRepository = new TranslationRepository(context);
			const contactRequestRepository = new ContactRequestRepository(context, translationRepository);

			await contactRequestRepository.createContactRequest(storedFormData);

			const client = new EmailClient(translationRepository);

			Logger.info({}, 'Email client created');

			const email = await client.buildContactEmail('Petición de información', storedFormData);

			Logger.info(
				{
					email: email
				},
				'Contact email built'
			);

			const result = await client.sendEmail(email);

			if (!result) {
				throw new CouldNotSendMail();
			}

			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};
}
