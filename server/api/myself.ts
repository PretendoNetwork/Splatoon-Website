import { getCookie } from 'h3';
import type { IUser } from '~~/shared/types/mongoose/user';

export default defineEventHandler(async (event) => {
	logger.debug('Getting myself');
	const authToken = getCookie(event, 'access_token');

	if (!authToken) {
		return null;
	}
	try {
		const userData = await fetchPNID(authToken);

		if (!userData) {
			logger.error('Failed to fetch user data from account');
			return null;
		}

		const friendInfo = await fetchFriendInfo(userData.pid);
		let settings = await getUserData(userData.pid);

		if (!friendInfo?.user) {
			logger.error('Failed to fetch user info from friends');
			return null;
		}

		if (!settings) {
			// If we are fetching this for the first time, create new user data
			const document: IUser = {
				pid: userData.pid,
				splash_tag_classes: 'bravo-blend PinkBlue stripes'
			};
			settings = await User.create(document);
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
