import { Router } from 'express';
import { KeystoneContext } from '@keystone-6/core/types';
import { deleteConfiguration, doesConfigExists } from '.';

const router = Router();

export default function configurationRouter(context: KeystoneContext) {
	router
		.head('/:configurationName', doesConfigExists(context))
		.delete('/:configurationName', deleteConfiguration(context));

	return router;
}
