<template>
    <div class="blood-oxygen-chart-demo">
        <van-nav-bar title="BloodOxygenChart 血氧趋势图" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 今日血氧 -->
            <div class="demo-section">
                <h3>今日血氧趋势</h3>
                <BloodOxygenChart :oxygenData="todayData" :showSafeZone="true" :normalMin="95" />
            </div>

            <!-- 24小时监测 -->
            <div class="demo-section">
                <h3>24小时连续监测</h3>
                <BloodOxygenChart :oxygenData="hourlyData" primaryColor="#8b5cf6" :showSafeZone="true"
                    :normalMin="94" />
            </div>

            <!-- 睡眠期间血氧 -->
            <div class="demo-section">
                <h3>睡眠期间血氧（含异常点）</h3>
                <BloodOxygenChart :oxygenData="sleepData" primaryColor="#ec4899" :showSafeZone="true" :normalMin="95" />
            </div>

            <!-- 数据说明 -->
            <div class="info-panel">
                <h3>血氧饱和度说明</h3>
                <div class="info-item">
                    <span class="status-dot status-normal"></span>
                    <span><strong>95-100%</strong>：正常范围</span>
                </div>
                <div class="info-item">
                    <span class="status-dot status-warning"></span>
                    <span><strong>90-94%</strong>：偏低，需关注</span>
                </div>
                <div class="info-item">
                    <span class="status-dot status-danger"></span>
                    <span><strong>&lt;90%</strong>：危险，建议就医</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import BloodOxygenChart from '../../../packages/src/components/BloodOxygenChart/index.vue';

export default {
    name: 'BloodOxygenChartDemo',
    components: {
        BloodOxygenChart
    },
    setup() {
        const router = useRouter();

        const goBack = () => {
            router.back();
        };

        return {
            goBack
        };
    },
    data() {
        return {
            // 今日数据（每小时采样）
            todayData: [
                { time: '8:00', value: 98 },
                { time: '10:00', value: 97 },
                { time: '12:00', value: 98 },
                { time: '14:00', value: 96 },
                { time: '16:00', value: 97 },
                { time: '18:00', value: 98 },
                { time: '20:00', value: 97 },
                { time: '22:00', value: 96 }
            ],
            // 24小时数据
            hourlyData: [
                { time: '00:00', value: 96 },
                { time: '02:00', value: 95 },
                { time: '04:00', value: 96 },
                { time: '06:00', value: 97 },
                { time: '08:00', value: 98 },
                { time: '10:00', value: 97 },
                { time: '12:00', value: 98 },
                { time: '14:00', value: 97 },
                { time: '16:00', value: 98 },
                { time: '18:00', value: 97 },
                { time: '20:00', value: 96 },
                { time: '22:00', value: 97 }
            ],
            // 睡眠期间数据（含异常点）
            sleepData: [
                { time: '22:00', value: 97 },
                { time: '23:00', value: 96 },
                { time: '00:00', value: 95 },
                { time: '01:00', value: 94 },
                { time: '02:00', value: 92 },
                { time: '03:00', value: 89 },
                { time: '04:00', value: 91 },
                { time: '05:00', value: 94 },
                { time: '06:00', value: 96 },
                { time: '07:00', value: 97 }
            ]
        };
    }
};
</script>

<style scoped>
.blood-oxygen-chart-demo {
    background: #f5f5f5;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.content {
    padding: 62px 20px 20px;
}

h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
}

h3 {
    font-size: 16px;
    color: #666;
    margin-bottom: 12px;
}

.demo-section {
    margin-bottom: 30px;
}

.info-panel {
    background: #fff;
    padding: 20px;
    border-radius: 16px;
    margin-top: 20px;
}

.info-panel h3 {
    margin-bottom: 16px;
    font-size: 15px;
    color: #333;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-normal {
    background: #22c55e;
}

.status-warning {
    background: #f59e0b;
}

.status-danger {
    background: #ef4444;
}
</style>
