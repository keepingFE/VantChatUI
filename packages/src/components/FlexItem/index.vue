<!-- File: packages/src/components/FlexItem/index.vue -->
<template>
  <div :class="flexItemClasses" :style="flexItemStyles">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // flex 比例
  flex: {
    type: [String, Number],
    default: "",
  },
  // flex-grow
  grow: {
    type: [String, Number],
    default: "",
  },
  // flex-shrink
  shrink: {
    type: [String, Number],
    default: "",
  },
  // flex-basis
  basis: {
    type: String,
    default: "",
  },
  // 单独的对齐方式
  alignSelf: {
    type: String,
    default: "",
    validator: (value) =>
      !value ||
      ["auto", "start", "end", "center", "baseline", "stretch"].includes(value),
  },
  // 排序
  order: {
    type: [String, Number],
    default: "",
  },
});

const flexItemClasses = computed(() => {
  return ["chat-flex-item"];
});

const flexItemStyles = computed(() => {
  const styles = {};

  if (props.flex) {
    styles.flex = props.flex;
  } else {
    if (props.grow) styles.flexGrow = props.grow;
    if (props.shrink) styles.flexShrink = props.shrink;
    if (props.basis) styles.flexBasis = props.basis;
  }

  if (props.alignSelf) {
    const alignMap = {
      auto: "auto",
      start: "flex-start",
      end: "flex-end",
      center: "center",
      baseline: "baseline",
      stretch: "stretch",
    };
    styles.alignSelf = alignMap[props.alignSelf];
  }

  if (props.order) {
    styles.order = props.order;
  }

  return styles;
});
</script>
