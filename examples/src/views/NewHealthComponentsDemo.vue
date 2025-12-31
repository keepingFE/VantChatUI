<template>
    <div class="new-health-demo">
        <van-nav-bar title="新增健康组件" left-arrow @click-left="$router.back()" fixed />

        <div class="content">
            <van-tabs v-model:active="activeTab" sticky :offset-top="46">
                <van-tab title="游泳数据">
                    <div class="tab-content">
                        <SwimmingChart :data="swimmingData" />
                    </div>
                </van-tab>

                <van-tab title="骑行数据">
                    <div class="tab-content">
                        <CyclingChart :data="cyclingData" />
                    </div>
                </van-tab>

                <van-tab title="运动日历">
                    <div class="tab-content">
                        <WorkoutCalendar :workouts="workouts" @workout-click="handleWorkoutClick" />
                    </div>
                </van-tab>

                <van-tab title="睡眠评分">
                    <div class="tab-content">
                        <SleepScoreCard :score="85" :factors="sleepFactors" :insights="sleepInsights"
                            :recommendations="sleepRecommendations" />
                    </div>
                </van-tab>

                <van-tab title="呼吸频率">
                    <div class="tab-content">
                        <RespiratoryRateChart :data="respiratoryData" :current-rate="16" />
                    </div>
                </van-tab>

                <van-tab title="体态分析">
                    <div class="tab-content">
                        <PostureAnalysis :overall-score="78" :data="postureData" :analysis-details="postureDetails"
                            :suggestions="postureSuggestions" />
                    </div>
                </van-tab>

                <van-tab title="康复进度">
                    <div class="tab-content">
                        <RehabProgress :overall-progress="65" start-date="2024-01-01" :completed-days="45"
                            estimated-end-date="2024-03-15" :exercises="rehabExercises" :milestones="rehabMilestones"
                            :pain-levels="painLevels" />
                    </div>
                </van-tab>

                <van-tab title="排行榜">
                    <div class="tab-content">
                        <LeaderboardCard :rankings="rankings" :my-rank="myRank" unit="步" />
                    </div>
                </van-tab>

                <van-tab title="目标进度">
                    <div class="tab-content">
                        <GoalProgressCard title="每周步数目标" :current="68000" :target="100000" unit="步" :days-remaining="3"
                            :milestones="goalMilestones" :motivation="{ icon: '💪', text: '再坚持3天就能完成目标了！' }" />
                    </div>
                </van-tab>

                <van-tab title="久坐提醒">
                    <div class="tab-content">
                        <SedentaryReminder :reminder-interval="3600" :today-stats="sedentaryStats"
                            :weekly-data="sedentaryWeekly" />
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'
import {
    SwimmingChart,
    CyclingChart,
    WorkoutCalendar,
    SleepScoreCard,
    RespiratoryRateChart,
    PostureAnalysis,
    RehabProgress,
    LeaderboardCard,
    GoalProgressCard,
    SedentaryReminder
} from '../../../packages/src/index.js'

const activeTab = ref(0)

// 游泳数据
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
        { lap: 5, pace: 106, distance: 100 }
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

// 骑行数据
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

// 运动日历数据
const workouts = ref([
    { date: '2024-01-15', type: 'running', duration: 45, distance: 8.5, calories: 420, heartRate: 145, notes: '晨跑，状态不错' },
    { date: '2024-01-16', type: 'cycling', duration: 90, distance: 35, calories: 580 },
    { date: '2024-01-17', type: 'swimming', duration: 60, distance: 2, calories: 350 },
    { date: '2024-01-18', type: 'gym', duration: 75, calories: 320 },
    { date: '2024-01-19', type: 'yoga', duration: 60, calories: 180 },
    { date: '2024-01-20', type: 'running', duration: 50, distance: 9.2, calories: 450 },
    { date: '2024-01-22', type: 'cycling', duration: 120, distance: 45, calories: 680 }
])

const handleWorkoutClick = (workout) => {
    showToast(`查看 ${workout.type} 详情`)
}

// 睡眠评分数据
const sleepFactors = ref([
    { name: '睡眠时长', score: 85, description: '7小时30分钟，接近理想时长' },
    { name: '深度睡眠', score: 75, description: '深睡占比25%，略低于标准' },
    { name: '睡眠连续性', score: 90, description: '夜间醒来1次，睡眠连续' },
    { name: '入睡时间', score: 80, description: '15分钟入睡，较为理想' }
])

