<template>
    <div class="achievement-badge" :class="[size, { unlocked, animated, glowing }]" @click="handleClick">
        <div class="badge-container">
            <!-- 徽章背景光晕 -->
            <div class="badge-glow" v-if="unlocked && glowing"></div>

            <!-- 徽章主体 -->
            <div class="badge-circle" :style="{ background: badgeColor }">
                <div class="badge-icon">{{ icon }}</div>

                <!-- 未解锁遮罩 -->
                <div class="locked-overlay" v-if="!unlocked">
                    <span class="lock-icon">🔒</span>
                </div>
            </div>

            <!-- 进度环 (未解锁时显示) -->
            <svg class="progress-ring" v-if="!unlocked && showProgress" :width="ringSize" :height="ringSize">
                <circle class="progress-ring-bg" :cx="ringSize / 2" :cy="ringSize / 2" :r="radius" />
                <circle class="progress-ring-fill" :cx="ringSize / 2" :cy="ringSize / 2" :r="radius"
                    :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset" />
            </svg>

            <!-- 等级标识 -->
            <div class="badge-level" v-if="level && unlocked">
                <span class="level-text">Lv.{{ level }}</span>
            </div>
        </div>

        <!-- 徽章信息 -->
        <div class="badge-info" v-if="showInfo">
            <div class="badge-name">{{ name }}</div>
            <div class="badge-description">{{ description }}</div>

            <!-- 进度文本 -->
            <div class="progress-text" v-if="!unlocked && showProgress">
                {{ currentProgress }} / {{ targetProgress }}
            </div>

            <!-- 解锁日期 -->
            <div class="unlock-date" v-if="unlocked && unlockDate">
                {{ unlockDate }}
            </div>
        </div>

        <!-- 稀有度标签 -->
        <div class="rarity-tag" v-if="rarity && unlocked" :class="rarity">
            {{ rarityText }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'AchievementBadge',
    props: {
        icon: {
            type: String,
            default: '🏆'
        },
        name: {
            type: String,
            default: '成就名称'
        },
        description: {
            type: String,
            default: '完成特定任务解锁'
        },
        unlocked: {
            type: Boolean,
            default: false
        },
        level: {
            type: Number,
            default: null
        },
        currentProgress: {
            type: Number,
            default: 0
        },
        targetProgress: {
            type: Number,
            default: 100
        },
        showProgress: {
            type: Boolean,
            default: true
        },
        unlockDate: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'medium', // small, medium, large
            validator: (value) => ['small', 'medium', 'large'].includes(value)
        },
        rarity: {
            type: String,
            default: 'common', // common, rare, epic, legendary
            validator: (value) => ['common', 'rare', 'epic', 'legendary'].includes(value)
        },
        animated: {
            type: Boolean,
            default: true
        },
        glowing: {
            type: Boolean,
            default: true
        },
        showInfo: {
            type: Boolean,
            default: true
        }
    },
    emits: ['click'],
    computed: {
        badgeColor() {
            if (!this.unlocked) return '#d1d5db';

            const colors = {
                common: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                rare: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                epic: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                legendary: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)'
            };
            return colors[this.rarity] || colors.common;
        },
        rarityText() {
            const texts = {
                common: '普通',
                rare: '稀有',
                epic: '史诗',
                legendary: '传说'
            };
            return texts[this.rarity] || texts.common;
        },
        ringSize() {
            const sizes = {
                small: 70,
                medium: 90,
                large: 110
            };
            return sizes[this.size] || sizes.medium;
        },
        radius() {
            return (this.ringSize - 10) / 2;
        },
        circumference() {
            return 2 * Math.PI * this.radius;
        },
        progressOffset() {
            const progress = this.currentProgress / this.targetProgress;
            return this.circumference * (1 - progress);
        }
    },
    methods: {
        handleClick() {
            this.$emit('click', {
                name: this.name,
                unlocked: this.unlocked,
                progress: this.currentProgress,
                target: this.targetProgress
            });
        }
    }
};
</script>

<style scoped>
.achievement-badge {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #fff;
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
    z-index: 1;
}

.achievement-badge:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 2;
}

.achievement-badge.unlocked.animated {
    animation: unlock-bounce 0.6s ease-out;
}

.badge-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-glow {
    position: absolute;
    width: 120%;
    height: 120%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
    animation: glow-pulse 2s ease-in-out infinite;
}

.badge-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
}

.achievement-badge.small .badge-circle {
    width: 60px;
    height: 60px;
}

.achievement-badge.large .badge-circle {
    width: 100px;
    height: 100px;
}

.badge-icon {
    font-size: 36px;
    z-index: 2;
}

.achievement-badge.small .badge-icon {
    font-size: 28px;
}

.achievement-badge.large .badge-icon {
    font-size: 48px;
}

.locked-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
}

.lock-icon {
    font-size: 24px;
}

.progress-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
}

.progress-ring-bg {
    fill: none;
    stroke: #e5e7eb;
    stroke-width: 4;
}

.progress-ring-fill {
    fill: none;
    stroke: #667eea;
    stroke-width: 4;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s ease;
}

.badge-level {
    position: absolute;
    bottom: -8px;
    right: -8px;
    background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
    color: #fff;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    z-index: 4;
}

.badge-info {
    text-align: center;
    max-width: 150px;
}

.badge-name {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.achievement-badge:not(.unlocked) .badge-name {
    color: #999;
}

.badge-description {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
}

.achievement-badge:not(.unlocked) .badge-description {
    color: #aaa;
}

.progress-text {
    font-size: 12px;
    color: #667eea;
    font-weight: 600;
    margin-top: 6px;
}

.unlock-date {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
}

.rarity-tag {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.rarity-tag.common {
    background: #a8edea;
    color: #0d9488;
}

.rarity-tag.rare {
    background: #667eea;
}

.rarity-tag.epic {
    background: #f5576c;
}

.rarity-tag.legendary {
    background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
    animation: legendary-shine 2s ease-in-out infinite;
}

@keyframes unlock-bounce {
    0% {
        transform: scale(0.8) rotate(-10deg);
        opacity: 0;
    }

    50% {
        transform: scale(1.1) rotate(5deg);
    }

    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

@keyframes glow-pulse {

    0%,
    100% {
        opacity: 0.6;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.1);
    }
}

@keyframes legendary-shine {

    0%,
    100% {
        filter: brightness(1);
    }

    50% {
        filter: brightness(1.3);
    }
}
</style>
