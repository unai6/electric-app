import { createApp } from 'vue'

import router from '@/router.js'
import i18nConfig from '@/lang/i18n.config.js'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import { createI18n } from 'vue-i18n'

import App from './App.vue'

const i18n = createI18n(i18nConfig)

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(Toast)

router.isReady().then(() => app.mount('#app')).catch(e => console.error(e))
