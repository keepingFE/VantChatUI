<template>
    <div class="blood-oxygen-chart">
        <div ref="chartContainer" class="chart-container"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, MarkLineComponent, MarkAreaComponent, GraphicComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, MarkAreaComponent, GraphicComponent, CanvasRenderer]);

export default {
    name: 'BloodOxygenChart',
    props: {
        /**
         * 血氧数据数组
         * @type {Array<{time: string, value: number}>}
         * @property {string} time - 时间点（如：'00:00', '8:00'）
         * @property {number} value - 血氧饱和度值（90-100）
         */
        oxygenData: {
            type: Array,
            default: () => []
        },
        /**
         * 主题颜色
         */
        primaryColor: {
            type: String,
            default: '#00d2ff'
        },
        /**
         * 正常范围最小值
         */
        normalMin: {
            type: Number,
            default: 95
        },
        /**
         * 是否显示安全区域
         */
        showSafeZone: {
            type: Boolean,
            default: true
        },
        /**
         * 图表高度
         */
        height: {
            type: Number,
            default: 280
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
        oxygenData: {
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
            if (!this.chart || this.oxygenData.length === 0) return;

            const times = this.oxygenData.map(item => item.time);
            const values = this.oxygenData.map(item => item.value);

            // 计算平均值和最小最大值
            const avgValue = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);

            const option = {
                grid: {
                    left: '45',
                    right: '65',
                    top: '60',
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
                        const param = params[0];
                        const value = param.value;
                        let status = '正常';
                        let statusColor = '#22c55e';

                        if (value < 90) {
                            status = '危险';
                            statusColor = '#ef4444';
                        } else if (value < this.normalMin) {
                            status = '偏低';
                            statusColor = '#f59e0b';
                        }

                        return `
                            <div style="padding: 4px 0;">
                                <div style="margin-bottom: 6px;">${param.name}</div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="color: ${statusColor}; font-weight: 600; font-size: 18px;">${value}%</span>
                                    <span style="color: ${statusColor}; font-size: 12px; padding: 2px 6px; background: ${statusColor}20; border-radius: 4px;">${status}</span>
                                </div>
                            </div>
                        `;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: times,
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
                    min: 85,
                    max: 100,
                    interval: 5,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        color: '#666',
                        fontSize: 12,
                        formatter: '{value}%'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0',
                            type: 'dashed'
                        }
                    }
                },
                series: [
                    // 安全区域背景
                    ...(this.showSafeZone ? [{
                        name: '安全区域',
                        type: 'line',
                        data: new Array(times.length).fill(null),
                        markArea: {
                            silent: true,
                            itemStyle: {
                                color: 'rgba(34, 197, 94, 0.08)'
                            },
                            data: [[
                                { yAxis: this.normalMin },
                                { yAxis: 100 }
                            ]]
                        }
                    }] : []),
                    // 主曲线
                    {
                        name: '血氧饱和度',
                        type: 'line',
                        data: values,
                        smooth: true,
                        symbol: 'circle',
                        symbolSize: 6,
                        showSymbol: true,
                        lineStyle: {
                            width: 3,
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                { offset: 0, color: this.primaryColor },
                                { offset: 1, color: this.adjustColorBrightness(this.primaryColor, 20) }
                            ])
                        },
                        itemStyle: {
                            color: this.primaryColor,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: this.adjustColorAlpha(this.primaryColor, 0.4) },
                                { offset: 1, color: this.adjustColorAlpha(this.primaryColor, 0.05) }
                            ])
                        },
                        // 标记正常范围线
                        markLine: this.showSafeZone ? {
                            silent: true,
                            symbol: 'none',
                            label: {
                                show: true,
                                position: 'insideEndTop',
                                formatter: '正常范围',
                                color: '#22c55e',
                                fontSize: 11,
                                distance: 5
                            },
                            lineStyle: {
                                type: 'dashed',
                                color: '#22c55e',
                                width: 1.5
                            },
                            data: [
                                { yAxis: this.normalMin }
                            ]
                        } : undefined,
                        // 标记最大最小值
                        markPoint: {
                            symbol: 'pin',
                            symbolSize: 40,
                            label: {
                                fontSize: 11,
                                color: '#fff'
                            },
                            data: [
                                {
                                    type: 'max',
                                    name: '最大值',
                                    itemStyle: { color: '#22c55e' }
                                },
                                {
                                    type: 'min',
                                    name: '最小值',
                                    itemStyle: {
                                        color: minValue < this.normalMin ? '#ef4444' : '#f59e0b'
                                    }
                                }
                            ]
                        }
                    }
                ],
                // 顶部统计信息
                graphic: [
                    {
                        type: 'group',
                        left: 'center',
                        top: 15,
                        children: [
                            {
                                type: 'text',
                                style: {
                                    text: `平均值: ${avgValue}%`,
                                    fontSize: 13,
                                    fontWeight: '600',
                                    fill: '#333'
                                }
                            },
                            {
                                type: 'text',
                                left: 100,
                                style: {
                                    text: `范围: ${minValue}% - ${maxValue}%`,
                                    fontSize: 12,
                                    fill: '#666'
                                }
                            }
                        ]
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
        /**
         * 调整颜色透明度
         */
        adjustColorAlpha(color, alpha) {
            if (color.startsWith('#')) {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
            return color;
        },
        /**
         * 调整颜色亮度
         */
        adjustColorBrightness(color, percent) {
            if (color.startsWith('#')) {
                let r = parseInt(color.slice(1, 3), 16);
                let g = parseInt(color.slice(3, 5), 16);
                let b = parseInt(color.slice(5, 7), 16);

                r = Math.min(255, Math.floor(r * (100 + percent) / 100));
                g = Math.min(255, Math.floor(g * (100 + percent) / 100));
                b = Math.min(255, Math.floor(b * (100 + percent) / 100));

                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }
            return color;
        }
    }
};
</script>

<style scoped>
.blood-oxygen-chart {
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
