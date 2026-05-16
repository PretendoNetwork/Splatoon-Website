<script>
export default {
  props: {
    pages: {
      type: Array,
      required: true,
    }
  },
	methods: {
		loadText() {
			if(!document.fonts.check('10px "PixelMplus12-Regular"'))
				window.setTimeout(this.loadText, 100);
			else
				window.matrix.setText(this.pages);
		}
	},
	created() {
		if (import.meta.browser) {
			window.matrix = new Matrix();
			this.loadText();
		}
	}
}
</script>

<template>
	<div class="wrapper">
		<canvas id="ledSign"></canvas>
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
	white-space: nowrap;
	margin: 1em;
	overflow-x: hidden;
	-ms-overflow-style: none;  /* Internet Explorer 10+ */
	scrollbar-width: none;  /* Firefox, Safari 18.2+, Chromium 121+ */
	width: calc(100% - 2em);
	height: 60px;
	box-sizing: border-box;
	user-select: none;
}
</style>
