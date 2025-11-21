<!-- File: packages/src/components/Chat/index.vue -->
<template>
  <div class="chat-container">
    <!-- 顶部导航栏插槽 -->
    <div v-if="$slots.navbar" class="chat-navbar">
      <slot name="navbar"></slot>
    </div>

    <!-- 消息列表区域 -->
    <div ref="scrollRef" class="chat-messages">
      <slot></slot>
    </div>

    <!-- 底部输入区插槽 -->
    <div v-if="$slots.composer" class="chat-composer">
      <slot name="composer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 滚动容器引用
const scrollRef = ref(null)

// 暴露 scrollRef 供父组件使用
defineExpose({
  scrollRef
})
</script>

<style scoped lang="scss">
.chat-container {
  height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-navbar {
  flex-shrink: 0;
  // 为 fixed 定位的导航栏预留空间
  height: 46px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch; // iOS 平滑滚动
  // 确保滚动容器有明确的高度
  min-height: 0;
}

.chat-composer {
  flex-shrink: 0;
  background: #fff;
  // iOS 安全区域适配
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
