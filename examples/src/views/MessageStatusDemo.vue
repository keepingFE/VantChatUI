<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="MessageStatus 消息状态" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <div class="demo-section">
                <div class="section-title">基础用法（0.8秒后出 loading，12秒后失败）</div>
                <div class="status-demo-item">
                    <MessageStatus :status="currentStatus" />
                </div>
            </div>

            <div class="demo-section">
                <div class="section-title">发送成功</div>
                <div class="status-demo-item">
                    <MessageStatus status="success" />
                </div>
            </div>

            <div class="demo-section">
                <div class="section-title">发送成功</div>
                <div class="status-demo-item">
                    <MessageStatus status="success" />
                </div>
            </div>

            <div class="demo-section">
                <div class="section-title">发送失败</div>
                <div class="status-demo-item">
                    <MessageStatus status="failed" />
                </div>
            </div>
        </template>

        <template #composer>
            <Composer @send="handleSend" />
        </template>
    </Chat>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, Composer, MessageStatus } from '../../../packages/src/index.js'

const router = useRouter()
const chatRef = ref(null)
const currentStatus = ref('loading')

let timer1 = null
let timer2 = null

onMounted(() => {
    // 0.8秒后显示 loading
    timer1 = setTimeout(() => {
        currentStatus.value = 'loading'
    }, 800)

    // 12秒后显示失败
    timer2 = setTimeout(() => {
        currentStatus.value = 'failed'
    }, 12000)
})

onUnmounted(() => {
    if (timer1) clearTimeout(timer1)
    if (timer2) clearTimeout(timer2)
})

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
    background: #ffffff;
    margin-bottom: 8px;
}

.section-title {
    font-size: 14px;
    color: #969799;
    margin-bottom: 12px;
}

.status-demo-item {
    padding: 8px 0;
}
</style>
