import {
	GridActionsCellItem,
	GridColDef,
	GridRowId,
	GridRowModes,
	GridRowParams
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect } from 'react';
import { GetActionsProps, GetColumnsProps, Row, Translation } from '../lib/types';
import { handleRowDelete } from '../lib/handlers/RowDeleteHandler';
import { DELETE_TRANSLATIONS } from '../graphql/mutations/DeleteTranslations';
import { useMutation } from '@apollo/client';

function getActions(props: GetActionsProps) {
	const {
		rowModesModel,
		setRowModesModel,
		rows,
		setRows,
		loading,
		setSnackbar,
		deleteTranslations
	} = props;

	const handleSaveClick = (id: GridRowId) => () => {
		setRowModesModel((oldRowModesModel) => ({
			...oldRowModesModel,
			[id]: { mode: GridRowModes.View }
		}));
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel((oldRowModesModel) => ({
			...oldRowModesModel,
			[id]: { mode: GridRowModes.Edit }
		}));
	};

	const handleDeleteClick = handleRowDelete({
		setSnackbar,
		deleteTranslations,
		rows,
		setRows
	});

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel((oldRowModesModel) => ({
			...oldRowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true }
		}));

		setRows((oldRows) => oldRows.filter((row) => row.id !== id || (row.id === id && !row.isNew)));
	};

	return ({ id }: GridRowParams<Row>) => {
		const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

		if (isInEditMode) {
			return [
				<GridActionsCellItem
					key="save"
					icon={<SaveIcon />}
					label="Save"
					sx={{
						color: 'primary.main'
					}}
					onClick={handleSaveClick(id)}
					disabled={loading}
				/>,
				<GridActionsCellItem
					key="cancel"
					icon={<CancelIcon />}
					label="Cancel"
					className="textPrimary"
					onClick={handleCancelClick(id)}
					color="inherit"
					disabled={loading}
				/>
			];
		}

		return [
			<GridActionsCellItem
				key="edit"
				icon={<EditIcon />}
				label="Edit"
				className="textPrimary"
				onClick={handleEditClick(id)}
				color="inherit"
				disabled={loading}
			/>,
			<GridActionsCellItem
				key="delete"
				icon={<DeleteIcon />}
				label="Delete"
				onClick={async () => await handleDeleteClick(id)}
				color="inherit"
				disabled={loading}
			/>
		];
	};
}

export function getColumns(props: GetColumnsProps): GridColDef[] {
	const {
		languages,
		rowModesModel,
		setRowModesModel,
		rows,
		setRows,
		loading,
		setLoading,
		setSnackbar
	} = props;

	const [deleteTranslations, { loading: deleteLoading }] = useMutation<{
		deleteTranslations: Translation[];
	}>(DELETE_TRANSLATIONS);

	useEffect(() => {
		setLoading(() => deleteLoading);
	}, [deleteLoading]);

	return [
		{
			field: 'id',
			headerName: 'ID',
			sortable: false,
			filterable: false
		},
		{
			field: 'key',
			headerName: 'Identificador',
			editable: true,
			hideable: false,
			sortable: true,
			flex: 0.5
		},
		...languages.map(
			(language): GridColDef => ({
				field: language.code,
				editable: true,
				headerName: `${language.code}${language.isDefault ? ' (por defecto)' : ''}`,
				hideable: true,
				sortable: false,
				filterable: false,
				flex: 1
			})
		),
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Acciones',
			width: 100,
			cellClassName: 'actions',
			getActions: getActions({
				rowModesModel,
				setRowModesModel,
				rows,
				setRows,
				loading,
				setSnackbar,
				deleteTranslations
			})
		}
	];
}
