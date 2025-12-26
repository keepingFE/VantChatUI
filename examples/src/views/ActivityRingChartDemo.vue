<template>
    <div class="activity-ring-chart-demo">
        <van-nav-bar title="ActivityRingChart 运动活动三环" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 今日活动 -->
            <div class="demo-section">
                <h3>今日活动</h3>
                <ActivityRingChart :activityData="todayActivity" />
            </div>

            <!-- 高完成度 -->
            <div class="demo-section">
                <h3>高完成度示例</h3>
                <ActivityRingChart :activityData="highActivity" />
            </div>

            <!-- 低完成度 -->
            <div class="demo-section">
                <h3>低完成度示例</h3>
                <ActivityRingChart :activityData="lowActivity" />
            </div>

            <!-- 自定义颜色 -->
            <div class="demo-section">
                <h3>自定义配色</h3>
                <ActivityRingChart :activityData="customActivity" :colors="customColors" />
            </div>

            <!-- 说明卡片 -->
            <div class="info-panel">
                <h3>活动三环说明</h3>
                <div class="info-item">
                    <span class="ring-dot move"></span>
                    <div>
                        <div class="info-title">移动环（红色）</div>
                        <div class="info-desc">记录全天消耗的卡路里</div>
                    </div>
                </div>
                <div class="info-item">
                    <span class="ring-dot exercise"></span>
                    <div>
                        <div class="info-title">锻炼环（绿色）</div>
                        <div class="info-desc">记录高强度活动时长（分钟）</div>
                    </div>
                </div>
                <div class="info-item">
                    <span class="ring-dot stand"></span>
                    <div>
                        <div class="info-title">站立环（青色）</div>
                        <div class="info-desc">记录每小时站立活动次数</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import ActivityRingChart from '../../../packages/src/components/ActivityRingChart/index.vue';

export default {
    name: 'ActivityRingChartDemo',
    components: {
        ActivityRingChart
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
            // 今日活动数据
            todayActivity: {
                move: { current: 350, goal: 500 },
                exercise: { current: 25, goal: 30 },
                stand: { current: 10, goal: 12 }
            },
            // 高完成度
            highActivity: {
                move: { current: 520, goal: 500 },
                exercise: { current: 35, goal: 30 },
                stand: { current: 12, goal: 12 }
            },
            // 低完成度
            lowActivity: {
                move: { current: 180, goal: 500 },
                exercise: { current: 10, goal: 30 },
                stand: { current: 4, goal: 12 }
            },
            // 自定义数据
            customActivity: {
                move: { current: 420, goal: 600 },
                exercise: { current: 28, goal: 40 },
                stand: { current: 9, goal: 10 }
            },
            // 自定义颜色
            customColors: {
                move: '#ff6b6b',
                exercise: '#4ecdc4',
                stand: '#ffd93d'
            }
        };
    }
};
</script>

<style scoped>
.activity-ring-chart-demo {
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

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
}

.info-item:last-child {
    margin-bottom: 0;
}

.ring-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 2px;
}

.ring-dot.move {
    background: #ff3b30;
}

.ring-dot.exercise {
    background: #34c759;
}

.ring-dot.stand {
    background: #00c7be;
}

.info-title {
    font-size: 14px;
    color: #333;
    font-weight: 600;
    margin-bottom: 4px;
}

.info-desc {
    font-size: 13px;
    color: #999;
}
</style>
