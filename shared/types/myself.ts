import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info';

export type Myself = {
	tagTheme: string;
	userInfo: FriendInfoWiiU;
};
