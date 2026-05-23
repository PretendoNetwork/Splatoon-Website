import { getCookie } from 'h3'
import { logger } from '~~/logger';
import { fetchFriends, fetchPNID, fetchFriendInfo } from '~~/util';
import { getUsersData } from '~~/database';
import type { IUser } from '~~/types/mongoose/user';

BigInt.prototype.toJSON = function () {
  return JSON.rawJSON(this.toString());
};

export default defineEventHandler(async (event) => {
	logger.debug('Fetching friends');
	const authToken = getCookie(event, 'access_token');

	if (!authToken) return null;
	const userData = await fetchPNID(authToken);

	if (!userData) return null;
  let friends = await fetchFriends(userData.pid);

	if (!friends) return null;

	const friendPIDs = friends.map(friend => friend.nnaInfo?.principalBasicInfo?.pid ?? 0);

	const friendSettings = await getUsersData(friendPIDs);
	console.log(friendSettings);
	return friends.map(friend => ({...friend, tagTheme: friendSettings.find(settings => settings.pid == friend.nnaInfo?.principalBasicInfo?.pid)?.splash_tag_classes ?? 'bravo-blend PinkBlue stripes' }));
});

