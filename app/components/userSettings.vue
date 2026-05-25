<script setup lang="ts">
import { themes } from '~~/shared/utils/constants';

function updateColor(theme: string) {
	const frame = document.getElementById('content');
	const currentSelection = document.querySelector('.color-blob.selected');
	const newSelection = document.querySelector(`.color-blob.${theme}`);
	if (!newSelection || !frame) {
		return;
	}

	if (currentSelection) {
		currentSelection.classList.remove('selected');
	}

	newSelection.classList.add('selected');
	localStorage.setItem('theme', theme);
	frame.className = theme;
}

function loadTheme() {
	if (import.meta.client) {
		const storedTheme = localStorage.getItem('theme');
		if (!storedTheme) {
			return;
		}

		const newSelection = document.querySelector(`.color-blob.${storedTheme}`);
		if (!newSelection) {
			return;
		}

		newSelection.classList.add('selected');
	}
}

loadTheme();
</script>

<template>
  <Settings
    min-width="300px"
    width="35vw"
  >
    <h2>Theme</h2>
    <div class="color-wrapper">
      <template
        v-for="theme in themes"
        :key="theme"
      >
        <div
          class="color-blob"
          :class="theme"
          :title="theme"
          @click="updateColor(theme)"
        />
      </template>
    </div>
  </Settings>
</template>

<style scoped>
h2 {
	margin: 0;
}
</style>
