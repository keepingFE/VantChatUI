<template>
    <div class="cycling-chart">
        <div class="chart-header">
            <div class="title">{{ title }}</div>
            <div class="date">{{ formattedDate }}</div>
        </div>

        <div class="summary-grid">
            <div class="summary-item">
                <div class="icon">🚴</div>
                <div class="value">{{ data.distance }}</div>
                <div class="label">距离 (km)</div>
            </div>
            <div class="summary-item">
                <div class="icon">⏱️</div>
                <div class="value">{{ formatDuration(data.duration) }}</div>
                <div class="label">时长</div>
            </div>
            <div class="summary-item">
                <div class="icon">⚡</div>
                <div class="value">{{ data.avgSpeed }}</div>
                <div class="label">平均速度 (km/h)</div>
            </div>
            <div class="summary-item">
                <div class="icon">🔥</div>
                <div class="value">{{ data.calories }}</div>
                <div class="label">卡路里</div>
            </div>
        </div>

        <div class="metrics-section">
            <div class="metric-card">
                <div class="metric-header">
                    <span class="metric-title">踏频</span>
                    <span class="metric-unit">rpm</span>
                </div>
                <div class="metric-value">{{ data.cadence.avg }}</div>
                <div class="metric-range">
                    <span>最低: {{ data.cadence.min }}</span>
                    <span>最高: {{ data.cadence.max }}</span>
                </div>
            </div>

            <div class="metric-card" v-if="data.power">
                <div class="metric-header">
                    <span class="metric-title">功率</span>
                    <span class="metric-unit">W</span>
                </div>
                <div class="metric-value">{{ data.power.avg }}</div>
                <div class="metric-range">
                    <span>最低: {{ data.power.min }}</span>
                    <span>最高: {{ data.power.max }}</span>
                </div>
            </div>
        </div>

        <div class="chart-section">
            <div class="section-title">速度 & 踏频</div>
            <div ref="speedCadenceChartRef" class="chart"></div>
        </div>

        <div class="chart-section" v-if="data.power">
            <div class="section-title">功率分布</div>
            <div ref="powerChartRef" class="chart"></div>
        </div>

        <div class="elevation-section" v-if="data.elevation">
            <div class="section-title">爬升数据</div>
            <div class="elevation-stats">
                <div class="elevation-stat">
                    <span class="label">总爬升</span>
                    <span class="value">{{ data.elevation.gain }}m</span>
                </div>
                <div class="elevation-stat">
                    <span class="label">总下降</span>
                    <span class="value">{{ data.elevation.loss }}m</span>
                </div>
                <div class="elevation-stat">
                    <span class="label">最高海拔</span>
                    <span class="value">{{ data.elevation.max }}m</span>
                </div>
            </div>
            <div ref="elevationChartRef" class="chart"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: {
        type: String,
        default: '骑行数据'
    },
    date: {
        type: [String, Date],
        default: () => new Date()
    },
    data: {
        type: Object,
        required: true
    }
})

const speedCadenceChartRef = ref(null)
const powerChartRef = ref(null)
const elevationChartRef = ref(null)

let speedCadenceChart = null
let powerChart = null
let elevationChart = null

const formattedDate = computed(() => {
    const d = new Date(props.date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const initSpeedCadenceChart = () => {
    if (!speedCadenceChartRef.value || !props.data.timeline) return

    if (speedCadenceChart) {
        speedCadenceChart.dispose()
    }

    speedCadenceChart = echarts.init(speedCadenceChartRef.value)

    // 数据采样：如果数据点超过30个，进行采样以减少拥挤
    const timeline = props.data.timeline
    const sampleRate = Math.max(1, Math.floor(timeline.length / 30))
    const sampledData = timeline.filter((_, index) => index % sampleRate === 0)

    const option = {
        grid: { left: 50, right: 50, top: 40, bottom: 40 },
        legend: {
            data: ['速度', '踏频'],
            top: 0
        },
        xAxis: {
            type: 'category',
            data: sampledData.map(item => item.time),
            axisLabel: {
                formatter: (value) => {
                    const mins = Math.floor(value / 60)
                    return `${mins}min`
                },
                interval: 'auto',
                rotate: 0
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '速度 (km/h)',
                position: 'left',
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        opacity: 0.3
                    }
                }
            },
            {
                type: 'value',
                name: '踏频 (rpm)',
                position: 'right',
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: '速度',
                type: 'line',
                data: sampledData.map(item => item.speed),
                smooth: 0.3,
                symbol: 'none',
                lineStyle: {
                    width: 2
                },
                itemStyle: { color: '#1890ff' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(24, 144, 255, 0.2)' },
                        { offset: 1, color: 'rgba(24, 144, 255, 0.02)' }
                    ])
                }
            },
            {
                name: '踏频',
                type: 'line',
                yAxisIndex: 1,
                data: sampledData.map(item => item.cadence),
                smooth: 0.3,
                symbol: 'none',
                lineStyle: {
                    width: 2
                },
                itemStyle: { color: '#52c41a' }
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    type: 'dashed'
                }
            }
        }
    }

    speedCadenceChart.setOption(option)
}

