<template>
    <div class="calorie-balance-chart">
        <!-- 统计卡片 -->
        <div class="stats-cards">
            <div class="stat-card intake">
                <div class="stat-icon">🍔</div>
                <div class="stat-content">
                    <div class="stat-label">摄入</div>
                    <div class="stat-value">{{ totalIntake }}</div>
                    <div class="stat-unit">千卡</div>
                </div>
            </div>
            <div class="stat-card burn">
                <div class="stat-icon">🔥</div>
                <div class="stat-content">
                    <div class="stat-label">消耗</div>
                    <div class="stat-value">{{ totalBurn }}</div>
                    <div class="stat-unit">千卡</div>
                </div>
            </div>
            <div class="stat-card balance" :class="balanceClass">
                <div class="stat-icon">{{ balanceIcon }}</div>
                <div class="stat-content">
                    <div class="stat-label">净值</div>
                    <div class="stat-value">{{ netCalories }}</div>
                    <div class="stat-unit">千卡</div>
                </div>
            </div>
        </div>

        <!-- 图表 -->
        <div class="chart-section">
            <h4 class="section-title">{{ chartTitle }}</h4>
            <div ref="chartContainer" class="chart-container"></div>
        </div>

        <!-- 建议 -->
        <div class="suggestion-card" v-if="showSuggestion">
            <div class="suggestion-icon">{{ suggestionIcon }}</div>
            <div class="suggestion-content">
                <div class="suggestion-title">{{ suggestionTitle }}</div>
                <div class="suggestion-text">{{ suggestionText }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

export default {
    name: 'CalorieBalanceChart',
    props: {
        /**
         * 卡路里数据
         * @type {Array<{date: string, intake: number, burn: number}>}
         */
        calorieData: {
            type: Array,
            default: () => []
        },
        /**
         * 图表标题
         */
        chartTitle: {
            type: String,
            default: '每日卡路里平衡'
        },
        /**
         * 摄入颜色
         */
        intakeColor: {
            type: String,
            default: '#f59e0b'
        },
        /**
         * 消耗颜色
         */
        burnColor: {
            type: String,
            default: '#22c55e'
        },
        /**
         * 目标摄入（千卡）
         */
        targetIntake: {
            type: Number,
            default: 2000
        },
        /**
         * 是否显示建议
         */
        showSuggestion: {
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
        totalIntake() {
            if (this.calorieData.length === 0) return 0;
            const latest = this.calorieData[this.calorieData.length - 1];
            return latest.intake;
        },
        totalBurn() {
            if (this.calorieData.length === 0) return 0;
            const latest = this.calorieData[this.calorieData.length - 1];
            return latest.burn;
        },
        netCalories() {
            const net = this.totalIntake - this.totalBurn;
            return net > 0 ? `+${net}` : net;
        },
        balanceClass() {
            const net = this.totalIntake - this.totalBurn;
            if (net > 200) return 'surplus';
            if (net < -200) return 'deficit';
            return 'balanced';
        },
        balanceIcon() {
            const net = this.totalIntake - this.totalBurn;
            if (net > 200) return '📈';
            if (net < -200) return '📉';
            return '⚖️';
        },
        suggestionTitle() {
            const net = this.totalIntake - this.totalBurn;
            if (net > 500) return '摄入过多';
            if (net > 200) return '略有盈余';
            if (net < -500) return '消耗过大';
            if (net < -200) return '略有赤字';
            return '平衡良好';
        },
        suggestionText() {
            const net = this.totalIntake - this.totalBurn;
            if (net > 500) return '建议减少高热量食物摄入或增加运动量';
            if (net > 200) return '保持当前状态，注意控制饮食';
            if (net < -500) return '建议适当增加营养摄入';
            if (net < -200) return '可以适当补充能量';
            return '继续保持这种健康的平衡状态';
        },
        suggestionIcon() {
            const net = this.totalIntake - this.totalBurn;
            if (Math.abs(net) > 500) return '⚠️';
            if (Math.abs(net) > 200) return '💡';
            return '✅';
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
        calorieData: {
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
            if (!this.chart || this.calorieData.length === 0) return;

            const dates = this.calorieData.map(item => item.date);
            const intake = this.calorieData.map(item => item.intake);
            const burn = this.calorieData.map(item => item.burn);

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
                        const intakeValue = params[0].value;
                        const burnValue = params[1].value;
                        const net = intakeValue - burnValue;
                        const netColor = net > 0 ? '#ef4444' : '#22c55e';
                        return `
                            <div style="padding: 4px 0;">
                                <div style="margin-bottom: 8px; font-weight: 600;">${params[0].name}</div>
                                <div style="margin-bottom: 4px;">
                                    ${params[0].marker}摄入: <strong>${intakeValue}</strong> 千卡
                                </div>
                                <div style="margin-bottom: 8px;">
                                    ${params[1].marker}消耗: <strong>${burnValue}</strong> 千卡
                                </div>
                                <div style="padding-top: 8px; border-top: 1px solid #f0f0f0; color: ${netColor}; font-weight: 600;">
                                    净值: ${net > 0 ? '+' : ''}${net} 千卡
                                </div>
                            </div>
                        `;
                    }
                },
                legend: {
                    data: ['摄入', '消耗'],
                    bottom: 10,
                    textStyle: {
                        color: '#666',
                        fontSize: 12
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
                    name: '卡路里(千卡)',
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
                series: [
                    {
                        name: '摄入',
                        type: 'bar',
                        data: intake,
                        barWidth: '35%',
                        itemStyle: {
                            borderRadius: [8, 8, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: this.intakeColor },
                                { offset: 1, color: this.adjustColorAlpha(this.intakeColor, 0.6) }
                            ])
                        }
                    },
                    {
                        name: '消耗',
                        type: 'bar',
                        data: burn,
                        barWidth: '35%',
                        itemStyle: {
                            borderRadius: [8, 8, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: this.burnColor },
                                { offset: 1, color: this.adjustColorAlpha(this.burnColor, 0.6) }
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
.calorie-balance-chart {
    position: relative;
    width: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 16px;
}

.stats-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 24px;
}

.stat-card {
    padding: 12px 10px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
}

.stat-card.intake {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.stat-card.burn {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.stat-card.balance {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.stat-card.surplus {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.stat-card.deficit {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.stat-card.balanced {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.stat-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
    min-width: 0;
}

.stat-label {
    font-size: 11px;
    color: #666;
    margin-bottom: 2px;
}

.stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    line-height: 1.2;
}

.stat-unit {
    font-size: 10px;
    color: #999;
}

.chart-section {
    margin-bottom: 20px;
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}

.chart-container {
    width: 100%;
    height: 260px;
}

.suggestion-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #f7f8fa;
    border-radius: 12px;
}

.suggestion-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.suggestion-content {
    flex: 1;
}

.suggestion-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.suggestion-text {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
}
</style>