const sleepInsights = ref([
    { icon: '😴', text: '你的睡眠质量优于70%的用户' },
    { icon: '🌙', text: '深度睡眠时长比上周增加15分钟' }
])

const sleepRecommendations = ref([
    '建议在22:00-23:00之间入睡',
    '睡前1小时避免使用电子设备',
    '保持卧室温度在18-22℃'
])

// 呼吸频率数据
const respiratoryData = ref(
    Array.from({ length: 24 }, (_, i) => ({
        time: `2024-01-15 ${String(i).padStart(2, '0')}:00`,
        rate: 14 + Math.floor(Math.random() * 4)
    }))
)

// 体态分析数据
const postureData = ref({
    head: { score: 85, angle: 5 },
    neck: { score: 70, angle: 15 },
    shoulders: { score: 80, leftHeight: 0, rightHeight: 2 },
    spine: { score: 75, curvature: 'slight' },
    pelvis: { score: 90, tilt: 2 }
})

const postureDetails = ref([
    { part: '头部前倾', score: 85, description: '头部前倾角度5°，略有前倾' },
    { part: '颈椎曲度', score: 70, description: '颈椎前倾15°，建议改善' },
    { part: '肩部平衡', score: 80, description: '右肩略高2cm，基本平衡' },
    { part: '脊柱侧弯', score: 75, description: '轻度侧弯，需要注意' },
    { part: '骨盆倾斜', score: 90, description: '骨盆倾斜2°，状态良好' }
])

const postureSuggestions = ref([
    { icon: '💺', title: '调整坐姿', description: '保持背部挺直，避免长时间低头' },
    { icon: '🧘', title: '拉伸运动', description: '每天进行颈部和肩部拉伸10分钟' },
    { icon: '💪', title: '核心训练', description: '加强核心肌群训练，改善体态' }
])

// 康复进度数据
const rehabExercises = ref([
    { id: 1, icon: '🦵', name: '膝关节屈伸', progress: 80, completed: 24, total: 30, nextSession: '明天 09:00' },
    { id: 2, icon: '💪', name: '股四头肌训练', progress: 65, completed: 13, total: 20, nextSession: '明天 14:00' },
    { id: 3, icon: '🧘', name: '平衡训练', progress: 50, completed: 10, total: 20, nextSession: '后天 10:00' }
])

const rehabMilestones = ref([
    { title: '开始康复训练', date: '2024-01-01', completed: true },
    { title: '恢复基本活动能力', date: '2024-01-20', completed: true },
    { title: '无辅助行走', date: '2024-02-15', completed: true, current: true },
    { title: '恢复正常运动', date: '2024-03-15', completed: false }
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

// 排行榜数据
const rankings = ref([
    { id: 1, rank: 1, name: '张三', avatar: 'https://via.placeholder.com/100', value: 15000, description: '连续7天第一' },
    { id: 2, rank: 2, name: '李四', avatar: 'https://via.placeholder.com/100', value: 14500 },
    { id: 3, rank: 3, name: '王五', avatar: 'https://via.placeholder.com/100', value: 14000 },
    { id: 4, rank: 4, name: '赵六', avatar: 'https://via.placeholder.com/100', value: 13500 },
    { id: 5, rank: 5, name: '我', avatar: 'https://via.placeholder.com/100', value: 12000, isMe: true },
    { id: 6, rank: 6, name: '钱七', avatar: 'https://via.placeholder.com/100', value: 11500 }
])

const myRank = ref({
    rank: 5,
    value: 12000,
    trend: 2
})

// 目标进度数据
const goalMilestones = ref([
    { name: '25%', value: 25000, achieved: true },
    { name: '50%', value: 50000, achieved: true },
    { name: '75%', value: 75000, achieved: false },
    { name: '100%', value: 100000, achieved: false }
])

// 久坐提醒数据
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
.new-health-demo {
    min-height: 100vh;
    background: #f7f8fa;
}

.content {
    padding-top: 46px;
}

.tab-content {
    padding: 16px;
    min-height: calc(100vh - 90px);
}
</style>
