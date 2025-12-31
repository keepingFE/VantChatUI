<template>
    <div class="demo-page">
        <van-nav-bar title="呼吸频率趋势" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <RespiratoryRateChart :data="respiratoryData" :current-rate="16" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RespiratoryRateChart } from '../../../packages/src/index.js'

const respiratoryData = ref(
    Array.from({ length: 24 }, (_, i) => ({
        time: `2024-12-31 ${String(i).padStart(2, '0')}:00`,
        rate: 14 + Math.floor(Math.random() * 4)
    }))
)
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
