import type { H3Event } from 'h3'
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { FriendsServiceDefinition } from '@pretendonetwork/grpc/friends/v2/friends_service'
import type { GetUserFriendsDataWiiUResponse } from '@pretendonetwork/grpc/friends/v2/get_user_friend_data_wiiu_rpc'
import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info'
import { logger } from '~~/logger';

const config = useRuntimeConfig();
const { api_key, host, port } = config.grpc.friends;

const gRPCFriendsChannel = createChannel(`${host}:${port}`);
const gRPCFriendsClient = createClient(FriendsServiceDefinition, gRPCFriendsChannel);

BigInt.prototype.toJSON = function () {
  return JSON.rawJSON(this.toString());
};

async function fetchFriends(): Promise<FriendInfoWiiU[]> {
	try {
		let result: GetUserFriendsDataWiiUResponse = await gRPCFriendsClient.getUserFriendsDataWiiU({
			pid: 1542385105 // TODO: implement auth and rip this out
		}, {
				metadata: Metadata({
					'X-API-Key': api_key
				})
		});
		return result.friends
	} catch (e) {
		logger.error(e);
		return []
	}
}

export default cachedEventHandler(async (event) => {
	logger.debug('Fetching friends');
  const friends = await fetchFriends();

	return friends;
}, {
  maxAge: 0,
  getKey: (event: H3Event) => event.path
})
