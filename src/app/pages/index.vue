<script setup lang="ts">
import Polaroid from '../components/polaroid.vue';
import Timeline from '../components/timeline.vue';
import Page from '../components/page.vue';
import Header from '../components/header.vue';
import Poster from '../components/poster.vue';
import Settings from '../components/settings.vue';
import '~/assets/css/index.css'

const { te, t, tm, locale } = useI18n();

useHead({
	title: $t("meta.title"),
	meta: [
		{ name: 'description', content: $t("meta.description") },
	],
	bodyAttrs: {
		class: 'ink Neutral',
	}
})

const { data: stages } = await useFetch('/api/stages', { server: true });
const { data: matches } = await useFetch('/api/matches', { server: true });
const pages = [$t("titles.regular"), $t("titles.ranked"), $t("titles.gatherings")]

const showSettings = ref(false);

function parseDate(timestamp: string | object) {
	let date = new Date(timestamp as string);
	return date.toLocaleString(locale.value, { hour: 'numeric' });
}
</script>

<template>
	<div class="mainFrame">
		<Timeline :pages="pages"></Timeline>
		<div id="content" class="">
			<button class="settings" v-show="!showSettings" @click="showSettings = true">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
					<path
						d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z">
					</path>
				</svg>
			</button>
			<Settings v-show="showSettings" @close-modal="showSettings = false"/>
			<Page>
				<!-- Regular Battles -->
				<h1 v-if="stages == undefined" style="color: white">Loading...</h1>
				<template v-if="stages" v-for="(phase, index) in stages.Phases">
					<Header :index="index">{{ parseDate(String(phase.Date)) }}</Header>
					<Polaroid v-for="stage in phase.RegularStages" :mapID="stage.MapID" :gameMode="phase.RegularRule">
					</Polaroid>
				</template>
			</Page>
			<Page>
				<!-- Ranked Battles -->
				<h1 v-if="stages == undefined" style="color: white">Loading...</h1>
				<template v-if="stages" v-for="(phase, index) in stages.Phases">
					<Header :index="index + 1">{{ parseDate(String(phase.Date)) }}</Header>
					<Polaroid v-for="stage in phase.GachiStages" :mapID="stage.MapID" :gameMode="phase.GachiRule">
					</Polaroid>
				</template>
			</Page>
			<Page>
				<!-- Matches -->
				<h1 v-if="matches == undefined" style="color: white">Loading...</h1>
				<h1 v-if="matches && matches.length == 0" style="color: white">No Matches</h1>
				<template v-if="matches" v-for="match in matches">
					<Poster :id="match.id" :gameMode="Number(match.game_mode)" :players="match.participants"
						:stages="stages?.Phases"></Poster>
				</template>
			</Page>
		</div>
	</div>
</template>
