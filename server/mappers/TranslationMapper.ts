import { setPath } from '../helpers/JSONHelper';
import { DatabaseTranslation, Translation } from '../types/translation';

export class TranslationMapper {
	public static toDomain(translations: DatabaseTranslation[]): Translation {
		return translations.reduce((acc, { key, value }) => {
			setPath(acc, key, value);
			return acc;
		}, {} as Translation);
	}
}
