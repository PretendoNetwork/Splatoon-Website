<script setup lang="ts">
const { t } = useI18n();
const { contents, loading, contentsEmptyString } = defineProps<{
	contents: any;
	loading: boolean;
	contentsEmptyString: string;
}>();

</script>

<template>
  <div class="page">
    <h1
      v-if="loading"
      style="color: white"
    >
      {{ t('loading') }}
    </h1>
    <h1
      v-if="!loading && contents && Array.isArray(contents) && contents.length == 0"
      style="color: white"
    >
      {{ t(contentsEmptyString) }}
    </h1>
    <slot />
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
		padding-bottom: 4em;
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
