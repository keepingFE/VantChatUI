<template>
    <div class="demo-page">
        <Navbar title="Toast 轻提示" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <van-button type="primary" @click="showBasic">显示提示</van-button>
            </div>

            <div class="demo-section">
                <h3>成功提示</h3>
                <van-button type="success" @click="showSuccess">成功提示</van-button>
            </div>

            <div class="demo-section">
                <h3>失败提示</h3>
                <van-button type="danger" @click="showError">失败提示</van-button>
            </div>

            <div class="demo-section">
                <h3>警告提示</h3>
                <van-button type="warning" @click="showWarning">警告提示</van-button>
            </div>

            <div class="demo-section">
                <h3>加载提示</h3>
                <van-button type="primary" @click="showLoading">加载提示</van-button>
            </div>

            <div class="demo-section">
                <h3>自定义时长</h3>
                <van-button type="primary" @click="showCustomDuration">5秒后关闭</van-button>
            </div>

            <div class="demo-section">
                <h3>手动关闭</h3>
                <van-button type="primary" @click="showManual">显示提示</van-button>
                <van-button type="default" @click="closeToast" style="margin-left: 12px;">关闭提示</van-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Toast, Navbar } from '../../../packages/src/index.js';
import { Button as VanButton } from 'vant';

const showBasic = () => {
    Toast('这是一条提示消息');
};

const showSuccess = () => {
    Toast.success('操作成功');
};

const showError = () => {
    Toast.error('操作失败');
};

const showWarning = () => {
    Toast.warning('警告信息');
};

const showLoading = () => {
    const toast = Toast.loading('加载中...');
    setTimeout(() => {
        Toast.clear();
        Toast.success('加载完成');
    }, 2000);
};

const showCustomDuration = () => {
    Toast('这条消息将在5秒后关闭', { duration: 5000 });
};

const showManual = () => {
    Toast.loading('请手动关闭', { duration: 0 });
};

const closeToast = () => {
    Toast.clear();
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
    margin-bottom: 24px;
}

.demo-section h3 {
    margin-bottom: 12px;
    font-size: 16px;
    color: #323233;
}
</style>
