<template>
    <div class="demo-page">
        <Navbar title="Time 时间显示" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>自动格式化</h3>
                <div class="time-item">
                    <span>刚刚：</span>
                    <Time :time="now" />
                </div>
                <div class="time-item">
                    <span>5分钟前：</span>
                    <Time :time="fiveMinutesAgo" />
                </div>
                <div class="time-item">
                    <span>今天：</span>
                    <Time :time="today" />
                </div>
                <div class="time-item">
                    <span>昨天：</span>
                    <Time :time="yesterday" />
                </div>
                <div class="time-item">
                    <span>本周：</span>
                    <Time :time="thisWeek" />
                </div>
                <div class="time-item">
                    <span>今年：</span>
                    <Time :time="thisYear" />
                </div>
                <div class="time-item">
                    <span>去年：</span>
                    <Time :time="lastYear" />
                </div>
            </div>

            <div class="demo-section">
                <h3>相对时间</h3>
                <div class="time-item">
                    <span>1小时前：</span>
                    <Time :time="oneHourAgo" format="relative" />
                </div>
                <div class="time-item">
                    <span>3天前：</span>
                    <Time :time="threeDaysAgo" format="relative" />
                </div>
                <div class="time-item">
                    <span>2个月前：</span>
                    <Time :time="twoMonthsAgo" format="relative" />
                </div>
            </div>

            <div class="demo-section">
                <h3>完整时间</h3>
                <div class="time-item">
                    <Time :time="now" format="full" />
                </div>
            </div>

            <div class="demo-section">
                <h3>仅日期</h3>
                <div class="time-item">
                    <Time :time="now" format="date" />
                </div>
            </div>

            <div class="demo-section">
                <h3>仅时间</h3>
                <div class="time-item">
                    <Time :time="now" format="time" />
                </div>
            </div>

            <div class="demo-section">
                <h3>禁用自动更新</h3>
                <div class="time-item">
                    <Time :time="fiveMinutesAgo" :auto-update="false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Time, Navbar } from '../../../packages/src/index.js';

const now = ref(Date.now());
const fiveMinutesAgo = ref(Date.now() - 5 * 60 * 1000);
const oneHourAgo = ref(Date.now() - 60 * 60 * 1000);
const today = ref(new Date().setHours(10, 30, 0, 0));
const yesterday = ref(Date.now() - 24 * 60 * 60 * 1000);
const thisWeek = ref(Date.now() - 3 * 24 * 60 * 60 * 1000);
const threeDaysAgo = ref(Date.now() - 3 * 24 * 60 * 60 * 1000);
const thisYear = ref(new Date(new Date().getFullYear(), 5, 15).getTime());
const lastYear = ref(new Date(new Date().getFullYear() - 1, 8, 20).getTime());
const twoMonthsAgo = ref(Date.now() - 60 * 24 * 60 * 60 * 1000);

onMounted(() => {
    // 每秒更新当前时间
    setInterval(() => {
        now.value = Date.now();
    }, 1000);
});
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
    margin-bottom: 32px;
}

.demo-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #323233;
}

.time-item {
    padding: 12px;
    background-color: #f7f8fa;
    border-radius: 4px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.time-item span {
    color: #646566;
    font-size: 14px;
}
</style>
