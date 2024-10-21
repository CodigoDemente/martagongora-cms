import { config } from '@keystone-6/core';

import { config as dotenv } from 'dotenv';

import { lists } from './schema';

import { withAuth, session } from './auth';
import expressApp from './server/express';

dotenv();

export default withAuth(
	config({
		db: {
			provider: 'postgresql',
			url: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
			prismaClientPath: 'node_modules/.prisma/client',
			idField: {
				kind: 'uuid'
			}
		},
		lists,
		session,
		server: {
			cors: {
				origin: process.env.ORIGIN_URL || true
			},
			port: parseInt(process.env.PORT || '3000'),
			extendExpressApp: expressApp
		},
		ui: {
			isAccessAllowed: ({ session }) => {
				return !!session?.data;
			}
		},
		storage: {
			s3_image_storage: {
				kind: 's3',
				type: 'image',
				bucketName: process.env.S3_BUCKET_NAME || '',
				region: process.env.S3_REGION || '',
				accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
				signed: { expiry: 60 * 60 * 24 * 7 } // 1 week
			}
		}
	})
);
