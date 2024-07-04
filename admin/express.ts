import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types';
import type { Express } from 'express';
import { handleInstagramAuth } from './routes/instagram/auth';
import pino from 'pino-http';
import { HandleErrors } from './middlewares/ErrorHandler';
import instagramRouter from './routes/instagram/router';
import { HttpError } from './errors/HttpError';
import configurationRouter from './routes/configuration/router';

export default function expressApp(app: Express, context: KeystoneContext<BaseKeystoneTypeInfo>) {
	app.use(pino());

	app.use('/configuration', configurationRouter(context));

	app.use('/instagram', instagramRouter(context));

	app.use(HandleErrors);
}
