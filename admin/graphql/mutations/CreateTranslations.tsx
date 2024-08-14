import { gql } from '@apollo/client';

export const CREATE_TRANSLATIONS = gql`
	mutation CreateTranslations($input: [TranslationCreateInput!]!) {
		createTranslations(data: $input) {
			id
			key
			value
			language
		}
	}
`;
