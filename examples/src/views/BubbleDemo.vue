<template>
    <div class="demo-page">
        <Navbar title="Bubble 气泡" @back="$router.back()" />

        <div class="demo-content">
            <div class="demo-section">
                <h3>基础用法</h3>
                <div class="message-row">
                    <Bubble>这是一个基础的气泡消息</Bubble>
                </div>
                <div class="message-row message-row--right">
                    <Bubble position="right">这是右侧的气泡消息</Bubble>
                </div>
            </div>

            <div class="demo-section">
                <h3>不同类型</h3>
                <div class="message-row">
                    <Bubble type="text">文本类型气泡</Bubble>
                </div>
                <div class="message-row">
                    <Bubble type="card">
                        <div style="padding: 8px;">
                            <h4 style="margin: 0 0 8px;">卡片标题</h4>
                            <p style="margin: 0; color: #666;">这是卡片内容</p>
                        </div>
                    </Bubble>
                </div>
                <div class="message-row">
                    <Bubble type="image">
                        <img src="https://via.placeholder.com/200x150" alt="示例图片"
                            style="display: block; border-radius: 4px;">
                    </Bubble>
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义颜色</h3>
                <div class="message-row">
                    <Bubble bg-color="#e8f5e9" text-color="#2e7d32">
                        自定义背景和文字颜色
                    </Bubble>
                </div>
                <div class="message-row message-row--right">
                    <Bubble position="right" bg-color="#1976d2" text-color="#fff">
                        蓝色主题气泡
                    </Bubble>
                </div>
            </div>

            <div class="demo-section">
                <h3>无箭头</h3>
                <div class="message-row">
                    <Bubble :arrow="false">没有箭头的气泡</Bubble>
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义内容</h3>
                <div class="message-row">
                    <Bubble type="custom">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 24px;">🎉</span>
                            <div>
                                <div style="font-weight: bold;">恭喜你！</div>
                                <div style="font-size: 12px; color: #999;">完成了今日目标</div>
                            </div>
                        </div>
                    </Bubble>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Bubble, Navbar } from '../../../packages/src/index.js'
import { useRouter } from 'vue-router'

export default {
    name: 'BubbleDemo',
    components: {
        Bubble,
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

.message-row {
    display: flex;
    margin-bottom: 12px;
}

.message-row--right {
    justify-content: flex-end;
}
</style>
