<script setup lang="ts">
const { t } = useI18n();
import Settings from './settings.vue';
import Tag from './tag.vue';
import type { Myself } from '~~/types/myself';

const props = defineProps({
  user: {
		type: Object as PropType<Myself>,
		required: true
	}
});
const { user } = props;
const theme = ref('');
const colors = [
	'PinkGreen',
	'PinkBlue',
	'PinkOrange',
	'OrangeBlue',
	'GreenPurple',
	'TurquoiseOrange',
	'LightBlueDarkBlue',
	'LightBlueYellow',
	'BlueLime',
	'YellowLilac',
	'GreenMazenta',
	'LumigreenPurple',
	'LightgreenBlue',
	'SodaPink',
	'GreenOrange',
	'DarkblueYellow'
];
const themes = [
	'stripes',
	'arrows',
	'ink',
	'zigzag'
];

async function updateTheme(newTheme: string) {
	if (theme.value == newTheme) return;

	if (import.meta.client) {
		theme.value = newTheme;
		user.tagTheme = newTheme;
		await $fetch('/api/user', {
			method: 'POST',
			body: {
				class_list: newTheme
			},
		})
	}
}
</script>

<template>
  <Settings height="500px">
		<Tag :user="user.userInfo" :theme="`online animate ${theme}`"/>
		<div class="editor">
			<details open>
				<summary>{{ $t('tags.stock') }}</summary>
					<template v-for="theme in themes">
						<details open>
							<summary>{{ $t(`tags.${theme}`) }}</summary>
							<div class="pattern-picker">
								<template v-for="color in colors">
									<Tag :theme="`online alpha-blend ${color} ${theme}`" @click.native="updateTheme(`alpha-blend ${color} ${theme}`)"/>
									<Tag :theme="`online bravo-blend ${color} ${theme}`" @click.native="updateTheme(`bravo-blend ${color} ${theme}`)"/>
								</template>
							</div>
						</details>
					</template>
			</details>
		</div>
	</Settings>
</template>

<style scoped>
h3 {
	width: 100%;
}
.editor {
	overflow-y: scroll;
	width: 100%;
}
.color-wrapper {
	overflow-y: unset;
}
.pattern-picker {
	justify-content: center;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.tag {
	transition: none !important;
	min-height: 100px;
}

details {
	width: 100%;
	user-select: none;
	margin-bottom: 1em;
}

details > details {
	margin-bottom: unset;
}

summary {
	cursor: pointer;
}

details .tag {
	width: 175px;
	height: 50px;
	min-height: unset;
}
</style>
