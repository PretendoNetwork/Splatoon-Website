<script lang="ts">
import Settings from './settings.vue';
import Header from './header.vue';
import Tag from './tag.vue';
import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info';

export default {
	props: {
		user: {
			type: Object as PropType<FriendInfoWiiU>,
			required: true
		}
	},
	methods: {
	}
}
</script>

<template>
  <Settings>
		<div class="user-header">
			<img v-if="false" class="user-icon" :src="`https://r2-cdn.pretendo.cc/mii/${user.nnaInfo?.principalBasicInfo?.pid}/normal_face.png`"/>
			<img v-if="false" class="user-icon" src="https://cdn.discordapp.com/attachments/638541370478297088/1491084143315128391/post.png?ex=69eecb92&is=69ed7a12&hm=793e3aa5626bca1389ccc32e9b5b1660df2227ff6c4667d19e4d0e2f3f70907a&"/>
			<Tag :user="user" :disabled="true"/>
		</div>
		<Header class="PinkOrange" :index="1" size="medium">Favorite Stages</Header>
		<div>
			<Polaroid :mapID="0" gameMode="cPnt" :small="true"></Polaroid>
			<Polaroid :mapID="1" gameMode="cVar" :small="true"></Polaroid>
		</div>
		<div>
			<Header class="PinkOrange" :index="0" size="medium">Favorite Weapons</Header>
		</div>
	</Settings>
</template>

<style scoped>
.user-header {
	display: inline-flex;
	justify-content: center;
	flex-wrap: wrap-reverse;
}

h2 {
	margin: 0;
}

.online h2::after {
	position: relative;
	display: inline-block;
	content: " ";
	width: 0.5ch;
	height: 0.5ch;
	background-color: lime;
	border-radius: 100%;
	margin-bottom: 0.75ch;
}

img.user-icon {
	width: 100px;
	height: 100px;
	margin: auto 0;
}

Tag {
	margin: 0 auto;
}

div {
	display: flex;
	justify-content: space-around;
}
</style>
