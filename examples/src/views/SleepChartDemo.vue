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
                { date: '6/22', startTime: '22:00', endTime: '02:10', type: 'light', value: 60 },
                { date: '6/23', startTime: '03:00', endTime: '04:30', type: 'deep', value: 25 },
                { date: '6/23', startTime: '04:30', endTime: '05:00', type: 'light', value: 50 },
                { date: '6/23', startTime: '05:00', endTime: '06:00', type: 'deep', value: 25 },
                { date: '6/23', startTime: '06:00', endTime: '07:00', type: 'rem', value: 65 },
                { date: '6/23', startTime: '07:00', endTime: '07:30', type: 'light', value: 55 },
                { date: '6/23', startTime: '07:30', endTime: '08:00', type: 'awake', value: 85 },
                { date: '6/23', startTime: '08:00', endTime: '08:10', type: 'light', value: 60 },
                { date: '6/23', startTime: '08:10', endTime: '08:20', type: 'deep', value: 25 },
                { date: '6/23', startTime: '08:20', endTime: '08:30', type: 'light', value: 50 },
                { date: '6/23', startTime: '08:30', endTime: '08:40', type: 'deep', value: 25 },
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
