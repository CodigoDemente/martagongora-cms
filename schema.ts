import codes, { by639_1 } from 'iso-language-codes';
import { allowAll } from '@keystone-6/core/access';
import { checkbox, image, json, password, select, text, timestamp } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

import validateHook from './server/hooks/Translations/validateHook';
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
						regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[.#?!@$ %^&*-]).{8,}$/,
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
				query: sessionExists,
				create: sessionExists,
				update: sessionExists,
				delete: sessionExists
			}
		},
		ui: {
			isHidden: true
		}
	}),

	Language: list({
		access: {
			operation: {
				query: allowAll,
				create: sessionExists,
				update: sessionExists,
				delete: sessionExists
			}
		},

		ui: {
			label: 'Idiomas',
			singular: 'Idioma',
			plural: 'Idiomas'
		},

		fields: {
			code: select({
				type: 'enum',
				isIndexed: 'unique',
				options: codes.map((code) => ({
					label: code.name,
					value: code.iso639_1
				})),
				isFilterable: true,
				validation: {
					isRequired: true
				},
				ui: {
					itemView: { fieldMode: 'read' },
					listView: { fieldMode: 'read' }
				},
				label: 'Idioma'
			}),

			name: text({
				ui: {
					createView: { fieldMode: 'hidden' },
					itemView: { fieldMode: 'read' },
					listView: { fieldMode: 'hidden' }
				},
				graphql: {
					omit: {
						create: true,
						update: true
					}
				}
			}),

			enabled: checkbox({
				label: 'Habilitado'
			}),

			isDefault: checkbox({
				label: 'Idioma por defecto'
			}),

			createdAt: timestamp({
				defaultValue: { kind: 'now' },
				ui: {
					createView: { fieldMode: 'hidden' },
					itemView: { fieldMode: 'read' },
					listView: { fieldMode: 'read' }
				}
			})
		},

		hooks: {
			resolveInput: ({ item, resolvedData }) => {
				const code = (resolvedData.code || item?.code) as keyof typeof by639_1;
				const name = by639_1[code]?.name;

				return {
					...resolvedData,
					name
				};
			}
		}
	}),

	Translation: list({
		fields: {
			language: text({
				validation: {
					length: { min: 2, max: 2 }
				},
				isIndexed: true
			}),
			key: text({
				validation: {
					isRequired: true
				},
				isIndexed: true
			}),
			value: text({
				validation: {
					isRequired: true
				}
			}),
			compoundKey: text({
				isIndexed: 'unique',
				ui: {
					createView: { fieldMode: 'hidden' },
					itemView: { fieldMode: 'read' },
					listView: { fieldMode: 'hidden' }
				},
				graphql: {
					omit: {
						create: true,
						update: true
					}
				}
			})
		},
		hooks: {
			resolveInput: ({ item, resolvedData }) => {
				const language = resolvedData.language || item?.language;
				const key = resolvedData.key || item?.key;

				return {
					...resolvedData,
					compoundKey: `${key}-${language}`
				};
			},
			validate: {
				create: validateHook,
				update: validateHook
			}
		},
		access: {
			operation: {
				query: allowAll,
				create: sessionExists,
				update: sessionExists,
				delete: sessionExists
			}
		},
		ui: {
			isHidden: true,
			hideCreate: true,
			hideDelete: true,
			createView: {
				defaultFieldMode: 'hidden'
			},
			listView: {
				defaultFieldMode: 'hidden'
			},
			itemView: {
				defaultFieldMode: 'hidden'
			}
		}
	}),

	ContactRequest: list({
		fields: {
			date: timestamp({
				defaultValue: { kind: 'now' },
				ui: {
					itemView: { fieldMode: 'read' },
					listView: { fieldMode: 'read' }
				}
			}),
			data: text({
				ui: {
					displayMode: 'textarea',
					itemView: { fieldMode: 'read' },
					listView: { fieldMode: 'read' }
				}
			})
		},
		access: {
			operation: {
				query: sessionExists,
				create: () => false,
				update: () => false,
				delete: sessionExists
			}
		},
		ui: {
			label: 'Peticiones de contacto',
			singular: 'Petición de contacto',
			plural: 'Peticiones de contacto',
			hideCreate: true,
			hideDelete: true,
			createView: {
				defaultFieldMode: 'hidden'
			}
		}
	}),

	Picture: list({
		access: {
			operation: {
				query: allowAll,
				create: sessionExists,
				update: sessionExists,
				delete: sessionExists
			}
		},

		ui: {
			label: 'Imágenes',
			singular: 'Imagen',
			plural: 'Imágenes'
		},

		fields: {
			image: image({ storage: 's3_image_storage' }),

			code: text({
				label: 'Código de la imagen',
				isIndexed: 'unique'
			}),

			alt: text({
				label: 'Texto alternativo',
				validation: {
					isRequired: true
				}
			}),

			createdAt: timestamp({
				defaultValue: { kind: 'now' },
				ui: {
					createView: { fieldMode: 'hidden' },
					itemView: { fieldMode: 'read' },
					listView: { fieldMode: 'read' }
				}
			})
		}
	})
};
