<script lang="ts">
import type { FriendInfoWiiU } from '@pretendonetwork/grpc/friends/v2/friend_info';

const SPLATOON_TITLE_IDS = [
	1407375153522944, // USA
	1407375153523200, // EUR
	1407375153441536  // JPN
];

export default {
	props: {
		user: {
			type: Object as PropType<FriendInfoWiiU>,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	methods: {
		isOnline(): boolean {
			if (!this.user.presence?.online)
					return false;

			const titleID = this.user.presence?.gameKey?.titleId;
			if (titleID === undefined)
					return false;

			return SPLATOON_TITLE_IDS.includes(Number(titleID));
		}
	}
}
</script>

<template>
	<button class="tag TurquoiseOrange alpha-blend zigzag" :class="isOnline() ? 'online' : ''" v-if="user" @click="$emit('update-user', user)" :disabled="disabled">
		<h1>{{ user.nnaInfo?.principalBasicInfo?.mii?.name }}</h1>
		<h3>{{ user.nnaInfo?.principalBasicInfo?.nnid }}</h3>
	</button>
	<button class="tag TurquoiseOrange bravo-blend zigzag" v-if="user && !disabled" @click="$emit('update-user', user)" :disabled="disabled">
		<h1>{{ user.nnaInfo?.principalBasicInfo?.mii?.name }}</h1>
		<h3>{{ user.nnaInfo?.principalBasicInfo?.nnid }}</h3>
	</button>
</template>

<style scoped>
@keyframes background-slide {
  0% {
    background-position-y: 0px;
	}

  100% {
    background-position-y: 350px;
	}
}
.tag {
	font-family: "Splatoon1";
	position: relative;
	background-color: white;
	width: 350px;
	height: 100px;
	margin: 1ch;
	border: none;
	cursor: pointer;
	user-select: none;
	transition: filter 0.25s, background-position-y 10s;
	filter: brightness(50%);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.online, .tag:hover {
	filter: brightness(100%);
}
.tag:hover {
	animation: background-slide 20s linear infinite;
}
.tag h1 {
    position: relative;
		font-size: 30px;
		margin: 0;
		text-align: center;
		vertical-align: middle;
}
.online h1::after {
	position: relative;
	display: inline-block;
	content: "";
	width: 0.5ch;
	height: 0.5ch;
	background-color: lime;
	border-radius: 100%;
	margin-bottom: 0.75ch;
}
.tag h3 {
    position: absolute;
    left: 1ch;
    bottom: 0.1ch;
    margin: 0;
}
/* Background Style Text Overrides */
.zigzag {
	color: white;
}
</style>
