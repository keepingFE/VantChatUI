<template>
    <div class="posture-analysis">
        <div class="header">
            <div class="title">{{ title }}</div>
            <div class="date">{{ formattedDate }}</div>
        </div>

        <div class="overall-score">
            <div class="score-circle">
                <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f0f0f0" stroke-width="8" />
                    <circle cx="60" cy="60" r="50" fill="none" :stroke="scoreColor" stroke-width="8"
                        stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                        transform="rotate(-90 60 60)" />
                </svg>
                <div class="score-text">
                    <div class="score-value">{{ overallScore }}</div>
                    <div class="score-label">综合评分</div>
                </div>
            </div>
            <div class="score-desc">{{ scoreDescription }}</div>
        </div>

        <div class="posture-diagram">
            <div class="body-outline">
                <div class="head" :class="getPartStatus(data.head)"></div>
                <div class="neck" :class="getPartStatus(data.neck)"></div>
                <div class="shoulders" :class="getPartStatus(data.shoulders)"></div>
                <div class="spine" :class="getPartStatus(data.spine)"></div>
                <div class="pelvis" :class="getPartStatus(data.pelvis)"></div>
            </div>
            <div class="legend">
                <div class="legend-item">
                    <span class="dot good"></span>
                    <span>良好</span>
                </div>
                <div class="legend-item">
                    <span class="dot warning"></span>
                    <span>注意</span>
                </div>
                <div class="legend-item">
                    <span class="dot danger"></span>
                    <span>异常</span>
                </div>
            </div>
        </div>

        <div class="details-section">
            <div class="section-title">详细分析</div>
            <div class="details-list">
                <div v-for="item in analysisDetails" :key="item.part" class="detail-item">
                    <div class="detail-header">
                        <span class="part-name">{{ item.part }}</span>
                        <span class="part-score" :style="{ color: getScoreColor(item.score) }">
                            {{ item.score }}分
                        </span>
                    </div>
                    <div class="detail-bar">
                        <div class="detail-fill" :style="{
                            width: item.score + '%',
                            background: getScoreColor(item.score)
                        }"></div>
                    </div>
                    <div class="detail-desc">{{ item.description }}</div>
                </div>
            </div>
        </div>

        <div class="suggestions-section">
            <div class="section-title">改善建议</div>
            <div class="suggestions-list">
                <div v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
                    <div class="suggestion-icon">{{ suggestion.icon }}</div>
                    <div class="suggestion-content">
                        <div class="suggestion-title">{{ suggestion.title }}</div>
                        <div class="suggestion-desc">{{ suggestion.description }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: '体态分析'
    },
    date: {
        type: [String, Date],
        default: () => new Date()
    },
    overallScore: {
        type: Number,
        required: true
    },
    data: {
        type: Object,
        required: true
        // data 结构：
        // {
        //   head: { score: 85, angle: 5 },
        //   neck: { score: 70, angle: 15 },
        //   shoulders: { score: 80, leftHeight: 0, rightHeight: 2 },
        //   spine: { score: 75, curvature: 'slight' },
        //   pelvis: { score: 90, tilt: 2 }
        // }
    },
    analysisDetails: {
        type: Array,
        required: true
    },
    suggestions: {
        type: Array,
        default: () => []
    }
})

const formattedDate = computed(() => {
    const d = new Date(props.date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const scoreDescription = computed(() => {
    const score = props.overallScore
    if (score >= 90) return '体态优秀，请继续保持'
    if (score >= 80) return '体态良好，略有改善空间'
    if (score >= 70) return '体态一般，建议加强锻炼'
    if (score >= 60) return '体态较差，需要重点改善'
    return '体态异常，建议就医检查'
})

const scoreColor = computed(() => {
    const score = props.overallScore
    if (score >= 90) return '#52c41a'
    if (score >= 80) return '#73d13d'
    if (score >= 70) return '#faad14'
    if (score >= 60) return '#ff7a45'
    return '#f5222d'
})

const circumference = computed(() => 2 * Math.PI * 50)
const dashOffset = computed(() => circumference.value * (1 - props.overallScore / 100))

const getPartStatus = (part) => {
    if (!part) return 'good'
    if (part.score >= 80) return 'good'
    if (part.score >= 60) return 'warning'
    return 'danger'
}

const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a'
    if (score >= 60) return '#faad14'
    return '#ff7875'
}
</script>

<style scoped lang="scss">
.posture-analysis {
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

    .date {
        font-size: 14px;
        color: #8c8c8c;
    }
}

.overall-score {
    text-align: center;
    margin-bottom: 24px;

    .score-circle {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 12px;

        svg {
            width: 100%;
            height: 100%;
        }

        .score-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;

            .score-value {
                font-size: 32px;
                font-weight: 600;
                color: #1a1a1a;
                line-height: 1;
            }

            .score-label {
                font-size: 12px;
                color: #8c8c8c;
                margin-top: 4px;
            }
        }
    }

    .score-desc {
        font-size: 14px;
        color: #595959;
    }
}

.posture-diagram {
    background: #f7f8fa;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;

    .body-outline {
        width: 80px;
        margin: 0 auto 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .head {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid;
        }

        .neck {
            width: 20px;
            height: 25px;
            border: 3px solid;
            border-radius: 4px;
        }

        .shoulders {
            width: 60px;
            height: 15px;
            border: 3px solid;
            border-radius: 8px;
        }

        .spine {
            width: 15px;
            height: 60px;
            border: 3px solid;
            border-radius: 8px;
        }

        .pelvis {
            width: 50px;
            height: 20px;
            border: 3px solid;
            border-radius: 8px;
        }

        .good {
            border-color: #52c41a;
            background: rgba(82, 196, 26, 0.1);
        }

        .warning {
            border-color: #faad14;
            background: rgba(250, 173, 20, 0.1);
        }

        .danger {
            border-color: #ff7875;
            background: rgba(255, 120, 117, 0.1);
        }
    }

    .legend {
        display: flex;
        justify-content: center;
        gap: 16px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #8c8c8c;

        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;

            &.good {
                background: #52c41a;
            }

            &.warning {
                background: #faad14;
            }

            &.danger {
                background: #ff7875;
            }
        }
    }
}

.details-section,
.suggestions-section {
    margin-top: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.details-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.detail-item {
    .detail-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .part-name {
            font-size: 14px;
            color: #1a1a1a;
        }

        .part-score {
            font-size: 14px;
            font-weight: 600;
        }
    }

    .detail-bar {
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 6px;

        .detail-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.6s ease;
        }
    }

    .detail-desc {
        font-size: 12px;
        color: #8c8c8c;
        line-height: 1.5;
    }
}

.suggestions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.suggestion-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;

    .suggestion-icon {
        font-size: 24px;
        flex-shrink: 0;
    }

    .suggestion-content {
        flex: 1;

        .suggestion-title {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 4px;
        }

        .suggestion-desc {
            font-size: 13px;
            color: #8c8c8c;
            line-height: 1.5;
        }
    }
}
</style>
