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
      <div v-if="showVoice" class="composer-icon voice-icon" :class="{ recording: isRecording }"
        @click="handleVoiceClick">
        <van-icon name="volume-o" size="24" :color="isRecording ? '#ee0a24' : '#969799'" />
      </div>

      <!-- 中间输入区域 -->
      <div class="composer-input-wrapper">
        <van-field v-model="inputValue" type="textarea" rows="1" autosize :maxlength="500" placeholder="请输入..."
          class="composer-field" @keydown.enter.exact.prevent="handleSend" />
      </div>

      <!-- 右侧图标区域 -->
      <div class="composer-actions">
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
    <!-- <EmojiPicker v-model:show="showEmojiPicker" @select="handleEmojiSelect" /> -->
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { showToast } from "vant";
import EmojiPicker from "../EmojiPicker/index.vue";

// Props 定义
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  // 是否显示语音按钮
  showVoice: {
    type: Boolean,
    default: true,
  },
  // 是否显示表情按钮
  showEmoji: {
    type: Boolean,
    default: false,
  },
  // 快捷回复列表
  quickReplies: {
    type: Array,
    default: () => [],
  },
});

// Emits 定义
const emit = defineEmits([
  "update:modelValue",
  "send",
  "upload",
  "uploadError",
  "emoji",
  "voiceStart", // 开始录音
  "voiceEnd", // 结束录音
  "voiceCancel", // 取消录音
  "voiceError", // 录音错误
]);

// 输入框内容
const inputValue = ref(props.modelValue);

// 文件上传输入框引用
const fileInputRef = ref(null);

// 表情选择器显示状态
const showEmojiPicker = ref(false);

// ========== 录音相关状态 ==========
const isRecording = ref(false); // 是否正在录音
const mediaRecorder = ref(null); // MediaRecorder 实例
const audioStream = ref(null); // 音频流
const audioChunks = ref([]); // 音频数据块
const recordingStartTime = ref(null); // 录音开始时间

// ========== 语音识别相关状态 ==========
const recognition = ref(null); // 语音识别实例
const recognizedText = ref(""); // 识别出的文字
const isRecognizing = ref(false); // 是否正在识别

// 处理语音按钮点击
const handleVoiceClick = async () => {
  if (isRecording.value) {
    // 如果正在录音，停止录音
    stopRecording();
  } else {
    // 开始录音
    await startRecording();
  }
};

// 开始录音
const startRecording = async () => {
  try {
    // 检查浏览器是否支持 MediaRecorder
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast("您的浏览器不支持录音功能");
      emit("voiceError", {
        type: "not_supported",
        message: "浏览器不支持录音",
      });
      return;
    }

    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStream.value = stream;

    // 创建 MediaRecorder 实例
    const options = { mimeType: "audio/webm" };
    // 某些浏览器可能不支持 webm，尝试其他格式
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options.mimeType = "audio/mp4";
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "";
      }
    }

    const recorder = new MediaRecorder(stream, options);
    mediaRecorder.value = recorder;
    audioChunks.value = [];

    // 监听数据可用事件
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    // 监听录音停止事件
    recorder.onstop = () => {
      handleRecordingStop();
    };

    // 开始录音
    recorder.start();
    isRecording.value = true;
    recordingStartTime.value = Date.now();

    // ========== 初始化语音识别 ==========
    try {
      recognizedText.value = ""; // 清空之前的识别结果

      // 检查浏览器是否支持语音识别
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        console.log("[语音识别] 浏览器支持语音识别，开始初始化");

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true; // 持续识别
        recognitionInstance.interimResults = true; // 返回临时结果
        recognitionInstance.lang = "zh-CN"; // 设置为中文

        // 识别开始事件
        recognitionInstance.onstart = () => {
          console.log("[语音识别] 识别已启动");
          isRecognizing.value = true;
        };

        // 识别结果事件
        recognitionInstance.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";
          let allTranscript = ""; // 保存所有结果（包括临时）

          // 遍历所有识别结果
          for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            allTranscript += transcript;

            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              console.log("[语音识别] 最终结果:", transcript);
            } else {
              interimTranscript += transcript;
              console.log("[语音识别] 临时结果:", transcript);
            }
          }

          // 优先保存最终结果，如果没有最终结果则保存所有文本（包括临时）
          if (finalTranscript) {
            // 只添加新的最终结果（避免重复添加）
            const currentLength = recognizedText.value.length;
            if (!recognizedText.value.endsWith(finalTranscript)) {
              recognizedText.value += finalTranscript;
              console.log(
                "[语音识别] 保存最终结果，累积文本:",
                recognizedText.value
              );
            }
          } else if (allTranscript) {
            // 如果只有临时结果，也暂存起来
            recognizedText.value = allTranscript;
            console.log("[语音识别] 保存临时文本:", recognizedText.value);
          }
        };

        // 识别错误事件
        recognitionInstance.onerror = (event) => {
          console.error("[语音识别] 错误:", event.error, event);

          // 特定错误处理
          if (event.error === "no-speech") {
            console.warn("[语音识别] 未检测到语音");
          } else if (event.error === "network") {
            console.error("[语音识别] 网络错误");
          } else if (event.error === "not-allowed") {
            console.error("[语音识别] 未授予权限");
          }
        };

        // 识别结束事件
        recognitionInstance.onend = () => {
          console.log("[语音识别] 识别结束，当前录音状态:", isRecording.value);

          // 如果还在录音，自动重启以保持持续识别
          if (isRecording.value && recognition.value) {
            try {
              console.log("[语音识别] 尝试重启识别");
              recognitionInstance.start();
            } catch (e) {
              console.log("[语音识别] 重启失败:", e);
            }
          }
        };

        // 开始语音识别
        console.log("[语音识别] 准备启动识别器");
        recognitionInstance.start();
        recognition.value = recognitionInstance;

        console.log("[语音识别] 识别器已启动");
      } else {
        console.warn("[语音识别] 浏览器不支持语音识别，将仅保存录音");
        showToast("浏览器不支持语音识别");
      }
    } catch (error) {
      console.error("[语音识别] 初始化失败:", error);
    }

    showToast("开始录音...");
    emit("voiceStart");
  } catch (error) {
    console.error("开始录音失败:", error);

    let errorMessage = "录音失败";
    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      errorMessage = "请允许访问麦克风权限";
    } else if (error.name === "NotFoundError") {
      errorMessage = "未找到麦克风设备";
    }

    showToast(errorMessage);
    emit("voiceError", { type: error.name, message: errorMessage, error });

    // 清理资源
    cleanupRecording();
  }
};

