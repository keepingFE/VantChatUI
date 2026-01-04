<template>
    <van-collapse v-model="activeNames" :accordion="accordion" :border="border" @change="handleChange">
        <slot></slot>
    </van-collapse>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // 当前展开面板的 name
    modelValue: {
        type: [String, Number, Array],
        default: () => [],
    },
    // 是否开启手风琴模式
    accordion: {
        type: Boolean,
        default: false,
    },
    // 是否显示外边框
    border: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

const activeNames = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const handleChange = (value) => {
    emit('change', value);
};
</script>
