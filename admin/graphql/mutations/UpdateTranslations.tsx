import { gql } from '@apollo/client';

export const UPDATE_TRANSLATIONS = gql`
	mutation UpdateTranslations($input: [TranslationUpdateArgs!]!) {
		updateTranslations(data: $input) {
			id
			key
			value
			language
		}
	}
`;
