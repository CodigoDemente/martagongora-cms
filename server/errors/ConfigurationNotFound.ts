import { HttpStatusCode } from 'axios';
import { HttpError } from './HttpError';

export class ConfigurationNotFound extends HttpError {
	constructor(name: string) {
		super(HttpStatusCode.NotFound, `Configuration with name ${name} not found`);
	}
}
