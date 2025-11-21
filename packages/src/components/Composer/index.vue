<!-- File: packages/src/components/Composer/index.vue -->
<template>
  <div class="composer-wrapper">
    <!-- 快捷回复栏 -->
    <div v-if="quickReplies && quickReplies.length > 0" class="quick-replies">
      <div class="quick-replies-scroll">
        <div v-for="(reply, index) in quickReplies" :key="index" class="quick-reply-item"
          @click="handleQuickReply(reply)">
          <van-icon v-if="reply.icon" :name="reply.icon" size="14" />
          <span class="quick-reply-text">{{ reply.text || reply }}</span>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="composer-container">
      <!-- 左侧语音图标 -->
      <div v-if="showVoice" class="composer-icon">
        <van-icon name="volume-o" size="24" color="#969799" />
      </div>

      <!-- 中间输入区域 -->
      <div class="composer-input-wrapper">
        <van-field v-model="inputValue" type="textarea" rows="1" autosize :maxlength="500" placeholder="请输入..."
          class="composer-field" @keydown.enter.exact.prevent="handleSend" />
      </div>

      <!-- 右侧图标区域 -->
      <div class="composer-actions">
        <!-- 表情图标 -->
        <div v-if="showEmoji" class="composer-icon" @click="handleEmojiClick">
          <van-icon name="smile-o" size="24" color="#969799" />
        </div>

        <!-- 发送按钮或加号图标 -->
        <van-button v-if="inputValue.trim()" type="primary" size="small" @click="handleSend">
          发送
        </van-button>
        <div v-else class="composer-icon" @click="handleUploadClick">
          <van-icon name="plus" size="24" color="#969799" />
          <!-- 隐藏的文件上传输入框 -->
          <input ref="fileInputRef" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" multiple
            style="display: none" @change="handleFileChange" />
        </div>
      </div>
    </div>

    <!-- 表情选择器 -->
    <EmojiPicker v-model:show="showEmojiPicker" @select="handleEmojiSelect" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EmojiPicker from '../EmojiPicker/index.vue'

// Props 定义
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  // 是否显示语音按钮
  showVoice: {
    type: Boolean,
    default: false
  },
  // 是否显示表情按钮
  showEmoji: {
    type: Boolean,
    default: false
  },
  // 快捷回复列表
  quickReplies: {
    type: Array,
    default: () => []
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'send', 'upload', 'uploadError', 'emoji'])

// 输入框内容
const inputValue = ref(props.modelValue)

// 文件上传输入框引用
const fileInputRef = ref(null)

// 表情选择器显示状态
const showEmojiPicker = ref(false)

// 监听输入变化
const handleInput = (value) => {
  inputValue.value = value
  emit('update:modelValue', value)
}

// 发送消息
const handleSend = () => {
  const text = inputValue.value.trim()
  if (text) {
    emit('send', text)
    inputValue.value = ''
    emit('update:modelValue', '')
  }
}

// 点击加号按钮，触发文件选择
const handleUploadClick = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 处理文件选择
const handleFileChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    // 将 FileList 转换为数组
    const fileArray = Array.from(files)

    // 文件大小限制：10MB
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB in bytes

    // 过滤超过大小限制的文件
    const validFiles = []
    const invalidFiles = []

    fileArray.forEach(file => {
      if (file.size > MAX_SIZE) {
        invalidFiles.push(file)
      } else {
        validFiles.push(file)
      }
    })

    // 如果有有效文件，触发 upload 事件
    if (validFiles.length > 0) {
      emit('upload', validFiles)
    }

    // 如果有超过大小限制的文件，触发 error 事件
    if (invalidFiles.length > 0) {
      emit('uploadError', {
        type: 'size',
        files: invalidFiles,
        maxSize: MAX_SIZE
      })
    }

    // 清空 input，允许重复选择同一文件
    event.target.value = ''
  }
}

// 点击表情按钮
const handleEmojiClick = () => {
  showEmojiPicker.value = true
}

// 选择表情
const handleEmojiSelect = (emoji) => {
  // 将表情插入到输入框
  inputValue.value += emoji
  emit('update:modelValue', inputValue.value)
  emit('emoji', emoji)
}

// 快捷回复点击
const handleQuickReply = (reply) => {
  // 获取回复文本
  const text = typeof reply === 'string' ? reply : reply.text

  if (text && text.trim()) {
    // 直接发送，不填充到输入框
    emit('send', text.trim())
  }
}
</script>

<style scoped lang="scss">
.composer-wrapper {
  background: #ffffff;
  border-top: 1px solid #ebedf0;
}

// ========== 快捷回复栏 ==========
.quick-replies {
  padding: 12px 12px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.quick-replies-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
}

.quick-reply-item {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  font-size: 13px;
  color: #323233;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all 0.2s;

  &:active {
    background: #f7f8fa;
    transform: scale(0.96);
  }

  .van-icon {
    flex-shrink: 0;
  }
}

.quick-reply-text {
  line-height: 1.2;
}

// ========== 输入区域 ==========
.composer-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #ffffff;
}

.composer-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
}

.composer-input-wrapper {
  flex: 1;
  background: #f2f4f5;
  border-radius: 4px;
  padding: 0 12px;
  height: 36px;
  display: flex;
  align-items: center;
}

.composer-field {
  padding: 0;
  font-size: 15px;
  line-height: 1.5;
  background: transparent;

  :deep(.van-field__control) {
    background: transparent !important;
    border: none;
    padding: 0;
    min-height: 20px;
  }

  :deep(.van-field__body) {
    padding: 0;
    background: transparent;
  }

  :deep(.van-cell) {
    padding: 0;
    background: transparent !important;
  }

  :deep(.van-cell::after) {
    display: none;
  }
}

.composer-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  // 发送按钮样式调整
  :deep(.van-button--primary) {
    background: #1989fa;
    border-color: #1989fa;
    border-radius: 4px;
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
  }

  :deep(.van-button--small) {
    min-width: 60px;
  }
}
</style>
