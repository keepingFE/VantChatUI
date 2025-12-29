<template>
  <div class="error-message">
    <div class="error-content">
      <van-icon name="warning-o" class="error-icon" />
      <span class="error-text">{{ message }}</span>
    </div>
    <div v-if="retry" class="error-action" @click="handleRetry">
      <van-icon name="replay" />
      <span>重试</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: "生成失败，请稍后重试",
  },
  retry: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["retry"]);

const handleRetry = () => {
  emit("retry");
};
</script>

<style scoped lang="scss">
.error-message {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: #fef0f0;
  border-radius: 8px;
  border: 1px solid #fde2e2;
  color: #f56c6c;
  font-size: 14px;
  max-width: 100%;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.error-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.error-text {
  line-height: 1.4;
}

.error-action {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f56c6c;
  cursor: pointer;
  padding-left: 12px;
  border-left: 1px solid #fde2e2;
  font-weight: 500;
  white-space: nowrap;
  user-select: none;

  &:active {
    opacity: 0.7;
  }

  .van-icon {
    font-size: 14px;
  }
}
</style>
