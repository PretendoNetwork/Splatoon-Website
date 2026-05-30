import { getCookie } from 'h3';

export default defineEventHandler(async (event) => {
	logger.debug('Getting myself');
	const authToken = getCookie(event, 'access_token');

	if (!authToken) {
		return null;
	}
	try {
		const userData = await fetchPNID(authToken);

		if (!userData) {
			return null;
		}

		const friendInfo = await fetchFriendInfo(userData.pid);
		const settings = await getUserData(userData.pid);

		if (!friendInfo?.user || !settings) {
			return null;
		}

		const myself: Myself = {
			tagTheme: settings?.splash_tag_classes,
			userInfo: friendInfo.user
		};

		return myself;
	} catch (e) {
		logger.error('Failed to fetch user data');
		logger.error(e);
		return null;
	}
});
