<template>
    <div class="chat-skeleton" :class="{ 'chat-skeleton--animate': animate }">
        <div v-if="avatar" class="chat-skeleton__avatar" :style="avatarStyle"></div>
        <div class="chat-skeleton__content">
            <div v-if="title" class="chat-skeleton__title" :style="titleStyle"></div>
            <div v-for="i in row" :key="i" class="chat-skeleton__row" :style="getRowStyle(i)"></div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    row: {
        type: Number,
        default: 3
    },
    title: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: Boolean,
        default: false
    },
    avatarSize: {
        type: [Number, String],
        default: 40
    },
    avatarShape: {
        type: String,
        default: 'round' // round | square
    },
    animate: {
        type: Boolean,
        default: true
    },
    rowWidth: {
        type: [String, Array],
        default: '100%'
    }
});

const avatarStyle = computed(() => ({
    width: `${props.avatarSize}px`,
    height: `${props.avatarSize}px`,
    borderRadius: props.avatarShape === 'round' ? '50%' : '4px'
}));

const titleStyle = computed(() => ({
    width: '40%'
}));

const getRowStyle = (index) => {
    if (Array.isArray(props.rowWidth)) {
        return { width: props.rowWidth[index - 1] || '100%' };
    }
    return { width: props.rowWidth };
};
</script>

<style scoped>
.chat-skeleton {
    display: flex;
    padding: 16px;
}

.chat-skeleton__avatar {
    flex-shrink: 0;
    margin-right: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    position: relative;
    overflow: hidden;
}

.chat-skeleton__avatar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: skeleton-shimmer 1.5s infinite;
}

.chat-skeleton__content {
    flex: 1;
}

.chat-skeleton__title {
    height: 18px;
    margin-bottom: 14px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 9px;
    position: relative;
    overflow: hidden;
}

.chat-skeleton__title::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: skeleton-shimmer 1.5s infinite;
}

.chat-skeleton__row {
    height: 14px;
    margin-bottom: 12px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    border-radius: 7px;
    position: relative;
    overflow: hidden;
}

.chat-skeleton__row::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    animation: skeleton-shimmer 1.5s infinite;
}

.chat-skeleton__row:last-child {
    margin-bottom: 0;
    width: 60%;
}

.chat-skeleton--animate .chat-skeleton__avatar::after,
.chat-skeleton--animate .chat-skeleton__title::after,
.chat-skeleton--animate .chat-skeleton__row::after {
    animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}

@keyframes skeleton-pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.6;
    }
}
</style>
