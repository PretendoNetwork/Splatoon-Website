import crypto from 'crypto'
import { createConfig, loaders } from '@neato/config';
import { z } from 'zod';
import logger from './logger';

const config = createConfig({
	envPrefix: 'PN_INK_',
	loaders: [
		loaders.environment(),
		loaders.cli(),
		loaders.file('.env'),
	],
	schema: z.object({
		boss: z.object({
			aes_key: z.coerce.string(),
			hmac_key: z.coerce.string(),
		}),
		domain: z.coerce.string(),
		app_id: z.coerce.string(),
		max_response: z.coerce.number()
	})
});

let configValid = true;

if (!config.domain) {
	logger.error('PN_INK_DOMAIN is Missing!');
	configValid = false;
}

if (!config.app_id) {
	logger.error('PN_INK_APP_ID is Missing!');
	configValid = false;
}

if (!config.max_response) {
	logger.error('PN_INK_MAX_RESPONSE is Missing!');
	configValid = false;
}

if (!config.boss.aes_key) {
	logger.error('PN_INK_BOSS__AES_KEY is Missing!');
	configValid = false;
} else {
	const AES_MD5 = crypto.createHash('md5');
	AES_MD5.update(config.boss.aes_key);

	if (AES_MD5.digest('hex') != '5202ce5099232c3d365e28379790a919') {
		logger.error('BOSS AES key hash does not match!');
		configValid = false;
	}
}

if (!config.boss.hmac_key) {
	logger.error('PN_INK_BOSS__HMAC_KEY is Missing!');
	configValid = false;
} else {
	const HMAC_MD5 = crypto.createHash('md5');
	HMAC_MD5.update(config.boss.hmac_key);

	if(HMAC_MD5.digest('hex') != 'b4482fef177b0100090ce0dbeb8ce977') {
		logger.error('BOSS HMAC key hash does not match!');
		configValid = false;
	}
}

if (!configValid) {
	process.exit(1);
}

export { config };
