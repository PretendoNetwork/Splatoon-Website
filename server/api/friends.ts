import { getCookie } from 'h3';

BigInt.prototype.toJSON = function () {
	return JSON.rawJSON(this.toString());
};

export default defineEventHandler(async (event) => {
	logger.debug('Fetching friends');
	const authToken = getCookie(event, 'access_token');

	if (!authToken) {
		return null;
	}
	const userData = await fetchPNID(authToken);

	if (!userData) {
		return null;
	}
	const friends = await fetchFriends(userData.pid);

	if (!friends) {
		return null;
	}

	const friendPIDs = friends.map(friend => friend.nnaInfo?.principalBasicInfo?.pid ?? 0);

	const friendSettings = await getUsersData(friendPIDs);
	return friends.map(friend => ({ ...friend, tagTheme: friendSettings.find(settings => settings.pid == friend.nnaInfo?.principalBasicInfo?.pid)?.splash_tag_classes ?? 'bravo-blend PinkBlue stripes' }));
});
