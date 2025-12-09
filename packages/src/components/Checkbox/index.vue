<!-- File: packages/src/components/Checkbox/index.vue -->
<template>
  <van-checkbox
    v-model="checked"
    :name="name"
    :shape="shape"
    :disabled="disabled"
    :icon-size="iconSize"
    :checked-color="checkedColor"
    :label-disabled="labelDisabled"
    :label-position="labelPosition"
    @change="handleChange"
  >
    <slot>{{ label }}</slot>
  </van-checkbox>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // v-model 绑定值
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 标签文本
  label: {
    type: String,
    default: "",
  },
  // 标识符，通常在组内使用
  name: {
    type: [String, Number],
    default: "",
  },
  // 形状：square方形 / round圆形
  shape: {
    type: String,
    default: "round",
    validator: (value) => ["square", "round"].includes(value),
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
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
  // 是否禁用文本点击
  labelDisabled: {
    type: Boolean,
    default: false,
  },
  // 文本位置：left / right
  labelPosition: {
    type: String,
    default: "right",
    validator: (value) => ["left", "right"].includes(value),
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const checked = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleChange = (value) => {
  emit("change", value);
};
</script>
