<!-- File: examples/src/views/LoadingDemo.vue -->
<template>
    <div class="loading-demo">
        <van-nav-bar title="Loading 加载动画" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <van-cell-group inset title="基础用法">
                <van-cell title="基础加载" is-link @click="showBasicLoading" />
                <van-cell title="自定义文字" is-link @click="showCustomText" />
                <van-cell title="无文字" is-link @click="showNoText" />
            </van-cell-group>

            <van-cell-group inset title="加载图标类型">
                <van-cell title="圆形加载图标" is-link @click="showCircular" />
                <van-cell title="旋转加载图标" is-link @click="showSpinner" />
            </van-cell-group>

            <van-cell-group inset title="自定义样式">
                <van-cell title="自定义颜色" is-link @click="showCustomColor" />
                <van-cell title="自定义大小" is-link @click="showCustomSize" />
                <van-cell title="水平排列" is-link @click="showHorizontal" />
            </van-cell-group>

            <van-cell-group inset title="自定义背景">
                <van-cell title="白色背景" is-link @click="showWhiteBackground" />
                <van-cell title="蓝色背景" is-link @click="showBlueBackground" />
                <van-cell title="渐变背景" is-link @click="showGradientBackground" />
                <van-cell title="自定义圆角和内边距" is-link @click="showCustomPadding" />
            </van-cell-group>

            <van-cell-group inset title="自定义图标">
                <van-cell title="自定义 SVG 图标" is-link @click="showCustomIcon" />
                <van-cell title="自定义动画图标" is-link @click="showCustomAnimatedIcon" />
            </van-cell-group>

            <van-cell-group inset title="其他配置">
                <van-cell title="无遮罩层" is-link @click="showNoOverlay" />
                <van-cell title="点击遮罩关闭" is-link @click="showClickClose" />
                <van-cell title="模拟加载过程" is-link @click="showLoadingProcess" />
            </van-cell-group>
        </div>

        <!-- Loading 组件 -->
        <Loading v-model:show="loading.show" :text="loading.text" :type="loading.type" :size="loading.size"
            :color="loading.color" :vertical="loading.vertical" :overlay="loading.overlay"
            :close-on-click-overlay="loading.closeOnClickOverlay" :background-color="loading.backgroundColor"
            :border-radius="loading.borderRadius" :padding="loading.padding" :min-width="loading.minWidth">
            <template v-if="loading.customIcon" #icon>
                <div class="custom-icon" v-html="loading.customIcon"></div>
            </template>
        </Loading>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Loading } from '../../../packages/src/index.js'

const router = useRouter()

const goBack = () => {
    router.back()
}

const loading = reactive({
    show: false,
    text: 'Loading...',
    type: 'circular',
    size: '30px',
    color: '#1989fa',
    vertical: true,
    overlay: true,
    closeOnClickOverlay: false,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
    padding: '24px',
    minWidth: '88px',
    customIcon: null
})

// 重置配置
const resetConfig = () => {
    loading.text = 'Loading...'
    loading.type = 'circular'
    loading.size = '30px'
    loading.color = '#1989fa'
    loading.vertical = true
    loading.overlay = true
    loading.closeOnClickOverlay = false
    loading.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    loading.borderRadius = '8px'
    loading.padding = '24px'
    loading.minWidth = '88px'
    loading.customIcon = null
}

// 显示加载并自动关闭
const showLoading = (duration = 2000) => {
    loading.show = true
    setTimeout(() => {
        loading.show = false
    }, duration)
}

// 基础加载
const showBasicLoading = () => {
    resetConfig()
    showLoading()
}

// 自定义文字
const showCustomText = () => {
    resetConfig()
    loading.text = '数据加载中...'
    showLoading()
}

// 无文字
const showNoText = () => {
    resetConfig()
    loading.text = ''
    showLoading()
}

// 圆形加载图标
const showCircular = () => {
    resetConfig()
    loading.type = 'circular'
    showLoading()
}

// 旋转加载图标
const showSpinner = () => {
    resetConfig()
    loading.type = 'spinner'
    showLoading()
}

