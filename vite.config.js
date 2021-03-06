import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/partials/_tokens.scss";
          @import "@/assets/scss/partials/_mixins.scss";
          @import "@/assets/scss/partials/_functions.scss";
          @import "@/assets/scss/partials/_grid.scss";
          @import "@/assets/scss/partials/_common-styles.scss";
          @import "@/assets/scss/partials/_layout.scss";
          @import "@/assets/scss/partials/_base.scss";
          @import "@/assets/scss/partials/_button.scss";
          @import "@/assets/scss/partials/_helpers.scss";
        `,
      },
    },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  envPrefix: 'VUE_APP',
})
