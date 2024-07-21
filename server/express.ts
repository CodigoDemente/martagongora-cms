import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types';
import type { Express } from 'express';
import pino from 'pino-http';
import { HandleErrors } from './middlewares/ErrorHandler';
import instagramRouter from './routes/instagram/router';
import configurationRouter from './routes/configuration/router';
import translationsRouter from './routes/translations/router';

export default function expressApp(app: Express, context: KeystoneContext<BaseKeystoneTypeInfo>) {
	app.use(pino());

	app.use('/configuration', configurationRouter(context));

	app.use('/instagram', instagramRouter(context));

	app.use('/translation', translationsRouter(context));

	app.use(HandleErrors);
}
