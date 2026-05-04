<script lang="ts">
export default {
	props: {
		theme: {
			type: String,
			required: false,
			default: "arrows Neutral"
		},
		width: {
			type: String,
			required: false
		},
		height: {
			type: String,
			required: false
		}
	}
}
</script>

<template>
  <div class="settings-overlay" @click.self="$emit('close-modal')">
    <div class="settings-window" :class="theme != '' ? `${theme} theme` : ''" :style="`width: ${width};height: ${height}`">
      <slot/>
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
  padding: 1em;
  margin: 1em;
  color: white;
  max-width: 35em;
  width: 100%;
  max-height: 35em;
	rotate: -2deg;
	align-items: center;
	overflow: visible;
}

.theme {
	border-radius: 2em;
	overflow-y: scroll;
}
</style>
