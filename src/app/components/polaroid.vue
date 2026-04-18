<script setup lang="ts">
const { t } = useI18n()
</script>

<script lang="ts">
export default {
	props: {
		mapID: {
			type: Number,
			required: true
		},
		gameMode: {
			type: String,
			required: true
		}
	},
	methods: {
	}
}
</script>

<template>
	<div class="polaroid">
		<img class="card" :src="`/images/stages/${mapID}.webp`" />
		<h4 :class="gameMode">{{ $t(`modes.${gameMode}`) }}</h4>
		<h3>{{ $t(`stages.${mapID}`) }}</h3>
	</div>
</template>

<style scoped>
/* Stage Rotation */
.polaroid {
	display: inline-block;
	vertical-align: top;
	position: relative;
	background-color: white;
	max-width: 18em;
	width: 100%;
	margin: 2ch;
	box-shadow: black 5px 5px 10px;
}

h3,
h4 {
	margin: 0;
	color: black;
	text-align: start;
	padding-left: 1em;
}

h3 {
	font-size: 22px;
	line-height: 25px;
	margin-bottom: 1ch;
}

h4 {
	font-size: 17px;
	line-height: 20px;
	color: #434242;
	text-shadow: unset;
	text-align: left;
	padding-top: 0;
	padding-left: 20px;
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
}

img {
	aspect-ratio: 1 / 1;
	object-fit: cover;
	margin-bottom: 0px;
	padding: 10px 10px 0px;
}

.card {
	display: inline-block;
	width: -webkit-fill-available;
	margin: 1ch 1ch 0 1ch;
}
</style>
