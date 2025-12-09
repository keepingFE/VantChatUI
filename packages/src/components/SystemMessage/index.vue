<!-- File: packages/src/components/SystemMessage/index.vue -->
<template>
    <div class="system-message">
        <div class="system-message-content">
            <span class="system-message-text">{{ content }}</span>
            <span v-if="actionText" class="system-message-action" @click="handleAction">
                {{ actionText }}
            </span>
        </div>
    </div>
</template>

<script setup>
// Props 定义
const props = defineProps({
    content: {
        type: String,
        required: true,
        default: ''
    },
    actionText: {
        type: String,
        default: ''
    }
})

// Emits 定义
const emit = defineEmits(['action'])

// 处理操作按钮点击
const handleAction = () => {
    emit('action')
}
</script>

<style scoped lang="scss">
.system-message {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    margin: 12px 0;
}

.system-message-content {
    background: #f7f8fa;
    color: #646566;
    font-size: 12px;
    line-height: 1.5;
    padding: 6px 12px;
    border-radius: 4px;
    text-align: center;
    max-width: 80%;
    word-wrap: break-word;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.system-message-text {
    color: #646566;
}

.system-message-action {
    color: #1989fa;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;

    &:active {
        opacity: 0.7;
    }
}
</style>
