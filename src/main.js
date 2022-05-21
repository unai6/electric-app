import { createApp } from 'vue'
import router from '@/router.js'
import i18nConfig from '@/lang/i18n.config.js'

import { createI18n } from 'vue-i18n'

import App from './App.vue'

const i18n = createI18n(i18nConfig)

const app = createApp(App)

app.use(router)
app.use(i18n)

router.isReady().then(() => app.mount('#app')).catch(e => console.error(e))
