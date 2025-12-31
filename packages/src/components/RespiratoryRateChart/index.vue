<template>
    <div class="respiratory-rate-chart">
        <div class="chart-header">
            <div class="title">{{ title }}</div>
            <div class="period-selector">
                <span v-for="p in periods" :key="p.value" class="period-item" :class="{ active: period === p.value }"
                    @click="changePeriod(p.value)">
                    {{ p.label }}
                </span>
            </div>
        </div>

        <div class="current-rate">
            <div class="rate-icon">🫁</div>
            <div class="rate-info">
                <div class="rate-value">{{ currentRate }}</div>
                <div class="rate-label">次/分钟</div>
            </div>
            <div class="rate-status" :class="rateStatus.class">
                {{ rateStatus.text }}
            </div>
        </div>

        <div class="chart-container">
            <div ref="chartRef" class="chart"></div>
        </div>

        <div class="stats-section">
            <div class="stat-card">
                <div class="stat-label">平均值</div>
                <div class="stat-value">{{ stats.avg }}</div>
                <div class="stat-unit">次/分钟</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">最低值</div>
                <div class="stat-value">{{ stats.min }}</div>
                <div class="stat-unit">次/分钟</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">最高值</div>
                <div class="stat-value">{{ stats.max }}</div>
                <div class="stat-unit">次/分钟</div>
            </div>
        </div>

        <div class="info-section">
            <div class="info-title">关于呼吸频率</div>
            <div class="info-content">
                <div class="info-item">
                    <span class="info-label">正常范围：</span>
                    <span class="info-text">12-20 次/分钟</span>
                </div>
                <div class="info-item">
                    <span class="info-label">测量时机：</span>
                    <span class="info-text">静息状态下测量最准确</span>
                </div>
                <div class="info-item">
                    <span class="info-label">影响因素：</span>
                    <span class="info-text">运动、情绪、温度、海拔等</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: {
        type: String,
        default: '呼吸频率'
    },
    data: {
        type: Array,
        required: true
        // data 结构示例：
        // [
        //   { time: '2024-01-01 00:00', rate: 14 },
        //   { time: '2024-01-01 01:00', rate: 13 },
        //   ...
        // ]
    },
    currentRate: {
        type: Number,
        default: 16
    }
})

const emit = defineEmits(['periodChange'])

const chartRef = ref(null)
let chart = null

const period = ref('day')
const periods = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' }
]

const rateStatus = computed(() => {
    const rate = props.currentRate
    if (rate < 12) return { text: '偏低', class: 'low' }
    if (rate > 20) return { text: '偏高', class: 'high' }
    return { text: '正常', class: 'normal' }
})

const stats = computed(() => {
    if (!props.data.length) return { avg: 0, min: 0, max: 0 }

    const rates = props.data.map(d => d.rate)
    return {
        avg: Math.round(rates.reduce((a, b) => a + b, 0) / rates.length),
        min: Math.min(...rates),
        max: Math.max(...rates)
    }
})

const changePeriod = (value) => {
    period.value = value
    emit('periodChange', value)
}

const initChart = () => {
    if (!chartRef.value || !props.data.length) return

    if (chart) {
        chart.dispose()
    }

    chart = echarts.init(chartRef.value)

    const option = {
        grid: {
            left: 50,
            right: 20,
            top: 40,
            bottom: 40
        },
        xAxis: {
            type: 'category',
            data: props.data.map(d => d.time),
            axisLabel: {
                formatter: (value) => {
                    const date = new Date(value)
                    if (period.value === 'day') {
                        return `${date.getHours()}:00`
                    } else if (period.value === 'week') {
                        return `${date.getMonth() + 1}/${date.getDate()}`
                    } else {
                        return `${date.getMonth() + 1}/${date.getDate()}`
                    }
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '次/分钟',
            min: 10,
            max: 25,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                data: props.data.map(d => d.rate),
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#1890ff'
                },
                lineStyle: {
                    width: 3
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                        { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
                    ])
                },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: {
                        color: '#52c41a',
                        type: 'dashed'
                    },
                    data: [
                        { yAxis: 12, label: { formatter: '正常下限' } },
                        { yAxis: 20, label: { formatter: '正常上限' } }
                    ]
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                return `${params[0].axisValue}<br/>呼吸频率: ${params[0].value} 次/分钟`
            }
        }
    }

    chart.setOption(option)
}

onMounted(() => {
    initChart()
    window.addEventListener('resize', () => {
        chart?.resize()
    })
})

watch(() => [props.data, period.value], () => {
    initChart()
}, { deep: true })
</script>

<style scoped lang="scss">
.respiratory-rate-chart {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }

    .period-selector {
        display: flex;
        gap: 8px;
    }

    .period-item {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 14px;
        color: #8c8c8c;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
            background: #1890ff;
            color: #fff;
        }

        &:not(.active):active {
            background: #f0f0f0;
        }
    }
}

.current-rate {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    margin-bottom: 20px;
    color: #fff;

    .rate-icon {
        font-size: 48px;
    }

    .rate-info {
        flex: 1;

        .rate-value {
            font-size: 36px;
            font-weight: 600;
            line-height: 1;
            margin-bottom: 4px;
        }

        .rate-label {
            font-size: 14px;
            opacity: 0.9;
        }
    }

    .rate-status {
        padding: 6px 16px;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 500;
        background: rgba(255, 255, 255, 0.2);

        &.normal {
            background: rgba(82, 196, 26, 0.9);
        }

        &.low {
            background: rgba(250, 173, 20, 0.9);
        }

        &.high {
            background: rgba(245, 34, 45, 0.9);
        }
    }
}

.chart-container {
    margin-bottom: 20px;
}

.chart {
    width: 100%;
    height: 250px;
}

.stats-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.stat-card {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;
    text-align: center;

    .stat-label {
        font-size: 12px;
        color: #8c8c8c;
        margin-bottom: 8px;
    }

    .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 4px;
    }

    .stat-unit {
        font-size: 12px;
        color: #8c8c8c;
    }
}

.info-section {
    padding: 16px;
    background: #f7f8fa;
    border-radius: 12px;

    .info-title {
        font-size: 14px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 12px;
    }

    .info-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .info-item {
        font-size: 13px;
        line-height: 1.6;

        .info-label {
            color: #8c8c8c;
        }

        .info-text {
            color: #595959;
        }
    }
}
</style>
