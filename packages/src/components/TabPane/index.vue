<template>
    <van-tab :title="title" :name="name" :disabled="disabled" :dot="dot" :badge="badge" :title-style="titleStyle"
        :title-class="titleClass">
        <slot></slot>
    </van-tab>
</template>

<script setup>
defineProps({
    // 标签标题
    title: {
        type: String,
        required: true,
    },
    // 标签名称，作为匹配的标识符
    name: {
        type: [Number, String],
        default: undefined,
    },
    // 是否禁用标签
    disabled: {
        type: Boolean,
        default: false,
    },
    // 是否在标题右上角显示小红点
    dot: {
        type: Boolean,
        default: false,
    },
    // 图标右上角徽标的内容
    badge: {
        type: [Number, String],
        default: '',
    },
    // 自定义标题样式
    titleStyle: {
        type: Object,
        default: () => ({}),
    },
    // 自定义标题类名
    titleClass: {
        type: String,
        default: '',
    },
});
</script>
