<template>
    <div class="demo-page">
        <Navbar title="Divider 分割线" @back="$router.back()" />

        <div class="demo-content">
            <div class="demo-section">
                <h3>基础用法</h3>
                <p>上方内容</p>
                <Divider />
                <p>下方内容</p>
            </div>

            <div class="demo-section">
                <h3>带文字的分割线</h3>
                <p>消息内容</p>
                <Divider text="2024年1月4日" />
                <p>消息内容</p>
            </div>

            <div class="demo-section">
                <h3>使用插槽</h3>
                <p>消息内容</p>
                <Divider>
                    <span style="color: #999;">以下是历史消息</span>
                </Divider>
                <p>历史消息内容</p>
            </div>

            <div class="demo-section">
                <h3>虚线分割</h3>
                <p>消息内容</p>
                <Divider type="dashed" text="更多消息" />
                <p>消息内容</p>
            </div>

            <div class="demo-section">
                <h3>垂直分割线</h3>
                <div style="display: flex; align-items: center;">
                    <span>选项1</span>
                    <Divider type="vertical" />
                    <span>选项2</span>
                    <Divider type="vertical" />
                    <span>选项3</span>
                </div>
            </div>

            <div class="demo-section">
                <h3>聊天场景示例</h3>
                <div class="chat-example">
                    <div class="message">你好，在吗？</div>
                    <Divider text="上午 10:30" />
                    <div class="message message--right">在的，有什么事吗？</div>
                    <div class="message">想问一下项目进度</div>
                    <Divider text="下午 2:15" />
                    <div class="message message--right">已经完成80%了</div>
                    <Divider>
                        <span style="color: #07c160; font-size: 12px;">✓ 以上消息已读</span>
                    </Divider>
                </div>
            </div>

            <div class="demo-section">
                <h3>时间分组</h3>
                <div class="chat-example">
                    <Divider text="今天" />
                    <div class="message">早上好</div>
                    <div class="message message--right">早上好</div>
                    <Divider text="昨天" />
                    <div class="message">晚安</div>
                    <div class="message message--right">晚安</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Divider, Navbar } from '../../../packages/src/index.js'
import { useRouter } from 'vue-router'

export default {
    name: 'DividerDemo',
    components: {
        Divider,
        Navbar
    },
    setup() {
        const $router = useRouter();
        return { $router };
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

.chat-example {
    padding: 16px;
    background: #f7f8fa;
    border-radius: 8px;
}

.message {
    padding: 10px 12px;
    margin-bottom: 8px;
    background: white;
    border-radius: 8px;
    max-width: 70%;
}

.message--right {
    margin-left: auto;
    background: #07c160;
    color: white;
}
</style>
