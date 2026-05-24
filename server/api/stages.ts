import fs from 'node:fs';
import tls from 'tls';
import * as xml2js from 'xml2js';
import { decryptWiiU } from '@pretendonetwork/boss-crypto';
import * as pkg from '@pretendonetwork/nintendo-files';
import type { H3Event } from 'h3';
const { BYAML } = pkg;
const config = useRuntimeConfig();

const { boss, maxResponse, fileCacheDir } = config;
const { aes_key, hmac_key, domain, app_id } = boss;

tls.DEFAULT_MIN_VERSION = 'TLSv1.1';

async function getFilesFromTask(taskId: string, filename: string | null = null) {
	const url = `${domain}/p01/tasksheet/1/${app_id}/${taskId}?c=US&l=en`;

	const tasksheet = await fetch(url);
	if (!tasksheet || tasksheet.status != 200) {
		return null;
	}

	const text = await tasksheet.text();
	const xml: TaskSheet = await xml2js.parseStringPromise(text, { explicitArray: false });

	if (!xml) {
		return null;
	}

	const task = xml.TaskSheet;
	if (task.TaskId != taskId || task.ServiceStatus != 'open') {
		return null;
	}

	const files = task.Files.File;
	if (filename && Array.isArray(files)) {
		for (const file of files) {
			if (file.Filename == filename) {
				return file;
			}
		}
		return null;
	}

	return task.Files.File;
}

async function getFileFromTask(taskId: string, filename: string) {
	const files = await getFilesFromTask(taskId, filename);

	if (!files || Array.isArray(files)) {
		return null;
	}

	if (files.Filename != filename) {
		return null;
	}

	return files;
}

async function decryptBossFile(file: BossFile | null) {
	if (!file) {
		return null;
	}

	try {
		const response = await fetch(file.Url);
		if (!response || response.status != 200) {
			return null;
		}
		const buffer = Buffer.from(await response.arrayBuffer());
		const { content } = decryptWiiU(buffer, aes_key, hmac_key);

		fs.writeFileSync(`${fileCacheDir}/${file.Filename}`, content);
		return content;
	} catch (e) {
		logger.error(e);
		return null;
	}
}

// The BYAML parser spits out this gross nested { value: xyz } struct that's a nightmare to parse through.
// Turn this into something sensible to actually use within the application
function getSensibleJSON(byaml: any): any {
	const json: Record<string, any> = {};
	const obj = byaml.value;
	// If it's anything other than a base object return it
	if (typeof obj != 'object') {
		return obj;
	}
	// Hydrate array
	if (Array.isArray(obj)) {
		const array = [];
		for (const el of obj) {
			array.push(getSensibleJSON(el));
		}
		return array;
	}
	// Otherwise iterate over keys
	for (const key in obj) {
		json[key] = getSensibleJSON(obj[key]);
	}
	return json;
}

async function fetchRotationFile() {
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
