import { list } from '@keystone-6/core';

import { text, password, timestamp, json } from '@keystone-6/core/fields';

import type { Lists } from '.keystone/types';

const sessionExists = ({ session }: { session?: unknown }) => {
	return session !== undefined;
};

export const lists: Lists = {
	User: list({
		access: {
			operation: {
				query: sessionExists,
				create: sessionExists,
				update: sessionExists,
				delete: sessionExists
			}
		},
		ui: {
			label: 'Usuarios',
			singular: 'Usuario',
			plural: 'Usuarios'
		},

		// this is the fields for our User list
		fields: {
			name: text({
				validation: {
					isRequired: true,
					length: { max: 100 }
				}
			}),

			email: text({
				validation: {
					isRequired: true,
					match: {
						regex: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
						explanation: 'Please enter a valid email address'
					}
				},
				isIndexed: 'unique'
			}),

			password: password({
				validation: {
					isRequired: true,
					length: { min: 8 },
					match: {
						regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
						explanation:
							'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'
					}
				}
			}),

			createdAt: timestamp({
				defaultValue: { kind: 'now' }
			})
		}
	}),

	Configuration: list({
		fields: {
			name: text({
				isIndexed: 'unique'
			}),
			value: json()
		},
		access: {
			operation: {
				query: (args) => {
					console.log('Querying Configuration', args.session);
					const res = sessionExists(args);
					console.log(res);

					return res;
				},
				create: sessionExists,
				update: sessionExists,
				delete: sessionExists
			}
		},
		ui: {
			isHidden: true
		}
	})

	// Language: list({
	// 	access: {
	// 		operation: {
	// 			query: allowAll,
	// 			create: sessionExists,
	// 			update: sessionExists,
	// 			delete: sessionExists
	// 		}
	// 	},

	// 	ui: {
	// 		label: 'Idiomas',
	// 		singular: 'Idioma',
	// 		plural: 'Idiomas'
	// 	},

	// 	fields: {
	// 		name: text({
	// 			validation: {
	// 				isRequired: true,
	// 				length: { max: 100 }
	// 			}
	// 		}),

	// 		code: select({
	// 			isIndexed: 'unique'
	// 		}),

	// 		createdAt: timestamp({
	// 			defaultValue: { kind: 'now' }
	// 		})
	// 	}
	// })
};
