<script lang="ts">
import Settings from './settings.vue';
export default {
	created() {
		if (import.meta.browser) {
			const storedTheme = localStorage.getItem("theme");
			if (!storedTheme)
				return;

			const newSelection = document.querySelector(`.color-blob.${storedTheme}`);
			if (!newSelection)
				return;

			newSelection.classList.add('selected');
		}
	},
	methods: {
		updateColor(theme: string) {
			if (import.meta.client) {
				const frame = document.getElementById('content');
				const currentSelection = document.querySelector('.color-blob.selected');
				const newSelection = document.querySelector(`.color-blob.${theme}`);
				if (!newSelection || !frame) return;

				if (currentSelection)
					currentSelection.classList.remove('selected');

				newSelection.classList.add('selected');
				localStorage.setItem("theme", theme)
				frame.className = theme;
			}
		}
	},
	data() {
		return {
			themes: [
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
			],
		};
	}
}
</script>

<template>
  <Settings width="35vw">
		<h2>Theme</h2>
		<div class="color-wrapper">
			<template v-for="theme in themes">
				<div class="color-blob" :class="theme" :title="theme" @click="updateColor(theme)"/>
			</template>
		</div>
	</Settings>
</template>

<style scoped>
h2 {
	margin: 0;
}
</style>
