<template>
    <div class="floating-button-demo">
        <van-nav-bar title="FloatingButton 悬浮按钮" left-arrow @click-left="$router.back()" fixed placeholder />

        <div class="demo-header">
            <h2>FloatingButton 悬浮按钮</h2>
            <p>可拖动的悬浮按钮，支持自动边缘吸附和自定义样式</p>
        </div>

        <div class="demo-section">
            <h3>基础用法</h3>
            <p>点击主按钮触发事件，默认位置在右侧中间</p>
            <div class="demo-tip">
                <van-icon name="info-o" />
                <span>点击右侧悬浮按钮查看效果，可拖动到不同位置</span>
            </div>
        </div>

        <div class="demo-section">
            <h3>智能边缘吸附</h3>
            <van-cell-group>
                <van-cell title="拖动按钮" value="松手后自动吸附到左右边缘" />
                <van-cell title="靠近左侧" value="吸附到左边缘" />
                <van-cell title="靠近右侧" value="吸附到右边缘" />
            </van-cell-group>
        </div>

        <div class="demo-section">
            <h3>功能特性</h3>
            <van-cell-group>
                <van-cell title="点击事件" value="点击主按钮触发" />
                <van-cell title="拖动移动" value="长按主按钮拖动" />
                <van-cell title="边缘吸附" value="自动吸附到左右边缘" />
                <van-cell title="自定义样式" value="支持样式和类名自定义" />
            </van-cell-group>
        </div>

        <div class="demo-section">
            <h3>自定义配置</h3>
            <van-cell-group>
                <van-cell title="主按钮颜色">
                    <template #value>
                        <div class="color-picker">
                            <div v-for="color in mainColors" :key="color" class="color-item"
                                :class="{ active: currentMainColor === color }" :style="{ backgroundColor: color }"
                                @click="currentMainColor = color" />
                        </div>
                    </template>
                </van-cell>
                <van-cell title="自定义样式">
                    <template #value>
                        <van-switch v-model="useCustomStyle" />
                    </template>
                </van-cell>
            </van-cell-group>
        </div>

        <div class="demo-section">
            <h3>返回顶部示例</h3>
            <p>固定在右下角的返回顶部按钮，点击滚动到页面顶部</p>
            <div class="demo-tip">
                <van-icon name="info-o" />
                <span>向下滚动页面，点击右下角的返回顶部按钮</span>
            </div>
        </div>

        <div class="demo-section">
            <h3>事件日志</h3>
            <div class="log-list">
                <div v-if="logs.length === 0" class="log-empty">
                    暂无事件，点击悬浮按钮试试
                </div>
                <div v-for="(log, index) in logs" :key="index" class="log-item">
                    <van-icon :name="log.icon" :color="log.color" />
                    <span>{{ log.text }}</span>
                    <span class="log-time">{{ log.time }}</span>
                </div>
            </div>
        </div>

        <!-- 悬浮按钮 -->
        <FloatingButton :background-color="currentMainColor" :main-button-style="useCustomStyle ? customMainStyle : {}"
            :main-button-class="useCustomStyle ? 'custom-main-button' : ''" @click="handleMainClick"
            @dragStart="handleDragStart" @dragEnd="handleDragEnd" />

        <!-- 返回顶部按钮 -->
        <BackToTop target=".floating-button-demo" :visibility-height="100" @click="handleBackToTop" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import FloatingButton from '../../../packages/src/components/FloatingButton/index.vue';
import BackToTop from '../../../packages/src/components/BackToTop/index.vue';

const logs = ref([]);
const currentMainColor = ref('#1677ff');
const useCustomStyle = ref(false);

const mainColors = ['#1677ff', '#52c41a', '#ff6600', '#722ed1', '#fa541c'];

// 自定义主按钮样式
const customMainStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '3px solid #fff',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
};

const addLog = (text, icon = 'info-o', color = '#1677ff') => {
    const time = new Date().toLocaleTimeString();
    logs.value.unshift({ text, time, icon, color });
    if (logs.value.length > 20) {
        logs.value.pop();
    }
};

const handleMainClick = () => {
    addLog('主按钮点击', 'plus', '#1677ff');
};

const handleDragStart = () => {
    addLog('开始拖动', 'guide-o', '#faad14');
};

const handleDragEnd = (position) => {
    addLog(
        `拖动结束 - 位置: (${Math.round(position.x)}, ${Math.round(position.y)})`,
        'location-o',
        '#1677ff'
    );
};

// 返回顶部
const handleBackToTop = () => {
    addLog('返回顶部', 'arrow-up', '#52c41a');
};
</script>

<style scoped lang="scss">
.floating-button-demo {
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

:deep(.van-cell__value) {
    display: flex;
    align-items: center;
}

// 自定义主按钮样式类
:deep(.custom-main-button) {
    animation: pulse 2s ease-in-out infinite;

    &:hover {
        animation: none;
    }
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }

    50% {
        box-shadow: 0 4px 30px rgba(102, 126, 234, 0.8);
    }
}
</style>
