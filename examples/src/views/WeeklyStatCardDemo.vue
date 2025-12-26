<template>
    <div class="weekly-stat-card-demo">
        <van-nav-bar title="WeeklyStatCard 健康周报统计" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 本周总结 -->
            <div class="demo-section">
                <h3>本周健康总结</h3>
                <WeeklyStatCard :mainStats="thisWeekStats" :dailyData="thisWeekDaily"
                    :achievements="thisWeekAchievements" trend="up" />
            </div>

            <!-- 运动数据 -->
            <div class="demo-section">
                <h3>本周运动数据</h3>
                <WeeklyStatCard periodLabel="运动周报" dateRange="12月18日 - 12月24日" :mainStats="exerciseStats"
                    :dailyData="exerciseDaily" :achievements="exerciseAchievements" progressColor="#34c759"
                    trend="up" />
            </div>

            <!-- 睡眠数据 -->
            <div class="demo-section">
                <h3>本周睡眠数据</h3>
                <WeeklyStatCard periodLabel="睡眠周报" dateRange="12月18日 - 12月24日" :mainStats="sleepStats"
                    :dailyData="sleepDaily" :achievements="sleepAchievements" progressColor="#a78bfa" trend="stable" />
            </div>

            <!-- 需要改进 -->
            <div class="demo-section">
                <h3>需要改进的周报</h3>
                <WeeklyStatCard periodLabel="本周总结" dateRange="12月11日 - 12月17日" :mainStats="poorStats"
                    :dailyData="poorDaily" :achievements="[]" trend="down" />
            </div>

            <!-- 无每日数据 -->
            <div class="demo-section">
                <h3>仅显示汇总数据</h3>
                <WeeklyStatCard periodLabel="月度总结" dateRange="12月1日 - 12月31日" :mainStats="monthlyStats"
                    :showDailyData="false" :achievements="monthlyAchievements" trend="up" />
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import WeeklyStatCard from '../../../packages/src/components/WeeklyStatCard/index.vue';

export default {
    name: 'WeeklyStatCardDemo',
    components: {
        WeeklyStatCard
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
            // 本周健康数据
            thisWeekStats: [
                {
                    key: 'steps',
                    label: '总步数',
                    value: 52341,
                    unit: '步',
                    change: '比上周 +12%',
                    icon: '👟',
                    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                    key: 'distance',
                    label: '运动距离',
                    value: 35.6,
                    unit: '公里',
                    change: '比上周 +15%',
                    icon: '🏃',
                    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    changeClass: 'positive'
                }
            ],
            thisWeekDaily: [
                { date: '12/18', dayName: '周一', value: 8432, progress: 84 },
                { date: '12/19', dayName: '周二', value: 12567, progress: 100 },
                { date: '12/20', dayName: '周三', value: 9821, progress: 98 },
                { date: '12/21', dayName: '周四', value: 11234, progress: 100 },
                { date: '12/22', dayName: '周五', value: 10567, progress: 100 },
                { date: '12/23', dayName: '周六', value: 15432, progress: 100 },
                { date: '12/24', dayName: '周日', value: 7890, progress: 79 }
            ],
            thisWeekAchievements: [
                { id: 1, icon: '🏆', text: '连续5天达标' },
                { id: 2, icon: '⚡', text: '周最佳记录' }
            ],

            // 运动数据
            exerciseStats: [
                {
                    key: 'duration',
                    label: '运动时长',
                    value: 186,
                    unit: '分钟',
                    change: '比上周 +22%',
                    icon: '⏱️',
                    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    changeClass: 'positive'
                },
                {
                    key: 'sessions',
                    label: '运动次数',
                    value: 12,
                    unit: '次',
                    change: '比上周 +3次',
                    icon: '💪',
                    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                    changeClass: 'positive'
                }
            ],
            exerciseDaily: [
                { date: '12/18', dayName: '周一', value: 25, progress: 83 },
                { date: '12/19', dayName: '周二', value: 30, progress: 100 },
                { date: '12/20', dayName: '周三', value: 28, progress: 93 },
                { date: '12/21', dayName: '周四', value: 32, progress: 100 },
                { date: '12/22', dayName: '周五', value: 26, progress: 87 },
                { date: '12/23', dayName: '周六', value: 35, progress: 100 },
                { date: '12/24', dayName: '周日', value: 10, progress: 33 }
            ],
            exerciseAchievements: [
                { id: 1, icon: '🎯', text: '完成周目标' },
                { id: 2, icon: '🔥', text: '连续7天打卡' }
            ],

            // 睡眠数据
            sleepStats: [
                {
                    key: 'avgSleep',
                    label: '平均睡眠',
                    value: 7.2,
                    unit: '小时',
                    change: '比上周 +0.3小时',
                    icon: '😴',
                    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    changeClass: 'positive'
                },
                {
                    key: 'deepSleep',
                    label: '深睡平均',
                    value: 2.5,
                    unit: '小时',
                    change: '比上周持平',
                    icon: '🌙',
                    color: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                    changeClass: 'stable'
                }
            ],
            sleepDaily: [
                { date: '12/18', dayName: '周一', value: 7.2, progress: 90 },
                { date: '12/19', dayName: '周二', value: 7.8, progress: 98 },
                { date: '12/20', dayName: '周三', value: 6.9, progress: 86 },
                { date: '12/21', dayName: '周四', value: 7.5, progress: 94 },
                { date: '12/22', dayName: '周五', value: 6.8, progress: 85 },
                { date: '12/23', dayName: '周六', value: 8.2, progress: 100 },
                { date: '12/24', dayName: '周日', value: 7.0, progress: 88 }
            ],
            sleepAchievements: [
                { id: 1, icon: '✨', text: '睡眠质量优秀' }
            ],

            // 较差数据
            poorStats: [
                {
                    key: 'steps',
                    label: '总步数',
                    value: 31240,
                    unit: '步',
                    change: '比上周 -25%',
                    icon: '👟',
                    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    changeClass: 'negative'
                },
                {
                    key: 'active',
                    label: '活动天数',
                    value: 3,
                    unit: '天',
                    change: '比上周 -4天',
                    icon: '📅',
                    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    changeClass: 'negative'
                }
            ],
            poorDaily: [
                { date: '12/11', dayName: '周一', value: 3200, progress: 32 },
                { date: '12/12', dayName: '周二', value: 5600, progress: 56 },
                { date: '12/13', dayName: '周三', value: 2100, progress: 21 },
                { date: '12/14', dayName: '周四', value: 8900, progress: 89 },
                { date: '12/15', dayName: '周五', value: 4200, progress: 42 },
                { date: '12/16', dayName: '周六', value: 6800, progress: 68 },
                { date: '12/17', dayName: '周日', value: 440, progress: 4 }
            ],

            // 月度数据
            monthlyStats: [
                {
                    key: 'totalSteps',
                    label: '月度总步数',
                    value: 234567,
                    unit: '步',
                    change: '比上月 +18%',
                    icon: '🎉',
                    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    changeClass: 'positive'
                },
                {
                    key: 'activeDays',
                    label: '活跃天数',
                    value: 25,
                    unit: '天',
                    change: '比上月 +5天',
                    icon: '📈',
                    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    changeClass: 'positive'
                }
            ],
            monthlyAchievements: [
                { id: 1, icon: '👑', text: '月度达人' },
                { id: 2, icon: '🏅', text: '坚持不懈' },
                { id: 3, icon: '💎', text: '新记录' }
            ]
        };
    }
};
</script>

<style scoped>
.weekly-stat-card-demo {
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
</style>
