import { HttpError } from './HttpError';

export class LanguageNotFound extends HttpError {
	constructor(language: string) {
		super(404, `Language ${language} not found`);
	}
}
