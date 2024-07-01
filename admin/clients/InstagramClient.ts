import axios, { Axios } from 'axios';
import { InstagramCredentials } from '../types/instagram';
import logger from '../logger';
import { InvalidInstagramCode } from '../errors/InvalidInstagramCode';

class InstagramClient {
	private httpClient: Axios;

	constructor() {
		this.httpClient = axios.create({
			baseURL: 'https://api.instagram.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	private async getShortLivedAccessToken(code: string): Promise<string> {
		const data = new FormData();

		data.append('client_id', process.env.INSTAGRAM_CLIENT_ID || '');
		data.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET || '');
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', process.env.INSTAGRAM_AUTH_REDIRECT_URI || '');
		data.append('code', code);

		const respone = await this.httpClient.request({
			method: 'POST',
			url: '/oauth/access_token',
			data
		});

		const { access_token } = respone.data;

		return access_token;
	}

	private async getLongLivedAccessToken(shortLivedAccessToken: string): Promise<{
		accessToken: string;
		expiresAt: Date;
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

	public async performAuthentication(code: string): Promise<InstagramCredentials> {
		logger.debug({ code: code.substring(0, 5) }, 'Performing instagram authentication');

		if (!code || typeof code !== 'string') {
			throw new InvalidInstagramCode(code);
		}

		const shortLivedAcccessToken = await this.getShortLivedAccessToken(code);

		const { accessToken, expiresAt } = await this.getLongLivedAccessToken(shortLivedAcccessToken);

		return {
			accessToken,
			expiresAt
		};
	}
}

export default new InstagramClient();
