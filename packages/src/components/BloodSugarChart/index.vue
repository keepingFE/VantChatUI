<template>
    <div class="blood-sugar-chart">
        <div ref="chartContainer" class="chart-container"></div>

        <!-- 统计信息 -->
        <div class="stats-panel">
            <div class="stat-card">
                <div class="stat-label">最近血糖</div>
                <div class="stat-value" :style="{ color: currentStatusColor }">
                    {{ currentValue }}
                    <span class="unit">{{ unit }}</span>
                </div>
                <div class="stat-status">
                    <span class="badge" :style="{ backgroundColor: currentTypeColor }">{{ currentTypeLabel }}</span>
                    <span class="status-text" :style="{ color: currentStatusColor }">{{ currentStatus }}</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">平均血糖</div>
                <div class="stat-value">
                    {{ averageValue }}
                    <span class="unit">{{ unit }}</span>
                </div>
                <div class="stat-sub">
                    近 {{ sugarData.length }} 次记录
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-label">达标率</div>
                <div class="stat-value">
                    {{ complianceRate }}%
                </div>
                <div class="stat-sub">
                    血糖控制情况
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { LineChart, ScatterChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, MarkLineComponent, MarkAreaComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent, MarkLineComponent, MarkAreaComponent, CanvasRenderer]);

