import type { Request, Response, NextFunction } from 'express';
import { KeystoneContext } from '@keystone-6/core/types';
import { ConfigurationRepository } from '../../repositories/ConfigurationRepository';
import Logger from '../../Logger';
import InstagramClient from '../../../admin/clients/InstagramClient';

export function handleInstagramAuth(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const context = await commonContext.withRequest(req, res);

			const repository = new ConfigurationRepository(context);

			Logger.debug('Instagram code received');

			const code = req.query.code;

			const client = InstagramClient;

			const { userId, accessToken, expiresAt } = await client.performAuthentication(code as string);

			Logger.debug('Instagram access token retrieved');

			await repository.createConfiguration('instagram', {
				userId,
				accessToken,
				expiresAt
			});

			res.redirect('/instagram-setup');
		} catch (error) {
			Logger.error(error, 'Error while handling Instagram auth');
			next(error);
		}
	};
}