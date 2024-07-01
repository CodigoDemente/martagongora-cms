/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading, Link } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';

const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=371932638864920&redirect_uri=https://localhost:3000/instagram/auth&scope=user_profile,user_media&response_type=code`;

export default function InstagramSetupPage() {
	return (
		<PageContainer header={<Heading type="h3">Configurar Instagram</Heading>}>
			<p>Aquí puedes configurar tu instagram para que aparezcan tus publicaciones en la web.</p>
			<Button>
				<Link href={instagramAuthUrl} target="_blank">
					Configurar
				</Link>
			</Button>
		</PageContainer>
	);
}
