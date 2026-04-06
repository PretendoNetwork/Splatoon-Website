<template>
  <div class="page">
    <slot></slot>
  </div>
</template>

<style scoped>
/* Page Wrapper */
.page {
    padding: 0 1rem;
    scroll-snap-align: start;
    text-align: center;
    position: relative;
    overflow-y: scroll;
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox, Safari 18.2+, Chromium 121+ */
}

.page::-webkit-scrollbar {
    display: none;  /* Older Safari and Chromium */
}
img {
	aspect-ratio: 1 / 1;
	object-fit: cover;
	padding: 10px;
	margin-bottom: 0;
	padding-bottom: 0;
}
</style>
