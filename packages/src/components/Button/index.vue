<!-- File: packages/src/components/Button/index.vue -->
<template>
  <van-button
    :type="vantType"
    :size="vantSize"
    :color="customColor"
    :disabled="disabled"
    :block="block"
    :round="round"
    :native-type="htmlType"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </van-button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 按钮文本
  text: {
    type: String,
    default: "",
  },
  // 按钮类型: primary, default, text
  type: {
    type: String,
    default: "default",
    validator: (value) => ["primary", "default", "text"].includes(value),
  },
  // 按钮尺寸: sm, md, lg
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg"].includes(value),
  },
  // 按钮颜色变体
  variant: {
    type: String,
    default: "",
    validator: (value) =>
      ["", "orange", "success", "warning", "danger"].includes(value),
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否块级按钮（占满父容器宽度）
  block: {
    type: Boolean,
    default: false,
  },
  // HTML button type 属性
  htmlType: {
    type: String,
    default: "button",
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  // 是否圆角按钮
  round: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

// 映射到 Vant 的按钮类型
const vantType = computed(() => {
  if (props.type === "text") return "default";
  return props.type;
});

// 映射到 Vant 的尺寸
const vantSize = computed(() => {
  const sizeMap = {
    sm: "small",
    md: "normal",
    lg: "large",
  };
  return sizeMap[props.size] || "normal";
});

// 自定义颜色（用于颜色变体）
const customColor = computed(() => {
  if (!props.variant) return undefined;

  const colorMap = {
    orange: "#ff6600",
    success: "#52c41a",
    warning: "#faad14",
    danger: "#ff4d4f",
  };

  // text 类型不使用自定义颜色
  if (props.type === "text") return undefined;

  return colorMap[props.variant];
});

// 额外的样式类
const buttonClasses = computed(() => {
  return [
    "chat-button",
    {
      "chat-button--text": props.type === "text",
      [`chat-button--${props.variant}`]: props.variant && props.type === "text",
    },
  ];
});

const handleClick = (event) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit("click", event);
};
</script>

<style scoped lang="scss">
// 文本按钮样式
.chat-button--text {
  :deep(.van-button__text) {
    color: #1677ff;
  }

  &:not(.van-button--disabled):active {
    opacity: 0.7;
  }
}

// 文本按钮颜色变体
.chat-button--orange {
  :deep(.van-button__text) {
    color: #ff6600;
  }
}

.chat-button--success {
  :deep(.van-button__text) {
    color: #52c41a;
  }
}

.chat-button--warning {
  :deep(.van-button__text) {
    color: #faad14;
  }
}

.chat-button--danger {
  :deep(.van-button__text) {
    color: #ff4d4f;
  }
}
</style>
