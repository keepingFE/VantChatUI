<template>
    <div class="demo-page">
        <Navbar title="Skeleton 骨架屏" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <Skeleton :row="3" />
            </div>

            <div class="demo-section">
                <h3>显示头像</h3>
                <Skeleton :row="3" avatar />
            </div>

            <div class="demo-section">
                <h3>显示标题</h3>
                <Skeleton :row="3" title />
            </div>

            <div class="demo-section">
                <h3>完整示例</h3>
                <Skeleton :row="3" title avatar />
            </div>

            <div class="demo-section">
                <h3>自定义行宽</h3>
                <Skeleton :row="3" :row-width="['100%', '80%', '60%']" />
            </div>

            <div class="demo-section">
                <h3>方形头像</h3>
                <Skeleton :row="3" avatar avatar-shape="square" />
            </div>

            <div class="demo-section">
                <h3>不显示动画</h3>
                <Skeleton :row="3" :animate="false" />
            </div>

            <div class="demo-section">
                <h3>聊天消息骨架屏</h3>
                <div class="message-skeleton">
                    <Skeleton :row="2" avatar :avatar-size="40" :row-width="['60%', '40%']" />
                </div>
                <div class="message-skeleton message-skeleton--right">
                    <Skeleton :row="2" :row-width="['50%', '70%']" />
                </div>
            </div>

            <div class="demo-section">
                <h3>加载状态切换</h3>
                <van-button type="primary" @click="loading = !loading" block>
                    {{ loading ? '显示内容' : '显示骨架屏' }}
                </van-button>
                <div style="margin-top: 16px;">
                    <Skeleton v-if="loading" :row="3" title avatar />
                    <div v-else class="content-card">
                        <div class="content-card__header">
                            <img src="https://via.placeholder.com/40" class="content-card__avatar" />
                            <div>
                                <div class="content-card__title">用户名称</div>
                                <div class="content-card__desc">这是一段描述文字</div>
                            </div>
                        </div>
                        <div class="content-card__body">
                            这是实际的内容区域，当数据加载完成后会显示真实内容。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Skeleton, Navbar } from '../../../packages/src/index.js';
import { Button as VanButton } from 'vant';

const loading = ref(true);
</script>

<style scoped>
.demo-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f7f8fa;
    overflow-y: auto;
}

.demo-container {
    padding: 56px 20px 20px;
}

.demo-section {
    margin-bottom: 32px;
}

.demo-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #323233;
}

.message-skeleton {
    margin-bottom: 16px;
    padding: 12px;
    background-color: #fff;
    border-radius: 8px;
}

.message-skeleton--right {
    margin-left: 60px;
}

.content-card {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

.content-card__header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.content-card__avatar {
    width: 40px;
    height: 40px;
    margin-right: 12px;
    border-radius: 50%;
}

.content-card__title {
    font-size: 14px;
    font-weight: 500;
    color: #323233;
}

.content-card__desc {
    margin-top: 4px;
    font-size: 12px;
    color: #969799;
}

.content-card__body {
    font-size: 14px;
    line-height: 20px;
    color: #646566;
}
</style>
