<template>
    <van-notice-bar v-if="visible" :mode="mode" :text="text" :color="color" :background="background"
        :left-icon="leftIcon" :delay="delay" :speed="speed" :scrollable="scrollable" :wrapable="wrapable"
        @close="handleClose" @click="handleClick">
        <template v-if="$slots.default" #default>
            <slot></slot>
        </template>
        <template v-if="$slots['left-icon']" #left-icon>
            <slot name="left-icon"></slot>
        </template>
        <template v-if="$slots['right-icon']" #right-icon>
            <slot name="right-icon"></slot>
        </template>
    </van-notice-bar>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    // 通知文本内容
    text: {
        type: String,
        default: '',
    },
    // 通知栏模式: closeable, link
    mode: {
        type: String,
        default: '',
        validator: (value) => ['', 'closeable', 'link'].includes(value),
    },
    // 通知文本颜色
    color: {
        type: String,
        default: '#ed6a0c',
    },
    // 滚动条背景
    background: {
        type: String,
        default: '#fffbe8',
    },
    // 左侧图标名称
    leftIcon: {
        type: String,
        default: 'volume-o',
    },
    // 动画延迟时间 (s)
    delay: {
        type: Number,
        default: 1,
    },
    // 滚动速率 (px/s)
    speed: {
        type: Number,
        default: 60,
    },
    // 是否开启滚动播放
    scrollable: {
        type: Boolean,
        default: undefined,
    },
    // 是否开启文本换行
    wrapable: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'click']);

const visible = ref(true);

const handleClose = () => {
    visible.value = false;
    emit('close');
};

const handleClick = (event) => {
    emit('click', event);
};
</script>
