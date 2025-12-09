<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="表情选择" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
        </template>

        <template #composer>
            <Composer @send="handleSend" :show-emoji="true" />
        </template>
    </Chat>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, Message, Composer, useAutoScroll } from '../../../packages/src/index.js'

const router = useRouter()
const chatRef = ref(null)

const messages = ref([
    {
        _id: '1',
        type: 'system',
        content: '点击表情按钮选择 Emoji'
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

    setTimeout(() => {
        messages.value.push({
            _id: `${Date.now()}_${Math.random()}`,
            type: 'text',
            content: `收到你的消息: ${text}`,
            position: 'left',
            user: {
                avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
                name: 'AI助手'
            }
        })
    }, 1000)
}

const goBack = () => {
    router.back()
}
</script>
