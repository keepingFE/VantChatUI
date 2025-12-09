<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="文件上传" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
        </template>

        <template #composer>
            <Composer @send="handleSend" @upload="handleUpload" @upload-error="handleUploadError" />
        </template>
    </Chat>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { Chat, Message, Composer, useAutoScroll } from '../../../packages/src/index.js'

const router = useRouter()
const chatRef = ref(null)

const messages = ref([
    {
        _id: '1',
        type: 'system',
        content: '点击附件按钮上传图片或文档'
    }
])

const currentUser = {
    avatar: 'https://img.yzcdn.cn/vant/logo.png',
    name: '我'
}

onMounted(() => {
    nextTick(() => {
        if (chatRef.value?.scrollRef) {
            const autoScrollInstance = useAutoScroll(chatRef.value.scrollRef, messages)
            setTimeout(() => autoScrollInstance?.scrollToBottom(false), 100)
        }
    })
})

const handleSend = (text) => {
    messages.value.push({
        _id: `${Date.now()}_${Math.random()}`,
        type: 'text',
        content: text,
        position: 'right',
        user: currentUser
    })
}

const handleUpload = (files) => {
    files.forEach((file) => {
        const isImage = file.type.startsWith('image/')

        if (isImage) {
            const imageUrl = URL.createObjectURL(file)
            messages.value.push({
                _id: `${Date.now()}_${Math.random()}`,
                type: 'image',
                content: imageUrl,
                position: 'right',
                user: currentUser
            })
            showToast({ message: '图片上传成功', position: 'top' })
        } else {
            const fileSizeKB = (file.size / 1024).toFixed(2)
            const sizeText = file.size > 1024 * 1024
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                : `${fileSizeKB} KB`

            messages.value.push({
                _id: `${Date.now()}_${Math.random()}`,
                type: 'file',
                position: 'right',
                user: currentUser,
                file: {
                    name: file.name,
                    size: sizeText,
                    url: URL.createObjectURL(file),
                    downloadable: true
                }
            })
            showToast({ message: '文档上传成功', position: 'top' })
        }
    })
}

const handleUploadError = (error) => {
    if (error.type === 'size') {
        const maxSizeMB = (error.maxSize / 1024 / 1024).toFixed(0)
        showToast({ message: `文件大小不能超过 ${maxSizeMB}MB`, position: 'top' })
    }
}

const goBack = () => {
    router.back()
}
</script>
