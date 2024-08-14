import { gql } from '@apollo/client';

export const GET_TRANSLATIONS = gql`
	query GetTranslations {
		translations {
			id
			language
			key
			value
		}
	}
`;
