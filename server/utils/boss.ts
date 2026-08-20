import fs from 'node:fs';
import tls from 'tls';
import * as xml2js from 'xml2js';
import { decryptWiiU } from '@pretendonetwork/boss-crypto';
import type { BossFile } from '~~/shared/types/boss';
const config = useRuntimeConfig();

const { boss, fileCacheDir } = config;
const { aes_key, hmac_key, domain, app_id } = boss;

tls.DEFAULT_MIN_VERSION = 'TLSv1.1';

export async function getFilesFromTask(taskId: string, filename: string | null = null): Promise<[BossFile] | BossFile | null> {
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

export async function getFileFromTask(taskId: string, filename: string): Promise<BossFile | null> {
	const files = await getFilesFromTask(taskId, filename);

	if (!files || Array.isArray(files)) {
		return null;
	}

	if (files.Filename != filename) {
		return null;
	}

	return files;
}

export async function decryptBossFile(file: BossFile | null): Promise<Buffer<ArrayBufferLike> | null> {
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
		logger.error('Failed to decrypt ' + e);
		return null;
	}
}

// The BYAML parser spits out this gross nested { value: xyz } struct that's a nightmare to parse through.
// Turn this into something sensible to actually use within the application
export function getSensibleJSON(byaml: any): any {
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
