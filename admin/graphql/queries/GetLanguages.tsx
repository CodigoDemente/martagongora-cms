import { gql } from '@keystone-6/core/admin-ui/apollo';

export const GET_LANGUAGES = gql`
	query GetLanguages {
		languages {
			id
			code
			isDefault
			enabled
		}
	}
`;
