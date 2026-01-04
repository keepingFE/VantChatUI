<template>
    <div class="weekly-stat-card">
        <!-- 卡片头部 -->
        <div class="card-header">
            <div class="period-info">
                <div class="period-label">{{ periodLabel }}</div>
                <div class="date-range">{{ dateRange }}</div>
            </div>
            <div class="summary-badge" :class="trendClass">
                <span class="trend-icon">{{ trendIcon }}</span>
                <span class="trend-text">{{ trendText }}</span>
            </div>
        </div>

        <!-- 主要统计数据 -->
        <div class="main-stats">
            <div class="stat-item" v-for="stat in mainStats" :key="stat.key">
                <div class="stat-icon" :style="{ background: stat.color }">
                    <span>{{ stat.icon }}</span>
                </div>
                <div class="stat-content">
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-value">
                        {{ stat.value }}
                        <span class="stat-unit">{{ stat.unit }}</span>
                    </div>
                    <div class="stat-change" :class="stat.changeClass">
                        {{ stat.change }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 每日数据概览 -->
        <div class="daily-overview" v-if="showDailyData">
            <div class="overview-title">每日概览</div>
            <div class="daily-grid">
                <div class="day-item" v-for="day in dailyData" :key="day.date">
                    <div class="day-name">{{ day.dayName }}</div>
                    <div class="day-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"
                                :style="{ width: day.progress + '%', background: progressColor }">
                            </div>
                        </div>
                    </div>
                    <div class="day-value">{{ day.value }}</div>
                </div>
            </div>
        </div>

        <!-- 成就标签 -->
        <div class="achievements" v-if="achievements.length > 0">
            <div class="achievement-tag" v-for="achievement in achievements" :key="achievement.id">
                <span class="achievement-icon">{{ achievement.icon }}</span>
                <span class="achievement-text">{{ achievement.text }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeeklyStatCard',
    props: {
        /**
         * 周期标签
         */
        periodLabel: {
            type: String,
            default: '本周总结'
        },
        /**
         * 日期范围
         */
        dateRange: {
            type: String,
            default: '12月18日 - 12月24日'
        },
        /**
         * 主要统计数据
         * @type {Array<{key: string, label: string, value: number, unit: string, change: string, icon: string, color: string}>}
         */
        mainStats: {
            type: Array,
            default: () => [
                {
                    key: 'steps',
                    label: '总步数',
                    value: 52341,
                    unit: '步',
                    change: '比上周 +12%',
                    icon: '👟',
                    color: 'linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%)',
                    changeClass: 'positive'
                },
                {
                    key: 'calories',
                    label: '消耗卡路里',
                    value: 2840,
                    unit: '千卡',
                    change: '比上周 +8%',
                    icon: '🔥',
                    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    changeClass: 'positive'
                },
                {
                    key: 'duration',
                    label: '运动时长',
                    value: 186,
                    unit: '分钟',
                    change: '比上周 -3%',
                    icon: '⏱️',
                    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    changeClass: 'negative'
                }
            ]
        },
        /**
         * 每日数据
         */
        dailyData: {
            type: Array,
            default: () => [
                { date: '12/18', dayName: '周一', value: 8432, progress: 84 },
                { date: '12/19', dayName: '周二', value: 12567, progress: 100 },
                { date: '12/20', dayName: '周三', value: 9821, progress: 98 },
                { date: '12/21', dayName: '周四', value: 11234, progress: 100 },
                { date: '12/22', dayName: '周五', value: 10567, progress: 100 },
                { date: '12/23', dayName: '周六', value: 15432, progress: 100 },
                { date: '12/24', dayName: '周日', value: 7890, progress: 79 }
            ]
        },
        /**
         * 是否显示每日数据
         */
        showDailyData: {
            type: Boolean,
            default: true
        },
        /**
         * 进度条颜色
         */
        progressColor: {
            type: String,
            default: '#4facfe'
        },
        /**
         * 成就标签
         */
        achievements: {
            type: Array,
            default: () => [
                { id: 1, icon: '🏆', text: '连续5天达标' },
                { id: 2, icon: '⚡', text: '最佳记录' }
            ]
        },
        /**
         * 趋势状态：'up' | 'down' | 'stable'
         */
        trend: {
            type: String,
            default: 'up',
            validator: (value) => ['up', 'down', 'stable'].includes(value)
        }
    },
    computed: {
        trendClass() {
            return `trend-${this.trend}`;
        },
        trendIcon() {
            const icons = {
                up: '📈',
                down: '📉',
                stable: '➡️'
            };
            return icons[this.trend] || icons.stable;
        },
        trendText() {
            const texts = {
                up: '表现优秀',
                down: '需要加油',
                stable: '保持稳定'
            };
            return texts[this.trend] || texts.stable;
        }
    }
};
</script>

<style scoped>
.weekly-stat-card {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
}

.period-info {
    flex: 1;
}

.period-label {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
}

.date-range {
    font-size: 13px;
    color: #999;
}

.summary-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
}

.summary-badge.trend-up {
    background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
    color: #2d7a4f;
}

.summary-badge.trend-down {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    color: #c44536;
}

.summary-badge.trend-stable {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    color: #5a6c7d;
}

.trend-icon {
    font-size: 14px;
}

.main-stats {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f7f8fa;
    border-radius: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.stat-item:active {
    transform: scale(0.98);
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
    min-width: 0;
}

.stat-label {
    font-size: 13px;
    color: #999;
    margin-bottom: 4px;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 2px;
}

.stat-unit {
    font-size: 14px;
    font-weight: 500;
    color: #666;
    margin-left: 4px;
}

.stat-change {
    font-size: 12px;
    font-weight: 500;
}

.stat-change.positive {
    color: #34c759;
}

.stat-change.negative {
    color: #ff3b30;
}

.daily-overview {
    margin-bottom: 20px;
}

.overview-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}

.daily-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.day-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.day-name {
    width: 42px;
    font-size: 13px;
    color: #666;
    font-weight: 500;
    flex-shrink: 0;
}

.day-progress {
    flex: 1;
    min-width: 0;
}

.progress-bar {
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.day-value {
    width: 60px;
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    flex-shrink: 0;
}

.achievements {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
}

.achievement-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #c44536;
}

.achievement-icon {
    font-size: 14px;
}
</style>
