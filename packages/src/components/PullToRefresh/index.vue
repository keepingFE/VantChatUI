<template>
    <van-pull-refresh v-model="loading" :disabled="disabled" :success-text="successText"
        :success-duration="successDuration" :pulling-text="pullingText" :loosing-text="loosingText"
        :loading-text="loadingText" :pull-distance="pullDistance" :head-height="headHeight" @refresh="handleRefresh">
        <slot></slot>
    </van-pull-refresh>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // 是否处于加载中状态
    modelValue: {
        type: Boolean,
        default: false,
    },
    // 是否禁用下拉刷新
    disabled: {
        type: Boolean,
        default: false,
    },
    // 刷新成功提示文案
    successText: {
        type: String,
        default: '刷新成功',
    },
    // 刷新成功提示展示时长(ms)
    successDuration: {
        type: Number,
        default: 500,
    },
    // 下拉过程提示文案
    pullingText: {
        type: String,
        default: '下拉即可刷新...',
    },
    // 释放过程提示文案
    loosingText: {
        type: String,
        default: '释放即可刷新...',
    },
    // 加载过程提示文案
    loadingText: {
        type: String,
        default: '加载中...',
    },
    // 触发下拉刷新的距离
    pullDistance: {
        type: Number,
        default: 50,
    },
    // 顶部内容高度
    headHeight: {
        type: Number,
        default: 50,
    },
});

const emit = defineEmits(['update:modelValue', 'refresh']);

const loading = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const handleRefresh = () => {
    emit('refresh');
};
</script>
