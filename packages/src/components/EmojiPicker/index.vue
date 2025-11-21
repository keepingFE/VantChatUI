<!-- File: packages/src/components/EmojiPicker/index.vue -->
<template>
  <van-popup v-model:show="visible" position="bottom" :style="{ height: '40%' }" round @close="handleClose">
    <div class="emoji-picker">
      <!-- 标题栏 -->
      <div class="emoji-header">
        <span class="emoji-title">选择表情</span>
      </div>

      <!-- 表情列表 -->
      <div class="emoji-content">
        <div class="emoji-grid">
          <div v-for="(emoji, index) in emojiList" :key="index" class="emoji-item" @click="handleEmojiClick(emoji)">
            {{ emoji }}
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props 定义
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['update:show', 'select'])

// 内部显示状态
const visible = ref(props.show)

// 监听外部 show 变化
watch(() => props.show, (newVal) => {
  visible.value = newVal
})

// 监听内部 visible 变化
watch(visible, (newVal) => {
  emit('update:show', newVal)
})

// 表情列表
const emojiList = ref([
  // 笑脸类
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',

  // 情绪类
  '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮',
  '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛',
  '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙁',

  // 表情类
  '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧',
  '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶',
  '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷',

  // 手势类
  '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙',
  '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐',
  '🖖', '👋', '🤝', '🙏', '💪', '🦾', '🦿', '🦵',

  // 爱心类
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
  '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️',

  // 其他常用
  '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉',
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
  '🎱', '🏓', '🏸', '🥅', '🥊', '🥋', '⛳', '⛸',
])

// 点击表情
const handleEmojiClick = (emoji) => {
  emit('select', emoji)
  visible.value = false
}

// 关闭弹窗
const handleClose = () => {
  emit('update:show', false)
}
</script>

<style scoped lang="scss">
// 重置 van-popup 的默认样式
:deep(.van-popup) {
  padding: 0;
  box-sizing: border-box;
}

.emoji-picker {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  box-sizing: border-box;
}

.emoji-header {
  padding: 16px;
  text-align: center;
  background: #ffffff;
  border-bottom: 1px solid #ebedf0;
  flex-shrink: 0;
}

.emoji-title {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
}

.emoji-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  width: 100%;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  font-size: 22px;
  cursor: pointer;
  background: transparent;
  border-radius: 8px;
  transition: all 0.2s;
  user-select: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;

  &:active {
    transform: scale(1.3);
    background: rgba(0, 0, 0, 0.05);
  }
}

// 滚动条样式
.emoji-content::-webkit-scrollbar {
  width: 4px;
}

.emoji-content::-webkit-scrollbar-thumb {
  background: #dcdee0;
  border-radius: 2px;
}

.emoji-content::-webkit-scrollbar-track {
  background: transparent;
}
</style>
