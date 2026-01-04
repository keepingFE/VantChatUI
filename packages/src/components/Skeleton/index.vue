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
    background-color: #f2f3f5;
}

.chat-skeleton__content {
    flex: 1;
}

.chat-skeleton__title {
    height: 16px;
    margin-bottom: 12px;
    background-color: #f2f3f5;
    border-radius: 4px;
}

.chat-skeleton__row {
    height: 12px;
    margin-bottom: 12px;
    background-color: #f2f3f5;
    border-radius: 4px;
}

.chat-skeleton__row:last-child {
    margin-bottom: 0;
}

.chat-skeleton--animate .chat-skeleton__avatar,
.chat-skeleton--animate .chat-skeleton__title,
.chat-skeleton--animate .chat-skeleton__row {
    animation: skeleton-blink 1.2s ease-in-out infinite;
}

@keyframes skeleton-blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
