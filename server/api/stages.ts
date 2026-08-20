import fs from 'node:fs';
import tls from 'tls';
import { BYAML } from '@pretendonetwork/nintendo-files';
import type { H3Event } from 'h3';
const config = useRuntimeConfig();

const { maxResponse, fileCacheDir } = config;

tls.DEFAULT_MIN_VERSION = 'TLSv1.1';

async function fetchRotationFile(): Promise<globalThis.Settings | null> {
	const cacheFile = `${fileCacheDir}/VSSetting.json`;
	if (fs.existsSync(cacheFile)) {
		const fileContents = fs.readFileSync(cacheFile, { encoding: 'utf-8' });
		const json = JSON.parse(fileContents);
		if (new Date(json.FetchedAt) > new Date(Date.now() - 60 * 60 * 1000)) {
			logger.info('Using cached file');
			return json;
		}
	}
	const file = await getFileFromTask('schdat2', 'VSSetting.byaml');
	if (!file) {
		return null;
	}

	const contents = await decryptBossFile(file);
	if (!contents) {
		return null;
	}
	const byaml = BYAML.fromBuffer(contents);
	const settings = byaml.toJSON();

	const json = getSensibleJSON(settings);
	json.FetchedAt = Date.now();

	const currentDate = new Date(json.ByamlInfo.BaseByamlStartTime);
	for (let i = 0; i < json.Phases.length; i++) {
		const timeOffset = json.Phases[i].Time;

		json.Phases[i].Date = currentDate.toString();
		currentDate.setHours(currentDate.getHours() + timeOffset);
	}

	logger.info('Caching file');
	fs.writeFileSync(cacheFile, JSON.stringify(json, null, 4), 'utf-8');
	return json;
}

export async function fetchSettings(): Promise<Settings | null> {
	const json = await fetchRotationFile();

	if (!json) {
		return null;
	}

	const now = new Date();
	const currentPhases: Phase[] = [];
	let isLeft = false;

	for (const phase of json.Phases) {
		const timeOffset = phase.Time;

		phase.Direction = isLeft ? 'left' : 'right';
		phase.Blend = isLeft ? 'alpha-blend' : 'bravo-blend';
		isLeft = !isLeft;

		const rotationStart = new Date(phase.Date);
		rotationStart.setHours(rotationStart.getHours() + timeOffset); // Move to end of rotation

		if (rotationStart >= now) {
			currentPhases.push(phase);
		}

		if (currentPhases.length >= Number(maxResponse)) {
			break;
		}
	}
	json.Phases = currentPhases;

	return json;
}

export default cachedEventHandler(async () => {
	logger.info('Fetching settings');
	return await fetchSettings();
}, {
	maxAge: 60,
	getKey: (event: H3Event) => event.path
});
