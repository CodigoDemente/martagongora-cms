import { HttpStatusCode } from 'axios';
import { HttpError } from './HttpError';

export class InvalidRecaptchaError extends HttpError {
	constructor() {
		super(HttpStatusCode.BadRequest, 'Invalid or missing reCAPTCHA token');
	}
}
