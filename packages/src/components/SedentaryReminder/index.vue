<template>
    <div class="sedentary-reminder">
        <div class="reminder-card" :class="{ active: isActive }">
            <div class="card-header">
                <div class="icon">{{ currentIcon }}</div>
                <div class="title">{{ currentTitle }}</div>
            </div>

            <div class="timer-section">
                <div class="timer-circle">
                    <svg viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" stroke-width="8" />
                        <circle cx="60" cy="60" r="50" fill="none" :stroke="timerColor" stroke-width="8"
                            stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                            transform="rotate(-90 60 60)" />
                    </svg>
                    <div class="timer-text">
                        <div class="time-value">{{ formattedTime }}</div>
                        <div class="time-label">{{ timeLabel }}</div>
                    </div>
                </div>
            </div>

            <div class="message">{{ currentMessage }}</div>

            <div class="actions">
                <van-button v-if="!isActive" type="primary" block round @click="startTimer">
                    开始计时
                </van-button>
                <template v-else>
                    <van-button type="default" block round @click="pauseTimer">
                        {{ isPaused ? '继续' : '暂停' }}
                    </van-button>
                    <van-button type="primary" block round @click="completeActivity" style="margin-top: 8px">
                        已活动
                    </van-button>
                </template>
            </div>
        </div>

        <div class="stats-section">
            <div class="section-title">今日统计</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-value">{{ todayStats.sedentaryTime }}</div>
                    <div class="stat-label">久坐时长(分钟)</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🚶</div>
                    <div class="stat-value">{{ todayStats.breaks }}</div>
                    <div class="stat-label">活动次数</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">✅</div>
                    <div class="stat-value">{{ todayStats.compliance }}%</div>
                    <div class="stat-label">达标率</div>
                </div>
            </div>
        </div>

        <div class="suggestions-section">
            <div class="section-title">活动建议</div>
            <div class="suggestions-list">
                <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item"
                    @click="selectSuggestion(suggestion)">
                    <div class="suggestion-icon">{{ suggestion.icon }}</div>
                    <div class="suggestion-content">
                        <div class="suggestion-name">{{ suggestion.name }}</div>
                        <div class="suggestion-duration">{{ suggestion.duration }}分钟</div>
                    </div>
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>

        <div class="history-section">
            <div class="section-title">本周记录</div>
            <div ref="historyChartRef" class="history-chart"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { showToast } from 'vant'
import * as echarts from 'echarts'

const props = defineProps({
    reminderInterval: {
        type: Number,
        default: 3600 // 默认1小时提醒一次（秒）
    },
    todayStats: {
        type: Object,
        default: () => ({
            sedentaryTime: 0,
            breaks: 0,
            compliance: 0
        })
    },
    suggestions: {
        type: Array,
        default: () => [
            { icon: '🚶', name: '走动一下', duration: 5 },
            { icon: '🧘', name: '拉伸运动', duration: 10 },
            { icon: '💧', name: '喝水休息', duration: 3 },
            { icon: '👀', name: '眼保健操', duration: 5 }
        ]
    },
    weeklyData: {
        type: Array,
        default: () => []
        // weeklyData 结构：
        // [
        //   { day: '周一', sedentary: 240, breaks: 8 },
        //   ...
        // ]
    }
})

const emit = defineEmits(['start', 'pause', 'complete', 'suggestionClick'])

const isActive = ref(false)
const isPaused = ref(false)
const elapsedTime = ref(0)
const timer = ref(null)
const historyChartRef = ref(null)
let historyChart = null

const currentIcon = computed(() => {
    if (!isActive.value) return '🪑'
    if (elapsedTime.value >= props.reminderInterval) return '⚠️'
    return '⏰'
})

const currentTitle = computed(() => {
    if (!isActive.value) return '久坐提醒'
    if (elapsedTime.value >= props.reminderInterval) return '该活动了！'
    return '计时中'
})

const currentMessage = computed(() => {
    if (!isActive.value) return '点击开始计时，定时提醒你起身活动'
    if (elapsedTime.value >= props.reminderInterval) {
        return '你已经坐了很久了，起来活动一下吧！'
    }
    const remaining = props.reminderInterval - elapsedTime.value
    const mins = Math.floor(remaining / 60)
    return `距离下次提醒还有 ${mins} 分钟`
})

const timeLabel = computed(() => {
    if (elapsedTime.value >= props.reminderInterval) return '已超时'
    return '已坐'
})

