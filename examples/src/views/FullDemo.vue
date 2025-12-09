<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="完整示例" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
            <Thinking v-if="isThinking" :avatar="'https://img.yzcdn.cn/vant/cat.jpeg'" text="思考中" :show-timer="true" />
            <Typing v-else-if="isTyping" :avatar="'https://img.yzcdn.cn/vant/cat.jpeg'" text="输入中" />
        </template>

        <template #composer>
            <Composer :quick-replies="quickReplies" @send="handleSend" @upload="handleUpload"
                @upload-error="handleUploadError" />
        </template>
    </Chat>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { Chat, Message, Composer, Typing, Thinking, useAutoScroll } from '../../../packages/src/index.js'

const router = useRouter()

const now = new Date()
const hours = now.getHours().toString().padStart(2, '0')
const minutes = now.getMinutes().toString().padStart(2, '0')
const seconds = now.getSeconds().toString().padStart(2, '0')
const timeStr = `${hours}:${minutes}:${seconds}`

const messages = ref([
    {
        _id: '1',
        type: 'system',
        content: `欢迎使用 ChatVant ${timeStr}`
    },
    {
        _id: '2',
        type: 'text',
        content: '你好！我是智能助手，有什么可以帮你的吗？',
        position: 'left',
        user: {
            avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
            name: 'AI助手'
        }
    }
])

const currentUser = {
    avatar: 'https://img.yzcdn.cn/vant/logo.png',
    name: '我'
}

const quickReplies = ref([
    { text: '联系人工服务', icon: 'service-o' },
    { text: '短语1' },
    { text: '短语2' },
    { text: '短语3' }
])

const chatRef = ref(null)
let autoScrollInstance = null
const isThinking = ref(false)
const isTyping = ref(false)

onMounted(() => {
    nextTick(() => {
        if (chatRef.value && chatRef.value.scrollRef) {
            autoScrollInstance = useAutoScroll(chatRef.value.scrollRef, messages)
            setTimeout(() => {
                if (autoScrollInstance) {
                    autoScrollInstance.scrollToBottom(false)
                }
            }, 100)
        }
    })
})

onBeforeUnmount(() => {
    if (autoScrollInstance && autoScrollInstance.cleanup) {
        autoScrollInstance.cleanup()
    }
})

const handleSend = (text) => {
    const userMsg = {
        _id: `${Date.now()}_${Math.random()}`,
        type: 'text',
        content: text,
        position: 'right',
        user: currentUser
    }
    messages.value.push(userMsg)

    isThinking.value = true

    const thinkingDelay = 1000 + Math.random() * 1000
    setTimeout(() => {
        isThinking.value = false
        isTyping.value = true

        const typingDelay = 500 + Math.random() * 500
        setTimeout(() => {
            isTyping.value = false

            const isImageReply = Math.random() > 0.7

            if (isImageReply) {
                const botMsg = {
                    _id: `${Date.now()}_${Math.random()}`,
                    type: 'image',
                    content: 'https://img.yzcdn.cn/vant/cat.jpeg',
                    position: 'left',
                    user: {
                        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
                        name: 'AI助手'
                    }
                }
                messages.value.push(botMsg)
            } else {
                const botMsg = {
                    _id: `${Date.now()}_${Math.random()}`,
                    type: 'text',
                    content: `收到你的消息: "${text}"`,
                    position: 'left',
                    typing: true,
                    typingSpeed: 50,
                    user: {
                        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
                        name: 'AI助手'
                    }
                }
                messages.value.push(botMsg)
            }
        }, typingDelay)
    }, thinkingDelay)
}

const handleUpload = (files) => {
    files.forEach((file) => {
        const isImage = file.type.startsWith('image/')

        if (isImage) {
            const imageUrl = URL.createObjectURL(file)

            const imageMsg = {
                _id: `${Date.now()}_${Math.random()}`,
                type: 'image',
                content: imageUrl,
                position: 'right',
                user: currentUser
            }
            messages.value.push(imageMsg)

            showToast({
                message: `图片上传成功`,
                position: 'top',
                duration: 1500
            })
        } else {
            const fileSizeKB = (file.size / 1024).toFixed(2)
            const fileSizeMB = (file.size / 1024 / 1024).toFixed(2)
            const sizeText = file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`

            const fileUrl = URL.createObjectURL(file)

            const fileMsg = {
                _id: `${Date.now()}_${Math.random()}`,
                type: 'file',
                position: 'right',
                user: currentUser,
                file: {
                    name: file.name,
                    size: sizeText,
                    url: fileUrl,
                    downloadable: true
                }
            }
            messages.value.push(fileMsg)

            showToast({
                message: `文档上传成功`,
                position: 'top',
                duration: 1500
            })
        }
    })

    isThinking.value = true

    const thinkingDelay = 1000 + Math.random() * 1000
    setTimeout(() => {
        isThinking.value = false
        isTyping.value = true

        setTimeout(() => {
            isTyping.value = false

            const botMsg = {
                _id: `${Date.now()}_${Math.random()}`,
                type: 'text',
                content: `已收到 ${files.length} 个文件`,
                position: 'left',
                typing: true,
                typingSpeed: 50,
                user: {
                    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
                    name: 'AI助手'
                }
            }
            messages.value.push(botMsg)
        }, 500)
    }, thinkingDelay)
}

const handleUploadError = (error) => {
    if (error.type === 'size') {
        const maxSizeMB = (error.maxSize / 1024 / 1024).toFixed(0)
        const fileNames = error.files.map(f => f.name).join(', ')

        showToast({
            message: `文件大小不能超过 ${maxSizeMB}MB\n${fileNames}`,
            position: 'top',
            duration: 3000
        })
    }
}

const goBack = () => {
    router.back()
}
</script>
