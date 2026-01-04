<template>
    <div class="demo-page">
        <Navbar title="Progress 进度条" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <Progress :percentage="50" />
            </div>

            <div class="demo-section">
                <h3>线条粗细</h3>
                <Progress :percentage="50" :stroke-width="12" />
            </div>

            <div class="demo-section">
                <h3>不显示进度文字</h3>
                <Progress :percentage="50" :show-pivot="false" />
            </div>

            <div class="demo-section">
                <h3>自定义颜色</h3>
                <Progress :percentage="30" color="#07c160" />
                <Progress :percentage="60" color="#ff976a" style="margin-top: 12px;" />
                <Progress :percentage="90" color="#ee0a24" style="margin-top: 12px;" />
            </div>

            <div class="demo-section">
                <h3>渐变色</h3>
                <Progress :percentage="70" :color="['#1989fa', '#07c160']" />
            </div>

            <div class="demo-section">
                <h3>自定义文字</h3>
                <Progress :percentage="75" pivot-text="进行中" />
            </div>

            <div class="demo-section">
                <h3>文字外显</h3>
                <Progress :percentage="80" text-inside />
            </div>

            <div class="demo-section">
                <h3>动画效果</h3>
                <Progress :percentage="percentage" />
                <div style="margin-top: 12px; display: flex; gap: 8px;">
                    <van-button size="small" @click="percentage = Math.max(0, percentage - 10)">-10</van-button>
                    <van-button size="small" @click="percentage = Math.min(100, percentage + 10)">+10</van-button>
                    <van-button size="small" @click="percentage = 0">重置</van-button>
                </div>
            </div>

            <div class="demo-section">
                <h3>上传进度示例</h3>
                <div class="upload-card">
                    <div class="upload-card__header">
                        <span>文件上传中...</span>
                        <span>{{ uploadProgress }}%</span>
                    </div>
                    <Progress :percentage="uploadProgress" :show-pivot="false" />
                    <van-button size="small" type="primary" @click="startUpload" :disabled="uploading"
                        style="margin-top: 12px;">
                        {{ uploading ? '上传中...' : '开始上传' }}
                    </van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Progress, Navbar, Toast } from '../../../packages/src/index.js';
import { Button as VanButton } from 'vant';

const percentage = ref(50);
const uploadProgress = ref(0);
const uploading = ref(false);

const startUpload = () => {
    uploading.value = true;
    uploadProgress.value = 0;

    const timer = setInterval(() => {
        uploadProgress.value += 10;
        if (uploadProgress.value >= 100) {
            clearInterval(timer);
            uploading.value = false;
            Toast.success('上传完成');
        }
    }, 500);
};
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

.upload-card {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

.upload-card__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    color: #646566;
}
</style>
