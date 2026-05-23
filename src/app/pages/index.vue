<script setup lang="ts">
import type { Friend } from '~~/types/friend';
import Polaroid from '~~/app/components/polaroid.vue';
import Timeline from '~~/app/components/timeline.vue';
import Page from '~~/app/components/page.vue';
import Header from '~~/app/components/header.vue';
import Poster from '~~/app/components/poster.vue';
import UserSettings from '~~/app/components/userSettings.vue';
import UserProfile from '~~/app/components/userProfile.vue';
import EditTag from '~~/app/components/editTag.vue';
import Tag from '~~/app/components/tag.vue'
import type { Settings } from '~~/types/settings';
import type { Match } from '~~/types/database';
import type { Myself } from '~~/types/myself';
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

const { data: stages, pending: stagesPending } = await useFetch<Settings>('/api/stages', { server: true });
const { data: matches, pending: matchesPending } = await useFetch<Match[]>('/api/matches', { server: true });
const { data: friends, pending: friendsPending } = await useFetch<Friend[] | null>('/api/friends');
const { data: myself, refresh: refreshMyself } = await useFetch<Myself>('/api/myself');

const pages = [$t("titles.regular"), $t("titles.ranked"), $t("titles.gatherings"), $t("titles.friends")]

const showSettings = ref(false);
const showUserPage = ref(false);
const showEditTag = ref(false);
const selectedUser: Ref<Friend | null> = ref(null);

function parseDate(timestamp: string | object) {
	let date = new Date(timestamp as string);
	return date.toLocaleString(locale.value, { hour: 'numeric' });
}

function updateUser(user: Friend) {
	console.log('test', user);
	selectedUser.value = user;
	showUserPage.value = true;
}

async function updateTheme(theme: string) {
	if (!myself.value) return;

	refreshMyself();
}
</script>

<template>
	<div class="mainFrame">
		<Timeline :pages="pages"></Timeline>
		<div id="content" class="">
			<button class="settings" v-show="!showSettings && !showUserPage && !showEditTag" @click="showSettings = true">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256">
					<path
						d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z">
					</path>
				</svg>
			</button>
			<UserSettings v-show="showSettings" @close-modal="showSettings = false"/>
			<UserProfile v-if="selectedUser" v-show="showUserPage" @close-modal="showUserPage = false" :user="selectedUser"/>
			<EditTag v-show="showEditTag" @close-modal="showEditTag = false" @update-theme="updateTheme" v-if="myself" :user="myself"/>
			<Page :contents="stages" :loading="stagesPending" contentsEmptyString="stages.none">

				<!-- Regular Battles -->
				<template v-if="stages" v-for="(phase, index) in stages.Phases">
					<Header :index="index">{{ parseDate(String(phase.Date)) }}</Header>
					<Polaroid v-for="stage in phase.RegularStages" :mapID="stage.MapID" :gameMode="phase.RegularRule">
					</Polaroid>
				</template>
			</Page>
			<Page :contents="stages" :loading="stagesPending" contentsEmptyString="stages.none">
				<!-- Ranked Battles -->
				<template v-if="stages" v-for="(phase, index) in stages.Phases">
					<Header :index="index + 1">{{ parseDate(String(phase.Date)) }}</Header>
					<Polaroid v-for="stage in phase.GachiStages" :mapID="stage.MapID" :gameMode="phase.GachiRule">
					</Polaroid>
				</template>
			</Page>
			<Page :contents="matches" :loading="matchesPending" contentsEmptyString="matches.none">
				<!-- Matches -->
				<template v-if="matches" v-for="match in matches">
					<Poster :id="match.id" :gameMode="Number(match.game_mode)" :players="match.participants"
						:stages="stages?.Phases"></Poster>
				</template>
			</Page>
			<Page :contents="friends" :loading="friendsPending" contentsEmptyString="friends.none">
				<!-- Friends -->
				<a class="pretendo" href="http://localhost:3210/account/login?redirect=http://localhost:3000" v-if="!friends">
					<svg role="img" aria-label="Pretendo" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
						<g id="logo_type" data-name="logo type" transform="translate(-553 -467)">
							<g id="logo" transform="translate(553 467)">
								<g id="XMLID_6_" transform="translate(8.222 1.418)">
									<path id="XMLID_15_" d="M69.149,28.312c-1.051.553-.129,2.139.922,1.585a12.365,12.365,0,0,1,8.794-.571,10.829,10.829,0,0,1,6.342,4.166c.645,1,2.231.074,1.585-.922C83.308,27.169,74.7,25.436,69.149,28.312Z" transform="translate(-64.246 -23.389)" fill="#fff"></path>
									<path id="XMLID_14_" d="M82.64,14.608A15.565,15.565,0,0,0,73.5,8.45a17.535,17.535,0,0,0-12.647.9c-1.051.553-.129,2.139.922,1.585,3.411-1.788,7.6-1.714,11.209-.719,3.1.848,6.268,2.544,8.038,5.309C81.681,16.543,83.267,15.622,82.64,14.608Z" transform="translate(-57.476 -7.693)" fill="#fff"></path>
									<path id="XMLID_9_" d="M55.68,47.8a10.719,10.719,0,0,0-6.71,2.3H45.983A1.336,1.336,0,0,0,44.6,51.376V75.84a1.431,1.431,0,0,0,1.383,1.383h3.023a1.367,1.367,0,0,0,1.309-1.383V68.392A10.993,10.993,0,1,0,55.68,47.8Zm0,17.182a6.213,6.213,0,1,1,6.213-6.213A6.216,6.216,0,0,1,55.68,64.982Z" transform="translate(-44.6 -40.406)" fill="#fff"></path>
								</g>
							</g>
						</g>
					</svg>
					<span>{{ $t('sign_in') }}</span>
				</a>
				<Tag v-if="myself" :user="myself?.userInfo" :theme="myself?.tagTheme" @click="showEditTag = true"/>
				<template v-if="friends" v-for="friend in friends">
					<Tag :user="friend" :theme="friend.tagTheme" @update-user="updateUser"/>
				</template>
			</Page>
		</div>
	</div>
</template>
