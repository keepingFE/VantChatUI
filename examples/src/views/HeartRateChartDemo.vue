<template>
    <div class="heart-rate-chart-demo">
        <van-nav-bar title="HeartRateChart 心率数据图表" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <HeartRateChart :heartRateData="mockHeartRateData" />
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import HeartRateChart from '../../../packages/src/components/HeartRateChart/index.vue'

export default {
    name: 'HeartRateChartDemo',
    components: {
        HeartRateChart
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
            mockHeartRateData: this.generateMockData()
        }
    },
    methods: {
        generateMockData() {
            return [
                { date: '12/3', min: 60, max: 70 },
                { date: '12/4', min: 50, max: 80 },
                { date: '12/5', min: 67, max: 87 },
                { date: '12/6', min: 42, max: 90 },
                { date: '12/7', min: 32, max: 98 },
                { date: '12/8', min: 76, max: 80 },
                { date: '12/9', min: 58, max: 79 }
            ]
        }
    }
}
</script>

<style scoped>
.heart-rate-chart-demo {
    min-height: 100vh;
    background: #546882;
}

.content {
    padding: 10px;
}
</style>
