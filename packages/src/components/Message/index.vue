<!-- File: packages/src/components/Message/index.vue -->
<template>
  <div class="message-wrapper">
    <!-- 系统消息 -->
    <div v-if="msg.type === 'system'" class="message-system">
      {{ msg.content }}
    </div>

    <!-- 文本/图片消息 -->
    <div v-else class="message-item" :class="[`message-${msg.position}`]">
      <!-- 头像 -->
      <div class="message-avatar">
        <van-image round :src="msg.user?.avatar" :width="40" :height="40" fit="cover" />
      </div>

      <!-- 消息内容 -->
      <div class="message-content">
        <!-- 文本消息 -->
        <div v-if="msg.type === 'text'" class="message-bubble" :class="[`bubble-${msg.position}`]">
          <span v-if="msg.typing">
            {{ displayText }}
            <span v-if="isTypingActive" class="typing-cursor"></span>
          </span>
          <span v-else>{{ msg.content }}</span>
        </div>

        <!-- 图片消息 -->
        <div v-else-if="msg.type === 'image'" class="message-image" @click="handleImagePreview">
          <van-image :src="msg.content" fit="cover" :style="{
            maxWidth: '200px',
            maxHeight: '200px',
            borderRadius: '8px'
          }">
            <template #error>
              <div class="image-error">加载失败</div>
            </template>
          </van-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { showImagePreview } from 'vant'

// Props 定义
const props = defineProps({
  msg: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// 打字机效果
const displayText = ref('')
const isTypingActive = ref(false) // 是否正在打字
let typingTimer = null

// 开始打字效果
const startTyping = () => {
  if (!props.msg.typing || !props.msg.content) return

  displayText.value = ''
  isTypingActive.value = true // 开始打字，显示光标
  let currentIndex = 0
  const text = props.msg.content
  const speed = props.msg.typingSpeed || 50 // 默认 50ms/字符

  // 清除之前的定时器
  if (typingTimer) {
    clearInterval(typingTimer)
  }

  // 开始逐字显示
  typingTimer = setInterval(() => {
    if (currentIndex < text.length) {
      displayText.value += text[currentIndex]
      currentIndex++
    } else {
      // 打字完成，隐藏光标
      clearInterval(typingTimer)
      typingTimer = null
      isTypingActive.value = false
    }
  }, speed)
}

// 监听消息变化
watch(
  () => props.msg,
  (newMsg) => {
    if (newMsg.typing && newMsg.type === 'text') {
      startTyping()
    } else {
      displayText.value = newMsg.content || ''
    }
  },
  { immediate: true, deep: true }
)

// 组件挂载时
onMounted(() => {
  if (props.msg.typing && props.msg.type === 'text') {
    startTyping()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (typingTimer) {
    clearInterval(typingTimer)
    typingTimer = null
  }
})

// 图片预览
const handleImagePreview = () => {
  if (props.msg.type === 'image') {
    showImagePreview({
      images: [props.msg.content],
      closeable: true
    })
  }
}
</script>

<style scoped lang="scss">
.message-wrapper {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

// ========== 系统消息 ==========
.message-system {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin: 8px 0;
  line-height: 1.5;
}

// ========== 普通消息 ==========
.message-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

// 对方消息 (左对齐)
.message-left {
  flex-direction: row;
}

// 我方消息 (右对齐)
.message-right {
  flex-direction: row-reverse;
}

// ========== 头像 ==========
.message-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}

// ========== 消息内容 ==========
.message-content {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

// ========== 文本气泡 ==========
.message-bubble {
  padding: 10px 12px;
  font-size: 15px;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-word;
}

// 对方气泡 (白底黑字，左上角尖角)
.bubble-left {
  background: #ffffff;
  color: #000000;
  border-radius: 2px 12px 12px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

// 我方气泡 (蓝底白字，右上角尖角)
.bubble-right {
  background: #2b6de5;
  color: #ffffff;
  border-radius: 12px 2px 12px 12px;
}

// ========== 打字机光标 ==========
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin-left: 2px;
  animation: cursor-blink 1s infinite;
  vertical-align: text-bottom;
}

@keyframes cursor-blink {

  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

// ========== 图片消息 ==========
.message-image {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background: #f7f8fa;
  color: #999;
  font-size: 14px;
}
</style>
