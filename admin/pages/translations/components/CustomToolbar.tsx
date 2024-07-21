import { v4 as uuidv4 } from 'uuid';
import type { CustomToolbarProps, Row } from '../../../lib/types';
import { GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

export default function CustomToolbar(props: CustomToolbarProps) {
	const { setRows, setRowModesModel, languages, loading } = props;

	function handleAddRowClick() {
		const id = uuidv4();
		const newRow: Row = {
			id,
			key: '',
			identifiers: {},
			isNew: true
		};

		languages.forEach((language) => {
			newRow[language] = '';
		});

		setRows((oldRows) => [newRow, ...oldRows]);

		setRowModesModel((oldRowModesModel) => ({
			...oldRowModesModel,
			[id]: { mode: GridRowModes.Edit, fieldToFocus: 'key' }
		}));
	}

	return (
		<GridToolbarContainer>
			<Button
				color="primary"
				startIcon={<AddIcon />}
				onClick={handleAddRowClick}
				disabled={loading}
			>
				Añadir traducción
			</Button>
		</GridToolbarContainer>
	);
}
