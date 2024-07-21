export type Configuration<T extends Record<string, unknown>> = {
	name: string;
	value: T;
};
