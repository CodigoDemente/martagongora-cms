import { HttpStatusCode } from 'axios';
import { HttpError } from './HttpError';

export class CouldNotSendMail extends HttpError {
	constructor() {
		super(HttpStatusCode.FailedDependency, 'Could not send email');
	}
}
