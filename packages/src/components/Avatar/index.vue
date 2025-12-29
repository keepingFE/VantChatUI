<!-- File: packages/src/components/Avatar/index.vue -->
<template>
  <div
    class="chat-avatar"
    :class="avatarClasses"
    :style="avatarStyle"
    :tabindex="clickable ? 0 : undefined"
    :role="clickable ? 'button' : undefined"
    :aria-label="ariaLabel"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <!-- 图片头像 -->
    <van-image
      v-if="showImage"
      :src="src"
      :alt="alt || name"
      :width="computedSize"
      :height="computedSize"
      :round="shape === 'circle'"
      :radius="shape === 'square' ? radius : undefined"
      fit="cover"
      @error="handleImageError"
      @load="handleImageLoad"
    />

    <!-- 文字头像 -->
    <span v-else-if="showText" class="avatar-text" :style="textStyle">
      {{ initials }}
    </span>

    <!-- 图标头像 -->
    <span v-else class="avatar-icon">
      <slot name="icon">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          :width="iconSize"
          :height="iconSize"
        >
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      </slot>
    </span>

    <!-- 状态指示器 -->
    <span v-if="validStatus" class="avatar-status" :style="statusStyle" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// ========== 常量定义 ==========
const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const STATUS_COLOR_MAP = {
  online: "#52c41a",
  offline: "#d9d9d9",
  busy: "#ff4d4f",
  away: "#faad14",
};

const DEFAULT_BG_COLORS = [
  "#1890ff",
  "#52c41a",
  "#faad14",
  "#ff4d4f",
  "#722ed1",
  "#13c2c2",
  "#eb2f96",
  "#fa8c16",
];

// ========== Props 定义 ==========
const props = defineProps({
  src: { type: String, default: "" },
  alt: { type: String, default: "" },
  name: { type: String, default: "" },
  size: { type: [String, Number], default: "md" },
  shape: {
    type: String,
    default: "circle",
    validator: (v) => ["circle", "square"].includes(v),
  },
  radius: { type: [Number, String], default: 4 },
  status: { type: String, default: "" },
  clickable: { type: Boolean, default: false },
  icon: { type: String, default: "" },
  bgColor: { type: String, default: "" },
  textColor: { type: String, default: "#ffffff" },
});

const emit = defineEmits(["click", "error", "load"]);

// ========== 响应式状态 ==========
const imageLoadFailed = ref(false);

// ========== 工具函数 ==========
function getColorByName(name) {
  if (!name) return DEFAULT_BG_COLORS[0];
  const index = name.charCodeAt(0) % DEFAULT_BG_COLORS.length;
  return DEFAULT_BG_COLORS[index];
}

function getInitials(name, maxLength = 2) {
  if (!name) return "";
  // 中文：取前两个字符
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.slice(0, maxLength);
  }
  // 英文：取每个单词首字母
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, maxLength)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

// ========== 计算属性 ==========
const computedSize = computed(() => {
  if (typeof props.size === "number") {
    return Math.max(16, props.size);
  }
  return SIZE_MAP[props.size] || SIZE_MAP.md;
});

const showImage = computed(() => props.src && !imageLoadFailed.value);
const showText = computed(() => !showImage.value && props.name);
const initials = computed(() => getInitials(props.name));

const validStatus = computed(() => {
  return ["online", "offline", "busy", "away"].includes(props.status)
    ? props.status
    : null;
});

const avatarClasses = computed(() => ({
  "avatar--clickable": props.clickable,
  [`avatar--${props.shape}`]: true,
}));

const avatarStyle = computed(() => ({
  width: `${computedSize.value}px`,
  height: `${computedSize.value}px`,
  borderRadius: props.shape === "circle" ? "50%" : `${props.radius}px`,
}));

const textStyle = computed(() => ({
  backgroundColor: props.bgColor || getColorByName(props.name),
  color: props.textColor,
  fontSize: `${computedSize.value * 0.4}px`,
}));

const iconSize = computed(() => computedSize.value * 0.5);

const statusSize = computed(() => Math.max(8, computedSize.value * 0.25));

const statusStyle = computed(() => ({
  width: `${statusSize.value}px`,
  height: `${statusSize.value}px`,
  backgroundColor:
    STATUS_COLOR_MAP[validStatus.value] || STATUS_COLOR_MAP.offline,
}));

const ariaLabel = computed(() => {
  if (props.alt) return props.alt;
  if (props.name) return props.name;
  return "User avatar";
});

// ========== 事件处理 ==========
function handleClick(event) {
  if (props.clickable) {
    emit("click", event);
  }
}

function handleImageError(event) {
  imageLoadFailed.value = true;
  emit("error", event);
}

function handleImageLoad(event) {
  emit("load", event);
}

// 导出工具函数供测试使用
defineExpose({ getInitials, getColorByName, SIZE_MAP, STATUS_COLOR_MAP });
</script>

<style scoped lang="scss">
.chat-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f0f0f0;
  vertical-align: middle;
  flex-shrink: 0;

  &--clickable {
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.85;
    }
    &:focus {
      outline: 2px solid #1890ff;
      outline-offset: 2px;
    }
  }
}

.avatar-text {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: 500;
  user-select: none;
}

.avatar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  border-radius: 50%;
  border: 2px solid #fff;
  box-sizing: content-box;
}
</style>
