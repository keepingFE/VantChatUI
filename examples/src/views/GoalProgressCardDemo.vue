<template>
    <div class="demo-page">
        <van-nav-bar title="目标达成进度" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <GoalProgressCard title="每周步数目标" :current="68000" :target="100000" unit="步" :days-remaining="3"
                :milestones="goalMilestones" :motivation="{ icon: '💪', text: '再坚持3天就能完成目标了！' }" />

            <div style="margin-top: 16px;">
                <GoalProgressCard icon="🏃" title="本月跑步目标" period="本月" :current="85" :target="100" unit="公里"
                    :days-remaining="10" :milestones="runningMilestones"
                    :motivation="{ icon: '🔥', text: '你已经超过了85%的用户！' }" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { GoalProgressCard } from '../../../packages/src/index.js'

const goalMilestones = ref([
    { name: '25%', value: 25000, achieved: true },
    { name: '50%', value: 50000, achieved: true },
    { name: '75%', value: 75000, achieved: false },
    { name: '100%', value: 100000, achieved: false }
])

const runningMilestones = ref([
    { name: '25%', value: 25, achieved: true },
    { name: '50%', value: 50, achieved: true },
    { name: '75%', value: 75, achieved: true },
    { name: '100%', value: 100, achieved: false }
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
