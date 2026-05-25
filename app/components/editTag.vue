<script setup lang="ts">
import { themes } from '~~/shared/utils/constants';
const { t } = useI18n();
const { user } = defineProps<{
	user: Myself;
}>();
const emit = defineEmits<{
	updateTheme: [theme: string];
}>();
const theme = ref(user.tagTheme);
const patterns = [
	'stripes',
	'arrows',
	'ink',
	'zigzag'
];

async function updateTheme(newTheme: string) {
	if (theme.value == newTheme) {
		return;
	}
	emit('updateTheme', newTheme);
	theme.value = newTheme;
	await $fetch('/api/user', {
		method: 'POST',
		body: {
			class_list: newTheme
		}
	});
}
</script>

<template>
  <Settings height="500px">
    <Tag
      :user="user.userInfo"
      :theme="`online animate ${theme}`"
    />
    <div class="editor">
      <details open>
        <summary>{{ t('tags.stock') }}</summary>
        <template
          v-for="pattern in patterns"
          :key="pattern"
        >
          <details open>
            <summary>{{ t(`tags.${pattern}`) }}</summary>
            <div class="pattern-picker">
              <template
                v-for="color in themes"
                :key="color"
              >
                <Tag
                  :theme="`online alpha-blend ${color} ${pattern}`"
                  @click="updateTheme(`alpha-blend ${color} ${pattern}`)"
                />
                <Tag
                  :theme="`online bravo-blend ${color} ${pattern}`"
                  @click="updateTheme(`bravo-blend ${color} ${pattern}`)"
                />
              </template>
            </div>
          </details>
        </template>
      </details>
    </div>
  </Settings>
</template>

<style scoped>
h3 {
	width: 100%;
}
.editor {
	overflow-y: scroll;
	width: 100%;
}
.color-wrapper {
	overflow-y: unset;
}
.pattern-picker {
	justify-content: center;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.tag {
	transition: none !important;
	min-height: 100px;
}

details {
	width: 100%;
	user-select: none;
	margin-bottom: 1em;
}

details > details {
	margin-bottom: unset;
}

summary {
	cursor: pointer;
}

details .tag {
	width: 175px;
	height: 50px;
	min-height: unset;
}
</style>
