<template>
    <div class="workout-zone-chart">
        <!-- 头部 -->
        <div class="header">
            <h3 class="title">{{ title }}</h3>
            <div class="duration-badge">{{ totalDuration }}分钟</div>
        </div>

        <!-- 心率区间可视化 -->
        <div class="zone-visualization">
            <div class="zone-bar" v-for="zone in zones" :key="zone.id" :style="{
                width: zone.percentage + '%',
                background: zone.color
            }" @click="handleZoneClick(zone)">
                <div class="zone-label" v-if="zone.percentage > 8">
                    {{ zone.percentage }}%
                </div>
            </div>
        </div>

        <!-- 区间详情列表 -->
        <div class="zone-list">
            <div class="zone-item" v-for="zone in zones" :key="zone.id" :class="{ active: selectedZone === zone.id }">
                <div class="zone-indicator" :style="{ background: zone.color }"></div>
                <div class="zone-info">
                    <div class="zone-name">
                        <span class="zone-icon">{{ zone.icon }}</span>
                        <span class="name-text">{{ zone.name }}</span>
                    </div>
                    <div class="zone-range">{{ zone.minHR }} - {{ zone.maxHR }} bpm</div>
                </div>
                <div class="zone-stats">
                    <div class="zone-time">{{ zone.duration }}分</div>
                    <div class="zone-percent">{{ zone.percentage }}%</div>
                </div>
            </div>
        </div>

        <!-- 心率分布图表 -->
        <div class="chart-section" v-if="showChart">
            <div class="chart-title">心率分布</div>
            <div ref="chartContainer" class="chart-container"></div>
        </div>

        <!-- 底部建议 -->
        <div class="recommendation" v-if="recommendation">
            <div class="rec-icon">💡</div>
            <div class="rec-content">
                <div class="rec-title">训练建议</div>
                <div class="rec-text">{{ recommendation }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GridComponent, TooltipComponent, BarChart, CanvasRenderer]);

export default {
    name: 'WorkoutZoneChart',
    props: {
        title: {
            type: String,
            default: '运动强度区间'
        },
        zones: {
            type: Array,
            default: () => [
                {
                    id: 1,
                    name: '热身区',
                    icon: '🚶',
                    minHR: 90,
                    maxHR: 110,
                    duration: 5,
                    percentage: 8,
                    color: '#3b82f6'
                },
                {
                    id: 2,
                    name: '燃脂区',
                    icon: '🔥',
                    minHR: 110,
                    maxHR: 130,
                    duration: 15,
                    percentage: 25,
                    color: '#22c55e'
                },
                {
                    id: 3,
                    name: '有氧区',
                    icon: '🏃',
                    minHR: 130,
                    maxHR: 150,
                    duration: 25,
                    percentage: 42,
                    color: '#f59e0b'
                },
                {
                    id: 4,
                    name: '无氧区',
                    icon: '⚡',
                    minHR: 150,
                    maxHR: 170,
                    duration: 12,
                    percentage: 20,
                    color: '#f97316'
                },
                {
                    id: 5,
                    name: '极限区',
                    icon: '🚀',
                    minHR: 170,
                    maxHR: 190,
                    duration: 3,
                    percentage: 5,
                    color: '#ef4444'
                }
            ]
        },
        showChart: {
            type: Boolean,
            default: true
        },
        recommendation: {
            type: String,
            default: '你在有氧区的时间最长，适合提升心肺耐力。建议增加无氧区训练以提高爆发力。'
        }
    },
    emits: ['zone-click'],
    data() {
        return {
            chart: null,
            selectedZone: null
        };
    },
    computed: {
        totalDuration() {
            return this.zones.reduce((sum, zone) => sum + zone.duration, 0);
        }
    },
    mounted() {
        if (this.showChart) {
            this.$nextTick(() => {
                this.initChart();
            });
            window.addEventListener('resize', this.handleResize);
        }
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
        if (this.chart) this.chart.dispose();
    },
    methods: {
        handleZoneClick(zone) {
            this.selectedZone = zone.id;
            this.$emit('zone-click', zone);
        },
        initChart() {
            if (!this.$refs.chartContainer) return;
            this.chart = echarts.init(this.$refs.chartContainer);
            this.updateChart();
        },
        updateChart() {
            if (!this.chart) return;

            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: (params) => {
                        const data = params[0];
                        const zone = this.zones[data.dataIndex];
                        return `${zone.name}<br/>
                    心率: ${zone.minHR}-${zone.maxHR} bpm<br/>
                    时长: ${zone.duration}分钟 (${zone.percentage}%)`;
                    }
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.zones.map(z => z.name),
                    axisLine: { lineStyle: { color: '#eee' } },
                    axisLabel: { color: '#999', fontSize: 11 },
                    axisTick: { show: false }
                },
                yAxis: {
                    type: 'value',
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { type: 'dashed', color: '#f5f5f5' } },
                    axisLabel: {
                        color: '#999',
                        formatter: '{value}分'
                    }
                },
                series: [{
                    type: 'bar',
                    data: this.zones.map(z => ({
                        value: z.duration,
                        itemStyle: { color: z.color }
                    })),
                    barWidth: '60%',
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}分',
                        color: '#666',
                        fontSize: 11
                    }
                }]
            };
            this.chart.setOption(option);
        },
        handleResize() {
            this.chart?.resize();
        }
    }
};
</script>

<style scoped>
.workout-zone-chart {
    background: #fff;
    border-radius: 20px;
    padding: 20px 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    max-width: 100%;
    overflow: hidden;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

.duration-badge {
    padding: 6px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 600;
}

.zone-visualization {
    display: flex;
    height: 40px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.zone-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.2s;
    position: relative;
}

.zone-bar:hover {
    opacity: 0.85;
}

.zone-label {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.zone-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.zone-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 12px;
    transition: all 0.2s;
    cursor: pointer;
}

.zone-item:hover {
    background: #eef0f2;
}

.zone-item.active {
    background: #e0e7ff;
    border: 2px solid #667eea;
}

.zone-indicator {
    width: 4px;
    height: 40px;
    border-radius: 2px;
    flex-shrink: 0;
}

.zone-info {
    flex: 1;
    min-width: 0;
}

.zone-name {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
}

.zone-icon {
    font-size: 16px;
}

.name-text {
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

.zone-range {
    font-size: 12px;
    color: #999;
}

.zone-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
}

.zone-time {
    font-size: 16px;
    font-weight: 700;
    color: #333;
}

.zone-percent {
    font-size: 12px;
    color: #666;
}

.chart-section {
    margin-bottom: 20px;
}

.chart-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}

.chart-container {
    width: 100%;
    height: 200px;
}

.recommendation {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 12px;
}

.rec-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.rec-content {
    flex: 1;
}

.rec-title {
    font-size: 14px;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 4px;
}

.rec-text {
    font-size: 13px;
    color: #78350f;
    line-height: 1.5;
}
</style>
