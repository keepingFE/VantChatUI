<template>
    <div class="demo-page">
        <van-nav-bar title="康复训练进度" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <RehabProgress :overall-progress="65" start-date="2024-01-01" :completed-days="45"
                estimated-end-date="2025-03-15" :exercises="rehabExercises" :milestones="rehabMilestones"
                :pain-levels="painLevels" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RehabProgress } from '../../../packages/src/index.js'

const rehabExercises = ref([
    { id: 1, icon: '🦵', name: '膝关节屈伸', progress: 80, completed: 24, total: 30, nextSession: '明天 09:00' },
    { id: 2, icon: '💪', name: '股四头肌训练', progress: 65, completed: 13, total: 20, nextSession: '明天 14:00' },
    { id: 3, icon: '🧘', name: '平衡训练', progress: 50, completed: 10, total: 20, nextSession: '后天 10:00' },
    { id: 4, icon: '🚶', name: '步态训练', progress: 70, completed: 14, total: 20, nextSession: '今天 16:00' }
])

const rehabMilestones = ref([
    { title: '开始康复训练', date: '2024-01-01', completed: true },
    { title: '恢复基本活动能力', date: '2024-01-20', completed: true },
    { title: '无辅助行走', date: '2024-02-15', completed: true, current: true },
    { title: '恢复正常运动', date: '2025-03-15', completed: false }
])

const painLevels = ref([
    { date: '01-01', level: 7 },
    { date: '01-08', level: 6 },
    { date: '01-15', level: 5 },
    { date: '01-22', level: 4 },
    { date: '01-29', level: 3 },
    { date: '02-05', level: 3 },
    { date: '02-12', level: 2 }
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
