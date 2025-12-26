<template>
    <div class="blood-pressure-chart-demo">
        <van-nav-bar title="BloodPressureChart 血压图表" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 正常血压 -->
            <div class="demo-section">
                <h3>正常血压趋势</h3>
                <BloodPressureChart :pressureData="normalData" :showHealthyRange="true" />
            </div>

            <!-- 高血压 -->
            <div class="demo-section">
                <h3>高血压患者监测</h3>
                <BloodPressureChart :pressureData="highData" :showHealthyRange="true" />
            </div>

            <!-- 低血压 -->
            <div class="demo-section">
                <h3>低血压监测</h3>
                <BloodPressureChart :pressureData="lowData" :showHealthyRange="true" />
            </div>

            <!-- 波动较大 -->
            <div class="demo-section">
                <h3>血压波动监测</h3>
                <BloodPressureChart :pressureData="fluctuatingData" :showHealthyRange="true" />
            </div>

            <!-- 自定义颜色 -->
            <div class="demo-section">
                <h3>自定义配色</h3>
                <BloodPressureChart :pressureData="customData" systolicColor="#8b5cf6" diastolicColor="#06b6d4"
                    :showHealthyRange="true" />
            </div>

            <!-- 血压标准说明 -->
            <div class="info-panel">
                <h3>血压标准说明</h3>
                <div class="pressure-ranges">
                    <div class="pressure-category">
                        <div class="category-header">
                            <span class="category-name">理想血压</span>
                            <span class="category-value">120/80 mmHg</span>
                        </div>
                        <div class="category-desc">收缩压 ≤120，舒张压 ≤80</div>
                    </div>
                    <div class="pressure-category">
                        <div class="category-header healthy">
                            <span class="category-name">正常范围</span>
                            <span class="category-value">90-140/60-90</span>
                        </div>
                        <div class="category-desc">收缩压 90-140，舒张压 60-90</div>
                    </div>
                    <div class="pressure-category">
                        <div class="category-header warning">
                            <span class="category-name">偏高</span>
                            <span class="category-value">140-160/90-100</span>
                        </div>
                        <div class="category-desc">需要关注，建议调整生活方式</div>
                    </div>
                    <div class="pressure-category">
                        <div class="category-header danger">
                            <span class="category-name">高血压</span>
                            <span class="category-value">&gt;160/&gt;100</span>
                        </div>
                        <div class="category-desc">建议就医咨询，可能需要药物治疗</div>
                    </div>
                </div>

                <div class="tips-section">
                    <h4>测量建议</h4>
                    <ul class="tips-list">
                        <li>每天同一时间测量，最好早晨起床后</li>
                        <li>测量前静坐休息5-10分钟</li>
                        <li>避免在运动、吸烟或饮酒后测量</li>
                        <li>连续测量2-3次，取平均值</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import BloodPressureChart from '../../../packages/src/components/BloodPressureChart/index.vue';

export default {
    name: 'BloodPressureChartDemo',
    components: {
        BloodPressureChart
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
            // 正常血压数据
            normalData: [
                { date: '1/1', systolic: 118, diastolic: 78 },
                { date: '1/3', systolic: 120, diastolic: 80 },
                { date: '1/5', systolic: 116, diastolic: 76 },
                { date: '1/7', systolic: 122, diastolic: 82 },
                { date: '1/9', systolic: 119, diastolic: 79 },
                { date: '1/11', systolic: 121, diastolic: 81 },
                { date: '1/13', systolic: 117, diastolic: 77 }
            ],

            // 高血压数据
            highData: [
                { date: '12/18', systolic: 155, diastolic: 98 },
                { date: '12/20', systolic: 152, diastolic: 96 },
                { date: '12/22', systolic: 148, diastolic: 94 },
                { date: '12/24', systolic: 145, diastolic: 92 },
                { date: '12/26', systolic: 142, diastolic: 90 },
                { date: '12/28', systolic: 138, diastolic: 88 },
                { date: '12/30', systolic: 135, diastolic: 86 }
            ],

            // 低血压数据
            lowData: [
                { date: '2/1', systolic: 95, diastolic: 62 },
                { date: '2/3', systolic: 92, diastolic: 60 },
                { date: '2/5', systolic: 88, diastolic: 58 },
                { date: '2/7', systolic: 90, diastolic: 59 },
                { date: '2/9', systolic: 94, diastolic: 61 },
                { date: '2/11', systolic: 96, diastolic: 63 },
                { date: '2/13', systolic: 93, diastolic: 60 }
            ],

            // 波动数据
            fluctuatingData: [
                { date: '周一', systolic: 125, diastolic: 82 },
                { date: '周二', systolic: 140, diastolic: 92 },
                { date: '周三', systolic: 118, diastolic: 78 },
                { date: '周四', systolic: 145, diastolic: 95 },
                { date: '周五', systolic: 122, diastolic: 80 },
                { date: '周六', systolic: 138, diastolic: 88 },
                { date: '周日', systolic: 115, diastolic: 75 }
            ],

            // 自定义颜色数据
            customData: [
                { date: '8:00', systolic: 120, diastolic: 78 },
                { date: '10:00', systolic: 122, diastolic: 80 },
                { date: '12:00', systolic: 125, diastolic: 82 },
                { date: '14:00', systolic: 128, diastolic: 84 },
                { date: '16:00', systolic: 124, diastolic: 81 },
                { date: '18:00', systolic: 121, diastolic: 79 },
                { date: '20:00', systolic: 118, diastolic: 76 },
                { date: '22:00', systolic: 115, diastolic: 74 }
            ]
        };
    }
};
</script>

<style scoped>
.blood-pressure-chart-demo {
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
    font-weight: 600;
}

.pressure-ranges {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.pressure-category {
    padding: 12px;
    background: #f7f8fa;
    border-radius: 12px;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.category-header.healthy {
    color: #22c55e;
}

.category-header.warning {
    color: #f59e0b;
}

.category-header.danger {
    color: #ef4444;
}

.category-name {
    font-size: 14px;
    font-weight: 600;
}

.category-value {
    font-size: 13px;
    font-weight: 600;
}

.category-desc {
    font-size: 12px;
    color: #999;
}

.tips-section {
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
}

.tips-section h4 {
    font-size: 14px;
    color: #333;
    margin-bottom: 12px;
    font-weight: 600;
}

.tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tips-list li {
    font-size: 13px;
    color: #666;
    padding: 6px 0;
    padding-left: 16px;
    position: relative;
}

.tips-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #4facfe;
    font-weight: bold;
}
</style>
