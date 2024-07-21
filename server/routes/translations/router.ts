import { KeystoneContext } from '@keystone-6/core/types';
import { Router } from 'express';
import { getLanguageTranslations } from './language';

const router = Router();

export default function translationsRouter(context: KeystoneContext) {
	router.get('/:language', getLanguageTranslations(context));

	return router;
}
