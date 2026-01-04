<template>
    <div class="demo-page">
        <Navbar title="运动强度区间" @back="$router.back()" />

        <div class="demo-content">
            <div class="demo-header">
                <h2>WorkoutZoneChart</h2>
                <p>心率区间分布图，热身、燃脂、有氧、无氧、极限区分析</p>
            </div>

            <div class="demo-section">
                <h3>完整示例</h3>
                <WorkoutZoneChart :zones="zones" :show-chart="true" @zone-click="handleZoneClick" />
            </div>

            <div class="demo-section">
                <h3>无图表版本</h3>
                <WorkoutZoneChart title="今日训练区间" :zones="todayZones" :show-chart="false"
                    recommendation="今天主要在燃脂区训练，适合减脂目标。" />
            </div>
        </div>
    </div>
</template>

<script>
import { WorkoutZoneChart, Navbar } from '../../../packages/src/index.js';
import { useRouter } from 'vue-router';

export default {
    name: 'WorkoutZoneChartDemo',
    components: {
        WorkoutZoneChart,
        Navbar
    },
    setup() {
        const $router = useRouter();
        return { $router };
    },
    data() {
        return {
            zones: [
                {
                    id: 1,
                    name: '热身区',
                    icon: '🚶',
                    minHR: 90,
                    maxHR: 110,
                    duration: 5,
                    percentage: 8,
                    color: '#3b82f6'
                },
                {
                    id: 2,
                    name: '燃脂区',
                    icon: '🔥',
                    minHR: 110,
                    maxHR: 130,
                    duration: 15,
                    percentage: 25,
                    color: '#22c55e'
                },
                {
                    id: 3,
                    name: '有氧区',
                    icon: '🏃',
                    minHR: 130,
                    maxHR: 150,
                    duration: 25,
                    percentage: 42,
                    color: '#f59e0b'
                },
                {
                    id: 4,
                    name: '无氧区',
                    icon: '⚡',
                    minHR: 150,
                    maxHR: 170,
                    duration: 12,
                    percentage: 20,
                    color: '#f97316'
                },
                {
                    id: 5,
                    name: '极限区',
                    icon: '🚀',
                    minHR: 170,
                    maxHR: 190,
                    duration: 3,
                    percentage: 5,
                    color: '#ef4444'
                }
            ],
            todayZones: [
                {
                    id: 1,
                    name: '热身区',
                    icon: '🚶',
                    minHR: 90,
                    maxHR: 110,
                    duration: 8,
                    percentage: 20,
                    color: '#3b82f6'
                },
                {
                    id: 2,
                    name: '燃脂区',
                    icon: '🔥',
                    minHR: 110,
                    maxHR: 130,
                    duration: 25,
                    percentage: 62,
                    color: '#22c55e'
                },
                {
                    id: 3,
                    name: '有氧区',
                    icon: '🏃',
                    minHR: 130,
                    maxHR: 150,
                    duration: 7,
                    percentage: 18,
                    color: '#f59e0b'
                }
            ]
        };
    },
    methods: {
        handleZoneClick(zone) {
            console.log('点击了区间:', zone);
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
