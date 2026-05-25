<script setup lang="ts">
import { Matrix } from '~/utils/matrix';
const { pages } = defineProps<{
	pages: string[];
}>();

if (import.meta.client) {
	const matrix = new Matrix();
	const frame = document.getElementById('content');

	if (frame) {
		frame.addEventListener('scroll', (event) => {
			const target = event.target as HTMLElement;
			if (!target) {
				return;
			}
			matrix.setOffset(Math.ceil((target.scrollLeft * -1)));
		});
	}

	function loadText() {
		if (!document.fonts.check('10px "PixelMplus12-Regular"')) {
			window.setTimeout(loadText, 100);
		} else {
			matrix.setText(pages);
		}
	}

	loadText();
}
</script>

<template>
  <div class="wrapper">
    <canvas id="ledSign" />
  </div>
</template>
<style scoped>
.wrapper {
	background-color: black;
	position: sticky;
	top: 0;
	--c1: #000000;
	border: 4px solid #323131;
	box-shadow: -5px 7px var(--c1), -2px 2px var(--c1), -3px 3px var(--c1), -4px 4px var(--c1), -5px 5px var(--c1);
	margin: 1em;
	width: calc(100% - 2em);
	height: 60px;
	box-sizing: border-box;
	user-select: none;
}
</style>
