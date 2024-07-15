import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';

export const HandleErrors = function (err: unknown, _: Request, res: Response, __: NextFunction) {
	if (err instanceof HttpError) {
		return res.status(err.code).json({ message: err.message });
	}

	res.status(500).json({ message: 'Internal server error' });
};
