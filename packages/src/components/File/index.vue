<!-- File: packages/src/components/File/index.vue -->
<template>
    <div :class="fileClasses" @click="handleClick">
        <div class="chat-file__icon" :style="iconStyles">
            <svg class="chat-file__icon-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"
                    :fill="iconColor" />
            </svg>
            <span class="chat-file__ext" :style="{ color: iconColor }">{{ fileExt }}</span>
        </div>

        <div class="chat-file__info">
            <div class="chat-file__name">{{ name }}</div>
            <div class="chat-file__meta">
                <span class="chat-file__size">{{ size }}</span>
                <span v-if="downloadable" class="chat-file__download" @click.stop="handleDownload">
                    下载
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    // 文件名
    name: {
        type: String,
        required: true,
        default: ''
    },
    // 文件大小
    size: {
        type: String,
        default: ''
    },
    // 文件 URL
    url: {
        type: String,
        default: ''
    },
    // 是否可下载
    downloadable: {
        type: Boolean,
        default: false
    },
    // 文件扩展名（可选，如果不提供则从文件名提取）
    extension: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['click', 'download'])

// 获取文件扩展名
const fileExt = computed(() => {
    if (props.extension) return props.extension.toUpperCase()
    if (!props.name) return 'FILE'
    const ext = props.name.split('.').pop()?.toUpperCase()
    return ext || 'FILE'
})

// 获取文件图标颜色
const iconColor = computed(() => {
    const ext = fileExt.value.toLowerCase()
    const colorMap = {
        'pdf': '#ff4d4f',
        'doc': '#1890ff',
        'docx': '#1890ff',
        'xls': '#52c41a',
        'xlsx': '#52c41a',
        'zip': '#ff9800',
        'rar': '#ff9800',
        '7z': '#ff9800',
        'ppt': '#ff6b6b',
        'pptx': '#ff6b6b',
        'txt': '#969799'
    }
    return colorMap[ext] || '#ff9800'
})

// 获取文件图标背景色
const iconBg = computed(() => {
    const ext = fileExt.value.toLowerCase()
    const bgMap = {
        'pdf': '#fff1f0',
        'doc': '#e6f7ff',
        'docx': '#e6f7ff',
        'xls': '#f6ffed',
        'xlsx': '#f6ffed',
        'zip': '#fff7e6',
        'rar': '#fff7e6',
        '7z': '#fff7e6',
        'ppt': '#fff1f0',
        'pptx': '#fff1f0',
        'txt': '#fafafa'
    }
    return bgMap[ext] || '#fff7e6'
})

const fileClasses = computed(() => ['chat-file'])

const iconStyles = computed(() => ({
    background: iconBg.value,
    borderColor: iconBg.value
}))

// 处理文件点击
const handleClick = () => {
    emit('click')
}

// 处理下载
const handleDownload = () => {
    emit('download')
    if (props.url) {
        const link = document.createElement('a')
        link.href = props.url
        link.download = props.name || 'download'
        link.click()
    }
}
</script>

<style scoped lang="scss">
.chat-file {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    max-width: 280px;

    &:active {
        background: #f7f8fa;
    }

    &__icon {
        position: relative;
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 2px solid;
    }

    &__icon-svg {
        position: absolute;
        width: 32px;
        height: 32px;
        opacity: 0.3;
    }

    &__ext {
        position: relative;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        z-index: 1;
    }

    &__info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__name {
        font-size: 15px;
        font-weight: 400;
        color: #323233;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.4;
    }

    &__meta {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
    }

    &__size {
        color: #969799;
    }

    &__download {
        color: #1989fa;
        cursor: pointer;
        user-select: none;

        &:active {
            opacity: 0.7;
        }
    }
}
</style>
