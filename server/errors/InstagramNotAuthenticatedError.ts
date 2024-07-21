import { HttpStatusCode } from 'axios';
import { HttpError } from './HttpError';

export class InstagramNotAuthenticatedError extends HttpError {
	constructor() {
		super(HttpStatusCode.Unauthorized, 'Instagram not authenticated');
	}
}
