<template>
    <div class="demo-page">
        <van-nav-bar title="骑行数据图表" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <CyclingChart :data="cyclingData" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { CyclingChart } from '../../../packages/src/index.js'

const cyclingData = ref({
    distance: 45.5,
    duration: 5400,
    avgSpeed: 30.3,
    calories: 680,
    cadence: {
        avg: 85,
        min: 60,
        max: 110
    },
    power: {
        avg: 180,
        min: 120,
        max: 280,
        zones: [
            { name: '恢复', duration: 600, color: '#95de64' },
            { name: '耐力', duration: 2400, color: '#ffd666' },
            { name: '节奏', duration: 1800, color: '#ff9c6e' },
            { name: '乳酸阈', duration: 600, color: '#ff7875' }
        ]
    },
    timeline: Array.from({ length: 90 }, (_, i) => ({
        time: i * 60,
        speed: 25 + Math.random() * 10,
        cadence: 75 + Math.random() * 20
    })),
    elevation: {
        gain: 450,
        loss: 420,
        max: 580,
        profile: [100, 120, 150, 200, 280, 350, 420, 480, 520, 580, 550, 480, 400, 320, 250, 180, 120, 100]
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
