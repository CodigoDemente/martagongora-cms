import axios, { Axios } from 'axios';
import Bluebird from 'bluebird';
import {
	InstagramAPIMediaResponse,
	InstagramCredentials,
	InstagramMedia
} from '../server/types/instagram';
import logger from '../server/logger';
import { InvalidInstagramCode } from '../server/errors/InvalidInstagramCode';
import { InstagramNotAuthenticatedError } from '../server/errors/InstagramNotAuthenticatedError';

class InstagramClient {
	private httpClient: Axios;
	private graphHttpClient?: Axios;
	private credentials?: InstagramCredentials;

	constructor() {
		this.httpClient = axios.create({
			baseURL: 'https://api.instagram.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	private async getShortLivedAccessToken(code: string): Promise<{
		accessToken: string;
		userId: string;
	}> {
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

		const { access_token, user_id } = respone.data;

		return {
			accessToken: access_token,
			userId: user_id
		};
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

		const { accessToken: shortLivedAcccessToken, userId } =
			await this.getShortLivedAccessToken(code);

		const { accessToken, expiresAt } = await this.getLongLivedAccessToken(shortLivedAcccessToken);

		this.setCredentials(userId, accessToken, expiresAt);

		return this.credentials!;
	}

	public setCredentials(userId: string, accessToken: string, expiresAt: Date): void {
		this.credentials = {
			userId: userId,
			accessToken,
			expiresAt
		};

		this.graphHttpClient = axios.create({
			baseURL: 'https://graph.instagram.com/v20.0',
			headers: {
				Accept: 'application/json'
			},
			params: {
				access_token: this.credentials.accessToken,
				limit: 25
			}
		});
	}
	private async getMediaDetails(mediaData: { id: string }): Promise<InstagramMedia> {
		if (!this.credentials || !this.graphHttpClient) {
			throw new InstagramNotAuthenticatedError();
		}

		const media = await this.graphHttpClient.get<InstagramMedia>(`/${mediaData.id}`, {
			params: {
				fields: 'media_type,media_url'
			}
		});

		return {
			media_type: media.data.media_type,
			media_url: media.data.media_url
		};
	}

	public async refreshCredentials(): Promise<InstagramCredentials> {
		if (!this.credentials || !this.credentials.accessToken) {
			throw new InstagramNotAuthenticatedError();
		}

		const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
			params: {
				grant_type: 'ig_refresh_token',
				access_token: this.credentials.accessToken
			}
		});

		const { access_token, expires_in } = response.data;

		return {
			userId: this.credentials.userId,
			accessToken: access_token,
			expiresAt: new Date(Date.now() + expires_in * 1000)
		};
	}

	public async getLatestMedia(next?: string): Promise<{
		data: InstagramMedia[];
		next: string | null;
	}> {
		if (!this.credentials || !this.graphHttpClient) {
			throw new InstagramNotAuthenticatedError();
		}

		const response = await this.graphHttpClient.get<InstagramAPIMediaResponse>(
			`/${this.credentials.userId}/media`,
			{
				params: {
					after: next
				}
			}
		);

		const responseBody = response.data;

		const mediaIds = responseBody.data;

		const allMedia = await Bluebird.map(mediaIds, this.getMediaDetails.bind(this), {
			concurrency: 5
		});

		return {
			data: allMedia,
			next: responseBody.paging.next ? responseBody.paging.cursors.after : null
		};
	}
}

export default new InstagramClient();
