/**
 * Sets the value that references a nested path. E.g. foo.bar
 * @param object The object to search in
 * @param path The path to set
 * @param value The value to set
 * @returns void
 */
export function setPath(object: Record<string, unknown>, path: string, value: unknown): void {
	const keys = path.split('.');

	const lastKey = keys[keys.length - 1];
	const lastKeyIsNumber = !isNaN(parseInt(lastKey));

	let currObj = object;

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!currObj || !currObj[key]) {
			if (i === keys.length - 2 && lastKeyIsNumber) {
				currObj[key] = [];
			} else {
				currObj[key] = {};
			}
		}

		currObj = currObj[key] as Record<string, unknown>;
	}

	if (lastKeyIsNumber) {
		(currObj as unknown as Array<unknown>).push(value);
	} else {
		currObj[lastKey] = value;
	}
}
