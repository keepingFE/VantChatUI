<template>
    <div class="body-weight-chart">
        <div ref="chartContainer" class="chart-container"></div>

        <!-- 统计信息 -->
        <div class="stats-panel">
            <div class="stat-card">
                <div class="stat-label">当前体重</div>
                <div class="stat-value">{{ currentWeight }} <span class="unit">kg</span></div>
                <div class="stat-change" :class="weightChangeClass">{{ weightChange }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">当前BMI</div>
                <div class="stat-value">{{ currentBMI }}</div>
                <div class="stat-status" :style="{ color: bmiStatusColor }">{{ bmiStatus }}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">目标体重</div>
                <div class="stat-value">{{ goalWeight }} <span class="unit">kg</span></div>
                <div class="stat-progress">还差 {{ weightDiff }} kg</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, MarkLineComponent, MarkAreaComponent, LegendComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, MarkAreaComponent, LegendComponent, DataZoomComponent, CanvasRenderer]);

export default {
    name: 'BodyWeightChart',
    props: {
        /**
         * 体重数据数组
         * @type {Array<{date: string, weight: number, bmi?: number}>}
         */
        weightData: {
            type: Array,
            default: () => []
        },
        /**
         * 身高（cm）- 用于计算BMI
         */
        height: {
            type: Number,
            default: 170
        },
        /**
         * 目标体重（kg）
         */
        goalWeight: {
            type: Number,
            default: 65
        },
        /**
         * 主题颜色
         */
        primaryColor: {
            type: String,
            default: '#4facfe'
        },
        /**
         * 是否显示BMI曲线
         */
        showBMI: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            chart: null
        };
    },
    computed: {
        currentWeight() {
            if (this.weightData.length === 0) return 0;
            return this.weightData[this.weightData.length - 1].weight.toFixed(1);
        },
        currentBMI() {
            if (this.weightData.length === 0) return 0;
            const lastData = this.weightData[this.weightData.length - 1];
            const bmi = lastData.bmi || this.calculateBMI(lastData.weight);
            return bmi.toFixed(1);
        },
        bmiStatus() {
            const bmi = parseFloat(this.currentBMI);
            if (bmi < 18.5) return '偏瘦';
            if (bmi < 24) return '正常';
            if (bmi < 28) return '偏胖';
            return '肥胖';
        },
        bmiStatusColor() {
            const bmi = parseFloat(this.currentBMI);
            if (bmi < 18.5) return '#f59e0b';
            if (bmi < 24) return '#22c55e';
            if (bmi < 28) return '#f59e0b';
            return '#ef4444';
        },
        weightChange() {
            if (this.weightData.length < 2) return '--';
            const first = this.weightData[0].weight;
            const last = this.weightData[this.weightData.length - 1].weight;
            const diff = (last - first).toFixed(1);
            return diff > 0 ? `+${diff} kg` : `${diff} kg`;
        },
        weightChangeClass() {
            if (this.weightData.length < 2) return '';
            const first = this.weightData[0].weight;
            const last = this.weightData[this.weightData.length - 1].weight;
            return last > first ? 'increase' : 'decrease';
        },
        weightDiff() {
            const diff = Math.abs(parseFloat(this.currentWeight) - this.goalWeight);
            return diff.toFixed(1);
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
        weightData: {
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
            if (!this.chart || this.weightData.length === 0) return;

            const dates = this.weightData.map(item => item.date);
            const weights = this.weightData.map(item => item.weight);
            const bmis = this.weightData.map(item =>
                item.bmi || this.calculateBMI(item.weight)
            );

            const series = [
                // 体重曲线
                {
                    name: '体重',
                    type: 'line',
                    data: weights,
                    yAxisIndex: 0,
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
                    },
                    markLine: {
                        silent: true,
                        symbol: 'none',
                        label: {
                            show: true,
                            position: 'insideEndTop',
                            formatter: '目标',
                            color: '#ff6b6b',
                            fontSize: 11
                        },
                        lineStyle: {
                            type: 'dashed',
                            color: '#ff6b6b',
                            width: 2
                        },
                        data: [
                            { yAxis: this.goalWeight }
                        ]
                    }
                }
            ];

            // 添加BMI曲线
            if (this.showBMI) {
                series.push({
                    name: 'BMI',
                    type: 'line',
                    data: bmis,
                    yAxisIndex: 1,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 6,
                    lineStyle: {
                        width: 2,
                        color: '#a78bfa',
                        type: 'dashed'
                    },
                    itemStyle: {
                        color: '#a78bfa'
                    },
                    // BMI健康范围标识
                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: 'rgba(34, 197, 94, 0.1)'
                        },
                        data: [[
                            { yAxis: 18.5 },
                            { yAxis: 24 }
                        ]],
                        label: {
                            show: false
                        }
                    }
                });
            }

            const option = {
                grid: {
                    left: '45',
                    right: this.showBMI ? '50' : '20',
                    top: '50',
                    bottom: '80'
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
                            if (param.seriesName === '体重') {
                                const diff = (param.value - this.goalWeight).toFixed(1);
                                result += `${param.marker}体重: <strong>${param.value}</strong> kg`;
                                if (diff > 0) {
                                    result += ` <span style="color: #ef4444;">(+${diff})</span>`;
                                } else if (diff < 0) {
                                    result += ` <span style="color: #22c55e;">(${diff})</span>`;
                                }
                                result += '<br/>';
                            } else {
                                result += `${param.marker}BMI: <strong>${param.value}</strong><br/>`;
                            }
                        });
                        return result;
                    }
                },
                legend: {
                    data: this.showBMI ? ['体重', 'BMI'] : ['体重'],
                    bottom: 10,
                    textStyle: {
                        color: '#666',
                        fontSize: 12
                    }
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    boundaryGap: false,
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
                yAxis: [
                    // 体重Y轴
                    {
                        type: 'value',
                        name: '体重(kg)',
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
                            fontSize: 12
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#f0f0f0',
                                type: 'dashed'
                            }
                        }
                    },
                    // BMI Y轴
                    ...(this.showBMI ? [{
                        type: 'value',
                        name: 'BMI',
                        nameTextStyle: {
                            color: '#a78bfa',
                            fontSize: 12
                        },
                        min: 16,
                        max: 32,
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            color: '#a78bfa',
                            fontSize: 12
                        },
                        splitLine: {
                            show: false
                        }
                    }] : [])
                ],
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 100
                    }
                ],
                series: series
            };

            this.chart.setOption(option);
        },
        handleResize() {
            if (this.chart) {
                this.chart.resize();
            }
        },
        calculateBMI(weight) {
            const heightInMeters = this.height / 100;
            return weight / (heightInMeters * heightInMeters);
        },
        adjustColorAlpha(color, alpha) {
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
.body-weight-chart {
    position: relative;
    width: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 16px;
}

.chart-container {
    width: 100%;
    height: 300px;
    margin-bottom: 20px;
}

.stats-panel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.stat-card {
    padding: 16px;
    background: #f7f8fa;
    border-radius: 12px;
    text-align: center;
}

.stat-label {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
}

.stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 4px;
}

.stat-value .unit {
    font-size: 13px;
    font-weight: 500;
    color: #666;
    margin-left: 2px;
}

.stat-change {
    font-size: 12px;
    font-weight: 600;
}

.stat-change.increase {
    color: #ef4444;
}

.stat-change.decrease {
    color: #22c55e;
}

.stat-status {
    font-size: 12px;
    font-weight: 600;
}

.stat-progress {
    font-size: 12px;
    color: #999;
}
</style>
