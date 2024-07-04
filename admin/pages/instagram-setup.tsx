/** @jsxRuntime classic */
/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import { Heading, Link } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { useState, useEffect } from 'react';

const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=371932638864920&redirect_uri=https://localhost:3000/instagram/auth&scope=user_profile,user_media&response_type=code`;

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
	} catch (error) {
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
			<Button tone='negative' onClick={
				async () => {
					const success = await unlinkInstagram();

					if (success) {
						onUnlink();
					}
				}
			}>
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
			<p>Aquí puedes gestionar la vinculación de tu instagram para que aparezcan tus publicaciones en la web.</p>
			<InstagramButton configExists={configExists} onUnlink={() => setConfigExists(false)}/>
		</PageContainer>
	);
}
