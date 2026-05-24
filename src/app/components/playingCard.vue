<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
  index: {
		type: Number,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	level: {
		type: Number,
		required: false
	},
	rank: {
		type: String,
		required: false
	},
	icon: {
		type: String,
		required: true
	}
});
const { index, title, level, rank, icon } = props;
const layer = ref(999999);

function shuffleCards(event: any) {
		if (import.meta.client) {
			const cardList = event.target.closest('.playing-card');
			if (!cardList) return;
			let currentIndex = Number(cardList.style.zIndex);
			cardList.classList.add('is-animated');
			cardList.style.zIndex = `${currentIndex - 25}`;
			cardList.addEventListener("animationend", (event: any) => {
				cardList.classList.remove('is-animated');
			});
		}
	}
</script>

<template>
		<div class="playing-card" :data-card="index" @click="shuffleCards($event)" :style="`z-index: ${layer - index};`">
		<div class="header">
			<h4>{{ title }}</h4>
			<h5 v-if="level"><span class="level">lvl</span>{{ level }}</h5>
			<span v-if="rank" class="rank">{{ rank }}</span>
		</div>
		<div class="art TurquoiseOrange bravo-blend zigzag">
			<img class="user-icon" :src="icon"/>
		</div>
		<div class="body">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="css" scoped>
div.playing-card {
    width: 300px;
		height: 380px;
		position: absolute;
		display: block;
		color: white;
    padding: 0 5px;
    border: 10px solid rgb(201, 201, 46);
    border-radius: 1ch;
		box-sizing: border-box;
		--c5: rgba(0, 0, 0, 0.5);
		--c6: rgb(124, 124, 124);
		background-color: white;
		background: linear-gradient(24deg, var(--c5), var(--c6)), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 310' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"), gray;
		box-shadow: -5px 6px 15px rgba(0, 0, 0, 0.4);
		cursor: pointer;
		user-select: none;
		animation: none;
		animation-fill-mode: forwards;
}
.header {
    display: inline-flex;
    box-sizing: content-box;
    justify-content: space-between;
    margin: 0 1ch;
		width: calc(100% - 2ch);
		height: 40px;
		align-items: center;
}

.header h5, .header h4 {
    font-size: 18px;
		margin: 0;
}
.header h5 > span.level {
    font-size: 10px;
}

.header h5 {
	margin-right: 22px;
}
span.rank {
	position: absolute;
	top: 5px;
	right: 5px;
	font-size: 14px;
	line-height: 30px;
	background: radial-gradient(circle at 10px 10px, #5cabff, #000);
	border-radius: 100%;
	width: 30px;
	height: 30px;
	text-align: center;
}
.art {
	height: 150px;
	border: 2px inset gray;
	margin: 0 1ch;
	display: flex;
	justify-content: center;
}
.body {
	text-align: start;
	margin: 1ch;
	font-family: sans-serif;
}
div.playing-card[data-card="0"] {
	--c5: rgba(51, 0, 255, 0.5);
	--c6: rgba(51, 0, 255, 1);
}
div.playing-card[data-card="1"] {
	--c5: rgba(0, 255, 136, 0.5);
	--c6: rgba(0, 255, 51, 1);
}
div.playing-card[data-card="2"] {
	--c5: rgba(255, 166, 0, 0.5);
	--c6: rgba(255, 183, 0, 1);
}

@keyframes shuffle-even {
  0% {
    transform: rotate(4deg) translateX(0) scale(1);
  }
	10% {
    transform: rotate(4deg) translateX(-10%) scale(1.05);
  }
  50% {
    transform: rotate(5deg) translateX(108%) scale(0.96);
  }
  100% {
    transform: rotate(4deg) translateX(0);
  }
}
@keyframes shuffle-odd {
  0% {
    transform: rotate(-2deg) translateX(0) scale(1);
  }
	10% {
    transform: rotate(-2deg) translateX(-10%) scale(1.05);
  }
  50% {
    transform: rotate(-3deg) translateX(108%) scale(0.96);
  }
  100% {
    transform: rotate(-2deg) translateX(0);
  }
}

.playing-card:nth-of-type(1n) {
  transform: rotate(-2deg);
	&.is-animated {
		animation: shuffle-odd 0.6s ease-in-out 0s 1 normal !important;
		transition: z-index 0s ease-in-out 0.3s !important;
	}
}
.playing-card:nth-of-type(2n) {
  transform: rotate(4deg);
	&.is-animated {
		animation: shuffle-even 0.6s ease-in-out 0s 1 normal !important;
		transition: z-index 0s ease-in-out 0.3s !important;
	}
}

.card-wrapper {
  display: flex;
  flex-direction: row;
  height: 350px;
}
</style>
<style>
.playing-card .body {
	h1, h2, h3, h4, h5 {
		margin-top: 5px;
		margin-bottom: 0;
	}
}
.playing-card .body span {
	font-size: 15px;
}
</style>
