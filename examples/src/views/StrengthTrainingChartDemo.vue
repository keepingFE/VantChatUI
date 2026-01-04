<template>
    <div class="demo-page">
        <Navbar title="力量训练记录" @back="$router.back()" />

        <div class="demo-content">
            <div class="demo-header">
                <h2>StrengthTrainingChart</h2>
                <p>记录训练动作、组数、重量、次数，自动计算训练量</p>
            </div>

            <div class="demo-section">
                <h3>基础示例</h3>
                <StrengthTrainingChart :exercises="exercises" :duration="75" :calories="380"
                    @exercise-click="handleExerciseClick" />
            </div>

            <div class="demo-section">
                <h3>简化版（无总结）</h3>
                <StrengthTrainingChart title="快速训练" :exercises="quickExercises" :show-summary="false" />
            </div>
        </div>
    </div>
</template>

<script>
import { StrengthTrainingChart, Navbar } from '../../../packages/src/index.js';
import { useRouter } from 'vue-router';

export default {
    name: 'StrengthTrainingChartDemo',
    components: {
        StrengthTrainingChart,
        Navbar
    },
    setup() {
        const $router = useRouter();
        return { $router };
    },
    data() {
        return {
            exercises: [
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
                        { weight: 75, reps: 8, completed: true }
                    ],
                    restTime: 90
                },
                {
                    name: '硬拉',
                    icon: '🏋️',
                    muscleGroup: '背部',
                    sets: [
                        { weight: 100, reps: 8, completed: true },
                        { weight: 110, reps: 6, completed: true },
                        { weight: 120, reps: 5, completed: false }
                    ],
                    restTime: 150
                }
            ],
            quickExercises: [
                {
                    name: '俯卧撑',
                    icon: '💪',
                    muscleGroup: '胸部',
                    sets: [
                        { weight: 0, reps: 20, completed: true },
                        { weight: 0, reps: 18, completed: true },
                        { weight: 0, reps: 15, completed: true }
                    ],
                    restTime: 60
                }
            ]
        };
    },
    methods: {
        handleExerciseClick(exercise) {
            console.log('点击了训练项目:', exercise);
        }
    }
};
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f7f8fa;
}

.demo-content {
    padding: 56px 16px 40px;
    max-width: 800px;
    margin: 0 auto;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
}

.demo-content::-webkit-scrollbar {
    width: 6px;
}

.demo-content::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 3px;
}

.demo-content::-webkit-scrollbar-track {
    background-color: transparent;
}

.demo-header {
    margin-bottom: 24px;
}

.demo-header h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #333;
}

.demo-header p {
    margin: 0;
    color: #666;
    font-size: 14px;
}

.demo-section {
    margin-bottom: 40px;
}

.demo-section h3 {
    margin-bottom: 16px;
    color: #666;
    font-size: 16px;
    font-weight: 600;
}
</style>
