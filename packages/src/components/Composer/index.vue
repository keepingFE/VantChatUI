<!-- File: packages/src/components/Composer/index.vue -->
<template>
  <div class="composer-container">
    <!-- 左侧语音图标 -->
    <div class="composer-icon">
      <van-icon name="volume-o" size="24" color="#969799" />
    </div>

    <!-- 中间输入区域 -->
    <div class="composer-input-wrapper">
      <van-field v-model="inputValue" type="textarea" rows="1" autosize :maxlength="500" placeholder="请输入消息..."
        class="composer-field" @keydown.enter.exact.prevent="handleSend" />
    </div>

    <!-- 右侧图标区域 -->
    <div class="composer-actions">
      <!-- 表情图标 -->
      <div class="composer-icon" @click="handleEmojiClick">
        <van-icon name="smile-o" size="24" color="#969799" />
      </div>

      <!-- 发送按钮或加号图标 -->
      <div v-if="inputValue.trim()" class="composer-send" @click="handleSend">
        发送
      </div>
      <div v-else class="composer-icon" @click="handleUploadClick">
        <van-icon name="plus" size="24" color="#969799" />
        <!-- 隐藏的文件上传输入框 -->
        <input ref="fileInputRef" type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" multiple style="display: none"
          @change="handleFileChange" />
      </div>
    </div>
  </div>

  <!-- 表情选择器 -->
  <EmojiPicker v-model:show="showEmojiPicker" @select="handleEmojiSelect" />
</template>

<script setup>
import { ref } from 'vue'
import EmojiPicker from '../EmojiPicker/index.vue'

// Props 定义
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
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
</script>

<style scoped lang="scss">
.composer-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 8px 12px;
  background: #ffffff;
  border-top: 1px solid #ebedf0;
}

.composer-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  cursor: pointer;
}

.composer-input-wrapper {
  flex: 1;
  background: #f2f4f5;
  border-radius: 20px;
  padding: 8px 12px;
  min-height: 36px;
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
}

.composer-send {
  color: #2b6de5;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 0;
  cursor: pointer;
  user-select: none;

  &:active {
    opacity: 0.7;
  }
}
</style>
