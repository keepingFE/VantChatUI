<template>
    <div class="demo-page">
        <Navbar title="ScrollView 滚动视图" @back="$router.back()" />

        <div class="demo-content">
            <div class="demo-section">
                <h3>基础滚动</h3>
                <ScrollView style="height: 300px; border: 1px solid #ebedf0; border-radius: 8px;">
                    <div v-for="i in 20" :key="i" class="scroll-item">
                        消息 {{ i }}
                    </div>
                </ScrollView>
            </div>

            <div class="demo-section">
                <h3>下拉刷新</h3>
                <ScrollView pull-refresh style="height: 300px; border: 1px solid #ebedf0; border-radius: 8px;"
                    @refresh="handleRefresh">
                    <div v-for="item in refreshList" :key="item" class="scroll-item">
                        {{ item }}
                    </div>
                </ScrollView>
            </div>

            <div class="demo-section">
                <h3>上拉加载更多</h3>
                <ScrollView load-more :has-more="hasMore"
                    style="height: 300px; border: 1px solid #ebedf0; border-radius: 8px;" @load-more="handleLoadMore">
                    <div v-for="item in loadMoreList" :key="item" class="scroll-item">
                        {{ item }}
                    </div>
                </ScrollView>
            </div>

            <div class="demo-section">
                <h3>下拉刷新 + 上拉加载</h3>
                <ScrollView pull-refresh load-more :has-more="hasMoreCombined"
                    style="height: 400px; border: 1px solid #ebedf0; border-radius: 8px;"
                    @refresh="handleRefreshCombined" @load-more="handleLoadMoreCombined">
                    <div v-for="item in combinedList" :key="item" class="scroll-item">
                        {{ item }}
                    </div>
                </ScrollView>
            </div>

            <div class="demo-section">
                <h3>聊天消息列表</h3>
                <ScrollView ref="chatScrollView"
                    style="height: 400px; border: 1px solid #ebedf0; border-radius: 8px; background: #f7f8fa;"
                    @scroll="handleScroll">
                    <div v-for="(msg, index) in chatMessages" :key="index" class="chat-message">
                        <div :class="['message-bubble', msg.position === 'right' ? 'message-bubble--right' : '']">
                            {{ msg.text }}
                        </div>
                    </div>
                </ScrollView>
                <div style="margin-top: 12px; display: flex; gap: 8px;">
                    <button @click="addMessage" class="demo-btn">发送消息</button>
                    <button @click="scrollToBottom" class="demo-btn">滚动到底部</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ScrollView, Navbar } from '../../../packages/src/index.js'
import { useRouter } from 'vue-router'

export default {
    name: 'ScrollViewDemo',
    components: {
        ScrollView,
        Navbar
    },
    setup() {
        const $router = useRouter();
        return { $router };
    },
    data() {
        return {
            refreshList: Array.from({ length: 10 }, (_, i) => `消息 ${i + 1}`),
            loadMoreList: Array.from({ length: 10 }, (_, i) => `消息 ${i + 1}`),
            hasMore: true,
            combinedList: Array.from({ length: 15 }, (_, i) => `消息 ${i + 1}`),
            hasMoreCombined: true,
            chatMessages: [
                { text: '你好！', position: 'left' },
                { text: '你好，有什么可以帮你的吗？', position: 'right' },
                { text: '我想了解一下产品信息', position: 'left' },
                { text: '好的，我来为你介绍', position: 'right' }
            ]
        }
    },
    methods: {
        async handleRefresh() {
            await new Promise(resolve => setTimeout(resolve, 1000))
            this.refreshList = [
                `新消息 ${Date.now()}`,
                ...this.refreshList
            ]
        },

        async handleLoadMore() {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const currentLength = this.loadMoreList.length
            const newItems = Array.from({ length: 10 }, (_, i) => `消息 ${currentLength + i + 1}`)
            this.loadMoreList.push(...newItems)

            if (this.loadMoreList.length >= 50) {
                this.hasMore = false
            }
        },

        async handleRefreshCombined() {
            await new Promise(resolve => setTimeout(resolve, 1000))
            this.combinedList = [
                `新消息 ${Date.now()}`,
                ...this.combinedList
            ]
        },

        async handleLoadMoreCombined() {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const currentLength = this.combinedList.length
            const newItems = Array.from({ length: 10 }, (_, i) => `消息 ${currentLength + i + 1}`)
            this.combinedList.push(...newItems)

            if (this.combinedList.length >= 50) {
                this.hasMoreCombined = false
            }
        },

        handleScroll({ scrollTop, scrollHeight, clientHeight }) {
            console.log('滚动位置:', { scrollTop, scrollHeight, clientHeight })
        },

        addMessage() {
            const isRight = this.chatMessages.length % 2 === 0
            this.chatMessages.push({
                text: `新消息 ${this.chatMessages.length + 1}`,
                position: isRight ? 'right' : 'left'
            })
            this.$nextTick(() => {
                this.scrollToBottom()
            })
        },

        scrollToBottom() {
            this.$refs.chatScrollView?.scrollToBottom()
        }
    }
}
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f7f8fa;
}

.demo-content {
    padding: 56px 20px 40px;
    max-width: 800px;
    margin: 0 auto;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
}

.demo-content::-webkit-scrollbar {
    width: 6px;
}

.demo-content::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 3px;
}

.demo-content::-webkit-scrollbar-track {
    background-color: transparent;
}

.demo-section {
    margin-bottom: 30px;
}

.demo-section h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #323233;
}

.scroll-item {
    padding: 16px;
    border-bottom: 1px solid #ebedf0;
}

.scroll-item:last-child {
    border-bottom: none;
}

.chat-message {
    padding: 8px 16px;
}

.message-bubble {
    display: inline-block;
    max-width: 70%;
    padding: 10px 12px;
    background: white;
    border-radius: 8px;
    word-wrap: break-word;
}

.message-bubble--right {
    float: right;
    background: #07c160;
    color: white;
}

.demo-btn {
    padding: 8px 16px;
    background: #1989fa;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.demo-btn:hover {
    opacity: 0.8;
}
</style>
