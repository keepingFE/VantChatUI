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
    padding: 4px 12px;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
    letter-spacing: 0.3px;
}

.chat-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-tag--large {
    padding: 6px 16px;
    font-size: 15px;
    line-height: 24px;
    border-radius: 10px;
}

.chat-tag--small {
    padding: 2px 8px;
    font-size: 11px;
    line-height: 16px;
    border-radius: 6px;
}

.chat-tag--default {
    color: #6c757d;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-tag--primary {
    color: #fff;
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
}

.chat-tag--success {
    color: #fff;
    background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
    box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
}

.chat-tag--warning {
    color: #fff;
    background: linear-gradient(135deg, #faad14 0%, #d48806 100%);
    box-shadow: 0 2px 8px rgba(250, 173, 20, 0.3);
}

.chat-tag--danger {
    color: #fff;
    background: linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%);
    box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

.chat-tag--plain {
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.chat-tag--plain.chat-tag--default {
    color: #6c757d;
    border-color: #dee2e6;
}

.chat-tag--plain.chat-tag--primary {
    color: #1989fa;
    border-color: #1989fa;
}

.chat-tag--plain.chat-tag--success {
    color: #52c41a;
    border-color: #52c41a;
}

.chat-tag--plain.chat-tag--warning {
    color: #faad14;
    border-color: #faad14;
}

.chat-tag--plain.chat-tag--danger {
    color: #ff4d4f;
    border-color: #ff4d4f;
}

.chat-tag--round {
    border-radius: 999px;
}

.chat-tag--mark {
    border-radius: 0 999px 999px 0;
    padding-left: 16px;
}

.chat-tag__close {
    margin-left: 6px;
    font-size: 16px;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.3s;
    font-weight: 700;
}

.chat-tag__close:hover {
    opacity: 1;
    transform: scale(1.2);
}

.chat-tag--closeable {
    cursor: pointer;
}
</style>
