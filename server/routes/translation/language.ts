import { KeystoneContext } from '@keystone-6/core/types';
import { Request, Response, NextFunction } from 'express';
import { TranslationRepository } from '../../repositories/TranslationRepository';
import { LanguageNotFound } from '../../errors/LanguageNotFound';
import { LanguageRepository } from '../../repositories/LanguageRepository';

export function getLanguageTranslations(commonContext: KeystoneContext) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const language = req.params.language;

			if (!language) {
				throw new LanguageNotFound('');
			}

			const context = (await commonContext.withRequest(req, res)).sudo();

			const translationRepository = new TranslationRepository(context);
			const languageRepository = new LanguageRepository(context);

			const languageExists = await languageRepository.doesLanguageExist(language);

			if (!languageExists) {
				throw new LanguageNotFound(language);
			}

			const translations = await translationRepository.getTranslations(language);

			res.json(translations);
		} catch (error) {
			next(error);
		}
	};
}
