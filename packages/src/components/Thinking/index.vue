<!-- File: packages/src/components/Thinking/index.vue -->
<template>
  <div class="thinking-container">
    <!-- 头像 -->
    <div v-if="avatar" class="thinking-avatar">
      <img :src="avatar" alt="avatar" />
    </div>

    <!-- 思考气泡 -->
    <div class="thinking-bubble">
      <!-- 思考文本 -->
      <div class="thinking-text">
        <span>{{ text }}</span>
        <!-- 动态省略号 -->
        <span class="thinking-dots">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </span>
      </div>

      <!-- 可选：显示已用时间 -->
      <div v-if="showTimer && elapsedTime > 0" class="thinking-timer">
        <span>已思考 {{ formatTime(elapsedTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props 定义
const props = defineProps({
  // 头像 URL
  avatar: {
    type: String,
    default: ''
  },
  // 思考文本
  text: {
    type: String,
    default: '思考中'
  },
  // 是否显示计时器
  showTimer: {
    type: Boolean,
    default: false
  }
})

// 已用时间（秒）
const elapsedTime = ref(0)
let timer = null

// 格式化时间
const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}秒`
  }
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

// 启动计时器
onMounted(() => {
  if (props.showTimer) {
    timer = setInterval(() => {
      elapsedTime.value++
    }, 1000)
  }
})

// 清理计时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped lang="scss">
.thinking-container {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px;
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ========== 头像 ==========
.thinking-avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// ========== 思考气泡 ==========
.thinking-bubble {
  max-width: 70%;
  background: #ffffff;
  border-radius: 2px 12px 12px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

// ========== 思考文本 ==========
.thinking-text {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #323233;
  line-height: 1.5;

  span {
    white-space: nowrap;
  }
}

// ========== 动态省略号 ==========
.thinking-dots {
  display: inline-flex;
  align-items: center;
  margin-left: 2px;

  .dot {
    animation: dot-blink 1.4s infinite;
    opacity: 0;

    &:nth-child(1) {
      animation-delay: 0s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes dot-blink {

  0%,
  20% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

// ========== 计时器 ==========
.thinking-timer {
  font-size: 12px;
  color: #969799;
  text-align: left;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px solid #ebedf0;

  span {
    white-space: nowrap;
  }
}
</style>
