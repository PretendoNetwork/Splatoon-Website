// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	rootDir: 'src',
	modules: ["@nuxt/fonts", "@nuxtjs/i18n", '@nuxt/eslint'],
	eslint: {
		config: {
			standalone: false
		}
	},
	i18n: {
		compilation: {
			strictMessage: false
		},
		detectBrowserLanguage: {
      useCookie: false,
      redirectOn: 'root'
    },
		restructureDir: '',
		strategy: 'no_prefix',
		defaultLocale: 'en-US',
		vueI18n: '../i18n.config.ts',
		locales: [
			{ code: 'ja-JP', name: '日本語', file: 'ja_JP.json' },
			{ code: 'en-US', name: 'English (United States)', file: 'en_US.json' },
			{ code: 'es-ES', name: 'Español', file: 'es_ES.json' },
		]
	}
});
