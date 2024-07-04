import { Router } from 'express';
import { handleInstagramAuth } from './auth';
import { KeystoneContext } from '@keystone-6/core/types';
import { getInstagramMedia } from './media';

const router = Router();

export default function instagramRouter(context: KeystoneContext) {
	router.get('/auth', handleInstagramAuth(context)).get('/media', getInstagramMedia(context));

	return router;
}
