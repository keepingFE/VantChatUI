<template>
    <div class="sleep-ring-chart-demo">
        <van-nav-bar title="SleepRingChart 睡眠环形图" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <SleepRingChart :sleepData="sleepData" />
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import SleepRingChart from '../../../packages/src/components/SleepRingChart/index.vue'

export default {
    name: 'SleepRingChartDemo',
    components: {
        SleepRingChart
    },
    setup() {
        const router = useRouter()

        const goBack = () => {
            router.back()
        }

        return {
            goBack
        }
    },
    data() {
        return {
            sleepData: [
                { name: '深睡', value: 121, color: '#6C5CE7' },
                { name: '浅睡', value: 143, color: '#A29BFE' },
                { name: '快速眼动', value: 62, color: '#FD79A8' },
                { name: '清醒', value: 154, color: '#FDCB6E' }
            ]
        }
    }
}
</script>

<style scoped>
.sleep-ring-chart-demo {
    min-height: 100vh;
    background: #f7f8fa;
}

.content {
    padding: 62px 16px 16px;
}
</style>
