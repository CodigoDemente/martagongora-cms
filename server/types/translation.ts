export type Translation = {
	[key: string]: string | Translation;
};

export type DatabaseTranslation = {
	id: string;
	language: string;
	key: string;
	value: string;
};
