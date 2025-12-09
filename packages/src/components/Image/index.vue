<!-- File: packages/src/components/Image/index.vue -->
<template>
  <div :class="imageClasses" :style="imageContainerStyles">
    <img
      v-if="!loadError"
      :src="src"
      :alt="alt"
      :class="imgClasses"
      :style="imgStyles"
      :loading="lazy ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 加载中 -->
    <div v-if="loading && !loadError" class="chat-image__loading">
      <slot name="loading">
        <van-loading type="spinner" size="20" />
      </slot>
    </div>

    <!-- 加载失败 -->
    <div v-if="loadError" class="chat-image__error">
      <slot name="error">
        <div class="chat-image__error-icon">📷</div>
        <div class="chat-image__error-text">加载失败</div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  // 图片地址
  src: {
    type: String,
    required: true,
  },
  // 替代文本
  alt: {
    type: String,
    default: "",
  },
  // 宽度
  width: {
    type: [String, Number],
    default: "",
  },
  // 高度
  height: {
    type: [String, Number],
    default: "",
  },
  // 图片适配方式
  fit: {
    type: String,
    default: "fill",
    validator: (value) =>
      ["contain", "cover", "fill", "none", "scale-down"].includes(value),
  },
  // 是否圆角
  round: {
    type: Boolean,
    default: false,
  },
  // 圆角大小
  radius: {
    type: [String, Number],
    default: "",
  },
  // 是否懒加载
  lazy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["load", "error"]);

const loading = ref(true);
const loadError = ref(false);

const imageClasses = computed(() => {
  return [
    "chat-image",
    {
      "chat-image--round": props.round,
      "chat-image--loading": loading.value,
      "chat-image--error": loadError.value,
    },
  ];
});

const imgClasses = computed(() => {
  return ["chat-image__img"];
});

const imageContainerStyles = computed(() => {
  const styles = {};

  if (props.width) {
    styles.width =
      typeof props.width === "number" ? `${props.width}px` : props.width;
  }

  if (props.height) {
    styles.height =
      typeof props.height === "number" ? `${props.height}px` : props.height;
  }

  if (props.radius && !props.round) {
    styles.borderRadius =
      typeof props.radius === "number" ? `${props.radius}px` : props.radius;
  }

  return styles;
});

const imgStyles = computed(() => {
  return {
    objectFit: props.fit,
  };
});

const handleLoad = (event) => {
  loading.value = false;
  loadError.value = false;
  emit("load", event);
};

const handleError = (event) => {
  loading.value = false;
  loadError.value = true;
  emit("error", event);
};
</script>

<style scoped lang="scss">
.chat-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: #f7f8fa;

  &--round {
    border-radius: 50%;
    overflow: hidden;
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__loading,
  &__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f7f8fa;
  }

  &__error-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  &__error-text {
    font-size: 12px;
    color: #969799;
  }
}
</style>
