<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="FileCard 文件卡片" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <FileCard fileName="myFile.zip" fileSize="12.06 KB" @click="handleFileClick" />
            </div>

            <div class="demo-section">
                <div class="section-title">指定拓展名</div>
                <FileCard fileName="myFile.zip" fileSize="12.06 KB" extension="PDF" @click="handleFileClick" />
            </div>

            <div class="demo-section">
                <div class="section-title">额外内容</div>
                <FileCard fileName="myFile.zip" fileSize="12.06 KB" :downloadable="true" fileUrl="#"
                    @click="handleFileClick" @download="handleDownload" />
            </div>

            <div class="demo-section">
                <div class="section-title">不同文件类型</div>
                <div class="file-list">
                    <FileCard v-for="file in fileList" :key="file.name" :fileName="file.name" :fileSize="file.size"
                        :downloadable="file.downloadable" @click="handleFileClick" @download="handleDownload" />
                </div>
            </div>
        </template>

        <template #composer>
            <Composer @send="handleSend" />
        </template>
    </Chat>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, Composer, FileCard } from '../../../packages/src/index.js'
import { showToast } from 'vant'

const router = useRouter()
const chatRef = ref(null)

const fileList = [
    { name: 'document.pdf', size: '2.5 MB', downloadable: true },
    { name: 'report.docx', size: '1.2 MB', downloadable: false },
    { name: 'data.xlsx', size: '856 KB', downloadable: true },
    { name: 'presentation.pptx', size: '5.3 MB', downloadable: false },
    { name: 'archive.zip', size: '12.06 KB', downloadable: true },
    { name: 'notes.txt', size: '45 KB', downloadable: false }
]

const handleFileClick = () => {
    showToast('文件卡片被点击')
}

const handleDownload = () => {
    showToast('开始下载文件')
}

const handleSend = (text) => {
    console.log('发送消息:', text)
}

const goBack = () => {
    router.back()
}
</script>

<style scoped lang="scss">
.demo-section {
    padding: 16px;
    background: #f7f8fa;
    margin-bottom: 8px;
}

.section-title {
    font-size: 14px;
    color: #969799;
    margin-bottom: 12px;
}

.file-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
</style>
