import { useMutation } from '@apollo/client';
import { AlertProps } from '@mui/material';
import type { GridRowModesModel } from '@mui/x-data-grid';
import { Dispatch, SetStateAction } from 'react';

export type Language = {
	id: string;
	code: string;
	isDefault: boolean;
	enabled: boolean;
};

export type Translation = {
	id: string;
	language: string;
	key: string;
	value: string;
};

export type Row = {
	id: string;
	key: string;
	isNew: boolean;
	identifiers: Record<string, string>;
} & { [key: string]: string | boolean | Record<string, string> };

export type SetRowModelsModelFn = (
	setRowModesModelFn: (oldRowModesModel: GridRowModesModel) => GridRowModesModel
) => void;

export type SetRowsFn = (setRowFn: (oldRows: Row[]) => Row[]) => void;

type DeleteTranslationsFn = ReturnType<
	typeof useMutation<{ deleteTranslations: Translation[] }>
>['0'];

export type CustomToolbarProps = {
	setRows: SetRowsFn;
	setRowModesModel: SetRowModelsModelFn;
	languages: string[];
	loading: boolean;
};

export type TranslationsTableProps = Omit<CustomToolbarProps, 'languages'> & {
	rowModesModel: GridRowModesModel;
	rows: Row[];
	setLoading: (setLoadingFn: (oldLoading: boolean) => boolean) => void;
	setError: (setErrorFn: (oldError: Error | null) => Error | null) => void;
	loading: boolean;
	languages: Language[];
};

export type RowUpdateHandlerProps = {
	setSnackbar: Dispatch<SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>;
	setRows: SetRowsFn;
	languages: Language[];
	createTranslations: ReturnType<typeof useMutation<{ createTranslations: Translation[] }>>['0'];
	updateTranslations: ReturnType<typeof useMutation<{ updateTranslations: Translation[] }>>['0'];
};

export type RowDeleteHandlerProps = {
	setSnackbar: Dispatch<SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>;
	setRows: SetRowsFn;
	rows: Row[];
	deleteTranslations: DeleteTranslationsFn;
};

export type GetColumnsProps = {
	languages: Language[];
	rowModesModel: GridRowModesModel;
	setRowModesModel: SetRowModelsModelFn;
	rows: Row[];
	setRows: SetRowsFn;
	loading: boolean;
	setLoading: (setLoadingFn: (oldLoading: boolean) => boolean) => void;
	setSnackbar: Dispatch<SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>;
};

export type GetActionsProps = {
	rowModesModel: GridRowModesModel;
	setRowModesModel: SetRowModelsModelFn;
	rows: Row[];
	setRows: SetRowsFn;
	setSnackbar: Dispatch<SetStateAction<Pick<AlertProps, 'children' | 'severity'> | null>>;
	deleteTranslations: DeleteTranslationsFn;
	loading: boolean;
};
