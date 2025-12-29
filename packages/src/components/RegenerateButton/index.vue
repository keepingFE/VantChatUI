<template>
  <div
    class="regenerate-btn"
    :class="{ 'is-loading': loading, 'is-disabled': disabled }"
    @click="handleClick"
  >
    <van-icon name="replay" :class="{ 'spin-icon': loading }" />
    <span class="btn-text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "重新生成",
  },
});

const emit = defineEmits(["click"]);

const handleClick = (e) => {
  if (props.loading || props.disabled) return;
  emit("click", e);
};
</script>

<style scoped lang="scss">
.regenerate-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #ebedf0;
  border-radius: 4px;
  font-size: 13px;
  color: #323233;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:active:not(.is-disabled):not(.is-loading) {
    background-color: #f2f3f5;
  }

  &.is-loading {
    cursor: wait;
    opacity: 0.8;
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #f7f8fa;
  }
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
