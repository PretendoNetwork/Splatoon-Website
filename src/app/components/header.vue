<script setup lang="ts">
const { t } = useI18n()
</script>

<script lang="ts">
export default {
	props: {
		index: {
			type: Number,
			required: true
		}
	},
	methods: {
		headerDirection(index: number): String {
			return index % 2 == 0 ? 'left' : 'right';
		},
		headerBlend(index: number): String {
			return index % 2 == 0 ? 'alpha-blend' : 'bravo-blend';
		},
	}
}
</script>

<template>
	<header class="stripes" :class="headerDirection(index), headerBlend(index)">
		<h1>
			<slot></slot>
		</h1>
	</header>
</template>

<style scoped>
/* Header Text */
header h1 {
	padding: 0.1ch 1ch;
	color: white;
	margin: 0;
	text-shadow: -3px 3px black;
}

header {
	min-width: 25ch;
	width: min-content;
	box-sizing: border-box;
	user-select: none;
}

header.left {
	clip-path: polygon(0 0, 100% 20%, 100% 80%, 0% 100%);
	text-align: left;
	margin-right: auto;
}

header.right {
	clip-path: polygon(0 20%, 100% 0, 100% 100%, 0 80%);
	text-align: right;
	margin-left: auto;
}
</style>
