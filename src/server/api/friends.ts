import { getCookie } from 'h3'
import { logger } from '~~/logger';
import { fetchFriends, fetchPNID, fetchFriendInfo } from '~~/util';

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

	const self = await fetchFriendInfo(userData.pid);

	if (self?.user && friends)
		friends.unshift(self.user)

	return friends;
});

