<script setup lang='ts'>
import { Fireworks } from '~/utils/fireworks';
import { defaultPosts } from '~~/shared/utils/constants';
const { data: paintings } = await useFetch<string[]>('/api/posts', { server: true });

if (import.meta.browser) {
	const fireworks = new Fireworks();
	console.log('Loading fireworks...', paintings.value, defaultPosts);
	fireworks.updateImages(paintings.value ? (paintings.value.length > 0 ? paintings.value : defaultPosts) : defaultPosts);
	fireworks.start();
}
</script>
<template>
  <canvas id="fest" />
</template>
<style>
canvas#fest {
		display: block;
		width: 100vw;
		height: 100vh;
		background: transparent;
		border: 0;
		position: absolute;
		top: 0;
		left: 0;
		background: linear-gradient(rgb(4, 4, 29) 70%, rgb(103, 65, 42));
}
</style>