const initPowerChart = () => {
    if (!powerChartRef.value || !props.data.power?.zones) return

    if (powerChart) {
        powerChart.dispose()
    }

    powerChart = echarts.init(powerChartRef.value)

    const option = {
        grid: { left: 50, right: 20, top: 20, bottom: 40 },
        xAxis: {
            type: 'category',
            data: props.data.power.zones.map(z => z.name)
        },
        yAxis: {
            type: 'value',
            name: '时间 (分钟)'
        },
        series: [
            {
                type: 'bar',
                data: props.data.power.zones.map(z => ({
                    value: Math.floor(z.duration / 60),
                    itemStyle: { color: z.color }
                })),
                barWidth: '60%'
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                return `${params[0].name}<br/>时长: ${params[0].value}分钟`
            }
        }
    }

    powerChart.setOption(option)
}

const initElevationChart = () => {
    if (!elevationChartRef.value || !props.data.elevation?.profile) return

    if (elevationChart) {
        elevationChart.dispose()
    }

    elevationChart = echarts.init(elevationChartRef.value)

    const option = {
        grid: { left: 50, right: 20, top: 20, bottom: 40 },
        xAxis: {
            type: 'category',
            data: props.data.elevation.profile.map((_, i) => i),
            axisLabel: {
                formatter: (value) => `${value}km`
            }
        },
        yAxis: {
            type: 'value',
            name: '海拔 (m)'
        },
        series: [
            {
                type: 'line',
                data: props.data.elevation.profile,
                smooth: false,
                itemStyle: { color: '#faad14' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(250, 173, 20, 0.4)' },
                        { offset: 1, color: 'rgba(250, 173, 20, 0.1)' }
                    ])
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                return `${params[0].axisValue}km<br/>海拔: ${params[0].value}m`
            }
        }
    }

    elevationChart.setOption(option)
}

onMounted(() => {
    initSpeedCadenceChart()
    initPowerChart()
    initElevationChart()

    window.addEventListener('resize', () => {
        speedCadenceChart?.resize()
        powerChart?.resize()
        elevationChart?.resize()
    })
})

watch(() => props.data, () => {
    initSpeedCadenceChart()
    initPowerChart()
    initElevationChart()
}, { deep: true })
</script>

<style scoped lang="scss">
.cycling-chart {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }

    .date {
        font-size: 14px;
        color: #8c8c8c;
    }
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.summary-item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    color: #fff;

    &:nth-child(2) {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    &:nth-child(3) {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    &:nth-child(4) {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .icon {
        font-size: 24px;
        margin-bottom: 8px;
    }

    .value {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .label {
        font-size: 12px;
        opacity: 0.9;
    }
}

.metrics-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.metric-card {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;

    .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .metric-title {
            font-size: 14px;
            color: #8c8c8c;
        }

        .metric-unit {
            font-size: 12px;
            color: #bfbfbf;
        }
    }

    .metric-value {
        font-size: 32px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 8px;
    }

    .metric-range {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #8c8c8c;
    }
}

.chart-section,
.elevation-section {
    margin-top: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.chart {
    width: 100%;
    height: 240px;
}

.elevation-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
}

.elevation-stat {
    background: #f7f8fa;
    border-radius: 8px;
    padding: 12px;
    text-align: center;

    .label {
        display: block;
        font-size: 12px;
        color: #8c8c8c;
        margin-bottom: 4px;
    }

    .value {
        display: block;
        font-size: 20px;
        font-weight: 600;
        color: #1a1a1a;
    }
}
</style>
