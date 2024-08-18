import { KeystoneContext } from '@keystone-6/core/types';
import { NextFunction, Request, Response } from 'express';

import { EmailClient } from '../../clients/EmailClient';
import { TranslationRepository } from '../../repositories/TranslationRepository';
import { ContactRequestRepository } from '../../repositories/ContactRequestRepository';
import { CouldNotSendMail } from '../../errors/CouldNotSendMail';
import { ContactFormData } from '../../types/email';

export function createContactRequest(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const context = (await commonContext.withRequest(req, res)).sudo();

			const translationRepository = new TranslationRepository(context);
			const contactRequestRepository = new ContactRequestRepository(context, translationRepository);

			const formData = req.body as ContactFormData;

			await contactRequestRepository.createContactRequest(formData);

			const client = new EmailClient(translationRepository);

			const email = await client.buildContactEmail('Petición de información', formData);

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
