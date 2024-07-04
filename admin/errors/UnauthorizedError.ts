import { HttpStatusCode } from 'axios';
import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
	constructor() {
		super(HttpStatusCode.Unauthorized, 'Unauthorized');
	}
}
