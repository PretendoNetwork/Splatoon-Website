import { defaultPosts } from '~~/shared/utils/constants';
import type { H3Event } from 'h3';

export default cachedEventHandler(async (_) => {
	logger.debug('Fetching posts');
	try {
		const posts = await fetchPosts();
		const paintings = posts.map(m => m.painting?.url);
		return paintings;
	} catch {
		// Default pool of posts, this probably shouldn't be hardcoded but it works
		return defaultPosts;
	}
}, {
	maxAge: 60,
	getKey: (event: H3Event) => event.path
});
