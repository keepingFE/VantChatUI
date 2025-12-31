<template>
    <div class="strength-training-chart">
        <!-- 头部信息 -->
        <div class="header">
            <div class="title-section">
                <h3 class="title">{{ title }}</h3>
                <div class="date">{{ date }}</div>
            </div>
            <div class="summary-badge">
                <span class="badge-icon">💪</span>
                <span class="badge-text">{{ totalSets }} 组</span>
            </div>
        </div>

        <!-- 训练动作列表 -->
        <div class="exercise-list">
            <div class="exercise-item" v-for="(exercise, index) in exercises" :key="index"
                @click="handleExerciseClick(exercise)">
                <div class="exercise-header">
                    <div class="exercise-name">
                        <span class="exercise-icon">{{ exercise.icon }}</span>
                        <span class="name-text">{{ exercise.name }}</span>
                    </div>
                    <div class="exercise-muscle">{{ exercise.muscleGroup }}</div>
                </div>

                <!-- 组数详情 -->
                <div class="sets-container">
                    <div class="set-item" v-for="(set, setIndex) in exercise.sets" :key="setIndex"
                        :class="{ completed: set.completed }">
                        <div class="set-number">{{ setIndex + 1 }}</div>
                        <div class="set-details">
                            <span class="weight">{{ set.weight }}kg</span>
                            <span class="separator">×</span>
                            <span class="reps">{{ set.reps }}次</span>
                        </div>
                        <div class="set-status">
                            <span v-if="set.completed" class="check-icon">✓</span>
                            <span v-else class="pending-icon">○</span>
                        </div>
                    </div>
                </div>

                <!-- 统计信息 -->
                <div class="exercise-stats">
                    <div class="stat">
                        <span class="stat-label">总重量</span>
                        <span class="stat-value">{{ calculateTotalWeight(exercise) }}kg</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">总次数</span>
                        <span class="stat-value">{{ calculateTotalReps(exercise) }}次</span>
                    </div>
                    <div class="stat" v-if="exercise.restTime">
                        <span class="stat-label">休息</span>
                        <span class="stat-value">{{ exercise.restTime }}s</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部总结 -->
        <div class="summary" v-if="showSummary">
            <div class="summary-item">
                <div class="summary-icon">🏋️</div>
                <div class="summary-content">
                    <div class="summary-label">总训练量</div>
                    <div class="summary-value">{{ totalVolume }}kg</div>
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-icon">⏱️</div>
                <div class="summary-content">
                    <div class="summary-label">训练时长</div>
                    <div class="summary-value">{{ duration }}分钟</div>
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-icon">🔥</div>
                <div class="summary-content">
                    <div class="summary-label">消耗热量</div>
                    <div class="summary-value">{{ calories }}千卡</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'StrengthTrainingChart',
    props: {
        title: {
            type: String,
            default: '力量训练'
        },
        date: {
            type: String,
            default: () => new Date().toLocaleDateString('zh-CN')
        },
        exercises: {
            type: Array,
            default: () => [
                {
                    name: '杠铃深蹲',
                    icon: '🦵',
                    muscleGroup: '腿部',
                    sets: [
                        { weight: 80, reps: 10, completed: true },
                        { weight: 90, reps: 8, completed: true },
                        { weight: 100, reps: 6, completed: true },
                        { weight: 100, reps: 6, completed: false }
                    ],
                    restTime: 120
                },
                {
                    name: '卧推',
                    icon: '💪',
                    muscleGroup: '胸部',
                    sets: [
                        { weight: 60, reps: 12, completed: true },
                        { weight: 70, reps: 10, completed: true },
                        { weight: 75, reps: 8, completed: false }
                    ],
                    restTime: 90
                }
            ]
        },
        duration: {
            type: Number,
            default: 65
        },
        calories: {
            type: Number,
            default: 320
        },
        showSummary: {
            type: Boolean,
            default: true
        }
    },
    emits: ['exercise-click'],
    computed: {
        totalSets() {
            return this.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
        },
        totalVolume() {
            return this.exercises.reduce((sum, ex) => {
                return sum + ex.sets.reduce((setSum, set) => {
                    return setSum + (set.completed ? set.weight * set.reps : 0);
                }, 0);
            }, 0);
        }
    },
    methods: {
        calculateTotalWeight(exercise) {
            return exercise.sets.reduce((sum, set) => {
                return sum + (set.completed ? set.weight * set.reps : 0);
            }, 0);
        },
        calculateTotalReps(exercise) {
            return exercise.sets.reduce((sum, set) => {
                return sum + (set.completed ? set.reps : 0);
            }, 0);
        },
        handleExerciseClick(exercise) {
            this.$emit('exercise-click', exercise);
        }
    }
};
</script>

<style scoped>
.strength-training-chart {
    background: #fff;
    border-radius: 20px;
    padding: 20px 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    max-width: 100%;
    overflow: hidden;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
}

.title-section {
    flex: 1;
}

.title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin: 0 0 4px 0;
}

.date {
    font-size: 13px;
    color: #999;
}

.summary-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
}

.badge-icon {
    font-size: 14px;
}

.exercise-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
}

.exercise-item {
    background: #f7f8fa;
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.exercise-item:active {
    transform: scale(0.98);
}

.exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.exercise-name {
    display: flex;
    align-items: center;
    gap: 8px;
}

.exercise-icon {
    font-size: 20px;
}

.name-text {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.exercise-muscle {
    font-size: 12px;
    color: #fff;
    background: #667eea;
    padding: 4px 10px;
    border-radius: 12px;
}

.sets-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.set-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: #fff;
    border-radius: 10px;
    border: 2px solid transparent;
    transition: all 0.2s;
}

.set-item.completed {
    border-color: #34c759;
    background: #f0fdf4;
}

.set-number {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    flex-shrink: 0;
}

.set-item.completed .set-number {
    background: #34c759;
    color: #fff;
}

.set-details {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
}

.weight {
    color: #333;
}

.separator {
    color: #999;
}

.reps {
    color: #666;
}

.set-status {
    font-size: 18px;
    flex-shrink: 0;
}

.check-icon {
    color: #34c759;
}

.pending-icon {
    color: #d1d5db;
}

.exercise-stats {
    display: flex;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.stat-label {
    font-size: 11px;
    color: #999;
}

.stat-value {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.summary {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 20px;
    border-top: 2px solid #f0f0f0;
}

.summary-item {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    border-radius: 12px;
}

@media (max-width: 640px) {
    .summary-item {
        flex: 1 1 calc(50% - 6px);
        min-width: calc(50% - 6px);
    }
}

.summary-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.summary-content {
    flex: 1;
    min-width: 0;
}

.summary-label {
    font-size: 11px;
    color: #c44536;
    font-weight: 500;
}

.summary-value {
    font-size: 16px;
    font-weight: 700;
    color: #c44536;
}
</style>
