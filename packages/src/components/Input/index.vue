<!-- File: packages/src/components/Input/index.vue -->
<template>
  <van-field
    v-model="inputValue"
    :type="fieldType"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :clearable="clearable"
    :maxlength="maxLength"
    :show-word-limit="showWordLimit"
    :rows="rows"
    :autosize="autosizeConfig"
    :label-width="labelWidth"
    :label-align="labelAlign"
    :input-align="inputAlign"
    :error="error"
    :error-message="errorMessage"
    :left-icon="leftIcon"
    :right-icon="rightIcon"
    :clear-icon="clearIcon"
    @update:model-value="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @clear="handleClear"
    @click-left-icon="handleClickLeftIcon"
    @click-right-icon="handleClickRightIcon"
  >
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>
    <template v-if="$slots.button" #button>
      <slot name="button"></slot>
    </template>
    <template v-if="$slots['left-icon']" #left-icon>
      <slot name="left-icon"></slot>
    </template>
    <template v-if="$slots['right-icon']" #right-icon>
      <slot name="right-icon"></slot>
    </template>
  </van-field>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  // v-model 绑定值
  modelValue: {
    type: [String, Number],
    default: "",
  },
  // 输入框类型
  type: {
    type: String,
    default: "text",
    validator: (value) =>
      ["text", "number", "tel", "digit", "textarea", "password"].includes(
        value
      ),
  },
  // 标签文本
  label: {
    type: String,
    default: "",
  },
  // 占位提示文字
  placeholder: {
    type: String,
    default: "请输入",
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否只读
  readonly: {
    type: Boolean,
    default: false,
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false,
  },
  // 是否可清空
  clearable: {
    type: Boolean,
    default: false,
  },
  // 清除图标名称
  clearIcon: {
    type: String,
    default: "clear",
  },
  // 最小长度
  minLength: {
    type: Number,
    default: undefined,
  },
  // 最大长度
  maxLength: {
    type: Number,
    default: undefined,
  },
  // 是否显示字数统计
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  // 文本域行数 (type="textarea" 时有效)
  rows: {
    type: Number,
    default: 2,
  },
  // 最小行数
  minRows: {
    type: Number,
    default: undefined,
  },
  // 最大行数
  maxRows: {
    type: Number,
    default: undefined,
  },
  // 标签宽度
  labelWidth: {
    type: [String, Number],
    default: "6.2em",
  },
  // 标签对齐方式
  labelAlign: {
    type: String,
    default: "left",
    validator: (value) => ["left", "center", "right"].includes(value),
  },
  // 输入框内容对齐方式
  inputAlign: {
    type: String,
    default: "left",
    validator: (value) => ["left", "center", "right"].includes(value),
  },
  // 是否显示错误状态
  error: {
    type: Boolean,
    default: false,
  },
  // 错误提示文本
  errorMessage: {
    type: String,
    default: "",
  },
  // 左侧图标
  leftIcon: {
    type: String,
    default: "",
  },
  // 右侧图标
  rightIcon: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:modelValue",
  "change",
  "focus",
  "blur",
  "clear",
  "click-left-icon",
  "click-right-icon",
]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const fieldType = computed(() => {
  return props.type;
});

const autosizeConfig = computed(() => {
  if (props.type !== "textarea") return false;

  if (props.minRows || props.maxRows) {
    const lineHeight = 24; // 每行高度约 24px
    const config = {};

    if (props.minRows) {
      config.minHeight = props.minRows * lineHeight;
    }

    if (props.maxRows) {
      config.maxHeight = props.maxRows * lineHeight;
    }

    return config;
  }

  return true;
});

const handleChange = (value) => {
  emit("change", value);
};

const handleFocus = (event) => {
  emit("focus", event);
};

const handleBlur = (event) => {
  emit("blur", event);
};

const handleClear = () => {
  emit("clear");
};

const handleClickLeftIcon = () => {
  emit("click-left-icon");
};

const handleClickRightIcon = () => {
  emit("click-right-icon");
};
</script>
