<!-- File: examples/src/views/ChunkUploaderDemo.vue -->
<template>
    <div class="demo-page">
        <van-nav-bar title="大文件上传" left-arrow @click-left="$router.back()" />

        <div class="demo-content">
            <van-cell-group title="基础用法">
                <div class="demo-block">
                    <ChunkUploader action="/api/upload/chunk" check-action="/api/upload/check"
                        merge-action="/api/upload/merge" :max-size="500 * 1024 * 1024" @select="onSelect"
                        @progress="onProgress" @success="onSuccess" @error="onError" @exceed-size="onExceedSize" />
                </div>
            </van-cell-group>

            <van-cell-group title="支持刷新续传（IndexedDB）">
                <div class="demo-block">
                    <ChunkUploader ref="persistentUploader" action="/api/upload/chunk" check-action="/api/upload/check"
                        merge-action="/api/upload/merge" persistent :max-size="1024 * 1024 * 1024" @success="onSuccess"
                        @error="onError" />
                    <van-button v-if="pendingTasks.length > 0" type="primary" size="small" block
                        style="margin-top: 12px" @click="resumePendingTask">
                        恢复上次未完成的上传 ({{ pendingTasks[0]?.fileName }})
                    </van-button>
                </div>
            </van-cell-group>

            <van-cell-group title="自定义分片大小">
                <div class="demo-block">
                    <ChunkUploader action="/api/upload/chunk" :chunk-size="5 * 1024 * 1024" :concurrency="5"
                        accept=".zip,.rar,.7z" />
                    <p class="demo-tip">分片大小: 5MB，并发数: 5，仅支持压缩包</p>
                </div>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { ChunkUploader } from 'chatvant'

const persistentUploader = ref(null)
const pendingTasks = ref([])

onMounted(async () => {
    // 检查是否有未完成的上传任务
    if (persistentUploader.value) {
        pendingTasks.value = await persistentUploader.value.getPendingTasks()
    }
})

const resumePendingTask = async () => {
    if (pendingTasks.value.length > 0) {
        try {
            await persistentUploader.value.resumeFromStorage(pendingTasks.value[0].id)
            pendingTasks.value = []
        } catch (e) {
            showToast('恢复失败: ' + e.message)
        }
    }
}

const onSelect = (file) => {
    console.log('选择文件:', file.name)
}

const onProgress = ({ progress, file }) => {
    console.log(`上传进度: ${progress}%`)
}

const onSuccess = (result) => {
    showToast('上传成功')
    console.log('上传结果:', result)
}

const onError = (error) => {
    showToast('上传失败: ' + error.message)
}

const onExceedSize = ({ file, maxSize }) => {
    showToast(`文件过大，最大支持 ${(maxSize / 1024 / 1024).toFixed(0)}MB`)
}
</script>

<style scoped lang="scss">
.demo-page {
    height: 100vh;
    background: #f7f8fa;
    overflow-y: auto;
    overflow-x: hidden;
}

.demo-content {
    padding-bottom: 20px;
}

.demo-block {
    padding: 16px;
    background: #fff;
}

.demo-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #969799;
}
</style>
