import { getCookie } from 'h3';

export default defineEventHandler(async (event) => {
	logger.debug('Getting myself');
	const authToken = getCookie(event, 'access_token');

	if (!authToken) {
		return null;
	}
	const userData = await fetchPNID(authToken).catch((e) => {
		logger.error(e);
	});

	if (!userData) {
		return null;
	}
	const friendInfo = await fetchFriendInfo(userData.pid).catch((e) => {
		logger.error(e);
	});

	const settings = await getUserData(userData.pid).catch((e) => {
		logger.error(e);
	});

	if (!friendInfo?.user || !settings) {
		return null;
	}

	const myself: Myself = {
		tagTheme: settings?.splash_tag_classes,
		userInfo: friendInfo.user
	};

	return myself;
});
