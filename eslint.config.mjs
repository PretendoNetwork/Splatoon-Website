import pluginVue from 'eslint-plugin-vue';
import eslintConfig from '@pretendonetwork/eslint-config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
// eslint-disable-next-line no-restricted-imports -- we need to import this for the withNuxt function
import { withNuxt } from './.nuxt/eslint.config.mjs';

export default withNuxt([
	...eslintConfig,
	...pluginVue.configs['flat/recommended'],
	{
		files: ['**/*.vue'],
		languageOptions: {
			parserOptions: {
				parser: typescriptEslint.parser
			},
			globals: {
				...globals.browser
			}
		},
		rules: {
			'vue/multi-word-component-names': 'off'
		}
	},
	{
		rules: {
			'import/no-unresolved': ['error', { ignore: ['\\.css$'] }] // can't resolve .css files
		}
	}
]);
