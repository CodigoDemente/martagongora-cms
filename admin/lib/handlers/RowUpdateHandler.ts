import { GridRowModel } from '@mui/x-data-grid';
import { Row, RowUpdateHandlerProps, Translation } from '../types';
import { ApolloError, GraphQLErrors } from '@apollo/client/errors';

const UNIQUE_CONSTRAINT_FAILED = 'unique constraint failed';

export function handleRowUpdate(props: RowUpdateHandlerProps) {
	const { setSnackbar, languages, createTranslations, updateTranslations, setRows } = props;

	return async (newRow: GridRowModel<Row>, oldRow: GridRowModel<Row>) => {
		if (!newRow.key) {
			setSnackbar({
				children: 'El identificador es obligatorio',
				severity: 'error'
			});
			throw new Error('Key is required');
		}

		if (!languages.filter((language) => newRow[language.code] !== '').length) {
			setSnackbar({
				children: 'Al menos una traducción es obligatoria',
				severity: 'error'
			});
			throw new Error('At least one translation is required');
		}

		try {
			let errors: GraphQLErrors | undefined;

			const translationsToCreate: Omit<Translation, 'id'>[] = [];
			const translationsToUpdate: { where: { id: string }; data: Omit<Translation, 'id'> }[] = [];

			languages.forEach((language) => {
				const newValue = newRow[language.code] as string;
				const oldValue = oldRow[language.code] as string;
				const identifier = newRow.identifiers[language.code];

				if (newValue) {
					if (identifier && newValue !== oldValue) {
						translationsToUpdate.push({
							where: { id: identifier },
							data: {
								language: language.code,
								key: newRow.key,
								value: newValue
							}
						});
					} else if (!identifier) {
						translationsToCreate.push({
							language: language.code,
							key: newRow.key,
							value: newValue
						});
					}
				}
			});

			if (translationsToCreate.length) {
				const { data, errors: createErrors } = await createTranslations({
					variables: {
						input: translationsToCreate
					}
				});

				for (const piece of data?.createTranslations || []) {
					newRow.identifiers = {
						...newRow.identifiers,
						[piece.language]: piece.id
					};
				}

				errors = createErrors;
			}

			if (translationsToUpdate.length) {
				const { errors: updateErrors } = await updateTranslations({
					variables: {
						input: translationsToUpdate
					}
				});
				errors = updateErrors;
			}

			if (errors && errors.length) {
				throw errors;
			}
		} catch (error) {
			let message = `No se ha podido ${newRow.isNew ? 'crear' : 'actualizar'} la traducción`;

			const errors = Array.isArray(error) ? error : [error];

			for (const error of errors) {
				if (
					error instanceof ApolloError &&
					error.message.toLowerCase().includes(UNIQUE_CONSTRAINT_FAILED)
				) {
					message = 'El identificador de la traducción ya existe';
					break;
				}
			}

			setSnackbar({
				children: message,
				severity: 'error'
			});

			throw error;
		}

		const updatedRow: Row = { ...newRow, isNew: false };
		setSnackbar({
			children: `Traducción ${newRow.isNew ? 'creada' : 'actualizada'} correctamente`,
			severity: 'success'
		});

		setRows((oldRows: Row[]) => oldRows.map((row) => (row.id === newRow.id ? updatedRow : row)));

		return updatedRow;
	};
}
