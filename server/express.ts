import pino from 'pino-http';
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types';
import type { Express } from 'express';
import { json } from 'body-parser';

import configurationRouter from './routes/configuration/router';
import contactRouter from './routes/contact/router';
import instagramRouter from './routes/instagram/router';
import languageRouter from './routes/language/router';
import translationsRouter from './routes/translation/router';
import { HandleErrors } from './middlewares/ErrorHandler';

export default function expressApp(app: Express, context: KeystoneContext<BaseKeystoneTypeInfo>) {
	app.use(pino());

	app.use(json());

	app.use('/configuration', configurationRouter(context));

	app.use('/instagram', instagramRouter(context));

	app.use('/language', languageRouter(context));

	app.use('/translation', translationsRouter(context));

	app.use('/contact', contactRouter(context));

	app.use(HandleErrors);
}
