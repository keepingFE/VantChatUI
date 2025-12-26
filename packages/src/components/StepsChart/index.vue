<template>
    <div class="steps-chart">
        <div ref="chartContainer" class="chart-container"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default {
    name: 'StepsChart',
    props: {
        /**
         * 步数数据数组
         * @type {Array<{date: string, steps: number, goal?: number}>}
         * @property {string} date - 日期（如：'1/1', '周一'）
         * @property {number} steps - 步数
         * @property {number} goal - 目标步数（可选，默认10000）
         */
        stepsData: {
            type: Array,
            default: () => []
        },
        /**
         * 图表类型：'bar' 柱状图 | 'line' 折线图
         */
        chartType: {
            type: String,
            default: 'bar',
            validator: (value) => ['bar', 'line'].includes(value)
        },
        /**
         * 主色调
         */
        primaryColor: {
            type: String,
            default: '#4facfe'
        },
        /**
         * 目标线颜色
         */
        goalColor: {
            type: String,
            default: '#ff6b6b'
        },
        /**
         * 是否显示目标线
         */
        showGoal: {
            type: Boolean,
            default: true
        },
        /**
         * 默认目标步数
         */
        defaultGoal: {
            type: Number,
            default: 10000
        }
    },
    data() {
        return {
            chart: null
        };
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
        stepsData: {
            handler() {
                this.updateChart();
            },
            deep: true
        },
        chartType() {
            this.updateChart();
        }
    },
    methods: {
        initChart() {
            if (!this.$refs.chartContainer) return;

            this.chart = echarts.init(this.$refs.chartContainer);
            this.updateChart();
        },
        updateChart() {
            if (!this.chart || this.stepsData.length === 0) return;

            const dates = this.stepsData.map(item => item.date);
            const steps = this.stepsData.map(item => item.steps);
            const goalValue = this.defaultGoal;

            // 计算最大值用于y轴范围
            const maxSteps = Math.max(...steps, goalValue);
            const yMax = Math.ceil(maxSteps / 5000) * 5000;

            const series = [];

            // 添加主数据系列
            if (this.chartType === 'bar') {
                series.push({
                    name: '步数',
                    type: 'bar',
                    data: steps,
                    barWidth: '40%',
                    itemStyle: {
                        borderRadius: [8, 8, 0, 0],
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: this.primaryColor },
                            { offset: 1, color: this.adjustColorAlpha(this.primaryColor, 0.6) }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: this.primaryColor
                        }
                    }
                });
            } else {
                series.push({
                    name: '步数',
                    type: 'line',
                    data: steps,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3,
                        color: this.primaryColor
                    },
                    itemStyle: {
                        color: this.primaryColor,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: this.adjustColorAlpha(this.primaryColor, 0.3) },
                            { offset: 1, color: this.adjustColorAlpha(this.primaryColor, 0.05) }
                        ])
                    }
                });
            }

            // 添加目标线
            if (this.showGoal) {
                series.push({
                    name: '目标',
                    type: 'line',
                    data: new Array(dates.length).fill(goalValue),
                    lineStyle: {
                        type: 'dashed',
                        width: 2,
                        color: this.goalColor
                    },
                    symbol: 'none',
                    itemStyle: {
                        color: this.goalColor
                    }
                });
            }

            const option = {
                grid: {
                    left: '45',
                    right: '20',
                    top: '50',
                    bottom: '50'
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
                        let result = `${params[0].name}<br/>`;
                        params.forEach(param => {
                            if (param.seriesName === '步数') {
                                const percentage = ((param.value / goalValue) * 100).toFixed(0);
                                result += `${param.marker}${param.seriesName}: <strong>${param.value.toLocaleString()}</strong> 步 (${percentage}%)<br/>`;
                            } else {
                                result += `${param.marker}${param.seriesName}: ${param.value.toLocaleString()} 步<br/>`;
                            }
                        });
                        return result;
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
                    max: yMax,
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
                                return (value / 1000) + 'k';
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
                series: series
            };

            this.chart.setOption(option);
        },
        handleResize() {
            if (this.chart) {
                this.chart.resize();
            }
        },
        /**
         * 调整颜色透明度
         */
        adjustColorAlpha(color, alpha) {
            // 简单的 hex 转 rgba
            if (color.startsWith('#')) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            return color;
        }
    }
};
</script>

<style scoped>
.steps-chart {
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
</style>
