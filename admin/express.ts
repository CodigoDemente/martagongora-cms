import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types';
import type { Express } from 'express';
import { handleInstagramAuth } from './routes/instagram/auth';
import pino from 'pino-http';
import { HandleErrors } from './middlewares/ErrorHandler';

export default function expressApp(app: Express, context: KeystoneContext<BaseKeystoneTypeInfo>) {
	app.use(pino());

	app.get('/instagram/auth', handleInstagramAuth);

	app.use(HandleErrors);
}
