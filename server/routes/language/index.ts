import { KeystoneContext } from '@keystone-6/core/types';
import { Request, Response, NextFunction } from 'express';
import { LanguageRepository } from '../../repositories/LanguageRepository';

export function getAvailableLanguages(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const context = await commonContext.withRequest(req, res);

			const repository = new LanguageRepository(context);

			const languages = await repository.getAvailableLanguanges();

			res.status(200).send(languages);
		} catch (error) {
			next(error);
		}
	};
}
