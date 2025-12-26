<template>
    <div class="blood-pressure-chart">
        <div ref="chartContainer" class="chart-container"></div>

        <!-- 统计信息 -->
        <div class="stats-panel">
            <div class="stat-card">
                <div class="stat-label">收缩压（高压）</div>
                <div class="stat-value">
                    {{ currentSystolic }}
                    <span class="unit">mmHg</span>
                </div>
                <div class="stat-status" :style="{ color: systolicStatusColor }">
                    {{ systolicStatus }}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">舒张压（低压）</div>
                <div class="stat-value">
                    {{ currentDiastolic }}
                    <span class="unit">mmHg</span>
                </div>
                <div class="stat-status" :style="{ color: diastolicStatusColor }">
                    {{ diastolicStatus }}
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">平均血压</div>
                <div class="stat-value">
                    {{ averageReading }}
                </div>
                <div class="stat-change">{{ trend }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, MarkAreaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, MarkAreaComponent, CanvasRenderer]);

export default {
    name: 'BloodPressureChart',
    props: {
        /**
         * 血压数据数组
         * @type {Array<{date: string, systolic: number, diastolic: number}>}
         * @property {string} date - 日期/时间
         * @property {number} systolic - 收缩压（高压）
         * @property {number} diastolic - 舒张压（低压）
         */
        pressureData: {
            type: Array,
            default: () => []
        },
        /**
         * 收缩压颜色
         */
        systolicColor: {
            type: String,
            default: '#ef4444'
        },
        /**
         * 舒张压颜色
         */
        diastolicColor: {
            type: String,
            default: '#3b82f6'
        },
        /**
         * 是否显示健康范围
         */
        showHealthyRange: {
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
        currentSystolic() {
            if (this.pressureData.length === 0) return '--';
            return this.pressureData[this.pressureData.length - 1].systolic;
        },
        currentDiastolic() {
            if (this.pressureData.length === 0) return '--';
            return this.pressureData[this.pressureData.length - 1].diastolic;
        },
        systolicStatus() {
            const value = this.currentSystolic;
            if (value === '--') return '--';
            if (value < 90) return '偏低';
            if (value <= 120) return '理想';
            if (value <= 140) return '正常';
            if (value <= 160) return '偏高';
            return '高血压';
        },
        systolicStatusColor() {
            const value = this.currentSystolic;
            if (value === '--') return '#999';
            if (value < 90) return '#f59e0b';
            if (value <= 120) return '#22c55e';
            if (value <= 140) return '#22c55e';
            if (value <= 160) return '#f59e0b';
            return '#ef4444';
        },
        diastolicStatus() {
            const value = this.currentDiastolic;
            if (value === '--') return '--';
            if (value < 60) return '偏低';
            if (value <= 80) return '理想';
            if (value <= 90) return '正常';
            if (value <= 100) return '偏高';
            return '高血压';
        },
        diastolicStatusColor() {
            const value = this.currentDiastolic;
            if (value === '--') return '#999';
            if (value < 60) return '#f59e0b';
            if (value <= 80) return '#22c55e';
            if (value <= 90) return '#22c55e';
            if (value <= 100) return '#f59e0b';
            return '#ef4444';
        },
        averageReading() {
            if (this.currentSystolic === '--') return '--';
            return `${this.currentSystolic}/${this.currentDiastolic}`;
        },
        trend() {
            if (this.pressureData.length < 2) return '暂无趋势';
            const first = this.pressureData[0];
            const last = this.pressureData[this.pressureData.length - 1];
            const systolicDiff = last.systolic - first.systolic;
            const diastolicDiff = last.diastolic - first.diastolic;

            if (Math.abs(systolicDiff) < 3 && Math.abs(diastolicDiff) < 2) {
                return '保持稳定';
            }
            if (systolicDiff > 0 || diastolicDiff > 0) {
                return '略有上升';
            }
            return '略有下降';
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
        pressureData: {
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
            if (!this.chart || this.pressureData.length === 0) return;

            const dates = this.pressureData.map(item => item.date);
            const systolic = this.pressureData.map(item => item.systolic);
            const diastolic = this.pressureData.map(item => item.diastolic);

            const option = {
                grid: {
                    left: '45',
                    right: '20',
                    top: '60',
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
                        const systolicValue = params[0].value;
                        const diastolicValue = params[1].value;
                        return `
                            <div style="padding: 4px 0;">
                                <div style="margin-bottom: 8px; font-weight: 600;">${params[0].name}</div>
                                <div style="margin-bottom: 4px;">
                                    ${params[0].marker}收缩压: <strong>${systolicValue}</strong> mmHg
                                </div>
                                <div>
                                    ${params[1].marker}舒张压: <strong>${diastolicValue}</strong> mmHg
                                </div>
                                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f0f0f0; color: #666; font-size: 12px;">
                                    血压: ${systolicValue}/${diastolicValue} mmHg
                                </div>
                            </div>
                        `;
                    }
                },
                legend: {
                    data: ['收缩压', '舒张压'],
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
                yAxis: {
                    type: 'value',
                    name: '血压(mmHg)',
                    nameTextStyle: {
                        color: '#666',
                        fontSize: 12
                    },
                    min: 50,
                    max: 180,
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
                series: [
                    // 收缩压曲线
                    {
                        name: '收缩压',
                        type: 'line',
                        data: systolic,
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: {
                            width: 3,
                            color: this.systolicColor
                        },
                        itemStyle: {
                            color: this.systolicColor,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: this.adjustColorAlpha(this.systolicColor, 0.3) },
                                { offset: 1, color: this.adjustColorAlpha(this.systolicColor, 0.05) }
                            ])
                        },
                        // 健康范围标识
                        ...(this.showHealthyRange ? {
                            markArea: {
                                silent: true,
                                itemStyle: {
                                    color: 'rgba(34, 197, 94, 0.08)'
                                },
                                data: [[
                                    { yAxis: 90 },
                                    { yAxis: 140 }
                                ]],
                                label: {
                                    show: false
                                }
                            }
                        } : {})
                    },
                    // 舒张压曲线
                    {
                        name: '舒张压',
                        type: 'line',
                        data: diastolic,
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 8,
                        lineStyle: {
                            width: 3,
                            color: this.diastolicColor
                        },
                        itemStyle: {
                            color: this.diastolicColor,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: this.adjustColorAlpha(this.diastolicColor, 0.3) },
                                { offset: 1, color: this.adjustColorAlpha(this.diastolicColor, 0.05) }
                            ])
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
.blood-pressure-chart {
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
    font-size: 12px;
    font-weight: 500;
    color: #666;
    margin-left: 2px;
}

.stat-status {
    font-size: 12px;
    font-weight: 600;
}

.stat-change {
    font-size: 12px;
    color: #666;
}
</style>
