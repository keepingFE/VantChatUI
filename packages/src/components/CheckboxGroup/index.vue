<!-- File: packages/src/components/CheckboxGroup/index.vue -->
<template>
  <van-checkbox-group v-model="checkedList" :disabled="disabled" :direction="direction" :icon-size="iconSize"
    :checked-color="checkedColor" :max="max" @change="handleChange">
    <slot></slot>
  </van-checkbox-group>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // v-model 绑定值
  modelValue: {
    type: Array,
    default: () => [],
  },
  // 是否禁用所有复选框
  disabled: {
    type: Boolean,
    default: false,
  },
  // 排列方向：horizontal / vertical
  direction: {
    type: String,
    default: "vertical",
    validator: (value) => ["horizontal", "vertical"].includes(value),
  },
  // 图标大小
  iconSize: {
    type: [String, Number],
    default: "20px",
  },
  // 选中状态颜色
  checkedColor: {
    type: String,
    default: "#1989fa",
  },
  // 最大可选数
  max: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const checkedList = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleChange = (value) => {
  emit("change", value);
};
</script>
