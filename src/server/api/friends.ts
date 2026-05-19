import type { H3Event } from 'h3'
import { getCookie, parseCookies } from 'h3'
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { FriendsServiceDefinition } from '@pretendonetwork/grpc/friends/v2/friends_service'
import type { GetUserFriendsDataWiiUResponse } from '@pretendonetwork/grpc/friends/v2/get_user_friend_data_wiiu_rpc'
import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info'
import { logger } from '~~/logger';
import { fetchUserData } from '~~/util';

const config = useRuntimeConfig();
const { api_key, host, port } = config.grpc.friends;

const gRPCFriendsChannel = createChannel(`${host}:${port}`);
const gRPCFriendsClient = createClient(FriendsServiceDefinition, gRPCFriendsChannel);

BigInt.prototype.toJSON = function () {
  return JSON.rawJSON(this.toString());
};

async function fetchFriends(pid: number): Promise<FriendInfoWiiU[] | null> {
	try {
		let result: GetUserFriendsDataWiiUResponse = await gRPCFriendsClient.getUserFriendsDataWiiU({
			pid
		}, {
				metadata: Metadata({
					'X-API-Key': api_key
				})
		});
		return result.friends
	} catch (e) {
		logger.error(e);
		return null;
	}
}

export default defineEventHandler(async (event) => {
	logger.debug('Fetching friends');
	const authToken = getCookie(event, 'access_token');

	if (!authToken) return null;
	const userData = await fetchUserData(authToken);

	if (!userData) return null;
  return await fetchFriends(userData.pid);
});

