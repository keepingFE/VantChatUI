<template>
    <div class="demo-page">
        <van-nav-bar title="游泳数据图表" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <SwimmingChart :data="swimmingData" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SwimmingChart } from '../../../packages/src/index.js'

const swimmingData = ref({
    distance: 1500,
    duration: 1800,
    calories: 450,
    strokes: [
        { type: 'freestyle', distance: 800, swolf: 35, strokes: 420, pace: 105 },
        { type: 'breaststroke', distance: 400, swolf: 42, strokes: 280, pace: 130 },
        { type: 'backstroke', distance: 300, swolf: 38, strokes: 240, pace: 115 }
    ],
    paceData: [
        { lap: 1, pace: 105, distance: 100 },
        { lap: 2, pace: 102, distance: 100 },
        { lap: 3, pace: 108, distance: 100 },
        { lap: 4, pace: 103, distance: 100 },
        { lap: 5, pace: 106, distance: 100 },
        { lap: 6, pace: 104, distance: 100 },
        { lap: 7, pace: 107, distance: 100 },
        { lap: 8, pace: 105, distance: 100 }
    ],
    heartRate: {
        avg: 135,
        max: 165,
        zones: [
            { name: '热身', duration: 300, color: '#95de64' },
            { name: '有氧', duration: 900, color: '#ffd666' },
            { name: '无氧', duration: 480, color: '#ff7875' },
            { name: '极限', duration: 120, color: '#ff4d4f' }
        ]
    }
})
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
