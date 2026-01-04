<template>
    <div class="demo-page">
        <Navbar title="Switch 开关" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <Switch v-model="checked1" @change="handleChange" />
                <div class="demo-value">状态: {{ checked1 ? '开启' : '关闭' }}</div>
            </div>

            <div class="demo-section">
                <h3>禁用状态</h3>
                <Switch v-model="checked2" disabled />
            </div>

            <div class="demo-section">
                <h3>加载状态</h3>
                <Switch v-model="checked3" loading />
            </div>

            <div class="demo-section">
                <h3>自定义大小</h3>
                <div style="display: flex; gap: 16px; align-items: center;">
                    <Switch v-model="checked4" size="small" />
                    <Switch v-model="checked4" size="default" />
                    <Switch v-model="checked4" size="large" />
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义颜色</h3>
                <Switch v-model="checked5" active-color="#07c160" inactive-color="#ee0a24" />
            </div>

            <div class="demo-section">
                <h3>自定义值</h3>
                <Switch v-model="checked6" :active-value="1" :inactive-value="0" />
                <div class="demo-value">当前值: {{ checked6 }}</div>
            </div>

            <div class="demo-section">
                <h3>异步控制</h3>
                <Switch v-model="checked7" :loading="asyncLoading" @change="handleAsyncChange" />
                <div class="demo-value">{{ asyncMessage }}</div>
            </div>

            <div class="demo-section">
                <h3>在列表中使用</h3>
                <div class="setting-list">
                    <div class="setting-item">
                        <div class="setting-item__content">
                            <div class="setting-item__title">消息通知</div>
                            <div class="setting-item__desc">接收系统消息推送</div>
                        </div>
                        <Switch v-model="settings.notification" />
                    </div>
                    <div class="setting-item">
                        <div class="setting-item__content">
                            <div class="setting-item__title">声音提醒</div>
                            <div class="setting-item__desc">新消息声音提醒</div>
                        </div>
                        <Switch v-model="settings.sound" />
                    </div>
                    <div class="setting-item">
                        <div class="setting-item__content">
                            <div class="setting-item__title">震动反馈</div>
                            <div class="setting-item__desc">操作时震动反馈</div>
                        </div>
                        <Switch v-model="settings.vibrate" />
                    </div>
                    <div class="setting-item">
                        <div class="setting-item__content">
                            <div class="setting-item__title">夜间模式</div>
                            <div class="setting-item__desc">自动切换深色主题</div>
                        </div>
                        <Switch v-model="settings.darkMode" active-color="#646566" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Switch, Navbar, Toast } from '../../../packages/src/index.js';

const checked1 = ref(true);
const checked2 = ref(true);
const checked3 = ref(true);
const checked4 = ref(true);
const checked5 = ref(true);
const checked6 = ref(1);
const checked7 = ref(false);
const asyncLoading = ref(false);
const asyncMessage = ref('');

const settings = ref({
    notification: true,
    sound: false,
    vibrate: true,
    darkMode: false
});

const handleChange = (value) => {
    Toast(value ? '已开启' : '已关闭');
};

const handleAsyncChange = async (value) => {
    asyncLoading.value = true;
    asyncMessage.value = '处理中...';

    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000));

    asyncLoading.value = false;
    asyncMessage.value = value ? '开启成功' : '关闭成功';
    Toast.success(asyncMessage.value);
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

.demo-value {
    margin-top: 12px;
    font-size: 14px;
    color: #646566;
}

.setting-list {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #ebedf0;
}

.setting-item:last-child {
    border-bottom: none;
}

.setting-item__content {
    flex: 1;
}

.setting-item__title {
    font-size: 14px;
    color: #323233;
    margin-bottom: 4px;
}

.setting-item__desc {
    font-size: 12px;
    color: #969799;
}
</style>
