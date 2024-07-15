/** @jsxRuntime classic */
/** @jsx jsx */

import { H3, jsx, Link } from '@keystone-ui/core';

export const CustomLogo = () => {
	return (
		<H3>
			<Link
				href="/"
				css={{
					textDecoration: 'none',
					color: 'inherit'
				}}
			>
				Marta Góngora CMS
			</Link>
		</H3>
	);
};
