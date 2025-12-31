<template>
    <div class="sleep-score-card">
        <div class="card-header">
            <div class="title">{{ title }}</div>
            <div class="date">{{ formattedDate }}</div>
        </div>

        <div class="score-circle">
            <svg viewBox="0 0 200 200" class="circle-svg">
                <circle cx="100" cy="100" r="85" fill="none" stroke="#f0f0f0" stroke-width="12" />
                <circle cx="100" cy="100" r="85" fill="none" :stroke="scoreColor" stroke-width="12"
                    stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                    transform="rotate(-90 100 100)" class="progress-circle" />
            </svg>
            <div class="score-content">
                <div class="score-value">{{ score }}</div>
                <div class="score-label">{{ scoreLevel }}</div>
            </div>
        </div>

        <div class="factors-section">
            <div class="section-title">评分因素</div>
            <div class="factors-list">
                <div v-for="factor in factors" :key="factor.name" class="factor-item">
                    <div class="factor-header">
                        <span class="factor-name">{{ factor.name }}</span>
                        <span class="factor-score" :style="{ color: getFactorColor(factor.score) }">
                            {{ factor.score }}分
                        </span>
                    </div>
                    <div class="factor-bar">
                        <div class="factor-fill" :style="{
                            width: (factor.score / 100 * 100) + '%',
                            background: getFactorColor(factor.score)
                        }"></div>
                    </div>
                    <div class="factor-desc">{{ factor.description }}</div>
                </div>
            </div>
        </div>

        <div class="insights-section">
            <div class="section-title">睡眠洞察</div>
            <div class="insights-list">
                <div v-for="(insight, index) in insights" :key="index" class="insight-item">
                    <div class="insight-icon">{{ insight.icon }}</div>
                    <div class="insight-text">{{ insight.text }}</div>
                </div>
            </div>
        </div>

        <div class="recommendations-section" v-if="recommendations.length">
            <div class="section-title">改善建议</div>
            <div class="recommendations-list">
                <div v-for="(rec, index) in recommendations" :key="index" class="recommendation-item">
                    <div class="rec-icon">💡</div>
                    <div class="rec-text">{{ rec }}</div>
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
        default: '睡眠评分'
    },
    date: {
        type: [String, Date],
        default: () => new Date()
    },
    score: {
        type: Number,
        required: true,
        validator: (value) => value >= 0 && value <= 100
    },
    factors: {
        type: Array,
        required: true
        // factors 结构示例：
        // [
        //   { name: '睡眠时长', score: 85, description: '7小时30分钟，接近理想时长' },
        //   { name: '深度睡眠', score: 75, description: '深睡占比25%，略低于标准' },
        //   { name: '睡眠连续性', score: 90, description: '夜间醒来1次，睡眠连续' },
        //   { name: '入睡时间', score: 80, description: '15分钟入睡，较为理想' }
        // ]
    },
    insights: {
        type: Array,
        default: () => []
        // insights 结构示例：
        // [
        //   { icon: '😴', text: '你的睡眠质量优于70%的用户' },
        //   { icon: '🌙', text: '深度睡眠时长比上周增加15分钟' }
        // ]
    },
    recommendations: {
        type: Array,
        default: () => []
        // recommendations 示例：
        // ['建议在22:00-23:00之间入睡', '睡前1小时避免使用电子设备']
    }
})

const formattedDate = computed(() => {
    const d = new Date(props.date)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const scoreLevel = computed(() => {
    if (props.score >= 90) return '优秀'
    if (props.score >= 80) return '良好'
    if (props.score >= 70) return '一般'
    if (props.score >= 60) return '较差'
    return '很差'
})

const scoreColor = computed(() => {
    if (props.score >= 90) return '#52c41a'
    if (props.score >= 80) return '#73d13d'
    if (props.score >= 70) return '#faad14'
    if (props.score >= 60) return '#ff7a45'
    return '#f5222d'
})

const circumference = computed(() => {
    return 2 * Math.PI * 85
})

const dashOffset = computed(() => {
    return circumference.value * (1 - props.score / 100)
})

const getFactorColor = (score) => {
    if (score >= 85) return '#52c41a'
    if (score >= 70) return '#faad14'
    return '#ff7875'
}
</script>

<style scoped lang="scss">
.sleep-score-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.card-header {
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

.score-circle {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 24px;

    .circle-svg {
        width: 100%;
        height: 100%;
    }

    .progress-circle {
        transition: stroke-dashoffset 1s ease;
    }

    .score-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        .score-value {
            font-size: 48px;
            font-weight: 600;
            color: #1a1a1a;
            line-height: 1;
            margin-bottom: 8px;
        }

        .score-label {
            font-size: 16px;
            color: #8c8c8c;
        }
    }
}

.factors-section,
.insights-section,
.recommendations-section {
    margin-top: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 12px;
}

.factors-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.factor-item {
    .factor-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;

        .factor-name {
            font-size: 14px;
            color: #1a1a1a;
        }

        .factor-score {
            font-size: 14px;
            font-weight: 600;
        }
    }

    .factor-bar {
        height: 6px;
        background: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 6px;

        .factor-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.6s ease;
        }
    }

    .factor-desc {
        font-size: 12px;
        color: #8c8c8c;
        line-height: 1.5;
    }
}

.insights-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.insight-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;

    .insight-icon {
        font-size: 24px;
        flex-shrink: 0;
    }

    .insight-text {
        font-size: 14px;
        color: #595959;
        line-height: 1.6;
    }
}

.recommendations-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recommendation-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    background: #e6f7ff;
    border-radius: 8px;
    border-left: 3px solid #1890ff;

    .rec-icon {
        font-size: 20px;
        flex-shrink: 0;
    }

    .rec-text {
        font-size: 14px;
        color: #595959;
        line-height: 1.6;
    }
}
</style>
