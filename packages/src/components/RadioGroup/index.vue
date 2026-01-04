<template>
    <van-radio-group v-model="selectedValue" :disabled="disabled" :direction="direction" :icon-size="iconSize"
        :checked-color="checkedColor" @change="handleChange">
        <slot></slot>
    </van-radio-group>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // 当前选中项的标识符
    modelValue: {
        type: [String, Number],
        default: undefined,
    },
    // 是否禁用所有单选框
    disabled: {
        type: Boolean,
        default: false,
    },
    // 排列方向: horizontal, vertical
    direction: {
        type: String,
        default: 'vertical',
        validator: (value) => ['horizontal', 'vertical'].includes(value),
    },
    // 所有单选框的图标大小
    iconSize: {
        type: [Number, String],
        default: '20px',
    },
    // 所有单选框的选中状态颜色
    checkedColor: {
        type: String,
        default: '#1989fa',
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const handleChange = (value) => {
    emit('change', value);
};
</script>
