<template>
    <div class="challenge-card" :class="[status, { featured }]" @click="handleClick">
        <!-- 特色标签 -->
        <div class="featured-badge" v-if="featured">
            <span class="star-icon">⭐</span>
            <span>精选挑战</span>
        </div>

        <!-- 卡片头部 -->
        <div class="card-header">
            <div class="challenge-icon" :style="{ background: iconColor }">
                {{ icon }}
            </div>
            <div class="header-info">
                <h3 class="challenge-title">{{ title }}</h3>
                <div class="challenge-category">{{ category }}</div>
            </div>
            <div class="status-badge" :class="status">
                {{ statusText }}
            </div>
        </div>

        <!-- 挑战描述 -->
        <div class="challenge-description">
            {{ description }}
        </div>

        <!-- 进度条 -->
        <div class="progress-section">
            <div class="progress-header">
                <span class="progress-label">完成进度</span>
                <span class="progress-value">{{ currentValue }} / {{ targetValue }} {{ unit }}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{
                    width: progressPercentage + '%',
                    background: progressColor
                }">
                    <div class="progress-shine"></div>
                </div>
            </div>
            <div class="progress-percentage">{{ progressPercentage }}%</div>
        </div>

        <!-- 时间信息 -->
        <div class="time-section">
            <div class="time-item" v-if="startDate">
                <span class="time-icon">📅</span>
                <span class="time-label">开始:</span>
                <span class="time-value">{{ startDate }}</span>
            </div>
            <div class="time-item" v-if="endDate">
                <span class="time-icon">⏰</span>
                <span class="time-label">截止:</span>
                <span class="time-value" :class="{ urgent: isUrgent }">{{ endDate }}</span>
            </div>
            <div class="time-remaining" v-if="daysRemaining !== null" :class="{ urgent: isUrgent }">
                剩余 {{ daysRemaining }} 天
            </div>
        </div>

        <!-- 奖励信息 -->
        <div class="rewards-section" v-if="rewards.length > 0">
            <div class="rewards-title">🎁 完成奖励</div>
            <div class="rewards-list">
                <div class="reward-item" v-for="(reward, index) in rewards" :key="index">
                    <span class="reward-icon">{{ reward.icon }}</span>
                    <span class="reward-text">{{ reward.text }}</span>
                </div>
            </div>
        </div>

        <!-- 参与者信息 -->
        <div class="participants-section" v-if="showParticipants && participants > 0">
            <div class="participants-avatars">
                <div class="avatar" v-for="i in Math.min(3, participants)" :key="i">
                    {{ participantIcons[i % participantIcons.length] }}
                </div>
                <div class="more-count" v-if="participants > 3">
                    +{{ participants - 3 }}
                </div>
            </div>
            <div class="participants-text">{{ participants }} 人参与</div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
            <button class="action-btn" :class="actionButtonClass" @click.stop="handleAction">
                {{ actionButtonText }}
            </button>
            <button class="share-btn" v-if="showShare" @click.stop="handleShare">
                <span class="share-icon">📤</span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChallengeCard',
    props: {
        title: {
            type: String,
            default: '30天跑步挑战'
        },
        description: {
            type: String,
            default: '连续30天每天跑步至少3公里，养成运动习惯'
        },
        icon: {
            type: String,
            default: '🏃'
        },
        iconColor: {
            type: String,
            default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        category: {
            type: String,
            default: '跑步'
        },
        status: {
            type: String,
            default: 'ongoing', // not-started, ongoing, completed, failed
            validator: (value) => ['not-started', 'ongoing', 'completed', 'failed'].includes(value)
        },
        currentValue: {
            type: Number,
            default: 12
        },
        targetValue: {
            type: Number,
            default: 30
        },
        unit: {
            type: String,
            default: '天'
        },
        startDate: {
            type: String,
            default: ''
        },
        endDate: {
            type: String,
            default: ''
        },
        daysRemaining: {
            type: Number,
            default: null
        },
        rewards: {
            type: Array,
            default: () => [
                { icon: '🏆', text: '挑战者徽章' },
                { icon: '💎', text: '100积分' }
            ]
        },
        participants: {
            type: Number,
            default: 0
        },
        showParticipants: {
            type: Boolean,
            default: true
        },
        showShare: {
            type: Boolean,
            default: true
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click', 'action', 'share'],
    data() {
        return {
            participantIcons: ['👤', '👥', '🧑', '👨', '👩']
        };
    },
    computed: {
        progressPercentage() {
            if (this.targetValue === 0) return 0;
            return Math.min(100, Math.round((this.currentValue / this.targetValue) * 100));
        },
        progressColor() {
            if (this.status === 'completed') return 'linear-gradient(90deg, #34c759 0%, #30d158 100%)';
            if (this.status === 'failed') return 'linear-gradient(90deg, #ff3b30 0%, #ff453a 100%)';
            if (this.progressPercentage >= 80) return 'linear-gradient(90deg, #34c759 0%, #30d158 100%)';
            if (this.progressPercentage >= 50) return 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)';
            return 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
        },
        statusText() {
            const texts = {
                'not-started': '未开始',
                'ongoing': '进行中',
                'completed': '已完成',
                'failed': '已失败'
            };
            return texts[this.status] || texts['not-started'];
        },
        isUrgent() {
            return this.daysRemaining !== null && this.daysRemaining <= 3;
        },
        actionButtonText() {
            const texts = {
                'not-started': '开始挑战',
                'ongoing': '继续挑战',
                'completed': '查看详情',
                'failed': '重新挑战'
            };
            return texts[this.status] || texts['not-started'];
        },
        actionButtonClass() {
            return {
                'not-started': 'btn-start',
                'ongoing': 'btn-continue',
                'completed': 'btn-completed',
                'failed': 'btn-retry'
            }[this.status] || 'btn-start';
        }
    },
    methods: {
        handleClick() {
            this.$emit('click', {
                title: this.title,
                status: this.status,
                progress: this.progressPercentage
            });
        },
        handleAction() {
            this.$emit('action', {
                title: this.title,
                status: this.status
            });
        },
        handleShare() {
            this.$emit('share', {
                title: this.title,
                progress: this.progressPercentage
            });
        }
    }
};
</script>

<style scoped>
.challenge-card {
    background: #fff;
    border-radius: 20px;
    padding: 20px 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    overflow: hidden;
    max-width: 100%;
}

.challenge-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.challenge-card.featured {
    border: 2px solid #ffd700;
    box-shadow: 0 4px 24px rgba(255, 215, 0, 0.3);
}

.challenge-card.featured::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
    animation: shine 2s linear infinite;
}

