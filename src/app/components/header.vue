<script setup lang="ts">
const { t } = useI18n()
</script>

<script lang="ts">
export default {
	props: {
		index: {
			type: Number,
			required: true
		},
		size: {
			type: String,
			required: false,
			default: 'large'
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
		<h1 v-if="size == 'large'">
			<slot></slot>
		</h1>
		<h2 v-if="size == 'medium'">
			<slot></slot>
		</h2>
		<h3 v-if="size == 'small'">
			<slot></slot>
		</h3>
	</header>
</template>

<style scoped>
/* Header Text */
header h1, header h2, header h3 {
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
