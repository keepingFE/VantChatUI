<template>
    <div class="demo-page">
        <van-nav-bar title="睡眠评分卡片" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <SleepScoreCard :score="85" :factors="sleepFactors" :insights="sleepInsights"
                :recommendations="sleepRecommendations" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SleepScoreCard } from '../../../packages/src/index.js'

const sleepFactors = ref([
    { name: '睡眠时长', score: 85, description: '7小时30分钟，接近理想时长' },
    { name: '深度睡眠', score: 75, description: '深睡占比25%，略低于标准' },
    { name: '睡眠连续性', score: 90, description: '夜间醒来1次，睡眠连续' },
    { name: '入睡时间', score: 80, description: '15分钟入睡，较为理想' }
])

const sleepInsights = ref([
    { icon: '😴', text: '你的睡眠质量优于70%的用户' },
    { icon: '🌙', text: '深度睡眠时长比上周增加15分钟' },
    { icon: '⏰', text: '你的入睡时间比较规律' }
])

const sleepRecommendations = ref([
    '建议在22:00-23:00之间入睡',
    '睡前1小时避免使用电子设备',
    '保持卧室温度在18-22℃',
    '睡前可以进行轻度拉伸放松'
])
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    height: 100vh;
    background: #f7f8fa;
    overflow-y: auto;
    overflow-x: hidden;
}

.demo-page::-webkit-scrollbar {
    width: 6px;
}

.demo-page::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 3px;
}

.demo-page::-webkit-scrollbar-track {
    background-color: transparent;
}

.content {
    padding: 62px 16px 16px;
}
</style>
