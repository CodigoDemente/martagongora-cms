import { Translation, TranslationsTableProps } from '../../../lib/types';
import React, { useEffect, useState } from 'react';
import {
	DataGrid,
	GridEventListener,
	GridRowEditStopReasons,
	GridRowModesModel,
	GridSlots
} from '@mui/x-data-grid';
import Fade from '@mui/material/Fade';
import { esES } from '@mui/x-data-grid/locales';
import { getColumns } from '../../../components/Columns';
import CustomToolbar from './CustomToolbar';
import { useMutation } from '@keystone-6/core/admin-ui/apollo';
import { CREATE_TRANSLATIONS } from '../../../graphql/mutations/CreateTranslations';
import { Alert, AlertProps, Snackbar } from '@mui/material';
import { UPDATE_TRANSLATIONS } from '../../../graphql/mutations/UpdateTranslations';
import { handleRowUpdate } from '../../../lib/handlers/RowUpdateHandler';

export default function TranslationsTable(props: TranslationsTableProps) {
	const { rows, setRows, rowModesModel, setRowModesModel, loading, setLoading, languages } = props;

	const [snackbar, setSnackbar] = useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

	const [createTranslations, { loading: createLoading }] = useMutation<{
		createTranslations: Translation[];
	}>(CREATE_TRANSLATIONS);
	const [updateTranslations, { loading: updateLoading }] = useMutation<{
		updateTranslations: Translation[];
	}>(UPDATE_TRANSLATIONS);

	useEffect(() => {
		setLoading(() => createLoading || updateLoading);
	}, [createLoading, updateLoading]);

	const processRowUpdate = handleRowUpdate({
		setSnackbar,
		languages,
		createTranslations,
		updateTranslations,
		setRows
	});

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel((_) => newRowModesModel);
	};

	const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}

		if (params.reason === GridRowEditStopReasons.enterKeyDown) {
			event.defaultMuiPrevented = true;
		}
	};

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<DataGrid
				localeText={esES.components.MuiDataGrid.defaultProps.localeText}
				editMode="row"
				rows={rows}
				columns={getColumns({
					languages,
					rowModesModel,
					setLoading,
					setRowModesModel,
					setRows,
					setSnackbar,
					rows,
					loading
				})}
				initialState={{
					columns: {
						columnVisibilityModel: {
							id: false
						}
					},
					sorting: {
						sortModel: [{ field: 'key', sort: 'asc' }]
					}
				}}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				rowModesModel={rowModesModel}
				loading={loading}
				slots={{
					toolbar: CustomToolbar as GridSlots['toolbar']
				}}
				slotProps={{
					toolbar: {
						setRows,
						setRowModesModel,
						languages: languages.map((language) => language.code) || [],
						loading
					},
					loadingOverlay: {
						variant: 'linear-progress'
					}
				}}
			/>

			{!!snackbar && (
				<Snackbar
					open
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					onClose={() => setSnackbar(null)}
					autoHideDuration={4000}
					TransitionComponent={Fade}
				>
					<Alert {...snackbar} onClose={() => setSnackbar(null)} />
				</Snackbar>
			)}
		</div>
	);
}
