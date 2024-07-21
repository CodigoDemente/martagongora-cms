/**
 * Sets the value that references a nested path. E.g. foo.bar
 * @param object The object to search in
 * @param path The path to set
 * @param value The value to set
 * @returns void
 */
export function setPath(object: Record<string, unknown>, path: string, value: unknown): void {
	const keys = path.split('.');

	let currObj = object;

	for (let i = 0; i < keys.length - 1; i++) {
		if (!currObj || !currObj[keys[i]]) {
			currObj[keys[i]] = {};
		}

		currObj = currObj[keys[i]] as Record<string, unknown>;
	}

	currObj[keys[keys.length - 1]] = value;
}
