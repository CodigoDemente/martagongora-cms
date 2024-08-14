import { KeystoneContext } from '@keystone-6/core/types';
import { by639_1 } from 'iso-language-codes';
import { LanguageNotFound } from '../errors/LanguageNotFound';
import { Language } from '../types/language';

export class LanguageRepository {
	constructor(private readonly context: KeystoneContext) {}

	public async doesLanguageExist(language: string): Promise<boolean> {
		if (!(language in by639_1)) {
			throw new LanguageNotFound(language);
		}

		const data = await this.context.query.Language.findOne({
			where: {
				code: language
			}
		});

		return !!data;
	}

	public async getAvailableLanguanges(): Promise<Language[]> {
		const languages = await this.context.query.Language.findMany({
			where: {
				enabled: {
					equals: true
				}
			},
			query: 'id code isDefault'
		});

		return languages.map((language) => ({
			id: language.id,
			code: language.code,
			isDefault: language.isDefault
		}));
	}
}
