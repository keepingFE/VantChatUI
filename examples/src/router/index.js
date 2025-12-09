import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FullDemo from '../views/FullDemo.vue'
import BasicDemo from '../views/BasicDemo.vue'
import TypingDemo from '../views/TypingDemo.vue'
import FileDemo from '../views/FileDemo.vue'
import EmojiDemo from '../views/EmojiDemo.vue'
import SystemMessageDemo from '../views/SystemMessageDemo.vue'
import MessageStatusDemo from '../views/MessageStatusDemo.vue'
import FileCardDemo from '../views/FileCardDemo.vue'
import CardDemo from '../views/CardDemo.vue'
import SearchDemo from '../views/SearchDemo.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/full',
    name: 'FullDemo',
    component: FullDemo
  },
  {
    path: '/basic',
    name: 'BasicDemo',
    component: BasicDemo
  },
  {
    path: '/typing',
    name: 'TypingDemo',
    component: TypingDemo
  },
  {
    path: '/file',
    name: 'FileDemo',
    component: FileDemo
  },
  {
    path: '/emoji',
    name: 'EmojiDemo',
    component: EmojiDemo
  },
  {
    path: '/system-message',
    name: 'SystemMessageDemo',
    component: SystemMessageDemo
  },
  {
    path: '/message-status',
    name: 'MessageStatusDemo',
    component: MessageStatusDemo
  },
  {
    path: '/file-card',
    name: 'FileCardDemo',
    component: FileCardDemo
  },
  {
    path: '/card',
    name: 'CardDemo',
    component: CardDemo
  },
  {
    path: '/search',
    name: 'SearchDemo',
    component: SearchDemo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
