/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading } from '@keystone-ui/core';
import { GridRowModesModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import TranslationsTable from './components/TranslationsTable';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Language, Row, Translation } from '../../lib/types';
import { useQuery } from '@apollo/client';
import { GET_LANGUAGES } from '../../graphql/queries/GetLanguages';
import { GET_TRANSLATIONS } from '../../graphql/queries/GetTranslations';
import { toRows } from '../../lib/mappers/TranslationMapper';

const boxStyles = {
	height: '95%',
	width: '100%',
	padding: '2em 0',
	'& .actions': {
		color: 'text.secondary'
	},
	'& .textPrimary': {
		color: 'text.primary'
	}
};

export default function TranslationsPage() {
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);

	const [rows, setRows] = useState<Row[]>([]);
	const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

	const { data } = useQuery<{ languages: Language[] }>(GET_LANGUAGES);

	const {
		data: translationsData,
		loading: translationsLoading,
		error: translationsError
	} = useQuery<{
		translations: Translation[];
	}>(GET_TRANSLATIONS);

	useEffect(() => {
		setRows(() => toRows(translationsData?.translations || []));
	}, [translationsData]);

	useEffect(() => {
		setLoading(() => translationsLoading);
	}, [translationsLoading]);

	useEffect(() => {
		setError(() => translationsError || null);
	}, [translationsError]);

	function renderTable() {
		if (error) {
			return (
				<Alert severity="error">
					No se ha podido cargar la tabla. Si el error persiste contacta con nosotros.
				</Alert>
			);
		}

		return (
			<TranslationsTable
				rows={rows}
				setRows={setRows}
				rowModesModel={rowModesModel}
				setRowModesModel={setRowModesModel}
				loading={loading}
				setLoading={setLoading}
				setError={setError}
				languages={data?.languages || []}
			/>
		);
	}

	return (
		<PageContainer header={<Heading type="h3">Traducciones</Heading>}>
			<p>
				Puedes añadir algo de formato a las traducciones usando:
				<ul>
					<li>
						<strong>**texto**</strong> para <strong>negrita</strong>
					</li>
					<li>
						<strong>*texto*</strong> para <em>cursiva</em>
					</li>
					<li>
						<strong>&lt;br&gt;</strong> para incluir un salto de línea
					</li>
				</ul>
			</p>
			<Box sx={boxStyles}>{renderTable()}</Box>
		</PageContainer>
	);
}
