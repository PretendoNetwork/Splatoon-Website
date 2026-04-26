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
				if (process.client) {
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
  <Settings>
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
.color-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
}

.color-blob {
  width: 3em;
  height: 3em;
  position: relative;
  border-radius: 100%;
  margin: 0.5em;
  background-image: conic-gradient(var(--c1) 33%, var(--c2) 33%, var(--c2) 66%, var(--c3) 66%);
	animation: morph-2 3s linear infinite;
  box-shadow:
    inset 2px 2px 20px 0px rgb(248 248 248 / 82%),
    5px -10px 18px 4px rgb(255 255 255 / 22%) inset;
  opacity: 95%;
	filter: saturate(2);
	cursor: pointer;
}

.color-blob:nth-of-type(2n) {
	rotate: 125deg;
}

.color-blob:nth-of-type(2n)::after {
	rotate: -125deg;
}

.color-blob.selected {
	filter: saturate(1);
}

.color-blob.selected::after {
	content: "✓";
	display: flex;
	justify-content: center;
	color: black;
	font-size: 1.5em;
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>
