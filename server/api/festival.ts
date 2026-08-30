import fs from 'node:fs';
import tls from 'tls';
import { BYAML } from '@pretendonetwork/nintendo-files';
import { displayP3ToRgb } from '~~/shared/utils/convertColors';
import type { H3Event } from 'h3';
import type { Festival } from '~~/shared/types/festival';
const config = useRuntimeConfig();

const { fileCacheDir } = config;

tls.DEFAULT_MIN_VERSION = 'TLSv1.1';

async function fetchSplatfestFile(): Promise<Festival | null> {
	const cacheFile = `${fileCacheDir}/Festival.json`;
	if (fs.existsSync(cacheFile)) {
		const fileContents = fs.readFileSync(cacheFile, { encoding: 'utf-8' });
		const json = JSON.parse(fileContents);
		if (new Date(json.FetchedAt) > new Date(Date.now() - 60 * 60 * 1000)) {
			logger.info('Using cached fest file');
			return json;
		}
	}
	const file = await getFileFromTask('optdat2', 'Festival.byaml');
	if (!file) {
		return null;
	}

	const contents = await decryptBossFile(file);
	if (!contents) {
		return null;
	}
	const byaml = BYAML.fromBuffer(contents);
	const festival = byaml.toJSON();

	const json = getSensibleJSON(festival);
	json.FetchedAt = Date.now();

	logger.info('Caching fest file');
	fs.writeFileSync(cacheFile, JSON.stringify(json, null, 4), 'utf-8');
	return json;
}

export async function fetchFestival(): Promise<Festival | null> {
	const json = await fetchSplatfestFile();

	if (!json) {
		return null;
	}

	json.Teams.forEach((team, i) => {
		if (!json.Teams[i]) {
			return; // Make the linter happy, this is dumb
		}

		// Splatfest files seem to use the display-p3 standard for colors, which does not play nice with my styling rules
		// So let's convert them to RGB, even if the color shifts a little bit
		const p3ColorList = team.Color.split(',').map(color => Number(color)) as Parameters<typeof displayP3ToRgb>;
		if (p3ColorList.length < 3) {
			return;
		}
		json.Teams[i].Color = `rgb(${displayP3ToRgb(...p3ColorList).join(' ')})`;
	});

	const Team1 = json.Teams.at(0);
	const Team2 = json.Teams.at(1);

	if (!Team1 || !Team2) {
		return json;
	}
	// TODO: This is a bit of a hack, splatfest translations are stored differently than our translations
	// so we need to map the translations we do have to the actual locales we support. There has to be a better way ;~;
	json.Title = {
		'de-EU': `${Team1.ShortName?.EUde} vs ${Team2.ShortName?.EUde}`,
		'en-EU': `${Team1.ShortName?.EUen} vs ${Team2.ShortName?.EUen}`,
		'es-EU': `${Team1.ShortName?.EUes} vs ${Team2.ShortName?.EUes}`,
		'fr-EU': `${Team1.ShortName?.EUfr} vs ${Team2.ShortName?.EUfr}`,
		'it-EU': `${Team1.ShortName?.EUit} vs ${Team2.ShortName?.EUit}`,
		'ja-JP': `${Team1.ShortName?.JPja} vs ${Team2.ShortName?.JPja}`,
		'en-US': `${Team1.ShortName?.USen} vs ${Team2.ShortName?.USen}`,
		'es-US': `${Team1.ShortName?.USes} vs ${Team2.ShortName?.USes}`,
		'es-ES': `${Team1.ShortName?.USes} vs ${Team2.ShortName?.USes}`,
		'fr-US': `${Team1.ShortName?.USfr} vs ${Team2.ShortName?.USfr}`
	};

	const announcedDate = new Date(json.Time.Announce);
	const startDate = new Date(json.Time.Start);
	const endDate = new Date(json.Time.End);
	const resultDate = new Date(json.Time.Result);
	const splatfestEnd = new Date(resultDate);

	splatfestEnd.setDate(splatfestEnd.getDate() + 1);

	const currentDate = new Date();

	json.isAnnounced = announcedDate <= currentDate;
	json.isStarted = startDate <= currentDate;
	json.isEnded = endDate <= currentDate;
	json.resultsPosted = resultDate <= currentDate;
	json.isActive = currentDate <= splatfestEnd;

	if (json.resultsPosted) {
		json.translationID = 'festival.results';
	} else if (json.isStarted && !json.isEnded) {
		json.translationID = 'festival.live';
	} else if (json.isAnnounced && !json.isEnded) {
		json.translationID = 'festival.announced';
	} else {
		json.translationID = 'festival.ended';
	}

	return json;
}

export default cachedEventHandler(async () => {
	logger.info('Fetching festival');
	return await fetchFestival();
}, {
	maxAge: 60,
	getKey: (event: H3Event) => event.path
});
