import { GridRowId } from '@mui/x-data-grid';
import { RowDeleteHandlerProps } from '../types';

export function handleRowDelete(props: RowDeleteHandlerProps) {
	const { setSnackbar, deleteTranslations, rows, setRows } = props;

	return async (id: GridRowId) => {
		const row = rows.find((row) => row.id === id);

		if (!row) {
			setSnackbar({
				children: 'No se ha podido eliminar la traducción',
				severity: 'error'
			});

			return;
		}

		try {
			const toDelete = Object.entries(row.identifiers).map(([_, identifier]) => ({
				id: identifier
			}));

			const { errors } = await deleteTranslations({
				variables: {
					input: toDelete
				}
			});

			if (errors && errors.length) {
				throw errors;
			}
		} catch (_) {
			setSnackbar({
				children: 'No se ha podido eliminar la traducción',
				severity: 'error'
			});

			return;
		}

		setSnackbar({
			children: `Traducción eliminada correctamente`,
			severity: 'success'
		});

		setRows((oldRows) => oldRows.filter((row) => row.id !== id));
	};
}
