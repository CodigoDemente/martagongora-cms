import type { Request, Response } from 'express';
import https from 'https';
import Logger from '../../logger';
import InstagramClient from './client';
import axios from 'axios';

async function getShortLivedAccessToken(code: string): Promise<string> {
    const data = new FormData();

    data.append('client_id', process.env.INSTAGRAM_CLIENT_ID || '');
    data.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '');
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', process.env.INSTAGRAM_AUTH_REDIRECT_URI || '');
    data.append('code', code);

    const respone = await InstagramClient.request({
        method: 'POST',
        url: '/oauth/access_token',
        data
    });

    const { access_token } = respone.data;

    return access_token;
}

async function getLongLivedAccessToken(shortLivedAccessToken: string): Promise<{
    accessToken: string,
    expiresAt: Date
}> {
    const data = new FormData();

    data.append('client_id', process.env.INSTAGRAM_CLIENT_ID || '');
    data.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '');
    data.append('grant_type', 'ig_exchange_token');
    data.append('access_token', shortLivedAccessToken);

    const response = await axios.get('https://graph.instagram.com/access_token', {
        params: {
            grant_type: 'ig_exchange_token',
            client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
            access_token: shortLivedAccessToken
        }
    });

    const { access_token, expires_in } = response.data;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    return {
        accessToken: access_token,
        expiresAt
    };
}

export async function handleInstagramAuth(req: Request, res: Response) {
    Logger.debug({ query: req.query }, 'Instagram code received');

    const code = req.query.code;

    if (!code || typeof code !== 'string') {
        return res.status(400).send({
            error: 'Invalid code'
        });
    }

    const shortLivedAcccessToken = await getShortLivedAccessToken(code);

    const { accessToken, expiresAt } = await getLongLivedAccessToken(shortLivedAcccessToken);

    Logger.debug({ accessToken, expiresAt }, 'Instagram access token retrieved');

    res.send();
}