<template>
    <div class="activity-ring-chart">
        <div ref="chartContainer" class="chart-container"></div>

        <!-- 数据详情 -->
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-icon move"></div>
                <div class="stat-info">
                    <div class="stat-label">移动</div>
                    <div class="stat-value">{{ activityData.move.current }}/{{ activityData.move.goal }} 千卡</div>
                    <div class="stat-progress">{{ moveProgress }}%</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon exercise"></div>
                <div class="stat-info">
                    <div class="stat-label">锻炼</div>
                    <div class="stat-value">{{ activityData.exercise.current }}/{{ activityData.exercise.goal }} 分钟
                    </div>
                    <div class="stat-progress">{{ exerciseProgress }}%</div>
                </div>
            </div>
            <div class="stat-item">
                <div class="stat-icon stand"></div>
                <div class="stat-info">
                    <div class="stat-label">站立</div>
                    <div class="stat-value">{{ activityData.stand.current }}/{{ activityData.stand.goal }} 小时</div>
                    <div class="stat-progress">{{ standProgress }}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GaugeChart, CanvasRenderer]);

export default {
    name: 'ActivityRingChart',
    props: {
        /**
         * 活动数据
         * @type {Object}
         * @property {Object} move - 移动数据 {current: number, goal: number}
         * @property {Object} exercise - 锻炼数据 {current: number, goal: number}
         * @property {Object} stand - 站立数据 {current: number, goal: number}
         */
        activityData: {
            type: Object,
            default: () => ({
                move: { current: 350, goal: 500 },      // 卡路里
                exercise: { current: 25, goal: 30 },    // 分钟
                stand: { current: 10, goal: 12 }        // 小时
            })
        },
        /**
         * 环的颜色配置
         */
        colors: {
            type: Object,
            default: () => ({
                move: '#ff3b30',      // 红色 - 移动
                exercise: '#34c759',  // 绿色 - 锻炼
                stand: '#00c7be'      // 青色 - 站立
            })
        },
        /**
         * 图表尺寸
         */
        size: {
            type: Number,
            default: 280
        }
    },
    data() {
        return {
            chart: null
        };
    },
    computed: {
        moveProgress() {
            return Math.round((this.activityData.move.current / this.activityData.move.goal) * 100);
        },
        exerciseProgress() {
            return Math.round((this.activityData.exercise.current / this.activityData.exercise.goal) * 100);
        },
        standProgress() {
            return Math.round((this.activityData.stand.current / this.activityData.stand.goal) * 100);
        }
    },
    mounted() {
        this.initChart();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if (this.chart) {
            this.chart.dispose();
        }
    },
    watch: {
        activityData: {
            handler() {
                this.updateChart();
            },
            deep: true
        }
    },
    methods: {
        initChart() {
            if (!this.$refs.chartContainer) return;

            this.chart = echarts.init(this.$refs.chartContainer);
            this.updateChart();
        },
        updateChart() {
            if (!this.chart) return;

            const option = {
                series: [
                    // 移动环（最外层）
                    {
                        name: '移动',
                        type: 'gauge',
                        radius: '85%',
                        center: ['50%', '50%'],
                        startAngle: 90,
                        endAngle: -270,
                        min: 0,
                        max: 100,
                        progress: {
                            show: true,
                            width: 18,
                            itemStyle: {
                                color: this.colors.move
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                width: 18,
                                color: [[1, 'rgba(255, 59, 48, 0.15)']]
                            }
                        },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: false },
                        pointer: { show: false },
                        detail: { show: false },
                        data: [{ value: this.moveProgress }]
                    },
                    // 锻炼环（中间层）
                    {
                        name: '锻炼',
                        type: 'gauge',
                        radius: '65%',
                        center: ['50%', '50%'],
                        startAngle: 90,
                        endAngle: -270,
                        min: 0,
                        max: 100,
                        progress: {
                            show: true,
                            width: 18,
                            itemStyle: {
                                color: this.colors.exercise
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                width: 18,
                                color: [[1, 'rgba(52, 199, 89, 0.15)']]
                            }
                        },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: false },
                        pointer: { show: false },
                        detail: { show: false },
                        data: [{ value: this.exerciseProgress }]
                    },
                    // 站立环（最内层）
                    {
                        name: '站立',
                        type: 'gauge',
                        radius: '45%',
                        center: ['50%', '50%'],
                        startAngle: 90,
                        endAngle: -270,
                        min: 0,
                        max: 100,
                        progress: {
                            show: true,
                            width: 18,
                            itemStyle: {
                                color: this.colors.stand
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                width: 18,
                                color: [[1, 'rgba(0, 199, 190, 0.15)']]
                            }
                        },
                        axisTick: { show: false },
                        splitLine: { show: false },
                        axisLabel: { show: false },
                        pointer: { show: false },
                        detail: { show: false },
                        data: [{ value: this.standProgress }]
                    }
                ]
            };

            this.chart.setOption(option);
        },
        handleResize() {
            if (this.chart) {
                this.chart.resize();
            }
        }
    }
};
</script>

<style scoped>
.activity-ring-chart {
    position: relative;
    width: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 16px;
}

.chart-container {
    width: 100%;
    height: 280px;
}

.stats-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 12px;
}

.stat-icon {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.stat-icon.move {
    background: #ff3b30;
}

.stat-icon.exercise {
    background: #34c759;
}

.stat-icon.stand {
    background: #00c7be;
}

.stat-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.stat-value {
    font-size: 15px;
    color: #333;
    font-weight: 600;
}

.stat-progress {
    font-size: 13px;
    color: #999;
}
</style>
