import { KeystoneContext } from '@keystone-6/core/types';
import { DatabaseTranslation, Translation } from '../types/translation';
import { TranslationMapper } from '../mappers/TranslationMapper';

export class TranslationRepository {
	constructor(private readonly context: KeystoneContext) {}

	public async getTranslations(language: string): Promise<Translation> {
		const data = (await this.context.query.Translation.findMany({
			where: {
				language: {
					equals: language
				}
			},
			query: 'id language key value',
			orderBy: {
				key: 'asc'
			}
		})) as DatabaseTranslation[];

		return TranslationMapper.toDomain(data);
	}
}
