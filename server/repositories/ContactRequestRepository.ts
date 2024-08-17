import { KeystoneContext } from '@keystone-6/core/types';
import { ContactFormData } from '../types/email';
import { TranslationRepository } from './TranslationRepository';
import { Translation } from '../types/translation';

export class ContactRequestRepository {
	constructor(
		private readonly context: KeystoneContext,
		private readonly translationsRepository: TranslationRepository
	) {}

	public async createContactRequest(data: ContactFormData): Promise<void> {
		const translations = await this.translationsRepository.getTranslations('es');

		let text = '';

		Object.entries(data).forEach(([key, value]) => {
			const translatedKey =
				((((translations.contact as Translation)?.form as Translation)?.input as Translation)?.[
					key
				] as string) ?? key;

			text += `${translatedKey}: ${value}. `;
		});

		await this.context.query.ContactRequest.createOne({
			data: {
				data: text
			}
		});
	}
}
