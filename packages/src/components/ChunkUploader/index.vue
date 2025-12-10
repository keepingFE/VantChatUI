<!--
  分片上传组件
  支持大文件分片上传、断点续传、暂停恢复、拖拽上传等功能
-->
<template>
    <div class="chunk-uploader">
        <!-- ========== 文件选择区域 ========== -->
        <!-- 仅在空闲状态显示 -->
        <div v-if="status === UploadStatus.IDLE" class="upload-trigger" :class="{ disabled, dragging: isDragging }"
            @click="triggerSelect" @dragover.prevent="isDragging = !disabled" @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop">
            <!-- 隐藏的文件输入框 -->
            <input ref="inputRef" type="file" class="upload-input" :accept="accept" :disabled="disabled"
                @change="onFileChange" />

            <!-- 上传触发器插槽，可自定义 -->
            <slot name="trigger">
                <!-- 默认上传图标 -->
                <div class="upload-icon">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M544 864V672h128L512 480 352 672h128v192H320V672H192l320-320 320 320H704v192h-160zM512 96l448 448H768v384H256V544H64L512 96z"
                            fill="currentColor" />
                    </svg>
                </div>
                <!-- 上传提示文本 -->
                <div class="upload-text">
                    <span>点击或拖拽文件到此处上传</span>
                    <!-- 如果设置了大小限制，显示提示 -->
                    <span v-if="maxSize" class="upload-hint">最大支持 {{ formatSize(maxSize) }}</span>
                </div>
            </slot>
        </div>

        <!-- ========== 上传进度区域 ========== -->
        <!-- 在非空闲状态显示（准备中、上传中、暂停、成功、失败） -->
        <div v-else class="upload-progress">
            <!-- 文件信息展示 -->
            <div class="file-info">
                <!-- 文件图标 -->
                <div class="file-icon">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7z"
                            fill="#1989fa" />
                    </svg>
                </div>
                <!-- 文件详情 -->
                <div class="file-detail">
                    <div class="file-name">{{ currentFile?.name }}</div>
                    <div class="file-size">{{ formatSize(currentFile?.size || 0) }}</div>
                </div>
            </div>

            <!-- 进度条（使用 Vant 组件） -->
            <van-progress :percentage="progress" :stroke-width="8" :show-pivot="false" :color="progressColor"
                track-color="#ebedf0" />

            <!-- 进度信息 -->
            <div class="progress-info">
                <span class="progress-text">{{ STATUS_TEXT[status] }}</span>
                <span class="progress-percent">{{ progress }}%</span>
            </div>

            <!-- 操作按钮区域 -->
            <div class="upload-actions">
                <!-- 上传中：显示暂停和取消按钮 -->
                <template v-if="status === UploadStatus.UPLOADING">
                    <van-button size="small" @click="pause">暂停</van-button>
                    <van-button size="small" type="danger" @click="cancel">取消</van-button>
                </template>

                <!-- 已暂停：显示继续和取消按钮 -->
                <template v-else-if="status === UploadStatus.PAUSED">
                    <van-button size="small" type="primary" @click="onResume">继续</van-button>
                    <van-button size="small" type="danger" @click="cancel">取消</van-button>
                </template>

                <!-- 上传成功：显示重新上传按钮 -->
                <template v-else-if="status === UploadStatus.SUCCESS">
                    <van-button size="small" type="primary" @click="cancel">重新上传</van-button>
                </template>

                <!-- 上传失败：显示重试和取消按钮 -->
                <template v-else-if="status === UploadStatus.ERROR">
                    <van-button size="small" type="primary" @click="onRetry">重试</van-button>
                    <van-button size="small" @click="cancel">取消</van-button>
                </template>
            </div>

            <!-- 错误信息展示 -->
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>
    </div>
</template>

<!--
  分片上传组件脚本部分
  提供文件选择、拖拽上传、进度展示、暂停恢复等功能
-->
<script setup>
import { ref, computed, watch } from 'vue'
import { useChunkUpload, UploadStatus } from './useChunkUpload.js'

// ========== Props 定义 ==========
const props = defineProps({
    /** 分片上传接口地址（必填） */
    action: { type: String, required: true },
    /** 检查已上传分片接口地址 */
    checkAction: { type: String, default: '' },
    /** 合并分片接口地址 */
    mergeAction: { type: String, default: '' },
    /** 分片大小（字节），默认 2MB */
    chunkSize: { type: Number, default: 2 * 1024 * 1024 },
    /** 并发上传数，默认 3 */
    concurrency: { type: Number, default: 3 },
    /** 自定义请求头 */
    headers: { type: Object, default: () => ({}) },
    /** 额外的表单数据 */
    data: { type: Object, default: () => ({}) },
    /** 文件大小限制（字节），0 表示不限制 */
    maxSize: { type: Number, default: 0 },
    /** 接受的文件类型，如 'image/*' */
    accept: { type: String, default: '' },
    /** 是否禁用 */
    disabled: { type: Boolean, default: false },
    /** 是否自动上传 */
    autoUpload: { type: Boolean, default: true },
    /** 是否启用持久化（断点续传） */
    persistent: { type: Boolean, default: false }
})

// ========== Events 定义 ==========
const emit = defineEmits([
    'select',        // 文件选择事件
    'progress',      // 进度更新事件
    'success',       // 上传成功事件
    'error',         // 上传失败事件
    'status-change', // 状态变更事件
    'exceed-size'    // 超出大小限制事件
])

// ========== 状态文本映射 ==========
const STATUS_TEXT = {
    [UploadStatus.IDLE]: '等待上传',
    [UploadStatus.PENDING]: '准备中...',
    [UploadStatus.UPLOADING]: '上传中...',
    [UploadStatus.PAUSED]: '已暂停',
    [UploadStatus.SUCCESS]: '上传成功',
    [UploadStatus.ERROR]: '上传失败'
}

