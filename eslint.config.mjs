import pluginVue from 'eslint-plugin-vue';
import eslintConfig from '@pretendonetwork/eslint-config';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
// eslint-disable-next-line no-restricted-imports -- we need to import this for the withNuxt function
import { withNuxt } from './.nuxt/eslint.config.mjs';

export default withNuxt([
	...eslintConfig,
	...pluginVue.configs['flat/recommended'],
	{
		files: ['**/*.vue', 'public/js/*.js'],
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
		},
		settings: {
			// Override the common config's resolver: root tsconfig.json only has `references`
			// and no `compilerOptions.paths`, so the resolver can't find Nuxt's aliases (~~, ~, etc.)
			// from it directly. Point at the Nuxt-generated tsconfigs via glob so each file is
			// validated against the right context (app vs server have different #i18n/#imports targets).
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: '.nuxt/tsconfig.*.json',
					noWarnOnMultipleProjects: true
				},
				node: {
					extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
				}
			}
		}
	},
	// Nuxt specific ignores
	globalIgnores(['**/.output/**', '**/.nuxt/**'])
]);
