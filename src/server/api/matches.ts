import type { H3Event } from 'h3'
import logger from '~~/logger';
import { fetchMatches } from '~~/database';

export default cachedEventHandler(async (event) => {
	logger.info('Fetching matches');
  return await fetchMatches();
}, {
  maxAge: 1,
  getKey: (event: H3Event) => event.path
})
