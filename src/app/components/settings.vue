<script lang="ts">
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
  <div class="settings-overlay" @click.self="$emit('close-modal')">
    <div class="settings-window arrows Neutral">
      <h2>Theme</h2>
			<div class="color-wrapper">
				<template v-for="theme in themes">
					<div class="color-blob" :class="theme" :title="theme" @click="updateColor(theme)"/>
				</template>
			</div>
    </div>
  </div>
</template>

<style scoped>
h2 {
	margin: 0;
}
/* Overlays */
.settings-overlay {
  position: absolute;
  z-index: 9;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings-window {
  z-index: 10;
  display: flex;
  flex-direction: column;
  border-radius: 2em;
  padding: 1em;
  margin: 1em;
  color: white;
  max-width: 35em;
  width: 100%;
  max-height: 35em;
	rotate: -2deg;
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
