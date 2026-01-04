<template>
    <van-icon :name="name" :dot="dot" :badge="badge" :color="color" :size="size" :class-prefix="classPrefix" :tag="tag"
        @click="handleClick">
        <template v-if="$slots.default" #default>
            <slot></slot>
        </template>
    </van-icon>
</template>

<script setup>
defineProps({
    // 图标名称或图片链接
    name: {
        type: String,
        required: true,
    },
    // 是否显示图标右上角小红点
    dot: {
        type: Boolean,
        default: false,
    },
    // 图标右上角徽标的内容
    badge: {
        type: [Number, String],
        default: '',
    },
    // 图标颜色
    color: {
        type: String,
        default: 'inherit',
    },
    // 图标大小
    size: {
        type: [Number, String],
        default: 'inherit',
    },
    // 类名前缀，用于使用自定义图标
    classPrefix: {
        type: String,
        default: 'van-icon',
    },
    // HTML 标签
    tag: {
        type: String,
        default: 'i',
    },
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
    emit('click', event);
};
</script>
