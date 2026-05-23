import type { FriendInfoWiiU } from "@pretendonetwork/grpc/friends/v2/friend_info";

export interface Friend extends FriendInfoWiiU {
	tagTheme: string
}
