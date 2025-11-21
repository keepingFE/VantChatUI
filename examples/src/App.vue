<!-- File: examples/src/App.vue -->
<template>
  <Chat ref="chatRef">
    <!-- 顶部导航栏 -->
    <template #navbar>
      <van-nav-bar title="ChatVant Demo" fixed />
    </template>

    <!-- 消息列表 -->
    <template #default>
      <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
      <!-- 思考中组件 -->
      <Thinking v-if="isThinking" :avatar="'https://img.yzcdn.cn/vant/cat.jpeg'" text="思考中" :show-timer="true" />
      <!-- 打字气泡 -->
      <Typing v-else-if="isTyping" :avatar="'https://img.yzcdn.cn/vant/cat.jpeg'" text="输入中" />
    </template>

    <!-- 底部输入区 -->
    <template #composer>
      <Composer @send="handleSend" @upload="handleUpload" @upload-error="handleUploadError" />
    </template>
  </Chat>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { showToast } from 'vant'
import { Chat, Message, Composer, Typing, Thinking, useAutoScroll } from '../../packages/src/index.js'

// 获取当前时间
const now = new Date()
const hours = now.getHours().toString().padStart(2, '0')
const minutes = now.getMinutes().toString().padStart(2, '0')
const seconds = now.getSeconds().toString().padStart(2, '0')
const timeStr = `${hours}:${minutes}:${seconds}`

// 消息列表
const messages = ref([
  {
    _id: '1',
    type: 'system',
    content: `欢迎使用 ChatVant ${timeStr}`
  },
  {
    _id: '2',
    type: 'text',
    content: '你好！我是智能助手，有什么可以帮你的吗？',
    position: 'left',
    user: {
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
      name: 'AI助手'
    }
  }
])

// 当前用户信息
const currentUser = {
  avatar: 'https://img.yzcdn.cn/vant/logo.png',
  name: '我'
}

// Chat 组件引用
const chatRef = ref(null)

// 自动滚动实例
let autoScrollInstance = null

// 思考中状态
const isThinking = ref(false)

// 打字状态
const isTyping = ref(false)

// 使用自动滚动 Hook
onMounted(() => {
  // 确保子组件已渲染后获取 scrollRef
  nextTick(() => {
    if (chatRef.value && chatRef.value.scrollRef) {
      console.log('[App.vue] Initializing useAutoScroll', {
        chatRef: chatRef.value,
        scrollRef: chatRef.value.scrollRef,
        scrollRefValue: chatRef.value.scrollRef.value
      })
      // 传递 scrollRef（ref 对象），而不是 scrollRef.value
      autoScrollInstance = useAutoScroll(chatRef.value.scrollRef, messages)
      // 初始加载时滚动到底部（不平滑）
      setTimeout(() => {
        if (autoScrollInstance) {
          autoScrollInstance.scrollToBottom(false)
        }
      }, 100)
    } else {
      console.error('[App.vue] Failed to initialize useAutoScroll', {
        chatRef: chatRef.value,
        hasScrollRef: chatRef.value?.scrollRef
      })
    }
  })
})

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (autoScrollInstance && autoScrollInstance.cleanup) {
    autoScrollInstance.cleanup()
  }
})

// 发送消息处理
const handleSend = (text) => {
  // 1. 添加用户消息
  const userMsg = {
    _id: `${Date.now()}_${Math.random()}`,
    type: 'text',
    content: text,
    position: 'right',
    user: currentUser
  }
  messages.value.push(userMsg)

  // 2. 显示思考中状态
  isThinking.value = true

  // 3. 模拟思考时间（1-2秒）
  const thinkingDelay = 1000 + Math.random() * 1000
  setTimeout(() => {
    // 隐藏思考中，显示打字气泡
    isThinking.value = false
    isTyping.value = true

    // 4. 模拟打字延迟（0.5-1秒）
    const typingDelay = 500 + Math.random() * 500
    setTimeout(() => {
      // 隐藏打字气泡
      isTyping.value = false

      const isImageReply = Math.random() > 0.7 // 30% 概率回复图片

      if (isImageReply) {
        // 图片消息
        const botMsg = {
          _id: `${Date.now()}_${Math.random()}`,
          type: 'image',
          content: 'https://img.yzcdn.cn/vant/cat.jpeg',
          position: 'left',
          user: {
            avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
            name: 'AI助手'
          }
        }
        messages.value.push(botMsg)
      } else {
        // 文本消息 - 使用打字机效果
        const botMsg = {
          _id: `${Date.now()}_${Math.random()}`,
          type: 'text',
          content: `收到你的消息: "${text}"`,
          position: 'left',
          typing: true, // 启用打字机效果
          typingSpeed: 50, // 打字速度 50ms/字符
          user: {
            avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
            name: 'AI助手'
          }
        }
        messages.value.push(botMsg)
      }
    }, typingDelay)
  }, thinkingDelay)
}

// 处理文件上传
const handleUpload = (files) => {
  // 遍历所有选择的文件
  files.forEach((file) => {
    // 判断文件类型
    const isImage = file.type.startsWith('image/')

    if (isImage) {
      // 图片文件：创建本地预览 URL
      const imageUrl = URL.createObjectURL(file)

      const imageMsg = {
        _id: `${Date.now()}_${Math.random()}`,
        type: 'image',
        content: imageUrl,
        position: 'right',
        user: currentUser
      }
      messages.value.push(imageMsg)

      // 模拟上传成功提示
      showToast({
        message: `图片上传成功`,
        position: 'top',
        duration: 1500
      })
    } else {
      // 文档文件：显示文件名和大小
      const fileSizeKB = (file.size / 1024).toFixed(2)
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
      const sizeText = file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`

      const fileMsg = {
        _id: `${Date.now()}_${Math.random()}`,
        type: 'text',
        content: `📄 ${file.name}\n大小: ${sizeText}`,
        position: 'right',
        user: currentUser
      }
      messages.value.push(fileMsg)

      showToast({
        message: `文档上传成功`,
        position: 'top',
        duration: 1500
      })
    }
  })

  // 显示思考中状态
  isThinking.value = true

  // 模拟思考时间
  const thinkingDelay = 1000 + Math.random() * 1000
  setTimeout(() => {
    // 隐藏思考中，显示打字气泡
    isThinking.value = false
    isTyping.value = true

    // 模拟打字延迟
    setTimeout(() => {
      isTyping.value = false

      const botMsg = {
        _id: `${Date.now()}_${Math.random()}`,
        type: 'text',
        content: `已收到 ${files.length} 个文件`,
        position: 'left',
        typing: true, // 启用打字机效果
        typingSpeed: 50,
        user: {
          avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
          name: 'AI助手'
        }
      }
      messages.value.push(botMsg)
    }, 500)
  }, thinkingDelay)
}

// 处理文件上传错误
const handleUploadError = (error) => {
  if (error.type === 'size') {
    const maxSizeMB = (error.maxSize / 1024 / 1024).toFixed(0)
    const fileNames = error.files.map(f => f.name).join(', ')

    showToast({
      message: `文件大小不能超过 ${maxSizeMB}MB\n${fileNames}`,
      position: 'top',
      duration: 3000
    })
  }
}
</script>

<style scoped>
/* App 级别的样式可以在这里添加 */
</style>