// ========== 使用分片上传 Hook ==========
const {
    status,              // 上传状态
    progress,            // 上传进度
    currentFile,         // 当前文件
    errorMessage,        // 错误信息
    needReselect,        // 是否需要重新选择文件
    startUpload,         // 开始上传
    pause,               // 暂停上传
    resume,              // 恢复上传
    cancel,              // 取消上传
    retry,               // 重试上传
    resumeFromStorage,   // 从存储恢复
    continueWithFile,    // 继续上传（大文件）
    getPendingTasks      // 获取待处理任务
} = useChunkUpload(props)

// ========== 本地状态 ==========
/** 文件输入框引用 */
const inputRef = ref(null)
/** 是否正在拖拽 */
const isDragging = ref(false)

// ========== 计算属性 ==========
/**
 * 进度条颜色
 * 根据上传状态返回不同颜色
 */
const progressColor = computed(() => {
    const colors = {
        [UploadStatus.SUCCESS]: '#07c160',  // 成功：绿色
        [UploadStatus.ERROR]: '#ee0a24'     // 失败：红色
    }
    return colors[status.value] || '#1989fa'  // 默认：蓝色
})

// ========== 监听器 ==========
/** 监听状态变化，触发事件 */
watch(status, (v) => emit('status-change', v))
/** 监听进度变化，触发事件 */
watch(progress, (v) => emit('progress', { progress: v, file: currentFile.value }))

// ========== 工具函数 ==========
/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的大小字符串
 */
const formatSize = (bytes) => {
    if (!bytes) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let i = 0, size = bytes
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024
        i++
    }
    return `${size.toFixed(2)} ${units[i]}`
}

/**
 * 触发文件选择
 * 点击上传区域时调用
 */
const triggerSelect = () => !props.disabled && inputRef.value?.click()

/**
 * 处理文件
 * 检查文件大小，触发事件，自动上传
 * @param {File} file - 选择的文件
 */
const processFile = async (file) => {
    // 检查文件大小限制
    if (props.maxSize && file.size > props.maxSize) {
        emit('exceed-size', { file, maxSize: props.maxSize })
        return
    }

    // 触发文件选择事件
    emit('select', file)

    // 如果启用自动上传，开始上传
    if (props.autoUpload) {
        try {
            const result = await startUpload(file)
            // 上传成功且未暂停，触发成功事件
            if (result && !result.paused) emit('success', result)
        } catch (e) {
            emit('error', e)
        }
    }
}

/**
 * 文件输入框变化事件
 * @param {Event} e - 输入事件
 */
const onFileChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''  // 清空输入框，允许重复选择同一文件
    if (file) processFile(file)
}

/**
 * 拖拽放置事件
 * @param {DragEvent} e - 拖拽事件
 */
const onDrop = (e) => {
    isDragging.value = false
    if (!props.disabled) {
        const file = e.dataTransfer?.files?.[0]
        if (file) processFile(file)
    }
}

/**
 * 恢复上传按钮点击事件
 */
const onResume = async () => {
    try {
        const result = await resume()
        if (result) emit('success', result)
    } catch (e) {
        emit('error', e)
    }
}

/**
 * 重试上传按钮点击事件
 */
const onRetry = async () => {
    try {
        const result = await retry()
        if (result) emit('success', result)
    } catch (e) {
        emit('error', e)
    }
}

// ========== 暴露给父组件的方法和属性 ==========
defineExpose({
    startUpload,         // 开始上传
    pause,               // 暂停上传
    resume,              // 恢复上传
    cancel,              // 取消上传
    retry,               // 重试上传
    resumeFromStorage,   // 从存储恢复
    continueWithFile,    // 继续上传（大文件）
    getPendingTasks,     // 获取待处理任务
    status,              // 当前状态
    progress,            // 当前进度
    needReselect         // 是否需要重新选择文件
})
</script>

<!--
  样式部分
  定义组件的视觉样式
-->
<style scoped lang="scss">
/* 组件容器 */
.chunk-uploader {
    width: 100%;
}

/* 上传触发区域 */
.upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    border: 2px dashed #dcdee0;
    border-radius: 8px;
    background: #fafafa;
    cursor: pointer;
    transition: all 0.2s;

    /* 激活状态（点击或拖拽） */
    &:active,
    &.dragging {
        border-color: #1989fa;
        background: #e8f4ff;
    }

    /* 禁用状态 */
    &.disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}

/* 隐藏的文件输入框 */
.upload-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
}

/* 上传图标 */
.upload-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 12px;
    color: #969799;

    svg {
        width: 100%;
        height: 100%;
    }
}

/* 上传提示文本 */
.upload-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #646566;
}

/* 上传提示（大小限制） */
.upload-hint {
    font-size: 12px;
    color: #969799;
}

/* 上传进度容器 */
.upload-progress {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #ebedf0;
}

/* 文件信息区域 */
.file-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

/* 文件图标 */
.file-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    svg {
        width: 100%;
        height: 100%;
    }
}

/* 文件详情 */
.file-detail {
    flex: 1;
    min-width: 0;
}

/* 文件名 */
.file-name {
    font-size: 14px;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 文件大小 */
.file-size {
    font-size: 12px;
    color: #969799;
    margin-top: 2px;
}

/* 进度信息 */
.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    font-size: 12px;
}

/* 进度文本 */
.progress-text {
    color: #646566;
}

/* 进度百分比 */
.progress-percent {
    color: #1989fa;
    font-weight: 500;
}

/* 操作按钮区域 */
.upload-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
}

/* 错误信息 */
.error-message {
    margin-top: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: #ee0a24;
    background: #fff1f0;
    border-radius: 4px;
}
</style>
