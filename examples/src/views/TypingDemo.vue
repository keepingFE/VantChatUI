<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="打字效果" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
            <Thinking v-if="isThinking" :avatar="'https://img.yzcdn.cn/vant/cat.jpeg'" text="思考中" :show-timer="true" />
            <Typing v-else-if="isTyping" :avatar="'https://img.yzcdn.cn/vant/cat.jpeg'" text="输入中" />
        </template>

        <template #composer>
            <Composer @send="handleSend" />
        </template>
    </Chat>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, Message, Composer, Typing, Thinking, useAutoScroll } from '../../../packages/src/index.js'

const router = useRouter()
const chatRef = ref(null)
const isThinking = ref(false)
const isTyping = ref(false)

const messages = ref([
    {
        _id: '1',
        type: 'system',
        content: '体验打字机效果和状态提示'
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

    isThinking.value = true

    setTimeout(() => {
        isThinking.value = false
        isTyping.value = true

        setTimeout(() => {
            isTyping.value = false
            messages.value.push({
                _id: `${Date.now()}_${Math.random()}`,
                type: 'text',
                content: `这是一条带有打字机效果的回复消息，可以看到文字逐个显示的效果。`,
                position: 'left',
                typing: true,
                typingSpeed: 50,
                user: {
                    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
                    name: 'AI助手'
                }
            })
        }, 800)
    }, 1500)
}

const goBack = () => {
    router.back()
}
</script>
