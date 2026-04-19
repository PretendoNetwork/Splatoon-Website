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
	app: {
		head: {
			script: [
				{ tagPosition: 'bodyClose', src: '/js/index.js' },
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
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
	},
	// TODO: How do I actually validate this now that we're importing it here?
	runtimeConfig: {
		boss: {
			aes_key: '',
			hmac_key: '',
			domain: '',
			app_id: ''
		},
		grpc: {
			account: {
				api_key: '',
				host: '',
				port: ''
			}
		},
		postgresURI: '',
		maxResponse: 12,
		fileCacheDir: './'
	}
});
