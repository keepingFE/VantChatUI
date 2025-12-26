<template>
    <div class="water-intake-chart-demo">
        <van-nav-bar title="WaterIntakeChart 水分摄入追踪" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 今日饮水 -->
            <div class="demo-section">
                <h3>今日饮水进度</h3>
                <WaterIntakeChart :currentIntake="1600" :goalIntake="2000" :dailyData="weekData"
                    :intakeRecords="todayRecords" :showTimeline="true" />
            </div>

            <!-- 已完成目标 -->
            <div class="demo-section">
                <h3>已完成每日目标</h3>
                <WaterIntakeChart :currentIntake="2200" :goalIntake="2000" :dailyData="completedWeekData"
                    :intakeRecords="[]" :showTimeline="false" />
            </div>

            <!-- 开始追踪 -->
            <div class="demo-section">
                <h3>刚开始追踪</h3>
                <WaterIntakeChart :currentIntake="400" :goalIntake="2000" :dailyData="newUserData"
                    :intakeRecords="earlyRecords" :showTimeline="true" />
            </div>

            <!-- 高目标 -->
            <div class="demo-section">
                <h3>运动日（高目标）</h3>
                <WaterIntakeChart :currentIntake="2800" :goalIntake="3000" :dailyData="athleteData"
                    :intakeRecords="athleteRecords" progressColor="#8b5cf6" :showTimeline="true" />
            </div>

            <!-- 饮水建议 -->
            <div class="info-panel">
                <h3>饮水健康知识</h3>

                <div class="info-section">
                    <h4>📊 每日建议饮水量</h4>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="info-label">成年人：</span>
                            <span class="info-value">1500-2000 ml</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">运动时：</span>
                            <span class="info-value">2500-3000 ml</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">儿童：</span>
                            <span class="info-value">1000-1500 ml</span>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h4>💧 饮水时间建议</h4>
                    <div class="time-suggestions">
                        <div class="time-item">
                            <div class="time-badge">7:00</div>
                            <div class="time-desc">起床后 · 200ml</div>
                        </div>
                        <div class="time-item">
                            <div class="time-badge">9:00</div>
                            <div class="time-desc">上班时 · 250ml</div>
                        </div>
                        <div class="time-item">
                            <div class="time-badge">11:30</div>
                            <div class="time-desc">午饭前 · 200ml</div>
                        </div>
                        <div class="time-item">
                            <div class="time-badge">15:00</div>
                            <div class="time-desc">下午茶 · 250ml</div>
                        </div>
                        <div class="time-item">
                            <div class="time-badge">17:30</div>
                            <div class="time-desc">下班时 · 200ml</div>
                        </div>
                        <div class="time-item">
                            <div class="time-badge">19:00</div>
                            <div class="time-desc">晚饭时 · 200ml</div>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h4>✨ 温馨提示</h4>
                    <ul class="tips-list">
                        <li>少量多次饮水，不要一次性大量饮水</li>
                        <li>睡前1小时减少饮水，避免夜间频繁起夜</li>
                        <li>运动前后及时补充水分</li>
                        <li>白开水是最佳选择，避免过量饮用饮料</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import WaterIntakeChart from '../../../packages/src/components/WaterIntakeChart/index.vue';

export default {
    name: 'WaterIntakeChartDemo',
    components: {
        WaterIntakeChart
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
            // 本周数据
            weekData: [
                { date: '周一', amount: 1800 },
                { date: '周二', amount: 2100 },
                { date: '周三', amount: 1650 },
                { date: '周四', amount: 2200 },
                { date: '周五', amount: 1900 },
                { date: '周六', amount: 2300 },
                { date: '周日', amount: 1600 }
            ],

            // 今日记录
            todayRecords: [
                { time: '07:30', amount: 200 },
                { time: '09:15', amount: 250 },
                { time: '11:00', amount: 300 },
                { time: '14:30', amount: 250 },
                { time: '16:45', amount: 300 },
                { time: '18:20', amount: 300 }
            ],

            // 完成目标周数据
            completedWeekData: [
                { date: '周一', amount: 2100 },
                { date: '周二', amount: 2300 },
                { date: '周三', amount: 2050 },
                { date: '周四', amount: 2400 },
                { date: '周五', amount: 2200 },
                { date: '周六', amount: 2500 },
                { date: '周日', amount: 2200 }
            ],

            // 新用户数据
            newUserData: [
                { date: '周一', amount: 800 },
                { date: '周二', amount: 1200 },
                { date: '周三', amount: 1500 },
                { date: '周四', amount: 1800 },
                { date: '周五', amount: 1600 },
                { date: '周六', amount: 900 },
                { date: '周日', amount: 400 }
            ],

            // 早期记录
            earlyRecords: [
                { time: '08:00', amount: 200 },
                { time: '10:30', amount: 200 }
            ],

            // 运动员数据
            athleteData: [
                { date: '周一', amount: 2800 },
                { date: '周二', amount: 3200 },
                { date: '周三', amount: 2900 },
                { date: '周四', amount: 3400 },
                { date: '周五', amount: 3100 },
                { date: '周六', amount: 3500 },
                { date: '周日', amount: 2800 }
            ],

            // 运动员记录
            athleteRecords: [
                { time: '06:00', amount: 300 },
                { time: '08:00', amount: 400 },
                { time: '10:00', amount: 300 },
                { time: '12:00', amount: 500 },
                { time: '14:00', amount: 400 },
                { time: '16:00', amount: 500 },
                { time: '18:00', amount: 400 }
            ]
        };
    }
};
</script>

<style scoped>
.water-intake-chart-demo {
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

.info-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f7f8fa;
    border-radius: 8px;
}

.info-label {
    font-size: 13px;
    color: #666;
}

.info-value {
    font-size: 13px;
    color: #0ea5e9;
    font-weight: 600;
}

.time-suggestions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.time-item {
    padding: 12px;
    background: #f7f8fa;
    border-radius: 12px;
    text-align: center;
}

.time-badge {
    font-size: 16px;
    font-weight: 700;
    color: #0ea5e9;
    margin-bottom: 4px;
}

.time-desc {
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
    content: '💧';
    position: absolute;
    left: 0;
}
</style>
