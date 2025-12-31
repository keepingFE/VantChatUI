<template>
    <div class="back-to-top-demo">
        <van-nav-bar title="BackToTop 返回顶部" left-arrow @click-left="$router.back()" fixed placeholder />

        <div class="demo-header">
            <h2>BackToTop 返回顶部</h2>
            <p>滚动页面后自动显示返回顶部按钮，点击平滑滚动到顶部</p>
        </div>

        <div class="demo-section">
            <h3>基础用法</h3>
            <p>向下滚动 200px 后显示返回顶部按钮</p>
            <div class="demo-tip">
                <van-icon name="info-o" />
                <span>向下滚动页面，右下角会出现返回顶部按钮</span>
            </div>
        </div>

        <div class="demo-section">
            <h3>功能特性</h3>
            <van-cell-group>
                <van-cell title="自动显示/隐藏" value="根据滚动距离控制" />
                <van-cell title="平滑滚动" value="点击后平滑返回顶部" />
                <van-cell title="自定义样式" value="支持颜色、大小、位置" />
                <van-cell title="自定义图标" value="支持插槽自定义内容" />
            </van-cell-group>
        </div>

        <div class="demo-section">
            <h3>自定义配置</h3>
            <van-cell-group>
                <van-cell title="显示阈值">
                    <template #value>
                        <van-stepper v-model="visibilityHeight" min="100" max="500" step="50" />
                    </template>
                </van-cell>
                <van-cell title="按钮颜色">
                    <template #value>
                        <div class="color-picker">
                            <div v-for="color in colors" :key="color" class="color-item"
                                :class="{ active: currentColor === color }" :style="{ backgroundColor: color }"
                                @click="currentColor = color" />
                        </div>
                    </template>
                </van-cell>
                <van-cell title="按钮大小">
                    <template #value>
                        <van-stepper v-model="buttonSize" min="40" max="70" step="5" />
                    </template>
                </van-cell>
            </van-cell-group>
        </div>

        <div class="demo-section">
            <h3>自定义图标示例</h3>
            <p>使用插槽自定义按钮内容</p>
            <van-cell-group>
                <van-cell title="默认箭头" value="↑" />
                <van-cell title="文字" value="TOP" />
                <van-cell title="图标" value="🚀" />
            </van-cell-group>
        </div>

        <div class="demo-section">
            <h3>事件日志</h3>
            <div class="log-list">
                <div v-if="logs.length === 0" class="log-empty">
                    暂无事件，点击返回顶部按钮试试
                </div>
                <div v-for="(log, index) in logs" :key="index" class="log-item">
                    <van-icon :name="log.icon" :color="log.color" />
                    <span>{{ log.text }}</span>
                    <span class="log-time">{{ log.time }}</span>
                </div>
            </div>
        </div>

        <!-- 占位内容，用于产生滚动 -->
        <div class="demo-section" v-for="i in 5" :key="i">
            <h3>占位内容 {{ i }}</h3>
            <p>这是一些占位内容，用于产生页面滚动效果。向下滚动查看返回顶部按钮的显示效果。</p>
            <van-cell-group>
                <van-cell v-for="j in 5" :key="j" :title="`列表项 ${j}`" :value="`内容 ${j}`" />
            </van-cell-group>
        </div>

        <!-- 返回顶部按钮 - 默认样式 -->
        <BackToTop target=".back-to-top-demo" :visibility-height="visibilityHeight" :background-color="currentColor"
            :size="buttonSize" @click="handleBackToTop" />

        <!-- 返回顶部按钮 - 自定义图标（文字） -->
        <BackToTop target=".back-to-top-demo" :visibility-height="visibilityHeight" background-color="#722ed1"
            :size="50" :right="20" :bottom="110" @click="handleBackToTopCustom('文字')">
            <div class="custom-icon">TOP</div>
        </BackToTop>

        <!-- 返回顶部按钮 - 自定义图标（emoji） -->
        <BackToTop target=".back-to-top-demo" :visibility-height="visibilityHeight" background-color="#ff6600"
            :size="50" :right="20" :bottom="180" @click="handleBackToTopCustom('Emoji')">
            <div class="custom-icon">🚀</div>
        </BackToTop>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import BackToTop from '../../../packages/src/components/BackToTop/index.vue';

const logs = ref([]);
const visibilityHeight = ref(200);
const currentColor = ref('#52c41a');
const buttonSize = ref(50);

const colors = ['#52c41a', '#1677ff', '#ff6600', '#722ed1', '#fa541c'];

const addLog = (text, icon = 'info-o', color = '#52c41a') => {
    const time = new Date().toLocaleTimeString();
    logs.value.unshift({ text, time, icon, color });
    if (logs.value.length > 20) {
        logs.value.pop();
    }
};

const handleBackToTop = () => {
    addLog('返回顶部 - 默认按钮', 'arrow-up', '#52c41a');
};

const handleBackToTopCustom = (type) => {
    addLog(`返回顶部 - ${type}按钮`, 'arrow-up', '#722ed1');
};
</script>

<style scoped lang="scss">
.back-to-top-demo {
    padding: 20px;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 80px;
    overflow-y: auto;
    max-height: 100vh;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;

        &:hover {
            background: #555;
        }
    }
}

.demo-header {
    margin-bottom: 24px;

    h2 {
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #333;
    }

    p {
        margin: 0;
        color: #666;
        font-size: 14px;
    }
}

.demo-section {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;

    h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: #333;
    }

    p {
        margin: 0 0 12px 0;
        color: #999;
        font-size: 14px;
    }
}

.demo-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    border-radius: 4px;
    color: #1677ff;
    font-size: 14px;
}

.color-picker {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
    padding: 6px;
}

.color-item {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
    flex-shrink: 0;

    &:hover {
        transform: scale(1.1);
    }

    &.active {
        border-color: #333;
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #333;
    }
}

.log-list {
    max-height: 300px;
    overflow-y: auto;
}

.log-empty {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-size: 14px;
}

.log-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #666;

    &:last-child {
        margin-bottom: 0;
    }

    span:first-of-type {
        flex: 1;
    }

    .log-time {
        font-size: 12px;
        color: #999;
    }
}

.custom-icon {
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
}

:deep(.van-cell__value) {
    display: flex;
    align-items: center;
}
</style>
