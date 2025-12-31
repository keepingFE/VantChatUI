<template>
    <div class="demo-page">
        <van-nav-bar title="久坐提醒" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <SedentaryReminder :reminder-interval="3600" :today-stats="sedentaryStats" :weekly-data="sedentaryWeekly" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SedentaryReminder } from '../../../packages/src/index.js'

const sedentaryStats = ref({
    sedentaryTime: 180,
    breaks: 6,
    compliance: 75
})

const sedentaryWeekly = ref([
    { day: '周一', sedentary: 240, breaks: 8 },
    { day: '周二', sedentary: 210, breaks: 7 },
    { day: '周三', sedentary: 180, breaks: 6 },
    { day: '周四', sedentary: 200, breaks: 7 },
    { day: '周五', sedentary: 190, breaks: 6 },
    { day: '周六', sedentary: 120, breaks: 10 },
    { day: '周日', sedentary: 100, breaks: 12 }
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
