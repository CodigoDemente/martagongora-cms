import { GridRowId } from '@mui/x-data-grid';
import { Row, Translation } from '../types';

export function toRows(translations: Translation[]): Row[] {
	const rows: Record<GridRowId, Row> = {};

	translations.forEach((translation) => {
		if (!rows[translation.key]) {
			rows[translation.key] = {
				key: translation.key,
				isNew: false,
				id: translation.id,
				identifiers: {
					[translation.language]: translation.id
				},
				[translation.language]: translation.value
			};
		} else {
			rows[translation.key][translation.language] = translation.value;
			rows[translation.key].identifiers[translation.language] = translation.id;
		}
	});

	return Object.values(rows);
}
