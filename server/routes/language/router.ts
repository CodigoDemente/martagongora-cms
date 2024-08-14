import { Router } from 'express';
import { KeystoneContext } from '@keystone-6/core/types';

import { getAvailableLanguages } from '.';

const router = Router();

export default function languageRouter(context: KeystoneContext) {
	router.get('/', getAvailableLanguages(context));

	return router;
}
