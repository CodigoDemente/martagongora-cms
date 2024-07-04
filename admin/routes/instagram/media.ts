import { KeystoneContext } from '@keystone-6/core/types';
import type { Request, Response, NextFunction } from 'express';
import { ConfigurationRepository } from '../../repositories/ConfigurationRepository';
import { InstagramNotAuthenticatedError } from '../../errors/InstagramNotAuthenticatedError';
import { InstagramCredentials } from '../../types/instagram';
import InstagramClient from '../../clients/InstagramClient';

export function getInstagramMedia(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const context = await commonContext.withRequest(req, res);

			const repository = new ConfigurationRepository(context);

			const configuration = await repository.getConfiguration<InstagramCredentials>(
				'instagram',
				true
			);

			configuration.value.expiresAt = new Date(configuration.value.expiresAt);

			if (!configuration) {
				throw new InstagramNotAuthenticatedError();
			}

			const client = InstagramClient;

			client.setCredentials(
				configuration.value.userId,
				configuration.value.accessToken,
				configuration.value.expiresAt
			);

			if (configuration.value.expiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000) {
				const newCredentials = await client.refreshCredentials();

				await repository.updateConfiguration('instagram', newCredentials);

				client.setCredentials(
					newCredentials.userId,
					newCredentials.accessToken,
					newCredentials.expiresAt
				);
			}

			const media = await client.getLatestMedia(req.query.next as string);

			res.json(media);
		} catch (error) {
			next(error);
		}
	};
}