const formattedTime = computed(() => {
    const mins = Math.floor(elapsedTime.value / 60)
    const secs = elapsedTime.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const timerColor = computed(() => {
    const percentage = (elapsedTime.value / props.reminderInterval) * 100
    if (percentage >= 100) return '#ff7875'
    if (percentage >= 80) return '#faad14'
    return '#1890ff'
})

const circumference = computed(() => 2 * Math.PI * 50)

const dashOffset = computed(() => {
    const percentage = Math.min((elapsedTime.value / props.reminderInterval) * 100, 100)
    return circumference.value * (1 - percentage / 100)
})

const startTimer = () => {
    isActive.value = true
    isPaused.value = false
    elapsedTime.value = 0

    timer.value = setInterval(() => {
        if (!isPaused.value) {
            elapsedTime.value++

            // 到达提醒时间
            if (elapsedTime.value === props.reminderInterval) {
                showToast('该起来活动一下了！')
                // 可以添加震动、声音等提醒
                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200])
                }
            }
        }
    }, 1000)

    emit('start')
}

const pauseTimer = () => {
    isPaused.value = !isPaused.value
    emit('pause', isPaused.value)
}

const completeActivity = () => {
    if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }

    const duration = Math.floor(elapsedTime.value / 60)
    showToast(`本次久坐 ${duration} 分钟`)

    isActive.value = false
    isPaused.value = false
    elapsedTime.value = 0

    emit('complete', duration)
}

const selectSuggestion = (suggestion) => {
    emit('suggestionClick', suggestion)
}

const initHistoryChart = () => {
    if (!historyChartRef.value || !props.weeklyData.length) return

    if (historyChart) {
        historyChart.dispose()
    }

    historyChart = echarts.init(historyChartRef.value)

    const option = {
        grid: { left: 50, right: 50, top: 60, bottom: 40 },
        legend: {
            data: ['久坐时长', '活动次数'],
            top: 8,
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: props.weeklyData.map(d => d.day)
        },
        yAxis: [
            {
                type: 'value',
                name: '时长(分钟)',
                position: 'left'
            },
            {
                type: 'value',
                name: '次数',
                position: 'right'
            }
        ],
        series: [
            {
                name: '久坐时长',
                type: 'bar',
                data: props.weeklyData.map(d => d.sedentary),
                itemStyle: { color: '#ff7875' }
            },
            {
                name: '活动次数',
                type: 'line',
                yAxisIndex: 1,
                data: props.weeklyData.map(d => d.breaks),
                itemStyle: { color: '#52c41a' }
            }
        ],
        tooltip: {
            trigger: 'axis'
        }
    }

    historyChart.setOption(option)
}

onMounted(() => {
    initHistoryChart()
    window.addEventListener('resize', () => {
        historyChart?.resize()
    })
})

onUnmounted(() => {
    if (timer.value) {
        clearInterval(timer.value)
    }
})

watch(() => props.weeklyData, () => {
    initHistoryChart()
}, { deep: true })
</script>

<style scoped lang="scss">
.sedentary-reminder {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.reminder-card {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.3s;

    &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;

        .card-header .title,
        .message {
            color: #fff;
        }
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;

        .icon {
            font-size: 32px;
        }

        .title {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
        }
    }

    .timer-section {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;

        .timer-circle {
            position: relative;
            width: 120px;
            height: 120px;

            svg {
                width: 100%;
                height: 100%;
            }

            .timer-text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;

                .time-value {
                    font-size: 24px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .time-label {
                    font-size: 12px;
                    opacity: 0.8;
                }
            }
        }
    }

    .message {
        text-align: center;
        font-size: 14px;
        color: #595959;
        line-height: 1.6;
        margin-bottom: 20px;
    }

    .actions {
        display: flex;
        flex-direction: column;
    }
}

.stats-section,
.suggestions-section,
.history-section {
    margin-top: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.stat-card {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 16px;
    text-align: center;

    .stat-icon {
        font-size: 24px;
        margin-bottom: 8px;
    }

    .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 4px;
    }

    .stat-label {
        font-size: 12px;
        color: #8c8c8c;
    }
}

.suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:active {
        background: #e6e6e6;
    }

    .suggestion-icon {
        font-size: 28px;
        flex-shrink: 0;
    }

    .suggestion-content {
        flex: 1;

        .suggestion-name {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 2px;
        }

        .suggestion-duration {
            font-size: 12px;
            color: #8c8c8c;
        }
    }

    .van-icon {
        color: #bfbfbf;
    }
}

.history-chart {
    width: 100%;
    height: 240px;
}
</style>
