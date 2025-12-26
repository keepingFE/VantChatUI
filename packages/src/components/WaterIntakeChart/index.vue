<template>
    <div class="water-intake-chart">
        <!-- 进度环 -->
        <div class="progress-ring-container">
            <div class="progress-ring">
                <svg width="200" height="200">
                    <!-- 背景圆环 -->
                    <circle cx="100" cy="100" :r="radius" fill="none" stroke="#e0f2fe" :stroke-width="strokeWidth" />
                    <!-- 进度圆环 -->
                    <circle cx="100" cy="100" :r="radius" fill="none" :stroke="progressColor"
                        :stroke-width="strokeWidth" :stroke-dasharray="circumference"
                        :stroke-dashoffset="progressOffset" stroke-linecap="round" transform="rotate(-90 100 100)"
                        class="progress-circle" />
                </svg>
                <div class="progress-content">
                    <div class="water-icon">💧</div>
                    <div class="progress-value">{{ currentIntake }}</div>
                    <div class="progress-unit">ml</div>
                    <div class="progress-percentage">{{ progressPercentage }}%</div>
                </div>
            </div>
            <div class="goal-info">目标: {{ goalIntake }} ml</div>
        </div>

        <!-- 每日记录图表 -->
        <div class="chart-section">
            <h4 class="section-title">每日饮水记录</h4>
            <div ref="chartContainer" class="chart-container"></div>
        </div>

        <!-- 饮水记录时间线 -->
        <div class="timeline-section" v-if="showTimeline && intakeRecords.length > 0">
            <h4 class="section-title">今日记录</h4>
            <div class="timeline-list">
                <div class="timeline-item" v-for="(record, index) in intakeRecords" :key="index">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="record-time">{{ record.time }}</div>
                        <div class="record-amount">{{ record.amount }} ml</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, MarkLineComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, GridComponent, TooltipComponent, MarkLineComponent, CanvasRenderer]);

export default {
    name: 'WaterIntakeChart',
    props: {
        /**
         * 当前饮水量（ml）
         */
        currentIntake: {
            type: Number,
            default: 0
        },
        /**
         * 目标饮水量（ml）
         */
        goalIntake: {
            type: Number,
            default: 2000
        },
        /**
         * 每日数据
         * @type {Array<{date: string, amount: number}>}
         */
        dailyData: {
            type: Array,
            default: () => []
        },
        /**
         * 今日饮水记录
         * @type {Array<{time: string, amount: number}>}
         */
        intakeRecords: {
            type: Array,
            default: () => []
        },
        /**
         * 进度颜色
         */
        progressColor: {
            type: String,
            default: '#0ea5e9'
        },
        /**
         * 是否显示时间线
         */
        showTimeline: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            chart: null,
            radius: 85,
            strokeWidth: 12
        };
    },
    computed: {
        progressPercentage() {
            return Math.min(Math.round((this.currentIntake / this.goalIntake) * 100), 100);
        },
        circumference() {
            return 2 * Math.PI * this.radius;
        },
        progressOffset() {
            const progress = Math.min(this.currentIntake / this.goalIntake, 1);
            return this.circumference * (1 - progress);
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
        dailyData: {
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
            if (!this.chart || this.dailyData.length === 0) return;

            const dates = this.dailyData.map(item => item.date);
            const amounts = this.dailyData.map(item => item.amount);

            const option = {
                grid: {
                    left: '45',
                    right: '20',
                    top: '30',
                    bottom: '40'
                },
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    },
                    formatter: (params) => {
                        const value = params[0].value;
                        const percentage = Math.round((value / this.goalIntake) * 100);
                        return `
                            <div style="padding: 4px 0;">
                                <div style="margin-bottom: 6px; font-weight: 600;">${params[0].name}</div>
                                <div style="margin-bottom: 4px;">
                                    ${params[0].marker}饮水量: <strong>${value}</strong> ml
                                </div>
                                <div style="color: ${percentage >= 100 ? '#22c55e' : '#f59e0b'}; font-size: 12px;">
                                    完成度: ${percentage}%
                                </div>
                            </div>
                        `;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisLine: {
                        lineStyle: {
                            color: '#e0e0e0'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#666',
                        fontSize: 12
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '饮水量(ml)',
                    nameTextStyle: {
                        color: '#666',
                        fontSize: 12
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#666',
                        fontSize: 12,
                        formatter: (value) => {
                            if (value >= 1000) {
                                return (value / 1000) + 'L';
                            }
                            return value;
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0',
                            type: 'dashed'
                        }
                    }
                },
                series: [
                    {
                        name: '饮水量',
                        type: 'bar',
                        data: amounts,
                        barWidth: '50%',
                        itemStyle: {
                            borderRadius: [8, 8, 0, 0],
                            color: (params) => {
                                const percentage = (params.value / this.goalIntake) * 100;
                                if (percentage >= 100) {
                                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                        { offset: 0, color: '#22c55e' },
                                        { offset: 1, color: '#86efac' }
                                    ]);
                                }
                                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: this.progressColor },
                                    { offset: 1, color: '#7dd3fc' }
                                ]);
                            }
                        },
                        markLine: {
                            silent: true,
                            symbol: 'none',
                            label: {
                                show: true,
                                position: 'insideEndTop',
                                formatter: '目标',
                                color: '#0ea5e9',
                                fontSize: 11
                            },
                            lineStyle: {
                                type: 'dashed',
                                color: '#0ea5e9',
                                width: 2
                            },
                            data: [
                                { yAxis: this.goalIntake }
                            ]
                        }
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
.water-intake-chart {
    position: relative;
    width: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 16px;
}

.progress-ring-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
}

.progress-ring {
    position: relative;
    width: 200px;
    height: 200px;
}

.progress-circle {
    transition: stroke-dashoffset 0.5s ease;
}

.progress-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.water-icon {
    font-size: 32px;
    margin-bottom: 8px;
}

.progress-value {
    font-size: 32px;
    font-weight: 700;
    color: #0ea5e9;
    line-height: 1;
}

.progress-unit {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
}

.progress-percentage {
    font-size: 16px;
    font-weight: 600;
    color: #999;
    margin-top: 8px;
}

.goal-info {
    font-size: 14px;
    color: #666;
    margin-top: 12px;
}

.chart-section {
    margin-bottom: 24px;
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}

.chart-container {
    width: 100%;
    height: 220px;
}

.timeline-section {
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
}

.timeline-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-height: 300px;
    overflow-y: auto;
}

.timeline-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.timeline-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
    flex-shrink: 0;
}

.timeline-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;
}

.record-time {
    font-size: 13px;
    color: #666;
}

.record-amount {
    font-size: 14px;
    font-weight: 600;
    color: #0ea5e9;
}
</style>
