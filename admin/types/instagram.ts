export type InstagramCredentials = {
	userId: string;
	accessToken: string;
	expiresAt: Date;
};

export type InstagramMedia = {
	media_type: string;
	media_url: string;
};

export type InstagramAPIMediaResponse = {
	data: {
		id: string;
	}[];
	paging: {
		cursors: {
			before: string;
			after: string;
		};
		next?: string;
		previous?: string;
	};
};
