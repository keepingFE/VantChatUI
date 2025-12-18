<template>
    <div class="sleep-chart-demo">
        <van-nav-bar title="SleepChart 睡眠数据图表" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <SleepChart :sleepData="mockSleepData" :segmentsPerView="10" />
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import SleepChart from '../../../packages/src/components/SleepChart/index.vue'

export default {
    name: 'SleepChartDemo',
    components: {
        SleepChart
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
            mockSleepData: this.generateMockData()
        }
    },
    methods: {
        generateMockData() {
            return [
                { date: '6/23', time: '02:00', type: 'light', value: 60 },
                { date: '6/23', time: '02:30', type: 'light', value: 55 },
                { date: '6/23', time: '03:00', type: 'deep', value: 25 },
                { date: '6/23', time: '03:30', type: 'deep', value: 20 },
                { date: '6/23', time: '04:00', type: 'deep', value: 30 },
                { date: '6/23', time: '04:30', type: 'light', value: 50 },
                { date: '6/23', time: '05:00', type: 'deep', value: 25 },
                { date: '6/23', time: '05:30', type: 'deep', value: 20 },
                { date: '6/23', time: '06:00', type: 'rem', value: 65 },
                { date: '6/23', time: '06:30', type: 'rem', value: 60 },
                { date: '6/23', time: '07:00', type: 'light', value: 55 },
                { date: '6/23', time: '07:30', type: 'awake', value: 85 }
            ]
        }
    }
}
</script>

<style scoped>
.sleep-chart-demo {
    min-height: 100vh;
    background: #f7f8fa;
}

.content {
    padding: 62px 20px 16px;
}
</style>
