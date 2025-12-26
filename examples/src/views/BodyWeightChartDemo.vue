<template>
    <div class="body-weight-chart-demo">
        <van-nav-bar title="BodyWeightChart 体重趋势图" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 减重进行中 -->
            <div class="demo-section">
                <h3>减重进行中</h3>
                <BodyWeightChart :weightData="weightLossData" :height="170" :goalWeight="65" :showBMI="true" />
            </div>

            <!-- 增重计划 -->
            <div class="demo-section">
                <h3>增重计划</h3>
                <BodyWeightChart :weightData="weightGainData" :height="175" :goalWeight="72" primaryColor="#34c759"
                    :showBMI="true" />
            </div>

            <!-- 体重维持 -->
            <div class="demo-section">
                <h3>体重维持（已达目标）</h3>
                <BodyWeightChart :weightData="maintainData" :height="168" :goalWeight="58" primaryColor="#a78bfa"
                    :showBMI="true" />
            </div>

            <!-- 长期趋势 -->
            <div class="demo-section">
                <h3>长期趋势（3个月）</h3>
                <BodyWeightChart :weightData="longTermData" :height="172" :goalWeight="70" primaryColor="#ff6b6b"
                    :showBMI="true" />
            </div>

            <!-- 仅体重曲线 -->
            <div class="demo-section">
                <h3>仅显示体重曲线</h3>
                <BodyWeightChart :weightData="simpleData" :height="165" :goalWeight="55" :showBMI="false" />
            </div>

            <!-- BMI 说明卡片 -->
            <div class="info-panel">
                <h3>BMI 指数说明</h3>
                <div class="bmi-ranges">
                    <div class="bmi-range">
                        <div class="range-indicator underweight"></div>
                        <div class="range-info">
                            <div class="range-label">偏瘦</div>
                            <div class="range-value">BMI &lt; 18.5</div>
                        </div>
                    </div>
                    <div class="bmi-range">
                        <div class="range-indicator normal"></div>
                        <div class="range-info">
                            <div class="range-label">正常</div>
                            <div class="range-value">18.5 ≤ BMI &lt; 24</div>
                        </div>
                    </div>
                    <div class="bmi-range">
                        <div class="range-indicator overweight"></div>
                        <div class="range-info">
                            <div class="range-label">偏胖</div>
                            <div class="range-value">24 ≤ BMI &lt; 28</div>
                        </div>
                    </div>
                    <div class="bmi-range">
                        <div class="range-indicator obese"></div>
                        <div class="range-info">
                            <div class="range-label">肥胖</div>
                            <div class="range-value">BMI ≥ 28</div>
                        </div>
                    </div>
                </div>
                <div class="bmi-formula">
                    <strong>计算公式：</strong> BMI = 体重(kg) ÷ 身高²(m²)
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import BodyWeightChart from '../../../packages/src/components/BodyWeightChart/index.vue';

export default {
    name: 'BodyWeightChartDemo',
    components: {
        BodyWeightChart
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
            // 减重数据
            weightLossData: [
                { date: '1/1', weight: 75.2 },
                { date: '1/8', weight: 74.5 },
                { date: '1/15', weight: 73.8 },
                { date: '1/22', weight: 72.9 },
                { date: '1/29', weight: 71.5 },
                { date: '2/5', weight: 70.8 },
                { date: '2/12', weight: 69.5 },
                { date: '2/19', weight: 68.2 },
                { date: '2/26', weight: 67.1 }
            ],

            // 增重数据
            weightGainData: [
                { date: '12/1', weight: 62.5 },
                { date: '12/5', weight: 63.2 },
                { date: '12/9', weight: 64.1 },
                { date: '12/13', weight: 64.8 },
                { date: '12/17', weight: 65.5 },
                { date: '12/21', weight: 66.3 },
                { date: '12/25', weight: 67.2 }
            ],

            // 维持数据
            maintainData: [
                { date: '2/1', weight: 58.2 },
                { date: '2/4', weight: 57.8 },
                { date: '2/7', weight: 58.3 },
                { date: '2/10', weight: 58.1 },
                { date: '2/13', weight: 57.9 },
                { date: '2/16', weight: 58.2 },
                { date: '2/19', weight: 58.0 },
                { date: '2/22', weight: 58.4 },
                { date: '2/25', weight: 58.1 }
            ],

            // 长期数据
            longTermData: [
                { date: '10/1', weight: 78.5 },
                { date: '10/8', weight: 77.8 },
                { date: '10/15', weight: 77.2 },
                { date: '10/22', weight: 76.5 },
                { date: '10/29', weight: 75.8 },
                { date: '11/5', weight: 75.2 },
                { date: '11/12', weight: 74.5 },
                { date: '11/19', weight: 73.9 },
                { date: '11/26', weight: 73.2 },
                { date: '12/3', weight: 72.8 },
                { date: '12/10', weight: 72.1 },
                { date: '12/17', weight: 71.5 },
                { date: '12/24', weight: 70.8 }
            ],

            // 简单数据
            simpleData: [
                { date: '周一', weight: 56.5 },
                { date: '周二', weight: 56.2 },
                { date: '周三', weight: 56.0 },
                { date: '周四', weight: 55.8 },
                { date: '周五', weight: 55.5 },
                { date: '周六', weight: 55.3 },
                { date: '周日', weight: 55.1 }
            ]
        };
    }
};
</script>

<style scoped>
.body-weight-chart-demo {
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

.bmi-ranges {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.bmi-range {
    display: flex;
    align-items: center;
    gap: 12px;
}

.range-indicator {
    width: 40px;
    height: 8px;
    border-radius: 4px;
    flex-shrink: 0;
}

.range-indicator.underweight {
    background: #f59e0b;
}

.range-indicator.normal {
    background: #22c55e;
}

.range-indicator.overweight {
    background: #fb923c;
}

.range-indicator.obese {
    background: #ef4444;
}

.range-info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.range-label {
    font-size: 14px;
    color: #333;
    font-weight: 600;
}

.range-value {
    font-size: 13px;
    color: #666;
}

.bmi-formula {
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    font-size: 13px;
    color: #666;
}
</style>
