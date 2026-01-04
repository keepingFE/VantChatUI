<template>
    <van-collapse-item :name="name" :title="title" :value="value" :label="label" :border="border" :is-link="isLink"
        :disabled="disabled" :readonly="readonly" :title-class="titleClass" :value-class="valueClass"
        :label-class="labelClass">
        <template v-if="$slots.default" #default>
            <slot></slot>
        </template>
        <template v-if="$slots.title" #title>
            <slot name="title"></slot>
        </template>
        <template v-if="$slots.value" #value>
            <slot name="value"></slot>
        </template>
        <template v-if="$slots.label" #label>
            <slot name="label"></slot>
        </template>
        <template v-if="$slots.icon" #icon>
            <slot name="icon"></slot>
        </template>
        <template v-if="$slots['right-icon']" #right-icon>
            <slot name="right-icon"></slot>
        </template>
    </van-collapse-item>
</template>

<script setup>
defineProps({
    // 唯一标识符，默认为索引值
    name: {
        type: [String, Number],
        required: true,
    },
    // 标题栏左侧内容
    title: {
        type: String,
        default: '',
    },
    // 标题栏右侧内容
    value: {
        type: String,
        default: '',
    },
    // 标题栏描述信息
    label: {
        type: String,
        default: '',
    },
    // 是否显示内边框
    border: {
        type: Boolean,
        default: true,
    },
    // 是否展示标题栏右侧箭头并开启点击反馈
    isLink: {
        type: Boolean,
        default: true,
    },
    // 是否禁用面板
    disabled: {
        type: Boolean,
        default: false,
    },
    // 是否为只读状态，只读状态下无法操作面板
    readonly: {
        type: Boolean,
        default: false,
    },
    // 自定义标题类名
    titleClass: {
        type: String,
        default: '',
    },
    // 自定义右侧内容类名
    valueClass: {
        type: String,
        default: '',
    },
    // 自定义描述信息类名
    labelClass: {
        type: String,
        default: '',
    },
});
</script>
