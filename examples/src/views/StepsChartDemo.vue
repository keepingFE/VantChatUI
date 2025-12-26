<template>
    <div class="steps-chart-demo">
        <van-nav-bar title="StepsChart 步数图表" left-arrow fixed @click-left="goBack" />

        <div class="content">

            <!-- 图表类型切换 -->
            <div class="control-panel">
                <van-button :type="chartType === 'bar' ? 'primary' : 'default'" size="small" @click="chartType = 'bar'">
                    柱状图
                </van-button>
                <van-button :type="chartType === 'line' ? 'primary' : 'default'" size="small"
                    @click="chartType = 'line'">
                    折线图
                </van-button>
            </div>

            <!-- 周数据 -->
            <div class="demo-section">
                <h3>本周步数</h3>
                <StepsChart :stepsData="weeklyData" :chartType="chartType" :showGoal="true" :defaultGoal="10000" />
            </div>

            <!-- 月数据 -->
            <div class="demo-section">
                <h3>本月步数趋势</h3>
                <StepsChart :stepsData="monthlyData" :chartType="chartType" primaryColor="#00d2ff" :showGoal="true"
                    :defaultGoal="8000" />
            </div>

            <!-- 自定义颜色 -->
            <div class="demo-section">
                <h3>自定义样式</h3>
                <StepsChart :stepsData="customData" :chartType="chartType" primaryColor="#a78bfa" goalColor="#f59e0b"
                    :showGoal="true" :defaultGoal="12000" />
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import StepsChart from '../../../packages/src/components/StepsChart/index.vue';

export default {
    name: 'StepsChartDemo',
    components: {
        StepsChart
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
            chartType: 'bar',
            weeklyData: [
                { date: '周一', steps: 8432 },
                { date: '周二', steps: 12567 },
                { date: '周三', steps: 9821 },
                { date: '周四', steps: 11234 },
                { date: '周五', steps: 10567 },
                { date: '周六', steps: 15432 },
                { date: '周日', steps: 7890 }
            ],
            monthlyData: [
                { date: '1周', steps: 52341 },
                { date: '2周', steps: 58234 },
                { date: '3周', steps: 61234 },
                { date: '4周', steps: 55678 }
            ],
            customData: [
                { date: '1月', steps: 8234 },
                { date: '2月', steps: 9567 },
                { date: '3月', steps: 11234 },
                { date: '4月', steps: 13567 },
                { date: '5月', steps: 12890 },
                { date: '6月', steps: 14234 }
            ]
        };
    }
};
</script>

<style scoped>
.steps-chart-demo {
    background: #f5f5f5;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.content {
    padding: 62px 20px 20px;
}

h3 {
    font-size: 16px;
    color: #666;
    margin-bottom: 12px;
}

.control-panel {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.demo-section {
    margin-bottom: 30px;
}
</style>
