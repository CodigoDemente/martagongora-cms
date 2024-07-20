import { gql } from '@apollo/client';

export const DELETE_TRANSLATIONS = gql`
	mutation DeleteTranslations($input: [TranslationWhereUniqueInput!]!) {
		deleteTranslations(where: $input) {
			id
			key
			value
			language
		}
	}
`;
