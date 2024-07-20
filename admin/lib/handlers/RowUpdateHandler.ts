import { GridRowModel } from '@mui/x-data-grid';
import { Row, RowUpdateHandlerProps } from '../types';
import { ApolloError, GraphQLErrors } from '@apollo/client/errors';

const UNIQUE_CONSTRAINT_FAILED = 'unique constraint failed';

export function handleRowUpdate(props: RowUpdateHandlerProps) {
	const { setSnackbar, languages, createTranslations, updateTranslations, setRows } = props;

	return async (newRow: GridRowModel<Row>) => {
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
			if (newRow.isNew) {
				const translations = languages.map((language) => ({
					language: language.code,
					key: newRow.key,
					value: newRow[language.code] || ''
				}));

				const { data, errors: createErrors } = await createTranslations({
					variables: {
						input: translations
					}
				});

				for (const piece of data?.createTranslations || []) {
					newRow.identifiers = {
						...newRow.identifiers,
						[piece.language]: piece.id
					};
				}

				errors = createErrors;
			} else {
				const translations = languages.map((language) => ({
					where: { id: newRow.identifiers[language.code] },
					data: {
						language: language.code,
						key: newRow.key,
						value: newRow[language.code] || ''
					}
				}));

				const { errors: updateErrors } = await updateTranslations({
					variables: {
						input: translations
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
