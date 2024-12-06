/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading, Link } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { useState, useEffect } from 'react';

const instagramAuthUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=0&client_id=1111517720383404&redirect_uri=https://backoffice.martagongora.com/instagram/auth&response_type=code&scope=instagram_business_basic`;

type InstagramButtonProps = {
	configExists: boolean;
	onUnlink: () => void;
};

async function unlinkInstagram() {
	try {
		const response = await fetch('/configuration/instagram', {
			method: 'DELETE'
		});

		if (response.status !== 200) {
			throw new Error('Failed to unlink instagram');
		}

		return true;
	} catch (_) {
		return false;
	}
}

function InstagramButton({ configExists, onUnlink }: InstagramButtonProps) {
	if (!configExists) {
		return (
			<Button>
				<Link href={instagramAuthUrl} target="_self">
					Configurar
				</Link>
			</Button>
		);
	} else {
		return (
			<Button
				tone="negative"
				onClick={async () => {
					const success = await unlinkInstagram();

					if (success) {
						onUnlink();
					}
				}}
			>
				Desvincular
			</Button>
		);
	}
}

export default function InstagramSetupPage() {
	const [configExists, setConfigExists] = useState(false);

	useEffect(() => {
		async function doesConfigExists() {
			const response = await fetch('/configuration/instagram', {
				method: 'HEAD'
			});

			if (response.status === 200) {
				return setConfigExists(true);
			}
		}

		doesConfigExists();
	}, []);

	return (
		<PageContainer header={<Heading type="h3">Configurar Instagram</Heading>}>
			<p>
				Aquí puedes gestionar la vinculación de tu instagram para que aparezcan tus publicaciones en
				la web.
			</p>
			<InstagramButton configExists={configExists} onUnlink={() => setConfigExists(false)} />
		</PageContainer>
	);
}
