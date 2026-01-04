<template>
    <div class="demo-page">
        <Navbar title="Empty 空状态" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <Empty />
            </div>

            <div class="demo-section">
                <h3>自定义描述</h3>
                <Empty description="暂无聊天记录" />
            </div>

            <div class="demo-section">
                <h3>自定义图片</h3>
                <Empty description="网络连接失败">
                    <template #image>
                        <van-icon name="warning-o" size="80" color="#ee0a24" />
                    </template>
                </Empty>
            </div>

            <div class="demo-section">
                <h3>带操作按钮</h3>
                <Empty description="暂无消息">
                    <van-button type="primary" @click="handleAction">开始聊天</van-button>
                </Empty>
            </div>

            <div class="demo-section">
                <h3>自定义底部内容</h3>
                <Empty description="没有找到相关内容">
                    <div style="display: flex; gap: 12px;">
                        <van-button type="primary" size="small" @click="handleRefresh">刷新</van-button>
                        <van-button type="default" size="small" @click="handleBack">返回</van-button>
                    </div>
                </Empty>
            </div>

            <div class="demo-section">
                <h3>在聊天界面中使用</h3>
                <div class="chat-container">
                    <Empty description="还没有消息，快来开始聊天吧">
                        <van-button type="primary" round @click="handleStartChat">
                            发送第一条消息
                        </van-button>
                    </Empty>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Empty, Toast, Navbar } from '../../../packages/src/index.js';
import { Button as VanButton, Icon as VanIcon } from 'vant';

const handleAction = () => {
    Toast.success('开始聊天');
};

const handleRefresh = () => {
    Toast.loading('刷新中...');
    setTimeout(() => {
        Toast.clear();
        Toast.success('刷新成功');
    }, 1000);
};

const handleBack = () => {
    Toast('返回');
};

const handleStartChat = () => {
    Toast.success('开始聊天');
};
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    overflow-y: auto;
}

.demo-container {
    padding: 56px 20px 20px;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
}

.demo-section {
    margin-bottom: 40px;
}

.demo-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #323233;
}

.chat-container {
    height: 400px;
    background-color: #f7f8fa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
