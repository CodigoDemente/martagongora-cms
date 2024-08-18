import { KeystoneContext } from '@keystone-6/core/types';
import { Router } from 'express';

import { createContactRequest } from '.';

const router = Router();

export default function contactRouter(context: KeystoneContext) {
	router.post('/', createContactRequest(context));

	return router;
}
