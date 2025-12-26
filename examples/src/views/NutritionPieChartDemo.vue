<template>
    <div class="nutrition-pie-chart-demo">
        <van-nav-bar title="NutritionPieChart 营养摄入饼图" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 图表类型切换 -->
            <div class="control-panel">
                <van-button :type="chartType === 'pie' ? 'primary' : 'default'" size="small" @click="chartType = 'pie'">
                    饼图
                </van-button>
                <van-button :type="chartType === 'ring' ? 'primary' : 'default'" size="small"
                    @click="chartType = 'ring'">
                    环形图
                </van-button>
            </div>

            <!-- 今日营养摄入 -->
            <div class="demo-section">
                <h3>今日营养摄入</h3>
                <NutritionPieChart :nutritionData="todayData" :chartType="chartType" :showSummary="true" />
            </div>

            <!-- 本周平均营养摄入 -->
            <div class="demo-section">
                <h3>本周平均营养摄入</h3>
                <NutritionPieChart title="周平均营养" :nutritionData="weeklyData" :chartType="chartType"
                    :showSummary="true" />
            </div>

            <!-- 减脂期营养配比 -->
            <div class="demo-section">
                <h3>减脂期营养配比（推荐）</h3>
                <NutritionPieChart title="减脂营养方案" :nutritionData="weightLossData" :chartType="chartType"
                    :showSummary="true" />
            </div>

            <!-- 增肌期营养配比 -->
            <div class="demo-section">
                <h3>增肌期营养配比（推荐）</h3>
                <NutritionPieChart title="增肌营养方案" :nutritionData="bulkingData" :chartType="chartType"
                    :showSummary="true" />
            </div>

            <!-- 营养知识卡片 -->
            <div class="info-panel">
                <h3>💡 营养素知识</h3>

                <div class="info-section">
                    <h4>🥩 蛋白质（4千卡/克）</h4>
                    <ul class="tips-list">
                        <li>构建和修复肌肉组织</li>
                        <li>促进新陈代谢</li>
                        <li>建议：每公斤体重摄入1.2-2.0克</li>
                        <li>优质来源：鸡胸肉、鱼类、蛋类、豆制品</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h4>🍚 碳水化合物（4千卡/克）</h4>
                    <ul class="tips-list">
                        <li>身体主要能量来源</li>
                        <li>支持大脑和神经系统运作</li>
                        <li>减脂期：占总热量的30-40%</li>
                        <li>增肌期：占总热量的45-55%</li>
                        <li>优质来源：糙米、燕麦、红薯、全麦面包</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h4>🥑 脂肪（9千卡/克）</h4>
                    <ul class="tips-list">
                        <li>激素合成必需</li>
                        <li>帮助吸收脂溶性维生素</li>
                        <li>建议：占总热量的20-30%</li>
                        <li>优质来源：橄榄油、坚果、深海鱼、牛油果</li>
                    </ul>
                </div>

                <div class="info-section">
                    <h4>📊 营养配比建议</h4>
                    <div class="ratio-cards">
                        <div class="ratio-card loss">
                            <div class="ratio-title">减脂期</div>
                            <div class="ratio-item">蛋白质：30-35%</div>
                            <div class="ratio-item">碳水：30-40%</div>
                            <div class="ratio-item">脂肪：25-30%</div>
                        </div>
                        <div class="ratio-card maintain">
                            <div class="ratio-title">维持期</div>
                            <div class="ratio-item">蛋白质：25-30%</div>
                            <div class="ratio-item">碳水：40-50%</div>
                            <div class="ratio-item">脂肪：20-30%</div>
                        </div>
                        <div class="ratio-card bulk">
                            <div class="ratio-title">增肌期</div>
                            <div class="ratio-item">蛋白质：25-30%</div>
                            <div class="ratio-item">碳水：45-55%</div>
                            <div class="ratio-item">脂肪：20-25%</div>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h4>⚠️ 注意事项</h4>
                    <ul class="tips-list">
                        <li>营养配比应根据个人目标、活动量和体质调整</li>
                        <li>关注食物质量，不只是宏量营养素比例</li>
                        <li>保证充足的微量营养素（维生素、矿物质）</li>
                        <li>规律饮食，避免极端节食</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import NutritionPieChart from '../../../packages/src/components/NutritionPieChart/index.vue';

export default {
    name: 'NutritionPieChartDemo',
    components: {
        NutritionPieChart
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
            chartType: 'pie',
            // 今日数据
            todayData: [
                { name: '蛋白质', value: 85, calories: 340, color: '#FF6B6B' },
                { name: '碳水化合物', value: 180, calories: 720, color: '#4ECDC4' },
                { name: '脂肪', value: 50, calories: 450, color: '#FFD93D' },
                { name: '膳食纤维', value: 25, calories: 50, color: '#A8E6CF' }
            ],
            // 本周平均数据
            weeklyData: [
                { name: '蛋白质', value: 90, calories: 360, color: '#FF6B6B' },
                { name: '碳水化合物', value: 200, calories: 800, color: '#4ECDC4' },
                { name: '脂肪', value: 55, calories: 495, color: '#FFD93D' },
                { name: '膳食纤维', value: 30, calories: 60, color: '#A8E6CF' }
            ],
            // 减脂期推荐配比 (总计约1600千卡)
            weightLossData: [
                { name: '蛋白质', value: 130, calories: 520, color: '#FF6B6B' },    // 32.5%
                { name: '碳水化合物', value: 150, calories: 600, color: '#4ECDC4' }, // 37.5%
                { name: '脂肪', value: 45, calories: 405, color: '#FFD93D' },       // 25.3%
                { name: '膳食纤维', value: 35, calories: 75, color: '#A8E6CF' }     // 4.7%
            ],
            // 增肌期推荐配比 (总计约2500千卡)
            bulkingData: [
                { name: '蛋白质', value: 160, calories: 640, color: '#FF6B6B' },    // 25.6%
                { name: '碳水化合物', value: 320, calories: 1280, color: '#4ECDC4' }, // 51.2%
                { name: '脂肪', value: 60, calories: 540, color: '#FFD93D' },       // 21.6%
                { name: '膳食纤维', value: 40, calories: 40, color: '#A8E6CF' }     // 1.6%
            ]
        };
    }
};
</script>

<style scoped>
.nutrition-pie-chart-demo {
    background: #f5f5f5;
    min-height: 100vh;
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

.info-panel {
    background: #fff;
    padding: 20px;
    border-radius: 16px;
    margin-top: 20px;
}

.info-panel h3 {
    margin-bottom: 20px;
    font-size: 18px;
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
    font-size: 15px;
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
    line-height: 1.6;
}

.tips-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #4ECDC4;
    font-weight: bold;
}

.ratio-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-top: 12px;
}

.ratio-card {
    padding: 16px;
    border-radius: 12px;
    text-align: center;
}

.ratio-card.loss {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.ratio-card.maintain {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.ratio-card.bulk {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.ratio-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}

.ratio-item {
    font-size: 12px;
    color: #666;
    padding: 4px 0;
}
</style>
