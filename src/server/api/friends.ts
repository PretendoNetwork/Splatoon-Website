import type { H3Event } from 'h3'
import { createChannel, createClient, Metadata } from 'nice-grpc';
import { FriendsServiceDefinition } from '@pretendonetwork/grpc/friends/v2/friends_service'
import type { GetUserFriendsDataWiiUResponse, GetUserFriendsData3DSResponse } from '@pretendonetwork/grpc/friends/v2/get_user_friend_data_rpc'
import { logger } from '~~/logger';

const config = useRuntimeConfig();
const { api_key, host, port } = config.grpc.friends;

const gRPCFriendsChannel = createChannel(`${host}:${port}`);
const gRPCFriendsClient = createClient(FriendsServiceDefinition, gRPCFriendsChannel);

BigInt.prototype.toJSON = function () {
  return JSON.rawJSON(this.toString());
};

async function fetchFriendsWiiU() {
	let result: GetUserFriendsDataWiiUResponse = await gRPCFriendsClient.getUserFriendsDataWiiU({
		pid: 1542385105
	}, {
			metadata: Metadata({
				'X-API-Key': api_key
			})
	});
	return result.friends
}

async function fetchFriends3DS() {
	let result: GetUserFriendsData3DSResponse = await gRPCFriendsClient.getUserFriendsData3DS({
		pid: 1542385105
	}, {
			metadata: Metadata({
				'X-API-Key': api_key
			})
	});
	return result.friends
}

export default cachedEventHandler(async (event) => {
	logger.info('Fetching friends');
  const friends = await fetchFriendsWiiU();
	console.log(friends[0]);
	return friends;
}, {
  maxAge: 0,
  getKey: (event: H3Event) => event.path
})
