<template>
    <div class="swimming-chart">
        <div class="chart-header">
            <div class="title">{{ title }}</div>
            <div class="date">{{ formattedDate }}</div>
        </div>

        <div class="summary-cards">
            <div class="summary-card">
                <div class="icon">🏊</div>
                <div class="value">{{ data.distance }}</div>
                <div class="label">距离 (米)</div>
            </div>
            <div class="summary-card">
                <div class="icon">⏱️</div>
                <div class="value">{{ formatDuration(data.duration) }}</div>
                <div class="label">时长</div>
            </div>
            <div class="summary-card">
                <div class="icon">🔥</div>
                <div class="value">{{ data.calories }}</div>
                <div class="label">卡路里</div>
            </div>
        </div>

        <div class="stroke-section">
            <div class="section-title">泳姿分布</div>
            <div class="stroke-list">
                <div v-for="stroke in data.strokes" :key="stroke.type" class="stroke-item">
                    <div class="stroke-header">
                        <span class="stroke-name">{{ getStrokeName(stroke.type) }}</span>
                        <span class="stroke-distance">{{ stroke.distance }}m</span>
                    </div>
                    <div class="stroke-bar">
                        <div class="stroke-fill" :style="{
                            width: (stroke.distance / data.distance * 100) + '%',
                            background: getStrokeColor(stroke.type)
                        }"></div>
                    </div>
                    <div class="stroke-stats">
                        <span>SWOLF: {{ stroke.swolf }}</span>
                        <span>划水: {{ stroke.strokes }}次</span>
                        <span>配速: {{ stroke.pace }}/100m</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="pace-chart-section">
            <div class="section-title">配速趋势</div>
            <div ref="paceChartRef" class="pace-chart"></div>
        </div>

        <div class="heart-rate-section" v-if="data.heartRate">
            <div class="section-title">心率区间</div>
            <div class="hr-zones">
                <div v-for="zone in data.heartRate.zones" :key="zone.name" class="hr-zone">
                    <div class="zone-header">
                        <span class="zone-name">{{ zone.name }}</span>
                        <span class="zone-time">{{ formatDuration(zone.duration) }}</span>
                    </div>
                    <div class="zone-bar">
                        <div class="zone-fill" :style="{
                            width: (zone.duration / data.duration * 100) + '%',
                            background: zone.color
                        }"></div>
                    </div>
                </div>
            </div>
            <div class="hr-stats">
                <div class="hr-stat">
                    <span class="label">平均心率</span>
                    <span class="value">{{ data.heartRate.avg }} bpm</span>
                </div>
                <div class="hr-stat">
                    <span class="label">最大心率</span>
                    <span class="value">{{ data.heartRate.max }} bpm</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: {
        type: String,
        default: '游泳数据'
    },
    date: {
        type: [String, Date],
        default: () => new Date()
    },
    data: {
        type: Object,
        required: true,
        // data 结构示例：
        // {
        //   distance: 1500,
        //   duration: 1800, // 秒
        //   calories: 450,
        //   strokes: [
        //     { type: 'freestyle', distance: 800, swolf: 35, strokes: 420, pace: '1:45' },
        //     { type: 'breaststroke', distance: 400, swolf: 42, strokes: 280, pace: '2:10' },
        //     { type: 'backstroke', distance: 300, swolf: 38, strokes: 240, pace: '1:55' }
        //   ],
        //   paceData: [
        //     { lap: 1, pace: 105, distance: 100 },
        //     { lap: 2, pace: 102, distance: 100 },
        //     ...
        //   ],
        //   heartRate: {
        //     avg: 135,
        //     max: 165,
        //     zones: [
        //       { name: '热身', duration: 300, color: '#95de64' },
        //       { name: '有氧', duration: 900, color: '#ffd666' },
        //       { name: '无氧', duration: 480, color: '#ff7875' },
        //       { name: '极限', duration: 120, color: '#ff4d4f' }
        //     ]
        //   }
        // }
    }
})

const paceChartRef = ref(null)
let paceChart = null

const formattedDate = computed(() => {
    const d = new Date(props.date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const getStrokeName = (type) => {
    const names = {
        freestyle: '自由泳',
        breaststroke: '蛙泳',
        backstroke: '仰泳',
        butterfly: '蝶泳',
        medley: '混合泳'
    }
    return names[type] || type
}

const getStrokeColor = (type) => {
    const colors = {
        freestyle: '#1890ff',
        breaststroke: '#52c41a',
        backstroke: '#faad14',
        butterfly: '#f5222d',
        medley: '#722ed1'
    }
    return colors[type] || '#1890ff'
}

const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
}

const initPaceChart = () => {
    if (!paceChartRef.value || !props.data.paceData) return

    if (paceChart) {
        paceChart.dispose()
    }

    paceChart = echarts.init(paceChartRef.value)

    const option = {
        grid: {
            left: 50,
            right: 20,
            top: 30,
            bottom: 40
        },
        xAxis: {
            type: 'category',
            data: props.data.paceData.map(item => `${item.lap}`),
            axisLabel: {
                formatter: (value) => `第${value}趟`
            }
        },
        yAxis: {
            type: 'value',
            name: '配速(秒/100m)',
            axisLabel: {
                formatter: (value) => {
                    const mins = Math.floor(value / 60)
                    const secs = value % 60
                    return `${mins}:${String(secs).padStart(2, '0')}`
                }
            }
        },
        series: [
            {
                data: props.data.paceData.map(item => item.pace),
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#1890ff'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                        { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
                    ])
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                const value = params[0].value
                const mins = Math.floor(value / 60)
                const secs = value % 60
                return `第${params[0].axisValue}趟<br/>配速: ${mins}:${String(secs).padStart(2, '0')}/100m`
            }
        }
    }

    paceChart.setOption(option)
}

onMounted(() => {
    initPaceChart()
    window.addEventListener('resize', () => {
        paceChart?.resize()
    })
})

watch(() => props.data, () => {
    initPaceChart()
}, { deep: true })
</script>

<style scoped lang="scss">
.swimming-chart {
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

.summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.summary-card {
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

.stroke-section,
.pace-chart-section,
.heart-rate-section {
    margin-top: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.stroke-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.stroke-item {
    .stroke-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .stroke-name {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
        }

        .stroke-distance {
            font-size: 14px;
            color: #1890ff;
            font-weight: 600;
        }
    }

    .stroke-bar {
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;

        .stroke-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }
    }

    .stroke-stats {
        display: flex;
        gap: 16px;
        font-size: 12px;
        color: #8c8c8c;
    }
}

.pace-chart {
    width: 100%;
    height: 200px;
}

.hr-zones {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.hr-zone {
    .zone-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;

        .zone-name {
            font-size: 14px;
            color: #1a1a1a;
        }

        .zone-time {
            font-size: 14px;
            color: #8c8c8c;
        }
    }

    .zone-bar {
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;

        .zone-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s ease;
        }
    }
}

.hr-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;
}

.hr-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
        font-size: 12px;
        color: #8c8c8c;
    }

    .value {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }
}
</style>
