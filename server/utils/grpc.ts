import { createChannel, createClient, Metadata } from 'nice-grpc';
import { AccountServiceDefinition } from '@pretendonetwork/grpc/account/v2/account_service';
import { FriendsServiceDefinition } from '@pretendonetwork/grpc/friends/v2/friends_service';
import { APIDefinition } from '@pretendonetwork/grpc/api/api_service';
import { MiiverseServiceDefinition } from '@pretendonetwork/grpc/miiverse/v2/miiverse_service';
import { PostType } from '@pretendonetwork/grpc/miiverse/v2/post';
import type { GetPNIDsResponse } from '@pretendonetwork/grpc/account/v2/get_pnids_rpc';
import type { GetUserDataResponse } from '@pretendonetwork/grpc/api/get_user_data_rpc';
import type { GetUserFriendsDataWiiUResponse } from '@pretendonetwork/grpc/friends/v2/get_user_friend_data_wiiu_rpc';
import type { GetUserDataWiiUResponse } from '@pretendonetwork/grpc/friends/v2/get_user_data_wiiu_rpc';
import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info';
import type { PostData } from '@pretendonetwork/grpc/miiverse/v2/post';

const config = useRuntimeConfig();

const { api_key: api_key_account, host: host_account, port: port_account } = config.grpc.account;
const { api_key: api_key_friends, host: host_friends, port: port_friends } = config.grpc.friends;
const { api_key: api_key_juxt, host: host_juxt, port: port_juxt } = config.grpc.juxtaposition;

const gRPCAccountChannel = createChannel(`${host_account}:${port_account}`);
const gRPCAccountClient = createClient(AccountServiceDefinition, gRPCAccountChannel);

const gRPCApiChannel = createChannel(`${host_account}:${port_account}`);
const gRPCApiClient = createClient(APIDefinition, gRPCApiChannel);

const gRPCFriendsChannel = createChannel(`${host_friends}:${port_friends}`);
const gRPCFriendsClient = createClient(FriendsServiceDefinition, gRPCFriendsChannel);

const gRPCJuxtChannel = createChannel(`${host_juxt}:${port_juxt}`);
const gRPCJuxtClient = createClient(MiiverseServiceDefinition, gRPCJuxtChannel);

export async function fetchPNIDs(pids: number[]): Promise<GetPNIDsResponse['userData']> {
	try {
		const result: GetPNIDsResponse = await gRPCAccountClient.getPNIDs({
			pid: pids
		}, {
			metadata: Metadata({
				'X-API-Key': api_key_account
			})
		});
		return result.userData;
	} catch (e) {
		logger.error(e, 'Error fetching PNIDs');
		throw new Error('Failed to fetch PNIDs');
	}
}

export async function fetchPNID(token: string): Promise<GetUserDataResponse> {
	return gRPCApiClient.getUserData({}, {
		metadata: Metadata({
			'X-API-Key': api_key_account,
			'X-Token': token
		})
	});
}

export async function fetchFriendInfo(pid: number): Promise<GetUserDataWiiUResponse> {
	return gRPCFriendsClient.getUserDataWiiU({
		pid
	}, {
		metadata: Metadata({
			'X-API-Key': api_key_friends
		})
	});
}

export async function fetchFriends(pid: number): Promise<FriendInfoWiiU[]> {
	try {
		const result: GetUserFriendsDataWiiUResponse = await gRPCFriendsClient.getUserFriendsDataWiiU({
			pid
		}, {
			metadata: Metadata({
				'X-API-Key': api_key_friends
			})
		});
		return result.friends;
	} catch (e) {
		logger.error(e, 'Error fetching friends');
		throw new Error('Failed to fetch friends');
	}
}

export async function fetchPosts(): Promise<PostData[]> {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	try {
		const result = await gRPCJuxtClient.getCommunityPosts({
			communityId: '',
			distinctPid: true,
			allowSpoiler: false,
			type: PostType.POST_TYPE_MEMO,
			limit: 100,
			afterDate: yesterday.toTimeString()
		}, {
			metadata: Metadata({
				'X-API-Key': api_key_juxt
			})
		});
		return result.posts;
	} catch (e) {
		logger.error(e, 'Failed fetching posts');
		return [];
	}
}
