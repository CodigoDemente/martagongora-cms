import { config } from '@keystone-6/core';

import { lists } from './schema';

import { withAuth, session } from './auth';
import expressApp from './admin/express';

export default withAuth(
	config({
		db: {
			provider: 'postgresql',
			url: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
		},
		lists,
		session,
		server: {
			cors: {
				origin: process.env.ORIGIN_URL || true
			},
			port: parseInt(process.env.DASHBOARD_PORT || '3000'),
			extendExpressApp: expressApp
		},
		ui: {
			isAccessAllowed: ({ session }) => {
				return !!session?.data;
			}
		}
	})
);
