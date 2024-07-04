import { KeystoneContext } from '@keystone-6/core/types';
import { Request, Response, NextFunction } from 'express';
import { ConfigurationRepository } from '../../repositories/ConfigurationRepository';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

export function doesConfigExists(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const configurationName = req.params.configurationName;

			const context = await commonContext.withRequest(req, res);

			const repository = new ConfigurationRepository(context);

			const configuration = await repository.getConfiguration(configurationName);

			if (configuration == undefined) {
				res.status(404).send();
			} else {
				res.status(200).send();
			}
		} catch (error) {
			next(error);
		}
	};
}

export function deleteConfiguration(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const context = await commonContext.withRequest(req, res);

			if (!context.session) {
				throw new UnauthorizedError();
			}

			const configurationName = req.params.configurationName;

			const repository = new ConfigurationRepository(context);

			await repository.deleteConfiguration(configurationName);

			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};
}
