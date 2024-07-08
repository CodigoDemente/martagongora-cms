import { createAuth } from '@keystone-6/auth';

// see https://keystonejs.com/docs/apis/session for the session docs
import { statelessSessions } from '@keystone-6/core/session';

const sessionSecret = process.env.SESSION_SECRET;

// withAuth is a function we can use to wrap our base configuration
const { withAuth } = createAuth({
	listKey: 'User',
	identityField: 'email',

	sessionData: 'name createdAt',
	secretField: 'password',

	initFirstItem: {
		// if there are no items in the database, by configuring this field
		//   you are asking the Keystone AdminUI to create a new user
		//   providing inputs for these fields
		fields: ['name', 'email', 'password']

		// it uses context.sudo() to do this, which bypasses any access control you might have
		//   you shouldn't use this in production
	}
});

// A month in seconds
const sessionMaxAge = 60 * 60 * 24 * 30;

// you can find out more at https://keystonejs.com/docs/apis/session#session-api
const session = statelessSessions({
	maxAge: sessionMaxAge,
	secret: sessionSecret!
});

export { withAuth, session };
