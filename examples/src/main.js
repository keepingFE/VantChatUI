// File: examples/src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Vant 样式
import 'vant/lib/index.css'

// 引入主题样式
import './styles/chatui-theme.scss'

createApp(App).use(router).mount('#app')

