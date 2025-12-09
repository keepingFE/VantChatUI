<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="SystemMessage 系统消息" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <SystemMessage content="88VIP专属智能客服小蜜 为您服务" />
            </div>

            <div class="demo-section">
                <div class="section-title">操作按钮</div>
                <SystemMessage content="正在联系人工客服" actionText="取消" @action="handleCancel" />
            </div>

            <div class="demo-section">
                <div class="section-title">在消息流中使用</div>
                <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
            </div>
        </template>

        <template #composer>
            <Composer @send="handleSend" />
        </template>
    </Chat>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, Message, Composer, SystemMessage, useAutoScroll } from '../../../packages/src/index.js'

const router = useRouter()
const chatRef = ref(null)

const messages = ref([
    {
        _id: '1',
        type: 'text',
        content: '你好，我需要帮助',
        position: 'right',
        user: {
            avatar: 'https://img.yzcdn.cn/vant/logo.png',
            name: '我'
        }
    },
    {
        _id: '2',
        type: 'system',
        content: '88VIP专属智能客服小蜜 为您服务'
    },
    {
        _id: '3',
        type: 'text',
        content: '您好！我是智能客服小蜜，很高兴为您服务',
        position: 'left',
        user: {
            avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
            name: '客服小蜜'
        }
    },
    {
        _id: '4',
        type: 'text',
        content: '我想转人工客服',
        position: 'right',
        user: {
            avatar: 'https://img.yzcdn.cn/vant/logo.png',
            name: '我'
        }
    },
    {
        _id: '5',
        type: 'system',
        content: '正在为您转接人工客服，请稍候...'
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
            type: 'system',
            content: '系统提示：消息已发送'
        })
    }, 500)
}

const handleCancel = () => {
    console.log('取消操作')
    // 这里可以添加取消逻辑
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
    color: #323233;
    font-weight: 500;
    margin-bottom: 12px;
    padding-left: 8px;
    border-left: 3px solid #1989fa;
}
</style>
