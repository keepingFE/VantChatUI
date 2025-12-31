<template>
    <div class="rehab-progress">
        <div class="header">
            <div class="title">{{ title }}</div>
            <div class="phase">{{ currentPhase }}</div>
        </div>

        <div class="progress-overview">
            <div class="progress-circle">
                <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" stroke-width="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#1890ff" stroke-width="10" stroke-linecap="round"
                        :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                        transform="rotate(-90 60 60)" />
                </svg>
                <div class="progress-text">
                    <div class="progress-value">{{ overallProgress }}%</div>
                    <div class="progress-label">完成度</div>
                </div>
            </div>
            <div class="progress-info">
                <div class="info-item">
                    <span class="label">开始日期</span>
                    <span class="value">{{ startDate }}</span>
                </div>
                <div class="info-item">
                    <span class="label">已训练</span>
                    <span class="value">{{ completedDays }}天</span>
                </div>
                <div class="info-item">
                    <span class="label">预计完成</span>
                    <span class="value">{{ estimatedEndDate }}</span>
                </div>
            </div>
        </div>

        <div class="exercises-section">
            <div class="section-title">训练项目</div>
            <div class="exercises-list">
                <div v-for="exercise in exercises" :key="exercise.id" class="exercise-item"
                    @click="selectExercise(exercise)">
                    <div class="exercise-icon">{{ exercise.icon }}</div>
                    <div class="exercise-content">
                        <div class="exercise-name">{{ exercise.name }}</div>
                        <div class="exercise-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: exercise.progress + '%' }"></div>
                            </div>
                            <span class="progress-text">{{ exercise.progress }}%</span>
                        </div>
                        <div class="exercise-stats">
                            <span>{{ exercise.completed }}/{{ exercise.total }}次</span>
                            <span v-if="exercise.nextSession">下次: {{ exercise.nextSession }}</span>
                        </div>
                    </div>
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>

        <div class="milestones-section">
            <div class="section-title">康复里程碑</div>
            <div class="timeline">
                <div v-for="(milestone, index) in milestones" :key="index" class="milestone-item"
                    :class="{ completed: milestone.completed, current: milestone.current }">
                    <div class="milestone-dot"></div>
                    <div class="milestone-content">
                        <div class="milestone-title">{{ milestone.title }}</div>
                        <div class="milestone-date">{{ milestone.date }}</div>
                        <div v-if="milestone.description" class="milestone-desc">
                            {{ milestone.description }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="pain-tracking" v-if="painLevels.length">
            <div class="section-title">疼痛追踪</div>
            <div ref="painChartRef" class="pain-chart"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
    title: {
        type: String,
        default: '康复进度'
    },
    currentPhase: {
        type: String,
        default: '恢复期'
    },
    overallProgress: {
        type: Number,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    completedDays: {
        type: Number,
        required: true
    },
    estimatedEndDate: {
        type: String,
        required: true
    },
    exercises: {
        type: Array,
        required: true
    },
    milestones: {
        type: Array,
        default: () => []
    },
    painLevels: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['exerciseClick'])

const painChartRef = ref(null)
let painChart = null

const circumference = computed(() => 2 * Math.PI * 50)
const dashOffset = computed(() => circumference.value * (1 - props.overallProgress / 100))

const selectExercise = (exercise) => {
    emit('exerciseClick', exercise)
}

const initPainChart = () => {
    if (!painChartRef.value || !props.painLevels.length) return

    if (painChart) {
        painChart.dispose()
    }

    painChart = echarts.init(painChartRef.value)

    const option = {
        grid: { left: 50, right: 20, top: 20, bottom: 40 },
        xAxis: {
            type: 'category',
            data: props.painLevels.map(p => p.date)
        },
        yAxis: {
            type: 'value',
            name: '疼痛等级',
            min: 0,
            max: 10,
            interval: 2
        },
        series: [
            {
                data: props.painLevels.map(p => p.level),
                type: 'line',
                smooth: true,
                itemStyle: { color: '#ff7875' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 120, 117, 0.3)' },
                        { offset: 1, color: 'rgba(255, 120, 117, 0.05)' }
                    ])
                }
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                return `${params[0].axisValue}<br/>疼痛等级: ${params[0].value}/10`
            }
        }
    }

    painChart.setOption(option)
}

onMounted(() => {
    initPainChart()
    window.addEventListener('resize', () => {
        painChart?.resize()
    })
})

watch(() => props.painLevels, () => {
    initPainChart()
}, { deep: true })
</script>

<style scoped lang="scss">
.rehab-progress {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }

    .phase {
        padding: 4px 12px;
        background: #e6f7ff;
        color: #1890ff;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;
    }
}

.progress-overview {
    display: flex;
    gap: 20px;
    padding: 20px;
    background: #f7f8fa;
    border-radius: 12px;
    margin-bottom: 24px;

    .progress-circle {
        position: relative;
        width: 120px;
        height: 120px;
        flex-shrink: 0;

        svg {
            width: 100%;
            height: 100%;
        }

        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;

            .progress-value {
                font-size: 28px;
                font-weight: 600;
                color: #1a1a1a;
                line-height: 1;
            }

            .progress-label {
                font-size: 12px;
                color: #8c8c8c;
                margin-top: 4px;
            }
        }
    }

    .progress-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .info-item {
        display: flex;
        justify-content: space-between;

        .label {
            font-size: 14px;
            color: #8c8c8c;
        }

        .value {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
        }
    }
}

.exercises-section,
.milestones-section,
.pain-tracking {
    margin-top: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.exercises-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.exercise-item {
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

    .exercise-icon {
        font-size: 32px;
        flex-shrink: 0;
    }

    .exercise-content {
        flex: 1;

        .exercise-name {
            font-size: 15px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .exercise-progress {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;

            .progress-bar {
                flex: 1;
                height: 6px;
                background: #e6e6e6;
                border-radius: 3px;
                overflow: hidden;

                .progress-fill {
                    height: 100%;
                    background: #1890ff;
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }
            }

            .progress-text {
                font-size: 12px;
                color: #8c8c8c;
                min-width: 35px;
                text-align: right;
            }
        }

        .exercise-stats {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #8c8c8c;
        }
    }

    .van-icon {
        color: #bfbfbf;
    }
}

.timeline {
    position: relative;
    padding-left: 24px;

    &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 8px;
        bottom: 8px;
        width: 2px;
        background: #e6e6e6;
    }
}

.milestone-item {
    position: relative;
    padding-bottom: 20px;

    &:last-child {
        padding-bottom: 0;
    }

    .milestone-dot {
        position: absolute;
        left: -24px;
        top: 4px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #e6e6e6;
        border: 3px solid #fff;
        box-shadow: 0 0 0 2px #e6e6e6;
    }

    &.completed .milestone-dot {
        background: #52c41a;
        box-shadow: 0 0 0 2px #52c41a;
    }

    &.current .milestone-dot {
        background: #1890ff;
        box-shadow: 0 0 0 2px #1890ff;
        animation: pulse 2s infinite;
    }

    .milestone-content {
        .milestone-title {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 4px;
        }

        .milestone-date {
            font-size: 12px;
            color: #8c8c8c;
            margin-bottom: 4px;
        }

        .milestone-desc {
            font-size: 13px;
            color: #595959;
            line-height: 1.5;
        }
    }
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }
}

.pain-chart {
    width: 100%;
    height: 200px;
}
</style>
