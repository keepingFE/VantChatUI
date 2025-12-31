<template>
    <div class="goal-progress-card">
        <div class="header">
            <div class="goal-icon">{{ icon }}</div>
            <div class="goal-info">
                <div class="goal-title">{{ title }}</div>
                <div class="goal-period">{{ period }}</div>
            </div>
            <div class="goal-status" :class="statusClass">
                {{ statusText }}
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" :style="{
                    width: progressPercentage + '%',
                    background: progressColor
                }">
                    <span class="progress-label" v-if="progressPercentage > 20">
                        {{ progressPercentage }}%
                    </span>
                </div>
            </div>
            <div class="progress-values">
                <span class="current">{{ current }} {{ unit }}</span>
                <span class="target">目标: {{ target }} {{ unit }}</span>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">已完成</div>
                <div class="stat-value">{{ progressPercentage }}%</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">剩余</div>
                <div class="stat-value">{{ remaining }} {{ unit }}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">日均需完成</div>
                <div class="stat-value">{{ dailyRequired }} {{ unit }}</div>
            </div>
        </div>

        <div class="timeline-section" v-if="milestones.length">
            <div class="section-title">里程碑</div>
            <div class="milestones">
                <div v-for="(milestone, index) in milestones" :key="index" class="milestone"
                    :class="{ achieved: milestone.achieved }">
                    <div class="milestone-icon">
                        {{ milestone.achieved ? '✓' : '○' }}
                    </div>
                    <div class="milestone-info">
                        <div class="milestone-name">{{ milestone.name }}</div>
                        <div class="milestone-value">{{ milestone.value }} {{ unit }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="motivation-section" v-if="motivation">
            <div class="motivation-icon">{{ motivation.icon }}</div>
            <div class="motivation-text">{{ motivation.text }}</div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    icon: {
        type: String,
        default: '🎯'
    },
    title: {
        type: String,
        required: true
    },
    period: {
        type: String,
        default: '本周'
    },
    current: {
        type: Number,
        required: true
    },
    target: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: '步'
    },
    daysRemaining: {
        type: Number,
        default: 7
    },
    milestones: {
        type: Array,
        default: () => []
        // milestones 结构：
        // [
        //   { name: '25%', value: 2500, achieved: true },
        //   { name: '50%', value: 5000, achieved: true },
        //   { name: '75%', value: 7500, achieved: false },
        //   { name: '100%', value: 10000, achieved: false }
        // ]
    },
    motivation: {
        type: Object,
        default: null
        // motivation 结构：
        // { icon: '💪', text: '再坚持3天就能完成目标了！' }
    }
})

const progressPercentage = computed(() => {
    const percentage = (props.current / props.target) * 100
    return Math.min(Math.round(percentage), 100)
})

const remaining = computed(() => {
    return Math.max(props.target - props.current, 0)
})

const dailyRequired = computed(() => {
    if (props.daysRemaining <= 0) return 0
    return Math.ceil(remaining.value / props.daysRemaining)
})

const statusClass = computed(() => {
    if (progressPercentage.value >= 100) return 'completed'
    if (progressPercentage.value >= 75) return 'on-track'
    if (progressPercentage.value >= 50) return 'good'
    return 'behind'
})

const statusText = computed(() => {
    if (progressPercentage.value >= 100) return '已完成'
    if (progressPercentage.value >= 75) return '进展顺利'
    if (progressPercentage.value >= 50) return '正常进行'
    return '需要加油'
})

const progressColor = computed(() => {
    if (progressPercentage.value >= 100) return 'linear-gradient(90deg, #52c41a 0%, #73d13d 100%)'
    if (progressPercentage.value >= 75) return 'linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)'
    if (progressPercentage.value >= 50) return 'linear-gradient(90deg, #faad14 0%, #ffc53d 100%)'
    return 'linear-gradient(90deg, #ff7875 0%, #ff9c6e 100%)'
})
</script>

<style scoped lang="scss">
.goal-progress-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    .goal-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
    }

    .goal-info {
        flex: 1;

        .goal-title {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 4px;
        }

        .goal-period {
            font-size: 13px;
            color: #8c8c8c;
        }
    }

    .goal-status {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 500;

        &.completed {
            background: #f6ffed;
            color: #52c41a;
        }

        &.on-track {
            background: #e6f7ff;
            color: #1890ff;
        }

        &.good {
            background: #fffbe6;
            color: #faad14;
        }

        &.behind {
            background: #fff1f0;
            color: #ff7875;
        }
    }
}

.progress-section {
    margin-bottom: 20px;

    .progress-bar {
        height: 32px;
        background: #f0f0f0;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 8px;
        position: relative;

        .progress-fill {
            height: 100%;
            border-radius: 16px;
            transition: width 0.6s ease;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 12px;

            .progress-label {
                font-size: 14px;
                font-weight: 600;
                color: #fff;
            }
        }
    }

    .progress-values {
        display: flex;
        justify-content: space-between;
        font-size: 14px;

        .current {
            color: #1a1a1a;
            font-weight: 600;
        }

        .target {
            color: #8c8c8c;
        }
    }
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
}

.stat-item {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 12px;
    text-align: center;

    .stat-label {
        font-size: 12px;
        color: #8c8c8c;
        margin-bottom: 6px;
    }

    .stat-value {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }
}

.timeline-section {
    margin-bottom: 20px;

    .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 12px;
    }

    .milestones {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .milestone {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.2s;

        &.achieved {
            background: #f6ffed;

            .milestone-icon {
                background: #52c41a;
                color: #fff;
            }

            .milestone-name {
                color: #52c41a;
            }
        }

        .milestone-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #f0f0f0;
            color: #8c8c8c;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 600;
            flex-shrink: 0;
        }

        .milestone-info {
            flex: 1;

            .milestone-name {
                font-size: 14px;
                font-weight: 500;
                color: #8c8c8c;
                margin-bottom: 2px;
            }

            .milestone-value {
                font-size: 13px;
                color: #8c8c8c;
            }
        }
    }
}

.motivation-section {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
    border-radius: 12px;
    color: #fff;

    .motivation-icon {
        font-size: 32px;
        flex-shrink: 0;
    }

    .motivation-text {
        font-size: 14px;
        line-height: 1.6;
    }
}
</style>
