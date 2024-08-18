export type Email = {
	from: string;
	to: string;
	subject: string;
	body: string;
};

export type ContactFormData = {
	person_1: string;
	person_2: string;
	email: string;
	phone: string;
	date: string;
	place: string;
	suppliers: string;
	atendees?: string;
	instagram?: string;
	known?: string;
	tell_more: string;
	terms: string;
};

type ContactEmailField = {
	key: string;
	value: string;
};

export type ContactEmailData = {
	person_1: ContactEmailField;
	person_2: ContactEmailField;
	email: ContactEmailField;
	phone: ContactEmailField;
	date: ContactEmailField;
	place: ContactEmailField;
	suppliers: ContactEmailField;
	atendees: ContactEmailField;
	instagram: ContactEmailField;
	known: ContactEmailField;
	tell_more: ContactEmailField;
	terms: ContactEmailField;
};
