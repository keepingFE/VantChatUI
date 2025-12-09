<!-- File: packages/src/components/Flex/index.vue -->
<template>
  <div :class="flexClasses" :style="flexStyles">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // 主轴方向
  direction: {
    type: String,
    default: "row",
    validator: (value) =>
      ["row", "row-reverse", "column", "column-reverse"].includes(value),
  },
  // 主轴对齐方式
  justify: {
    type: String,
    default: "start",
    validator: (value) =>
      [
        "start",
        "end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
      ].includes(value),
  },
  // 交叉轴对齐方式
  align: {
    type: String,
    default: "stretch",
    validator: (value) =>
      ["start", "end", "center", "baseline", "stretch"].includes(value),
  },
  // 是否换行
  wrap: {
    type: String,
    default: "nowrap",
    validator: (value) => ["nowrap", "wrap", "wrap-reverse"].includes(value),
  },
  // 间距
  gap: {
    type: [String, Number],
    default: "",
  },
  // 是否内联 flex
  inline: {
    type: Boolean,
    default: false,
  },
});

const flexClasses = computed(() => {
  return [
    "chat-flex",
    {
      "chat-flex--inline": props.inline,
    },
  ];
});

const flexStyles = computed(() => {
  const justifyMap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    "space-between": "space-between",
    "space-around": "space-around",
    "space-evenly": "space-evenly",
  };

  const alignMap = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    baseline: "baseline",
    stretch: "stretch",
  };

  const styles = {
    flexDirection: props.direction,
    justifyContent: justifyMap[props.justify],
    alignItems: alignMap[props.align],
    flexWrap: props.wrap,
  };

  if (props.gap) {
    styles.gap = typeof props.gap === "number" ? `${props.gap}px` : props.gap;
  }

  return styles;
});
</script>

<style scoped lang="scss">
.chat-flex {
  display: flex;

  &--inline {
    display: inline-flex;
  }
}
</style>
