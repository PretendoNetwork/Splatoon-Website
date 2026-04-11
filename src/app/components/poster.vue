<script lang="ts">
export default {
	props: {
		id: {
			type: String,
			required: true
		},
		mapID: {
			type: String,
			required: true
		},
		gameMode: {
			type: String,
			required: true
		},
		players: {
			type: Array,
			required: true
		}
	},
	methods: {
	}
}
</script>

<template>
	<div class="poster">
		<div class="inner">
			<h3 class="">Gathering #{{ id }}</h3>
			<img class="" :src="`/images/stages/${mapID}.webp`"  />
			<h4 class="map">{{ $t(`stages.${mapID}`) }}</h4>
			<h4 :class="gameMode">{{ $t(`modes.${gameMode}`) }}</h4>
			<h4 class="friends">Friends Only</h4>
		</div>
		<div class="players">
			<template v-for="i in 8" :key="i">
				<span v-if="i > players.length" class="empty"></span>
				<span v-if="i <= players.length">{{ players[i-1] }}</span>
			</template>
		</div>
	</div>
</template>

<style scoped>
/* Active Matches */
.poster {
	width: 100%;
	max-width: 20em;
	display: inline-block;
	margin-top: 0;
	padding-top: 0;
	margin: 0 0.5em;
}

.poster > div.inner {
	background: white;
	display: flex;
	flex-direction: column;
	padding-bottom: 1ch;
	box-shadow: black 5px 5px 10px;
}

.page img {
    aspect-ratio: 1 / 1;
    object-fit: cover;
    padding: 10px;
    margin-bottom: 0;
    padding-bottom: 0;
}

.poster img {
	padding: 0 1ch 1ch 1ch;
}

.players > span {
	writing-mode: sideways-lr;
	border-top: 2px dashed;
	margin-right: 5px;
	width: 12.5%;
	background: white;
	padding: 1ch 0;
	position: relative;
	box-shadow: black 5px 5px 10px;
	min-height: 4em;
	text-align: start;
}

.players > span:last-of-type {
	margin-right: 0;
}

.players {
	display: flex;
}

.players>span.empty {
	height: 0px;
	min-height: unset;
}

.players>span.empty::after {
	content: "";
	height: 20px;
	display: block;
	background: url(/images/rip.svg) bottom left !important;
	position: absolute;
	top: 90%;
	left: 0;
	width: 100%;
}

h4 {
	margin: 0;
	color: black;
	text-align: start;
	padding-left: 1em;
}

.poster h3,
.poster h2 {
	margin: 0.2em;
}
</style>
