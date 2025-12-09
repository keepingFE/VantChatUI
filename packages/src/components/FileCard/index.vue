<!-- File: packages/src/components/FileCard/index.vue -->
<template>
    <div class="file-card" @click="handleClick">
        <div class="file-icon" :style="{ background: iconBg, borderColor: iconBg }">
            <svg class="icon-svg" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"
                    :fill="iconColor" />
            </svg>
            <span class="file-ext" :style="{ color: iconColor }">{{ fileExt }}</span>
        </div>

        <div class="file-info">
            <div class="file-name">{{ fileName }}</div>
            <div class="file-meta">
                <span class="file-size">{{ fileSize }}</span>
                <span v-if="downloadable" class="file-download" @click.stop="handleDownload">
                    下载
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

// Props 定义
const props = defineProps({
    fileName: {
        type: String,
        required: true,
        default: ''
    },
    fileSize: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        default: ''
    },
    downloadable: {
        type: Boolean,
        default: false
    },
    extension: {
        type: String,
        default: ''
    }
})

// Emits 定义
const emit = defineEmits(['click', 'download'])

// 获取文件扩展名
const fileExt = computed(() => {
    if (props.extension) return props.extension.toUpperCase()
    if (!props.fileName) return 'FILE'
    const ext = props.fileName.split('.').pop()?.toUpperCase()
    return ext || 'FILE'
})

// 获取文件图标颜色
const iconColor = computed(() => {
    const ext = fileExt.value.toLowerCase()
    const colorMap = {
        'pdf': '#ff4d4f',      // 红色
        'doc': '#1890ff',      // 蓝色
        'docx': '#1890ff',
        'xls': '#52c41a',      // 绿色
        'xlsx': '#52c41a',
        'zip': '#ff9800',      // 橙色
        'rar': '#ff9800',
        '7z': '#ff9800',
        'ppt': '#ff6b6b',      // 浅红色
        'pptx': '#ff6b6b',
        'txt': '#969799'       // 灰色
    }
    return colorMap[ext] || '#ff9800'
})

// 获取文件图标背景色（浅色版本）
const iconBg = computed(() => {
    const ext = fileExt.value.toLowerCase()
    const bgMap = {
        'pdf': '#fff1f0',      // 浅红色
        'doc': '#e6f7ff',      // 浅蓝色
        'docx': '#e6f7ff',
        'xls': '#f6ffed',      // 浅绿色
        'xlsx': '#f6ffed',
        'zip': '#fff7e6',      // 浅橙色
        'rar': '#fff7e6',
        '7z': '#fff7e6',
        'ppt': '#fff1f0',      // 浅红色
        'pptx': '#fff1f0',
        'txt': '#fafafa'       // 浅灰色
    }
    return bgMap[ext] || '#fff7e6'
})

// 处理卡片点击
const handleClick = () => {
    emit('click')
}

// 处理下载
const handleDownload = () => {
    emit('download')
    if (props.fileUrl) {
        const link = document.createElement('a')
        link.href = props.fileUrl
        link.download = props.fileName || 'download'
        link.click()
    }
}
</script>

<style scoped lang="scss">
.file-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;

    &:active {
        background: #f7f8fa;
    }
}

.file-icon {
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

.icon-svg {
    position: absolute;
    width: 32px;
    height: 32px;
    opacity: 0.3;
}

.file-ext {
    position: relative;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    z-index: 1;
}

.file-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-name {
    font-size: 15px;
    font-weight: 400;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
}

.file-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.file-size {
    color: #969799;
}

.file-download {
    color: #1989fa;
    cursor: pointer;
    user-select: none;

    &:active {
        opacity: 0.7;
    }
}
</style>
