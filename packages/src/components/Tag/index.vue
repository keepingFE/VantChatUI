<template>
    <div class="chat-tag" :class="[
        `chat-tag--${type}`,
        `chat-tag--${size}`,
        {
            'chat-tag--plain': plain,
            'chat-tag--round': round,
            'chat-tag--mark': mark,
            'chat-tag--closeable': closeable
        }
    ]" :style="tagStyle" @click="handleClick">
        <slot></slot>
        <span v-if="closeable" class="chat-tag__close" @click.stop="handleClose">×</span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'default' // default | primary | success | warning | danger
    },
    size: {
        type: String,
        default: 'medium' // large | medium | small
    },
    color: {
        type: String,
        default: ''
    },
    plain: {
        type: Boolean,
        default: false
    },
    round: {
        type: Boolean,
        default: false
    },
    mark: {
        type: Boolean,
        default: false
    },
    closeable: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click', 'close']);

const tagStyle = computed(() => {
    if (!props.color) return {};
    return props.plain ? {
        color: props.color,
        borderColor: props.color,
        backgroundColor: '#fff'
    } : {
        color: '#fff',
        backgroundColor: props.color,
        borderColor: props.color
    };
});

const handleClick = (e) => {
    emit('click', e);
};

const handleClose = (e) => {
    emit('close', e);
};
</script>

<style scoped>
.chat-tag {
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    font-size: 12px;
    line-height: 20px;
    border-radius: 4px;
    border: 1px solid transparent;
    transition: all 0.3s;
}

.chat-tag--large {
    padding: 4px 12px;
    font-size: 14px;
    line-height: 24px;
}

.chat-tag--small {
    padding: 0 4px;
    font-size: 10px;
    line-height: 16px;
}

.chat-tag--default {
    color: #646566;
    background-color: #f2f3f5;
}

.chat-tag--primary {
    color: #fff;
    background-color: #1989fa;
}

.chat-tag--success {
    color: #fff;
    background-color: #07c160;
}

.chat-tag--warning {
    color: #fff;
    background-color: #ff976a;
}

.chat-tag--danger {
    color: #fff;
    background-color: #ee0a24;
}

.chat-tag--plain {
    background-color: #fff;
}

.chat-tag--plain.chat-tag--default {
    color: #969799;
    border-color: #ebedf0;
}

.chat-tag--plain.chat-tag--primary {
    color: #1989fa;
    border-color: #1989fa;
}

.chat-tag--plain.chat-tag--success {
    color: #07c160;
    border-color: #07c160;
}

.chat-tag--plain.chat-tag--warning {
    color: #ff976a;
    border-color: #ff976a;
}

.chat-tag--plain.chat-tag--danger {
    color: #ee0a24;
    border-color: #ee0a24;
}

.chat-tag--round {
    border-radius: 999px;
}

.chat-tag--mark {
    border-radius: 0 999px 999px 0;
}

.chat-tag__close {
    margin-left: 4px;
    font-size: 14px;
    cursor: pointer;
    opacity: 0.6;
}

.chat-tag__close:hover {
    opacity: 1;
}
</style>