// 停止录音
const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    // 检查录音时长
    const duration = Date.now() - recordingStartTime.value;
    if (duration < 1000) {
      showToast("录音时间太短");
      cancelRecording();
      return;
    }

    mediaRecorder.value.stop();
    isRecording.value = false;
  }
};

// 处理录音停止后的数据
const handleRecordingStop = () => {
  // 停止语音识别
  if (recognition.value) {
    try {
      recognition.value.stop();
      isRecognizing.value = false;
    } catch (e) {
      console.log("停止语音识别失败:", e);
    }
  }

  if (audioChunks.value.length === 0) {
    showToast("录音数据为空");
    cleanupRecording();
    return;
  }

  // 创建音频 Blob
  const audioBlob = new Blob(audioChunks.value, {
    type: mediaRecorder.value.mimeType || "audio/webm",
  });

  // 计算录音时长（秒）
  const duration = (Date.now() - recordingStartTime.value) / 1000;

  // 创建音频文件对象
  const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, {
    type: audioBlob.type,
  });

  // 获取识别出的文字
  const text = recognizedText.value.trim();

  if (text) {
    // 如果识别出了文字，自动发送
    showToast("录音完成，正在发送...");
    emit("send", text);
  } else {
    showToast("录音完成，未识别到文字");
  }

  // 触发录音结束事件，传递音频文件、时长和识别文字
  emit("voiceEnd", {
    file: audioFile,
    blob: audioBlob,
    duration: duration.toFixed(1),
    url: URL.createObjectURL(audioBlob),
    text: text, // 识别出的文字
  });

  // 清理资源
  cleanupRecording();
};

// 取消录音
const cancelRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    mediaRecorder.value.stop();
    isRecording.value = false;
    showToast("已取消录音");
    emit("voiceCancel");
  }
  cleanupRecording();
};

// 清理录音资源
const cleanupRecording = () => {
  // 停止语音识别
  if (recognition.value) {
    try {
      recognition.value.stop();
    } catch (e) {
      console.log("停止语音识别失败:", e);
    }
    recognition.value = null;
    isRecognizing.value = false;
  }

  // 停止所有音频轨道
  if (audioStream.value) {
    audioStream.value.getTracks().forEach((track) => track.stop());
    audioStream.value = null;
  }

  // 清理 MediaRecorder
  mediaRecorder.value = null;
  audioChunks.value = [];
  recordingStartTime.value = null;
  isRecording.value = false;
  recognizedText.value = "";
};

// 组件卸载时清理资源
onUnmounted(() => {
  cleanupRecording();
});

// 监听输入变化
const handleInput = (value) => {
  inputValue.value = value;
  emit("update:modelValue", value);
};

// 发送消息
const handleSend = () => {
  const text = inputValue.value.trim();
  if (text) {
    emit("send", text);
    inputValue.value = "";
    emit("update:modelValue", "");
  }
};

// 点击加号按钮，触发文件选择
const handleUploadClick = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

// 处理文件选择
const handleFileChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    // 将 FileList 转换为数组
    const fileArray = Array.from(files);

    // 文件大小限制：10MB
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes

    // 过滤超过大小限制的文件
    const validFiles = [];
    const invalidFiles = [];

    fileArray.forEach((file) => {
      if (file.size > MAX_SIZE) {
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    // 如果有有效文件，触发 upload 事件
    if (validFiles.length > 0) {
      emit("upload", validFiles);
    }

    // 如果有超过大小限制的文件，触发 error 事件
    if (invalidFiles.length > 0) {
      emit("uploadError", {
        type: "size",
        files: invalidFiles,
        maxSize: MAX_SIZE,
      });
    }

    // 清空 input，允许重复选择同一文件
    event.target.value = "";
  }
};

// 点击表情按钮
const handleEmojiClick = () => {
  console.log('[Composer] Emoji button clicked, setting showEmojiPicker to true');
  showEmojiPicker.value = true;
  console.log('[Composer] showEmojiPicker.value:', showEmojiPicker.value);
};

// 选择表情
const handleEmojiSelect = (emoji) => {
  // 将表情插入到输入框
  inputValue.value += emoji;
  emit("update:modelValue", inputValue.value);
  emit("emoji", emoji);
};

// 快捷回复点击
const handleQuickReply = (reply) => {
  // 获取回复文本
  const text = typeof reply === "string" ? reply : reply.text;

  if (text && text.trim()) {
    // 直接发送，不填充到输入框
    emit("send", text.trim());
  }
};
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
  position: relative;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
  }
}

// 录音按钮样式
.voice-icon {
  &.recording {
    animation: recording-pulse 1.5s ease-in-out infinite;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(238, 10, 36, 0.1);
      animation: recording-ripple 1.5s ease-out infinite;
    }
  }
}

@keyframes recording-pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}

@keyframes recording-ripple {
  0% {
    width: 40px;
    height: 40px;
    opacity: 0.6;
  }

  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
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
