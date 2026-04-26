<template>
  <div class="settings-overlay" @click.self="$emit('close-modal')">
    <div class="settings-window arrows Neutral">
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
  border-radius: 2em;
  padding: 1em;
  margin: 1em;
  color: white;
  max-width: 35em;
  width: 100%;
  max-height: 35em;
	rotate: -2deg;
	overflow-y: scroll;
}
</style>
