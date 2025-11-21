<!-- File: packages/src/components/Typing/index.vue -->
<template>
  <div class="typing-wrapper">
    <div class="typing-item">
      <!-- 头像 -->
      <div v-if="avatar" class="typing-avatar">
        <van-image
          round
          :src="avatar"
          :width="40"
          :height="40"
          fit="cover"
        />
      </div>

      <!-- 打字气泡 -->
      <div class="typing-bubble">
        <span v-if="text" class="typing-text">{{ text }}</span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props 定义
const props = defineProps({
  avatar: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
.typing-wrapper {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.typing-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.typing-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}

.typing-bubble {
  background: #ffffff;
  border-radius: 2px 12px 12px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 44px;
}

.typing-text {
  color: #333;
  font-size: 14px;
  margin-right: 4px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b4b8c1;
  animation: typing-bounce 1.4s infinite ease-in-out;

  &:nth-child(1) {
    animation-delay: -0.32s;
  }

  &:nth-child(2) {
    animation-delay: -0.16s;
  }

  &:nth-child(3) {
    animation-delay: 0s;
  }
}

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

