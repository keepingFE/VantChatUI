<template>
    <div class="calorie-balance-chart-demo">
        <van-nav-bar title="CalorieBalanceChart 卡路里平衡图" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 减脂期 -->
            <div class="demo-section">
                <h3>减脂期（消耗大于摄入）</h3>
                <CalorieBalanceChart :calorieData="weightLossData" :targetIntake="1800" :showSuggestion="true" />
            </div>

            <!-- 维持期 -->
            <div class="demo-section">
                <h3>体重维持期（平衡状态）</h3>
                <CalorieBalanceChart :calorieData="maintenanceData" :targetIntake="2000" :showSuggestion="true" />
            </div>

            <!-- 增肌期 -->
            <div class="demo-section">
                <h3>增肌期（摄入大于消耗）</h3>
                <CalorieBalanceChart :calorieData="bulkingData" :targetIntake="2500" :showSuggestion="true" />
            </div>

            <!-- 自定义颜色 -->
            <div class="demo-section">
                <h3>自定义配色</h3>
                <CalorieBalanceChart chartTitle="本周卡路里对比" :calorieData="customData" intakeColor="#8b5cf6"
                    burnColor="#06b6d4" :showSuggestion="true" />
            </div>

            <!-- 卡路里知识 -->
            <div class="info-panel">
                <h3>卡路里平衡知识</h3>

                <div class="info-section">
                    <h4>📊 基础代谢率(BMR)</h4>
                    <div class="bmr-info">
                        <p>基础代谢率是维持生命基本活动所需的最低能量。</p>
                        <div class="formula-box">
                            <div class="formula-title">男性BMR计算：</div>
                            <div class="formula-text">10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5</div>
                        </div>
                        <div class="formula-box">
                            <div class="formula-title">女性BMR计算：</div>
                            <div class="formula-text">10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161</div>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h4>🎯 每日总消耗(TDEE)</h4>
                    <div class="tdee-table">
                        <div class="tdee-row">
                            <span class="activity-level">久坐不动</span>
                            <span class="multiplier">BMR × 1.2</span>
                        </div>
                        <div class="tdee-row">
                            <span class="activity-level">轻度活动</span>
                            <span class="multiplier">BMR × 1.375</span>
                        </div>
                        <div class="tdee-row">
                            <span class="activity-level">中度活动</span>
                            <span class="multiplier">BMR × 1.55</span>
                        </div>
                        <div class="tdee-row">
                            <span class="activity-level">高强度活动</span>
                            <span class="multiplier">BMR × 1.725</span>
                        </div>
                        <div class="tdee-row">
                            <span class="activity-level">专业运动员</span>
                            <span class="multiplier">BMR × 1.9</span>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h4>⚖️ 体重变化规律</h4>
                    <div class="weight-rules">
                        <div class="rule-item surplus">
                            <div class="rule-icon">📈</div>
                            <div class="rule-content">
                                <div class="rule-title">盈余7700千卡 ≈ 增重1公斤</div>
                                <div class="rule-desc">摄入持续大于消耗</div>
                            </div>
                        </div>
                        <div class="rule-item deficit">
                            <div class="rule-icon">📉</div>
                            <div class="rule-content">
                                <div class="rule-title">赤字7700千卡 ≈ 减重1公斤</div>
                                <div class="rule-desc">消耗持续大于摄入</div>
                            </div>
                        </div>
                        <div class="rule-item balanced">
                            <div class="rule-icon">⚖️</div>
                            <div class="rule-content">
                                <div class="rule-title">平衡状态 = 维持体重</div>
                                <div class="rule-desc">摄入≈消耗</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h4>💡 健康建议</h4>
                    <ul class="tips-list">
                        <li>减脂：每日赤字300-500千卡较健康</li>
                        <li>增肌：每日盈余200-400千卡配合力量训练</li>
                        <li>避免极端节食，每日摄入不低于基础代谢率</li>
                        <li>关注营养均衡，不只是关注总热量</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import CalorieBalanceChart from '../../../packages/src/components/CalorieBalanceChart/index.vue';

export default {
    name: 'CalorieBalanceChartDemo',
    components: {
        CalorieBalanceChart
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
            // 减脂期数据
            weightLossData: [
                { date: '周一', intake: 1650, burn: 2100 },
                { date: '周二', intake: 1580, burn: 2200 },
                { date: '周三', intake: 1720, burn: 2050 },
                { date: '周四', intake: 1600, burn: 2300 },
                { date: '周五', intake: 1680, burn: 2150 },
                { date: '周六', intake: 1550, burn: 2400 },
                { date: '周日', intake: 1750, burn: 1980 }
            ],

            // 维持期数据
            maintenanceData: [
                { date: '周一', intake: 2050, burn: 2100 },
                { date: '周二', intake: 1980, burn: 2020 },
                { date: '周三', intake: 2100, burn: 2050 },
                { date: '周四', intake: 2020, burn: 2080 },
                { date: '周五', intake: 2150, burn: 2100 },
                { date: '周六', intake: 1950, burn: 1980 },
                { date: '周日', intake: 2080, burn: 2050 }
            ],

            // 增肌期数据
            bulkingData: [
                { date: '周一', intake: 2650, burn: 2300 },
                { date: '周二', intake: 2800, burn: 2450 },
                { date: '周三', intake: 2700, burn: 2200 },
                { date: '周四', intake: 2900, burn: 2500 },
                { date: '周五', intake: 2750, burn: 2350 },
                { date: '周六', intake: 2850, burn: 2400 },
                { date: '周日', intake: 2600, burn: 2150 }
            ],

            // 自定义数据
            customData: [
                { date: '1/18', intake: 2200, burn: 2000 },
                { date: '1/19', intake: 1900, burn: 2300 },
                { date: '1/20', intake: 2100, burn: 2100 },
                { date: '1/21', intake: 2400, burn: 1950 },
                { date: '1/22', intake: 2000, burn: 2250 },
                { date: '1/23', intake: 2300, burn: 2400 },
                { date: '1/24', intake: 1850, burn: 2050 }
            ]
        };
    }
};
</script>

<style scoped>
.calorie-balance-chart-demo {
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
    margin-bottom: 20px;
    font-size: 15px;
    color: #333;
    font-weight: 600;
}

.info-section {
    margin-bottom: 24px;
}

.info-section:last-child {
    margin-bottom: 0;
}

.info-section h4 {
    font-size: 14px;
    color: #333;
    margin-bottom: 12px;
    font-weight: 600;
}

.bmr-info p {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
    line-height: 1.6;
}

.formula-box {
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;
    margin-bottom: 8px;
}

.formula-box:last-child {
    margin-bottom: 0;
}

.formula-title {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.formula-text {
    font-size: 13px;
    color: #333;
    font-weight: 500;
    font-family: monospace;
}

.tdee-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.tdee-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: #f7f8fa;
    border-radius: 8px;
}

.activity-level {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

.multiplier {
    font-size: 13px;
    color: #0ea5e9;
    font-weight: 600;
}

.weight-rules {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.rule-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
}

.rule-item.surplus {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.rule-item.deficit {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.rule-item.balanced {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.rule-icon {
    font-size: 28px;
    flex-shrink: 0;
}

.rule-content {
    flex: 1;
}

.rule-title {
    font-size: 14px;
    color: #333;
    font-weight: 600;
    margin-bottom: 2px;
}

.rule-desc {
    font-size: 12px;
    color: #666;
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
    color: #f59e0b;
    font-weight: bold;
}
</style>
