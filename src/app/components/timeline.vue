<script>
export default {
  props: {
    pages: {
      type: Array,
      required: true,
    }
  }
}
</script>

<template>
  <div class="TimelineWrapper row">
	<span v-for="name in pages" class="card">{{ name }}</span>
</div>
</template>

<style scoped>
/* LED Header */
.card {
  display: inline-block;
  width: -webkit-fill-available;
  margin: 1ch 1ch 0 1ch;
}

.row {
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
  scroll-snap-align: center;
  scroll-snap-type: block;
}

.TimelineWrapper {
    position: sticky;
    top: 0;
    background: black;
    --background-size: 6px;
    background-image: linear-gradient(#ffa03629 2px, transparent 2px), linear-gradient(to right, #ffa03629 2px, transparent 2px);
    background-size: 5px 5px;
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

.TimelineWrapper > span {
  color: #ffa036;
  font-weight: bold;
  box-sizing: border-box;
  font-family: 'Led Dot-Matrix';
  font-size: 35px;
  line-height: 50px;
  margin: 0;
  min-width: unset;
  max-width: unset;
  margin-left: 0.2em;
  width: calc(100% + 35px);
  user-select: none;
}
</style>
