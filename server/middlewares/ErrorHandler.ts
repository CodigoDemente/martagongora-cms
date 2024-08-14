import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';
import Logger from '../Logger';

export const HandleErrors = function (err: unknown, _: Request, res: Response, __: NextFunction) {
	if (err instanceof HttpError) {
		return res.status(err.code).json({ message: err.message });
	}

	Logger.error(err as Error);

	res.status(500).json({ message: 'Internal server error' });
};
