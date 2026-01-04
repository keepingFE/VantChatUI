<template>
    <van-radio :name="name" :disabled="disabled" :icon-size="iconSize" :checked-color="checkedColor"
        :label-disabled="labelDisabled" :label-position="labelPosition" :shape="shape">
        <slot>{{ label }}</slot>
    </van-radio>
</template>

<script setup>
defineProps({
    // 标识符，通常为一个唯一的字符串或数字
    name: {
        type: [String, Number],
        required: true,
    },
    // 单选框文本
    label: {
        type: String,
        default: '',
    },
    // 是否禁用单选框
    disabled: {
        type: Boolean,
        default: false,
    },
    // 图标大小
    iconSize: {
        type: [Number, String],
        default: '20px',
    },
    // 选中状态颜色
    checkedColor: {
        type: String,
        default: '#1989fa',
    },
    // 是否禁用文本点击
    labelDisabled: {
        type: Boolean,
        default: false,
    },
    // 文本位置: left, right
    labelPosition: {
        type: String,
        default: 'right',
        validator: (value) => ['left', 'right'].includes(value),
    },
    // 形状: round, square
    shape: {
        type: String,
        default: 'round',
        validator: (value) => ['round', 'square'].includes(value),
    },
});
</script>
