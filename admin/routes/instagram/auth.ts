import type { Request, Response } from 'express';
import Logger from '../../logger';
import InstagramClient from '../../clients/InstagramClient';

export async function handleInstagramAuth(req: Request, res: Response) {
	Logger.debug({ query: req.query }, 'Instagram code received');

	const code = req.query.code;

	const client = InstagramClient;

	const { accessToken, expiresAt } = await client.performAuthentication(code as string);

	Logger.debug({ accessToken, expiresAt }, 'Instagram access token retrieved');

	res.send();
}
