<template>
    <van-tabs v-model:active="activeTab" :type="type" :color="color" :background="background" :duration="duration"
        :line-width="lineWidth" :line-height="lineHeight" :animated="animated" :swipeable="swipeable"
        :scrollspy="scrollspy" :sticky="sticky" :offset-top="offsetTop" :swipe-threshold="swipeThreshold"
        @change="handleChange" @click-tab="handleClickTab">
        <slot></slot>
    </van-tabs>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    // 当前激活标签的索引或名称
    modelValue: {
        type: [Number, String],
        default: 0,
    },
    // 样式类型: line, card
    type: {
        type: String,
        default: 'line',
        validator: (value) => ['line', 'card'].includes(value),
    },
    // 标签主题色
    color: {
        type: String,
        default: '#1989fa',
    },
    // 标签栏背景色
    background: {
        type: String,
        default: '#fff',
    },
    // 动画时间（秒）
    duration: {
        type: Number,
        default: 0.3,
    },
    // 底部条宽度
    lineWidth: {
        type: [Number, String],
        default: '40px',
    },
    // 底部条高度
    lineHeight: {
        type: [Number, String],
        default: '3px',
    },
    // 是否开启切换标签内容时的转场动画
    animated: {
        type: Boolean,
        default: false,
    },
    // 是否开启手势滑动切换
    swipeable: {
        type: Boolean,
        default: false,
    },
    // 是否开启滚动导航
    scrollspy: {
        type: Boolean,
        default: false,
    },
    // 是否使用粘性定位布局
    sticky: {
        type: Boolean,
        default: false,
    },
    // 粘性定位布局下与顶部的最小距离
    offsetTop: {
        type: Number,
        default: 0,
    },
    // 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动
    swipeThreshold: {
        type: Number,
        default: 5,
    },
});

const emit = defineEmits(['update:modelValue', 'change', 'click-tab']);

const activeTab = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const handleChange = (name, title) => {
    emit('change', name, title);
};

const handleClickTab = ({ name, title, disabled }) => {
    emit('click-tab', { name, title, disabled });
};
</script>