.featured-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    color: #92400e;
    z-index: 2;
}

.star-icon {
    font-size: 12px;
}

.card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
}

.challenge-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-info {
    flex: 1;
    min-width: 0;
}

.challenge-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0 0 4px 0;
}

.challenge-category {
    font-size: 12px;
    color: #999;
    font-weight: 500;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
}

.status-badge.not-started {
    background: #e5e7eb;
    color: #6b7280;
}

.status-badge.ongoing {
    background: #dbeafe;
    color: #1e40af;
}

.status-badge.completed {
    background: #d1fae5;
    color: #065f46;
}

.status-badge.failed {
    background: #fee2e2;
    color: #991b1b;
}

.challenge-description {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
}

.progress-section {
    margin-bottom: 16px;
}

.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.progress-label {
    font-size: 13px;
    color: #999;
    font-weight: 500;
}

.progress-value {
    font-size: 14px;
    color: #333;
    font-weight: 600;
}

.progress-bar {
    height: 12px;
    background: #f0f0f0;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    margin-bottom: 6px;
}

.progress-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.6s ease;
    position: relative;
    overflow: hidden;
}

.progress-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shine 2s infinite;
}

.progress-percentage {
    text-align: right;
    font-size: 12px;
    color: #666;
    font-weight: 600;
}

.time-section {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 12px;
}

.time-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
}

.time-icon {
    font-size: 14px;
}

.time-label {
    color: #999;
}

.time-value {
    color: #333;
    font-weight: 600;
}

.time-value.urgent {
    color: #ef4444;
}

.time-remaining {
    margin-left: auto;
    padding: 4px 10px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
}

.time-remaining.urgent {
    background: #fee2e2;
    color: #991b1b;
    animation: pulse-urgent 1.5s ease-in-out infinite;
}

.rewards-section {
    margin-bottom: 16px;
    padding: 12px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 12px;
}

.rewards-title {
    font-size: 13px;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 8px;
}

.rewards-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.reward-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    font-size: 12px;
    color: #78350f;
    font-weight: 500;
}

.reward-icon {
    font-size: 14px;
}

.participants-section {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    padding: 10px;
    background: #f7f8fa;
    border-radius: 12px;
}

.participants-avatars {
    display: flex;
    align-items: center;
}

.avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 2px solid #fff;
    margin-left: -8px;
}

.avatar:first-child {
    margin-left: 0;
}

.more-count {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #666;
    border: 2px solid #fff;
    margin-left: -8px;
}

.participants-text {
    font-size: 13px;
    color: #666;
    font-weight: 500;
}

.action-section {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.action-btn {
    flex: 1;
    min-width: 0;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;
}

@media (max-width: 400px) {
    .action-btn {
        font-size: 14px;
        padding: 12px;
    }
}

.action-btn:active {
    transform: scale(0.98);
}

.btn-start {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-continue {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.btn-completed {
    background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
}

.btn-retry {
    background: linear-gradient(135deg, #ff3b30 0%, #ff453a 100%);
}

.share-btn {
    width: 48px;
    height: 48px;
    border: 2px solid #e5e7eb;
    background: #fff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.share-btn:hover {
    background: #f7f8fa;
    border-color: #d1d5db;
}

.share-btn:active {
    transform: scale(0.95);
}

.share-icon {
    font-size: 18px;
}

@keyframes shine {
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
}

@keyframes pulse-urgent {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}
</style>
