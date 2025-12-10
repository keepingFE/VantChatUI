<template>
    <div class="chunk-uploader">
        <!-- 文件选择区域 -->
        <div v-if="status === UploadStatus.IDLE" class="upload-trigger" :class="{ disabled, dragging: isDragging }"
            @click="triggerSelect" @dragover.prevent="isDragging = !disabled" @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop">
            <input ref="inputRef" type="file" class="upload-input" :accept="accept" :disabled="disabled"
                @change="onFileChange" />
            <slot name="trigger">
                <div class="upload-icon">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M544 864V672h128L512 480 352 672h128v192H320V672H192l320-320 320 320H704v192h-160zM512 96l448 448H768v384H256V544H64L512 96z"
                            fill="currentColor" />
                    </svg>
                </div>
                <div class="upload-text">
                    <span>点击或拖拽文件到此处上传</span>
                    <span v-if="maxSize" class="upload-hint">最大支持 {{ formatSize(maxSize) }}</span>
                </div>
            </slot>
        </div>

        <!-- 上传进度区域 -->
        <div v-else class="upload-progress">
            <div class="file-info">
                <div class="file-icon">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7z"
                            fill="#1989fa" />
                    </svg>
                </div>
                <div class="file-detail">
                    <div class="file-name">{{ currentFile?.name }}</div>
                    <div class="file-size">{{ formatSize(currentFile?.size || 0) }}</div>
                </div>
            </div>

            <van-progress :percentage="progress" :stroke-width="8" :show-pivot="false" :color="progressColor"
                track-color="#ebedf0" />

            <div class="progress-info">
                <span class="progress-text">{{ STATUS_TEXT[status] }}</span>
                <span class="progress-percent">{{ progress }}%</span>
            </div>

            <div class="upload-actions">
                <template v-if="status === UploadStatus.UPLOADING">
                    <van-button size="small" @click="pause">暂停</van-button>
                    <van-button size="small" type="danger" @click="cancel">取消</van-button>
                </template>
                <template v-else-if="status === UploadStatus.PAUSED">
                    <van-button size="small" type="primary" @click="onResume">继续</van-button>
                    <van-button size="small" type="danger" @click="cancel">取消</van-button>
                </template>
                <template v-else-if="status === UploadStatus.SUCCESS">
                    <van-button size="small" type="primary" @click="cancel">重新上传</van-button>
                </template>
                <template v-else-if="status === UploadStatus.ERROR">
                    <van-button size="small" type="primary" @click="onRetry">重试</van-button>
                    <van-button size="small" @click="cancel">取消</van-button>
                </template>
            </div>

            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useChunkUpload, UploadStatus } from './useChunkUpload.js'

const props = defineProps({
    action: { type: String, required: true },
    checkAction: { type: String, default: '' },
    mergeAction: { type: String, default: '' },
    chunkSize: { type: Number, default: 2 * 1024 * 1024 },
    concurrency: { type: Number, default: 3 },
    headers: { type: Object, default: () => ({}) },
    data: { type: Object, default: () => ({}) },
    maxSize: { type: Number, default: 0 },
    accept: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    autoUpload: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'progress', 'success', 'error', 'status-change', 'exceed-size'])

const STATUS_TEXT = {
    [UploadStatus.IDLE]: '等待上传',
    [UploadStatus.PENDING]: '准备中...',
    [UploadStatus.UPLOADING]: '上传中...',
    [UploadStatus.PAUSED]: '已暂停',
    [UploadStatus.SUCCESS]: '上传成功',
    [UploadStatus.ERROR]: '上传失败'
}

const {
    status, progress, currentFile, errorMessage, needReselect,
    startUpload, pause, resume, cancel, retry, resumeFromStorage, continueWithFile, getPendingTasks
} = useChunkUpload(props)

const inputRef = ref(null)
const isDragging = ref(false)

const progressColor = computed(() => {
    const colors = { [UploadStatus.SUCCESS]: '#07c160', [UploadStatus.ERROR]: '#ee0a24' }
    return colors[status.value] || '#1989fa'
})

watch(status, (v) => emit('status-change', v))
watch(progress, (v) => emit('progress', { progress: v, file: currentFile.value }))

const formatSize = (bytes) => {
    if (!bytes) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let i = 0, size = bytes
    while (size >= 1024 && i < units.length - 1) { size /= 1024; i++ }
    return `${size.toFixed(2)} ${units[i]}`
}

const triggerSelect = () => !props.disabled && inputRef.value?.click()

const processFile = async (file) => {
    if (props.maxSize && file.size > props.maxSize) {
        emit('exceed-size', { file, maxSize: props.maxSize })
        return
    }
    emit('select', file)
    if (props.autoUpload) {
        try {
            const result = await startUpload(file)
            if (result && !result.paused) emit('success', result)
        } catch (e) {
            emit('error', e)
        }
    }
}

const onFileChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) processFile(file)
}

const onDrop = (e) => {
    isDragging.value = false
    if (!props.disabled) {
        const file = e.dataTransfer?.files?.[0]
        if (file) processFile(file)
    }
}

const onResume = async () => {
    try {
        const result = await resume()
        if (result) emit('success', result)
    } catch (e) {
        emit('error', e)
    }
}

const onRetry = async () => {
    try {
        const result = await retry()
        if (result) emit('success', result)
    } catch (e) {
        emit('error', e)
    }
}

defineExpose({ startUpload, pause, resume, cancel, retry, resumeFromStorage, continueWithFile, getPendingTasks, status, progress, needReselect })
</script>


<style scoped lang="scss">
.chunk-uploader {
    width: 100%;
}

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

    &:active,
    &.dragging {
        border-color: #1989fa;
        background: #e8f4ff;
    }

    &.disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}

.upload-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
}

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

.upload-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #646566;
}

.upload-hint {
    font-size: 12px;
    color: #969799;
}

.upload-progress {
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #ebedf0;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.file-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    svg {
        width: 100%;
        height: 100%;
    }
}

.file-detail {
    flex: 1;
    min-width: 0;
}

.file-name {
    font-size: 14px;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-size {
    font-size: 12px;
    color: #969799;
    margin-top: 2px;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    font-size: 12px;
}

.progress-text {
    color: #646566;
}

.progress-percent {
    color: #1989fa;
    font-weight: 500;
}

.upload-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
}

.error-message {
    margin-top: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: #ee0a24;
    background: #fff1f0;
    border-radius: 4px;
}
</style>
