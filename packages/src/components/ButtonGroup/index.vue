<!-- File: packages/src/components/ButtonGroup/index.vue -->
<template>
  <div :class="groupClasses">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 按钮组方向: horizontal, vertical
  direction: {
    type: String,
    default: "horizontal",
    validator: (value) => ["horizontal", "vertical"].includes(value),
  },
  // 按钮组间距
  gap: {
    type: String,
    default: "8px",
  },
});

const groupClasses = computed(() => {
  return ["chat-button-group", `chat-button-group--${props.direction}`];
});
</script>

<style scoped lang="scss">
.chat-button-group {
  display: flex;
  align-items: center;

  &--horizontal {
    flex-direction: row;
    gap: v-bind(gap);
  }

  &--vertical {
    flex-direction: column;
    align-items: stretch;
    gap: v-bind(gap);

    :deep(.chat-button) {
      width: 100%;
    }
  }
}
</style>
