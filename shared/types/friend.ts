import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info';
import type { GetUserDataResponse } from '@pretendonetwork/grpc/api/get_user_data_rpc';

export interface Friend extends FriendInfoWiiU {
	tagTheme: string;
	pnid: GetUserDataResponse;
}
