import Handlebars from 'handlebars';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

import { ContactEmailData, ContactFormData, Email } from '../types/email';
import { Translation } from '../types/translation';
import { TranslationRepository } from '../repositories/TranslationRepository';
import Logger from '../Logger';
import type { Interfaces } from 'mailgun.js/definitions';

export class EmailClient {
	private mailgun: Mailgun;
	private mailgunClient: Interfaces.IMailgunClient;
	private contactTemplate: HandlebarsTemplateDelegate<ContactEmailData>;

	constructor(private readonly translationRepository: TranslationRepository) {
		this.mailgun = new Mailgun(formData);

		this.mailgunClient = this.mailgun.client({
			username: 'api',
			key: process.env.MAILGUN_API_KEY!,
			url: 'https://api.eu.mailgun.net'
		});

		const template = readFileSync(
			resolve(join(process.cwd(), 'server/views/emails', 'ContactRequest.hbs')),
			'utf-8'
		);

		this.contactTemplate = Handlebars.compile<ContactEmailData>(template);
	}

	public async sendEmail(email: Email): Promise<boolean> {
		try {
			const res = await this.mailgunClient.messages.create(process.env.MAILGUN_DOMAIN!, {
				from: process.env.MAILGUN_MAIL!,
				to: email.to,
				subject: email.subject,
				html: email.body
			});

			Logger.info(
				{
					from: process.env.MAILGUN_MAIL!,
					to: email.to,
					messageId: res.id,
					message: res.message,
					status: res.status,
					response: res.details
				},
				'Email sent'
			);

			return true;
		} catch (error) {
			Logger.error(error, 'Error sending email');

			return false;
		}
	}

	public async buildContactEmail(subject: string, data: ContactFormData): Promise<Email> {
		const translations = await this.translationRepository.getTranslations('es');

		const emailData = Object.fromEntries(
			Object.entries(data).map(([key, value]) => [
				key,
				{
					key: (((translations.contact as Translation).form as Translation).input as Translation)[
						key
					],
					value: value || '-'
				}
			])
		) as ContactEmailData;

		return {
			from: data.email,
			to: process.env.CONTACT_EMAIL!,
			subject: subject,
			body: this.contactTemplate({
				...emailData
			})
		};
	}
}
