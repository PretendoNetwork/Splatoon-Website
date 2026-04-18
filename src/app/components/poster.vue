<script lang="ts">
/// <reference types="../../../../../.vscode/extensions/vue.volar-3.2.6/types/template-helpers.d.ts" />
/// <reference types="../../../../../.vscode/extensions/vue.volar-3.2.6/types/props-fallback.d.ts" />
import type { Phase, Stage } from '~~/types/settings';
const RANKED = 1, SQUAD = 4;
export default {
	props: {
		id: {
			type: String,
			required: true
		},
		gameMode: {
			type: Number,
			required: true
		},
		players: {
			type: Array,
			required: true
		},
		stages: {
			type: Array<Phase>,
			required: true
		}
	},
	methods: {
		isRanked(): boolean {
			switch (this.gameMode) {
				case RANKED:
				case SQUAD:
					return true;
				default:
					return false;
			}
		},
		getMaps(): Array<string> {
			if (!this.stages) return [];
			let currentMaps: Array<Stage> | undefined = this.isRanked() ? this.stages[0]?.GachiStages : this.stages[0]?.RegularStages;
			if (!currentMaps) return [];
			let mapIDs = [];
			for (let map of currentMaps) {
				mapIDs.push(map.MapID.toString())
			}

			return mapIDs
		},
		getMode(): string | undefined {
			if (!this.stages) return;
			console.log(this.isRanked(), RANKED, SQUAD, RANKED==this.gameMode, SQUAD==this.gameMode)
			return this.isRanked() ? this.stages[0]?.GachiRule : this.stages[0]?.RegularRule;
		},
		getGameType(): string {
			switch (this.gameMode) {
				case 0:
					return 'cPnt';
				case 1:
					return 'cVgl';
				case 2:
					return 'cVar';
				case 3:
					return 'cVlf';
				default:
					return 'cNone'
			}
		}
	}
}
</script>

<template>
	<div class="poster">
		<div class="inner">
			<h3 class="">Gathering #{{ id }}</h3>
			<div class="img-wrapper">
				<img  v-for="map in getMaps()" :src="`/images/stages/${map}.webp`"/>
			</div>
			<h4 class="map" v-for="map in getMaps()">
				{{ $t(`stages.${map}`) }}
			</h4>
			<h4 class="mode" :class="getMode()">{{ $t(`modes.${getGameType()}`) }}</h4>
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
.img-wrapper{
	position: relative;
}

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
    /*aspect-ratio: 1 / 1;*/
    object-fit: cover;
    padding: 10px;
    margin-bottom: 0;
    padding-bottom: 0;
		width: calc(100% - 2ch);
		clip-path: polygon(98% 0, 0 98%, 0 0);
}

.page img:last-of-type {
	position: absolute;
	left: 0;
	top: 0;
	clip-path: polygon(100% 2%, 2% 100%, 100% 100%);
}

.poster img {
	padding: 0 1ch 0ch 1ch;
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