export default {
    name: 'BloodSugarChart',
    props: {
        /**
         * 血糖数据数组
         * @type {Array<{date: string, value: number, type: 'before_meal'|'after_meal'|'fasting'|'other'}>}
         */
        sugarData: {
            type: Array,
            default: () => []
        },
        unit: {
            type: String,
            default: 'mmol/L'
        }
    },
    data() {
        return {
            chart: null,
            typeMap: {
                'fasting': { label: '空腹', color: '#3b82f6' },
                'before_meal': { label: '餐前', color: '#10b981' },
                'after_meal': { label: '餐后', color: '#f59e0b' },
                'other': { label: '随机', color: '#8b5cf6' }
            }
        };
    },
    computed: {
        lastRecord() {
            if (!this.sugarData || this.sugarData.length === 0) return null;
            return this.sugarData[this.sugarData.length - 1];
        },
        currentValue() {
            return this.lastRecord ? this.lastRecord.value : '--';
        },
        currentType() {
            return this.lastRecord ? this.lastRecord.type : '';
        },
        currentTypeLabel() {
            return this.typeMap[this.currentType]?.label || '未知';
        },
        currentTypeColor() {
            return this.typeMap[this.currentType]?.color || '#999';
        },
        currentStatus() {
            if (!this.lastRecord) return '--';
            const { value, type } = this.lastRecord;
            return this.judgeStatus(value, type).label;
        },
        currentStatusColor() {
            if (!this.lastRecord) return '#333';
            const { value, type } = this.lastRecord;
            return this.judgeStatus(value, type).color;
        },
        averageValue() {
            if (!this.sugarData || this.sugarData.length === 0) return '--';
            const sum = this.sugarData.reduce((acc, cur) => acc + cur.value, 0);
            return (sum / this.sugarData.length).toFixed(1);
        },
        complianceRate() {
            if (!this.sugarData || this.sugarData.length === 0) return '--';
            const normalCount = this.sugarData.filter(item => {
                return this.judgeStatus(item.value, item.type).status === 'normal';
            }).length;
            return Math.round((normalCount / this.sugarData.length) * 100);
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
        sugarData: {
            handler() {
                this.updateChart();
            },
            deep: true
        }
    },
    methods: {
        judgeStatus(value, type) {
            let low, high;
            // 简单的标准设定，实际可能更复杂
            if (type === 'fasting' || type === 'before_meal') {
                low = 3.9;
                high = 6.1;
            } else if (type === 'after_meal') {
                low = 3.9;
                high = 7.8;
            } else {
                low = 3.9;
                high = 11.1; // 随机
            }

            if (value < low) return { label: '偏低', color: '#ef4444', status: 'low' };
            if (value > high) return { label: '偏高', color: '#f59e0b', status: 'high' };
            return { label: '正常', color: '#22c55e', status: 'normal' };
        },
        initChart() {
            if (!this.$refs.chartContainer) return;
            this.chart = echarts.init(this.$refs.chartContainer);
            this.updateChart();
        },
        updateChart() {
            if (!this.chart || this.sugarData.length === 0) return;

            const dates = this.sugarData.map(item => item.date);
            const values = this.sugarData.map(item => {
                const info = this.typeMap[item.type];
                return {
                    value: item.value,
                    itemStyle: {
                        color: info ? info.color : '#999',
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    name: info ? info.label : '未知'
                };
            });

            const option = {
                grid: {
                    left: '40',
                    right: '20',
                    top: '40',
                    bottom: '60',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: (params) => {
                        const param = params[0];
                        const dataIndex = param.dataIndex;
                        const originalData = this.sugarData[dataIndex];
                        const typeInfo = this.typeMap[originalData.type];
                        const status = this.judgeStatus(originalData.value, originalData.type);
                        
                        return `
                            <div style="font-size: 12px;">
                                <div style="color: #666; margin-bottom: 4px;">${originalData.date}</div>
                                <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">
                                    ${param.value} ${this.unit}
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:10px;background:${typeInfo.color};color:#fff;">
                                        ${typeInfo.label}
                                    </span>
                                    <span style="color: ${status.color}">${status.label}</span>
                                </div>
                            </div>
                        `;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: dates,
                    axisLine: { lineStyle: { color: '#eee' } },
                    axisLabel: {
                        color: '#999',
                        fontSize: 10,
                        formatter: (value) => {
                            // 简单的日期格式化，假设输入是 'MM-DD hh:mm' 或类似
                            return value.split(' ').pop(); // 只显示时间
                        }
                    },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: 'value',
                    name: this.unit,
                    nameTextStyle: {
                        color: '#999',
                        fontSize: 10,
                        padding: [0, 0, 0, 10]
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f5f5f5'
                        }
                    },
                    axisLabel: {
                        color: '#999',
                        fontSize: 10
                    }
                },
                series: [
                    {
                        data: values,
                        type: 'line',
                        smooth: true,
                        // showSymbol: true,
                        symbolSize: 8,
                        lineStyle: {
                            color: '#e0e0e0',
                            width: 2
                        },
                        markLine: {
                            silent: true,
                            symbol: 'none',
                            lineStyle: {
                                color: '#ccc',
                                type: 'dashed',
                                width: 1
                            },
                            label: {
                                show: true,
                                position: 'end',
                                fontSize: 10,
                                color: '#999'
                            },
                            data: [
                                { yAxis: 3.9, label: { formatter: '3.9' } },
                                { yAxis: 7.8, label: { formatter: '7.8' } },
                                { yAxis: 11.1, label: { formatter: '11.1' } }
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
.blood-sugar-chart {
    background: #fff;
    border-radius: 16px;
    padding: 16px;
}

.chart-container {
    width: 100%;
    height: 250px;
    margin-bottom: 20px;
}

.stats-panel {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.stat-card {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 12px 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.stat-label {
    font-size: 11px;
    color: #999;
    margin-bottom: 6px;
}

.stat-value {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    line-height: 1.2;
    margin-bottom: 4px;
}

.stat-value .unit {
    font-size: 10px;
    font-weight: normal;
    color: #999;
    margin-left: 2px;
}

.stat-status {
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
}

.badge {
    font-size: 9px;
    color: #fff;
    padding: 1px 4px;
    border-radius: 4px;
    line-height: 1.4;
}

.status-text {
    font-size: 10px;
    font-weight: 500;
}

.stat-sub {
    font-size: 10px;
    color: #999;
}
</style>
