import { InputBase, InputBaseProps, Paper, Popper } from '@mui/material';
import { GridRenderEditCellParams, GridValidRowModel, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

export default function EditTextarea<T extends GridValidRowModel>(
	props: GridRenderEditCellParams<T, string>
) {
	const { id, field, value, colDef, hasFocus } = props;

	const [valueState, setValueState] = React.useState(value);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>();
	const [inputRef, setInputRef] = React.useState<HTMLInputElement | null>(null);

	const apiRef = useGridApiContext();

	React.useLayoutEffect(() => {
		if (hasFocus && inputRef) {
			inputRef.focus();
		}
	}, [hasFocus, inputRef]);

	const handleRef = React.useCallback((el: HTMLElement | null) => {
		setAnchorEl(el);
	}, []);

	const handleChange = React.useCallback<NonNullable<InputBaseProps['onChange']>>(
		(event) => {
			const newValue = event.target.value;
			setValueState(newValue);
			apiRef.current.setEditCellValue({ id, field, value: newValue, debounceMs: 200 }, event);
		},
		[apiRef, field, id]
	);

	return (
		<div style={{ position: 'relative', alignSelf: 'flex-start' }}>
			<div
				ref={handleRef}
				style={{
					height: 1,
					width: colDef.computedWidth,
					display: 'block',
					position: 'absolute',
					top: 0
				}}
			/>
			{anchorEl && (
				<Popper open anchorEl={anchorEl} placement="bottom-start">
					<Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
						<InputBase
							multiline
							rows={4}
							value={valueState}
							sx={{ textarea: { resize: 'both' }, width: '100%' }}
							onChange={handleChange}
							inputRef={(ref) => setInputRef(ref)}
						/>
					</Paper>
				</Popper>
			)}
		</div>
	);
}