// 自定义颜色
const showCustomColor = () => {
    resetConfig()
    loading.color = '#07c160'
    loading.text = '加载中...'
    showLoading()
}

// 自定义大小
const showCustomSize = () => {
    resetConfig()
    loading.size = '40px'
    loading.textSize = '16px'
    loading.text = '加载中...'
    showLoading()
}

// 水平排列
const showHorizontal = () => {
    resetConfig()
    loading.vertical = false
    loading.text = '加载中...'
    showLoading()
}

// 无遮罩层
const showNoOverlay = () => {
    resetConfig()
    loading.overlay = false
    showLoading()
}

// 点击遮罩关闭
const showClickClose = () => {
    resetConfig()
    loading.closeOnClickOverlay = true
    loading.text = '点击遮罩关闭'
    showLoading(5000)
}

// 模拟加载过程
const showLoadingProcess = () => {
    resetConfig()
    loading.text = '正在加载数据...'
    loading.show = true

    setTimeout(() => {
        loading.text = '处理中...'
    }, 1000)

    setTimeout(() => {
        loading.text = '即将完成...'
    }, 2000)

    setTimeout(() => {
        loading.show = false
    }, 3000)
}

// 白色背景
const showWhiteBackground = () => {
    resetConfig()
    loading.backgroundColor = 'rgba(255, 255, 255, 0.95)'
    loading.color = '#1989fa'
    loading.text = '加载中...'
    showLoading()
}

// 蓝色背景
const showBlueBackground = () => {
    resetConfig()
    loading.backgroundColor = 'rgba(25, 137, 250, 0.9)'
    loading.color = '#ffffff'
    loading.text = '加载中...'
    showLoading()
}

// 渐变背景
const showGradientBackground = () => {
    resetConfig()
    loading.backgroundColor = 'linear-gradient(135deg, rgba(25, 137, 250, 0.9) 0%, rgba(7, 193, 96, 0.9) 100%)'
    loading.color = '#ffffff'
    loading.text = '加载中...'
    showLoading()
}

// 自定义圆角和内边距
const showCustomPadding = () => {
    resetConfig()
    loading.borderRadius = '20px'
    loading.padding = '32px 40px'
    loading.minWidth = '120px'
    loading.text = '加载中...'
    showLoading()
}

// 自定义 SVG 图标
const showCustomIcon = () => {
    resetConfig()
    loading.customIcon = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#1989fa" stroke-width="3" opacity="0.3"/>
            <path d="M 20 2 A 18 18 0 0 1 38 20" fill="none" stroke="#1989fa" stroke-width="3" stroke-linecap="round">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 20 20"
                    to="360 20 20"
                    dur="1s"
                    repeatCount="indefinite"/>
            </path>
        </svg>
    `
    loading.text = '自定义图标'
    showLoading()
}

// 自定义动画图标
const showCustomAnimatedIcon = () => {
    resetConfig()
    loading.customIcon = `
        <div class="custom-spinner">
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
            <div class="spinner-dot"></div>
        </div>
    `
    loading.text = '处理中...'
    loading.backgroundColor = 'rgba(255, 255, 255, 0.95)'
    showLoading()
}
</script>

<style scoped lang="scss">
.loading-demo {
    min-height: 100vh;
    background: #f7f8fa;

    .content {
        padding: 62px 0 16px;

        .van-cell-group {
            margin-bottom: 16px;
        }
    }
}

:deep(.custom-icon) {
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.custom-spinner) {
    display: flex;
    gap: 8px;
    align-items: center;

    .spinner-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #1989fa;
        animation: bounce 1.4s infinite ease-in-out both;

        &:nth-child(1) {
            animation-delay: -0.32s;
        }

        &:nth-child(2) {
            animation-delay: -0.16s;
        }

        &:nth-child(3) {
            animation-delay: 0s;
        }

        &:nth-child(4) {
            animation-delay: 0.16s;
        }
    }
}

@keyframes bounce {

    0%,
    80%,
    100% {
        transform: scale(0.6);
        opacity: 0.5;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
