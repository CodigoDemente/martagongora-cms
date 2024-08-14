import { HttpStatusCode } from 'axios';
import { HttpError } from './HttpError';

export class InvalidInstagramCode extends HttpError {
	constructor(code: string) {
		super(HttpStatusCode.FailedDependency, `Invalid or missing code code ${code}`);
	}
}
