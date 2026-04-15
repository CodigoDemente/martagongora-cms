import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

import Logger from '../Logger';

export type RecaptchaVerificationContext = {
	remoteIp?: string;
	userAgent?: string;
};

type ServiceAccountEnvLoad =
	| { ok: true; credentials: object; projectIdFromJson?: string }
	| { ok: false; reason: 'invalid_json' | 'none' };

let recaptchaClient: RecaptchaEnterpriseServiceClient | undefined;
let cachedServiceAccountLoad: ServiceAccountEnvLoad | undefined;

function loadServiceAccountFromEnv(): ServiceAccountEnvLoad {
	if (cachedServiceAccountLoad !== undefined) {
		return cachedServiceAccountLoad;
	}

	const raw =
		process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim() ||
		process.env.RECAPTCHA_SERVICE_ACCOUNT_JSON?.trim();
	const b64 =
		process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64?.trim() ||
		process.env.RECAPTCHA_SERVICE_ACCOUNT_JSON_B64?.trim();

	let jsonStr: string | undefined;
	if (raw) {
		jsonStr = raw;
	} else if (b64) {
		try {
			jsonStr = Buffer.from(b64, 'base64').toString('utf8');
		} catch (error) {
			Logger.error(error, 'reCAPTCHA Enterprise: invalid base64 in *_SERVICE_ACCOUNT_JSON_B64');
			cachedServiceAccountLoad = { ok: false, reason: 'invalid_json' };

			return cachedServiceAccountLoad;
		}
	}

	if (!jsonStr) {
		cachedServiceAccountLoad = { ok: false, reason: 'none' };

		return cachedServiceAccountLoad;
	}

	try {
		const credentials = JSON.parse(jsonStr) as { project_id?: string; [key: string]: unknown };
		const projectIdFromJson =
			typeof credentials.project_id === 'string' ? credentials.project_id : undefined;
		cachedServiceAccountLoad = { ok: true, credentials, projectIdFromJson };

		return cachedServiceAccountLoad;
	} catch (error) {
		Logger.error(
			error,
			'reCAPTCHA Enterprise: could not parse service account JSON from environment'
		);
		cachedServiceAccountLoad = { ok: false, reason: 'invalid_json' };

		return cachedServiceAccountLoad;
	}
}

function getClient(): RecaptchaEnterpriseServiceClient {
	if (!recaptchaClient) {
		const sa = loadServiceAccountFromEnv();
		const opts: {
			credentials?: object;
			keyFilename?: string;
			projectId?: string;
		} = {};

		if (sa.ok) {
			opts.credentials = sa.credentials;
			if (sa.projectIdFromJson) {
				opts.projectId = sa.projectIdFromJson;
			}
		}

		const keyFile = process.env.RECAPTCHA_KEY_FILE?.trim();
		if (keyFile) {
			opts.keyFilename = keyFile;
		}

		const pid =
			process.env.RECAPTCHA_PROJECT_ID?.trim() ||
			process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
			process.env.GCLOUD_PROJECT?.trim();
		if (pid) {
			opts.projectId = pid;
		}

		recaptchaClient = new RecaptchaEnterpriseServiceClient(
			Object.keys(opts).length > 0 ? opts : undefined
		);
	}

	return recaptchaClient;
}

async function resolveProjectId(): Promise<string | undefined> {
	const fromEnv =
		process.env.RECAPTCHA_PROJECT_ID?.trim() ||
		process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
		process.env.GCLOUD_PROJECT?.trim();

	if (fromEnv) {
		return fromEnv;
	}

	const sa = loadServiceAccountFromEnv();
	if (sa.ok && sa.projectIdFromJson) {
		return sa.projectIdFromJson;
	}

	try {
		return await getClient().getProjectId();
	} catch {
		return undefined;
	}
}

/**
 * Verifica un token de reCAPTCHA Enterprise con el cliente oficial
 * (@google-cloud/recaptcha-enterprise → createAssessment).
 *
 * En PaaS (p. ej. Render): pega el JSON de la cuenta de servicio en
 * `GOOGLE_SERVICE_ACCOUNT_JSON` o `RECAPTCHA_SERVICE_ACCOUNT_JSON`, o la misma cadena en base64
 * en `GOOGLE_SERVICE_ACCOUNT_JSON_B64` / `RECAPTCHA_SERVICE_ACCOUNT_JSON_B64` (evita problemas con comillas saltos de línea).
 * Rol recomendado: `roles/recaptchaenterprise.agent` (o permiso `recaptchaenterprise.assessments.create`).
 */
export async function verifyRecaptchaToken(
	token: string | undefined,
	ctx: RecaptchaVerificationContext = {}
): Promise<boolean> {
	if (!token?.trim()) {
		return false;
	}

	const saLoad = loadServiceAccountFromEnv();
	if (saLoad.ok === false && saLoad.reason === 'invalid_json') {
		return false;
	}

	const siteKey = process.env.RECAPTCHA_SITE_KEY?.trim();
	if (!siteKey) {
		Logger.error({}, 'reCAPTCHA Enterprise: RECAPTCHA_SITE_KEY is not set');

		return false;
	}

	const projectId = await resolveProjectId();
	if (!projectId) {
		Logger.error(
			{},
			'reCAPTCHA Enterprise: set RECAPTCHA_PROJECT_ID (or GOOGLE_CLOUD_PROJECT / GCLOUD_PROJECT), or put project_id in the service account JSON'
		);

		return false;
	}

	const event: {
		token: string;
		siteKey: string;
		userIpAddress?: string;
		userAgent?: string;
		expectedAction?: string;
	} = {
		token: token.trim(),
		siteKey
	};

	if (ctx.remoteIp) {
		event.userIpAddress = ctx.remoteIp;
	}
	if (ctx.userAgent) {
		event.userAgent = ctx.userAgent;
	}

	const expectedAction = process.env.RECAPTCHA_EXPECTED_ACTION?.trim();
	if (expectedAction) {
		event.expectedAction = expectedAction;
	}

	try {
		const client = getClient();
		const parent = client.projectPath(projectId);

		const [assessment] = await client.createAssessment({
			parent,
			assessment: { event }
		});

		if (!assessment.tokenProperties?.valid) {
			Logger.warn(
				{ invalidReason: assessment.tokenProperties?.invalidReason },
				'reCAPTCHA Enterprise: invalid token'
			);

			return false;
		}

		const score = assessment.riskAnalysis?.score;
		if (typeof score === 'number') {
			const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');
			if (score < minScore) {
				Logger.warn({ score, minScore }, 'reCAPTCHA Enterprise: risk score below threshold');

				return false;
			}
		}

		return true;
	} catch (error) {
		Logger.error(error, 'reCAPTCHA Enterprise: createAssessment failed');

		return false;
	}
}
