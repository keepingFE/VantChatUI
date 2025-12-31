<template>
    <div class="demo-page">
        <van-nav-bar title="运动日历" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <WorkoutCalendar :workouts="workouts" @workout-click="handleWorkoutClick" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import { WorkoutCalendar } from '../../../packages/src/index.js'

const workouts = ref([
    // 2024年12月
    { date: '2024-12-01', type: 'running', duration: 30, distance: 5, calories: 280, heartRate: 140 },
    { date: '2024-12-03', type: 'yoga', duration: 60, calories: 180, notes: '早晨瑜伽，身心放松' },
    { date: '2024-12-05', type: 'cycling', duration: 45, distance: 15, calories: 320, heartRate: 135 },
    { date: '2024-12-07', type: 'swimming', duration: 40, distance: 1.5, calories: 300, heartRate: 130 },
    { date: '2024-12-09', type: 'gym', duration: 60, calories: 350, notes: '力量训练日' },
    { date: '2024-12-11', type: 'running', duration: 40, distance: 7, calories: 380, heartRate: 145 },
    { date: '2024-12-13', type: 'basketball', duration: 90, calories: 520, heartRate: 155, notes: '和朋友打球' },
    { date: '2024-12-15', type: 'walking', duration: 50, distance: 4, calories: 200, heartRate: 110 },
    { date: '2024-12-17', type: 'cycling', duration: 60, distance: 20, calories: 420, heartRate: 138 },
    { date: '2024-12-19', type: 'yoga', duration: 45, calories: 150 },
    { date: '2024-12-21', type: 'running', duration: 35, distance: 6, calories: 320, heartRate: 142 },
    { date: '2024-12-23', type: 'gym', duration: 75, calories: 400, notes: '全身训练' },
    { date: '2024-12-25', type: 'hiking', duration: 180, distance: 12, calories: 800, notes: '圣诞登山' },
    { date: '2024-12-26', type: 'cycling', duration: 90, distance: 35, calories: 580 },
    { date: '2024-12-27', type: 'swimming', duration: 60, distance: 2, calories: 350 },
    { date: '2024-12-28', type: 'gym', duration: 75, calories: 320 },
    { date: '2024-12-29', type: 'yoga', duration: 60, calories: 180 },
    { date: '2024-12-30', type: 'running', duration: 50, distance: 9.2, calories: 450, notes: '年末冲刺' },
    { date: '2024-12-31', type: 'cycling', duration: 120, distance: 45, calories: 680, notes: '跨年骑行' },

    // 2025年1月
    { date: '2025-01-01', type: 'hiking', duration: 180, distance: 12, calories: 800, notes: '新年登高' },
    { date: '2025-01-02', type: 'basketball', duration: 90, calories: 520 },
    { date: '2025-01-04', type: 'running', duration: 40, distance: 7.5, calories: 400, heartRate: 145 },
    { date: '2025-01-06', type: 'swimming', duration: 45, distance: 1.8, calories: 320, heartRate: 132 },
    { date: '2025-01-08', type: 'gym', duration: 60, calories: 350 },
    { date: '2025-01-10', type: 'cycling', duration: 50, distance: 18, calories: 380, heartRate: 136 },
    { date: '2025-01-12', type: 'yoga', duration: 60, calories: 180, notes: '周末放松' },
    { date: '2025-01-14', type: 'running', duration: 45, distance: 8, calories: 420, heartRate: 148 },
    { date: '2025-01-16', type: 'tennis', duration: 90, calories: 480, heartRate: 150 },
    { date: '2025-01-18', type: 'gym', duration: 70, calories: 380, notes: '上肢训练' },
    { date: '2025-01-20', type: 'cycling', duration: 60, distance: 22, calories: 440, heartRate: 140 },
    { date: '2025-01-22', type: 'swimming', duration: 50, distance: 2, calories: 360 },
    { date: '2025-01-24', type: 'running', duration: 35, distance: 6.5, calories: 340, heartRate: 143 },
    { date: '2025-01-26', type: 'basketball', duration: 80, calories: 460 },
    { date: '2025-01-28', type: 'yoga', duration: 50, calories: 160, notes: '春节前放松' },
    { date: '2025-01-30', type: 'walking', duration: 60, distance: 5, calories: 240, heartRate: 115 },

    // 2025年12月
    { date: '2025-12-01', type: 'running', duration: 35, distance: 6, calories: 320, heartRate: 142 },
    { date: '2025-12-03', type: 'cycling', duration: 50, distance: 18, calories: 380, heartRate: 136 },
    { date: '2025-12-05', type: 'swimming', duration: 45, distance: 1.8, calories: 320, heartRate: 132 },
    { date: '2025-12-07', type: 'yoga', duration: 60, calories: 180, notes: '周末瑜伽' },
    { date: '2025-12-09', type: 'gym', duration: 70, calories: 380, notes: '力量训练' },
    { date: '2025-12-11', type: 'running', duration: 40, distance: 7.5, calories: 400, heartRate: 145 },
    { date: '2025-12-13', type: 'basketball', duration: 90, calories: 520, heartRate: 155 },
    { date: '2025-12-15', type: 'cycling', duration: 60, distance: 22, calories: 440, heartRate: 140 },
    { date: '2025-12-17', type: 'swimming', duration: 50, distance: 2, calories: 360 },
    { date: '2025-12-19', type: 'yoga', duration: 50, calories: 160 },
    { date: '2025-12-21', type: 'running', duration: 45, distance: 8, calories: 420, heartRate: 148 },
    { date: '2025-12-23', type: 'gym', duration: 75, calories: 400, notes: '全身训练' },
    { date: '2025-12-25', type: 'hiking', duration: 180, distance: 12, calories: 800, notes: '圣诞登山' },
    { date: '2025-12-27', type: 'tennis', duration: 90, calories: 480, heartRate: 150 },
    { date: '2025-12-29', type: 'cycling', duration: 60, distance: 20, calories: 420, heartRate: 138 },
    { date: '2025-12-31', type: 'running', duration: 50, distance: 9, calories: 450, notes: '跨年跑' },
])

const handleWorkoutClick = (workout) => {
    showToast(`查看运动详情`)
}
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
