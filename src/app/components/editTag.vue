<script lang="ts">
import Settings from './settings.vue';
import Tag from './tag.vue';
import type { Myself } from '~~/types/myself';

export default {
	props: {
		user: {
			type: Object as PropType<Myself>,
			required: true
		}
	},
	methods: {
		async updateTheme(theme: string) {
			if (this.theme == theme) return;
			this.$emit('update-theme', this.theme)

			if (import.meta.client) {
				this.theme = theme;
				this.user.tagTheme == theme;
				await $fetch('/api/user', {
					method: 'POST',
					body: {
						class_list: theme
					},
				})
			}
		}
	},
	created() {
		this.theme = this.user.tagTheme;
	},
	data() {
		return {
			theme: 'PinkGreen arrows',
			colors: [
				'PinkGreen',
				'PinkBlue',
				'PinkOrange',
				'OrangeBlue',
				'GreenPurple',
				'TurquoiseOrange',
				'LightBlueDarkBlue',
				'LightBlueYellow',
				'BlueLime',
				'YellowLilac',
				'GreenMazenta',
				'LumigreenPurple',
				'LightgreenBlue',
				'SodaPink',
				'GreenOrange',
				'DarkblueYellow'
			],
			themes: [
				'stripes',
				'arrows',
				'ink',
				'zigzag'
			]
		};
	}
}
</script>

<template>
  <Settings height="500px">
		<Tag :user="user.userInfo" :theme="`online animate ${theme}`"/>
		<div class="editor">
			<details open>
				<summary>Stock Patterns</summary>
					<template v-for="theme in themes">
						<details open>
							<summary>{{ theme }}</summary>
							<div class="pattern-picker">
								<template v-for="color in colors">
									<Tag :theme="`online alpha-blend ${color} ${theme}`" @click.native="updateTheme(`alpha-blend ${color} ${theme}`)"/>
									<Tag :theme="`online bravo-blend ${color} ${theme}`" @click.native="updateTheme(`bravo-blend ${color} ${theme}`)"/>
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
