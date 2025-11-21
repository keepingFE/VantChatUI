// File: examples/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    // Vant 组件自动按需引入
    Components({
      resolvers: [VantResolver()]
    })
  ],
  server: {
    port: 3000,
    open: true
  }
})

