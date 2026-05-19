import type { H3Event } from 'h3'
import { logger } from '~~/logger';
import { fetchMatches } from '~~/database';
import { fetchPNIDs } from '~~/util';

export default cachedEventHandler(async (event) => {
	logger.info('Fetching matches');
  const matches = await fetchMatches();
	const pids = matches.map(m => m.participants).flat(1);
	const pnids = await fetchPNIDs(pids)

	return matches.map(element => ({...element, participants : element.participants.map(pid => pid in pnids ? pnids[pid]?.username : 'Unknown')}));
}, {
  maxAge: 60,
  getKey: (event: H3Event) => event.path
})
