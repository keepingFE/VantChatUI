<template>
    <div class="demo-page">
        <Navbar title="Toolbar 工具栏" @back="$router.back()" />

        <div class="demo-content">
            <div class="demo-section">
                <h3>底部工具栏</h3>
                <div class="demo-container">
                    <div class="demo-inner-content">
                        <p>页面内容区域</p>
                        <p>向下滚动查看底部工具栏</p>
                    </div>
                    <Toolbar position="bottom">
                        <button class="toolbar-btn">
                            <span>📷</span>
                        </button>
                        <button class="toolbar-btn">
                            <span>🎤</span>
                        </button>
                        <button class="toolbar-btn">
                            <span>📁</span>
                        </button>
                        <button class="toolbar-btn">
                            <span>😊</span>
                        </button>
                    </Toolbar>
                </div>
            </div>

            <div class="demo-section">
                <h3>顶部工具栏</h3>
                <div class="demo-container">
                    <Toolbar position="top">
                        <button class="toolbar-btn">
                            <span>⬅️</span>
                        </button>
                        <div style="flex: 1; text-align: center; font-weight: bold;">
                            聊天工具栏
                        </div>
                        <button class="toolbar-btn">
                            <span>⋮</span>
                        </button>
                    </Toolbar>
                    <div class="demo-inner-content" style="margin-top: 60px;">
                        <p>页面内容区域</p>
                    </div>
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义内容</h3>
                <div class="demo-container">
                    <div class="demo-inner-content">
                        <p>页面内容</p>
                    </div>
                    <Toolbar position="bottom">
                        <input type="text" placeholder="输入消息..."
                            style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 20px; outline: none;">
                        <button
                            style="margin-left: 8px; padding: 8px 16px; background: #07c160; color: white; border: none; border-radius: 20px; cursor: pointer;">
                            发送
                        </button>
                    </Toolbar>
                </div>
            </div>

            <div class="demo-section">
                <h3>图标工具栏</h3>
                <div class="demo-container">
                    <div class="demo-inner-content">
                        <p>页面内容</p>
                    </div>
                    <Toolbar position="bottom">
                        <div style="display: flex; width: 100%; justify-content: space-around;">
                            <button class="icon-btn">
                                <span style="font-size: 20px;">🏠</span>
                                <span style="font-size: 12px; display: block;">首页</span>
                            </button>
                            <button class="icon-btn">
                                <span style="font-size: 20px;">💬</span>
                                <span style="font-size: 12px; display: block;">消息</span>
                            </button>
                            <button class="icon-btn">
                                <span style="font-size: 20px;">👤</span>
                                <span style="font-size: 12px; display: block;">我的</span>
                            </button>
                        </div>
                    </Toolbar>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Toolbar, Navbar } from '../../../packages/src/index.js'
import { useRouter } from 'vue-router'

export default {
    name: 'ToolbarDemo',
    components: {
        Toolbar,
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
    margin-bottom: 40px;
}

.demo-section h3 {
    margin: 0 0 16px;
    font-size: 16px;
    color: #323233;
}

.demo-container {
    position: relative;
    height: 300px;
    border: 1px solid #ebedf0;
    border-radius: 8px;
    overflow: hidden;
}

.demo-inner-content {
    padding: 20px;
}

.toolbar-btn {
    padding: 8px 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 20px;
}

.toolbar-btn:hover {
    background: #f7f8fa;
    border-radius: 4px;
}

.icon-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
}

.icon-btn:hover {
    opacity: 0.7;
}
</style>
