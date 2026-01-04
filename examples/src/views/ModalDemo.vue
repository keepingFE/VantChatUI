<template>
    <div class="demo-page">
        <Navbar title="Modal 模态对话框" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <van-button type="primary" @click="showBasic = true">显示对话框</van-button>
                <Modal v-model="showBasic" title="提示" message="这是一条提示消息" @confirm="handleConfirm"
                    @cancel="handleCancel" />
            </div>

            <div class="demo-section">
                <h3>无标题</h3>
                <van-button type="primary" @click="showNoTitle = true">显示对话框</van-button>
                <Modal v-model="showNoTitle" message="确定要删除这条消息吗？" @confirm="handleConfirm" />
            </div>

            <div class="demo-section">
                <h3>只有确认按钮</h3>
                <van-button type="primary" @click="showConfirmOnly = true">显示对话框</van-button>
                <Modal v-model="showConfirmOnly" title="提示" message="操作成功" :show-cancel-button="false"
                    @confirm="handleConfirm" />
            </div>

            <div class="demo-section">
                <h3>自定义按钮文字</h3>
                <van-button type="primary" @click="showCustomButton = true">显示对话框</van-button>
                <Modal v-model="showCustomButton" title="退出登录" message="确定要退出登录吗？" cancel-button-text="再想想"
                    confirm-button-text="确定退出" @confirm="handleConfirm" @cancel="handleCancel" />
            </div>

            <div class="demo-section">
                <h3>点击遮罩关闭</h3>
                <van-button type="primary" @click="showClickOverlay = true">显示对话框</van-button>
                <Modal v-model="showClickOverlay" title="提示" message="点击遮罩层可以关闭对话框" close-on-click-overlay
                    @confirm="handleConfirm" />
            </div>

            <div class="demo-section">
                <h3>自定义内容</h3>
                <van-button type="primary" @click="showCustomContent = true">显示对话框</van-button>
                <Modal v-model="showCustomContent" title="用户信息" @confirm="handleConfirm">
                    <div style="padding: 20px; text-align: left;">
                        <div style="margin-bottom: 12px;">
                            <strong>姓名：</strong>张三
                        </div>
                        <div style="margin-bottom: 12px;">
                            <strong>邮箱：</strong>zhangsan@example.com
                        </div>
                        <div>
                            <strong>电话：</strong>138****8888
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Modal, Toast, Navbar } from '../../../packages/src/index.js';
import { Button as VanButton } from 'vant';

const showBasic = ref(false);
const showNoTitle = ref(false);
const showConfirmOnly = ref(false);
const showCustomButton = ref(false);
const showClickOverlay = ref(false);
const showCustomContent = ref(false);

const handleConfirm = () => {
    Toast.success('已确认');
};

const handleCancel = () => {
    Toast('已取消');
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
