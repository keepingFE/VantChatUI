// File: examples/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'chatvant': resolve(__dirname, '../packages/src')
    }
  },
  plugins: [
    vue(),
    // Vant 组件自动按需引入
    Components({
      resolvers: [VantResolver()]
    })
  ],
  server: {
    host: '0.0.0.0', // 支持 localhost 和 IP 地址访问
    port: 3000,
    open: true
  }
})

