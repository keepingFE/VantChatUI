<template>
    <!-- 营养摄入饼图容器 -->
    <div class="nutrition-pie-chart">
        <!-- 标题 -->
        <div v-if="title" class="chart-title">{{ title }}</div>

        <!-- ECharts 图表容器 -->
        <div ref="chartRef" class="chart-container"></div>

        <!-- 图例容器 -->
        <div class="legend-container">
            <!-- 遍历图例数据项 -->
            <div v-for="item in legendData" :key="item.name" class="legend-item">
                <!-- 图例颜色圆点 -->
                <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
                <!-- 图例名称 -->
                <span class="legend-name">
                    {{ item.name }}
                </span>
                <!-- 图例数值（克数和百分比） -->
                <span class="legend-value">
                    {{ item.value }}g ({{ item.percentage }}%)
                </span>
            </div>
        </div>

        <!-- 营养总结卡片 -->
        <div v-if="showSummary" class="summary-card">
            <div class="summary-title">营养总览</div>
            <div class="summary-content">
                <div class="summary-item">
                    <span class="summary-label">总热量</span>
                    <span class="summary-value">{{ totalCalories }} 千卡</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">总摄入</span>
                    <span class="summary-value">{{ totalIntake }}g</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
// 按需引入 ECharts 核心模块
import * as echarts from 'echarts/core'
// 引入饼图组件
import { PieChart } from 'echarts/charts'
// 引入提示框组件
import { TooltipComponent } from 'echarts/components'
// 引入 Canvas 渲染器
import { CanvasRenderer } from 'echarts/renderers'
// 引入标签布局功能
import { LabelLayout } from 'echarts/features'

// 注册 ECharts 所需组件
echarts.use([PieChart, TooltipComponent, CanvasRenderer, LabelLayout])

export default {
    name: 'NutritionPieChart',
    props: {
        /**
         * 营养数据数组
         * @type {Array<{name: string, value: number, calories: number, color?: string}>}
         * @property {string} name - 营养素名称（如：蛋白质、碳水化合物、脂肪、其他）
         * @property {number} value - 摄入量（单位：克）
         * @property {number} calories - 该营养素提供的热量（单位：千卡）
         * @property {string} color - 对应的颜色值（十六进制格式，可选）
         */
        nutritionData: {
            type: Array,
            default: () => [
                { name: '蛋白质', value: 65, calories: 260, color: '#FF6B6B' },
                { name: '碳水化合物', value: 250, calories: 1000, color: '#4ECDC4' },
                { name: '脂肪', value: 55, calories: 495, color: '#FFD93D' },
                { name: '其他', value: 30, calories: 45, color: '#A8E6CF' }
            ]
        },
        /**
         * 图表标题
         * @type {string}
         */
        title: {
            type: String,
            default: '营养摄入比例'
        },
        /**
         * 是否显示营养总结
         * @type {boolean}
         */
        showSummary: {
            type: Boolean,
            default: true
        },
        /**
         * 图表类型：'pie' 饼图 | 'ring' 环形图
         * @type {string}
         */
        chartType: {
            type: String,
            default: 'pie',
            validator: (value) => ['pie', 'ring'].includes(value)
        }
    },
    setup(props) {
        // 图表 DOM 元素引用
        const chartRef = ref(null)
        // ECharts 实例对象
        let chartInstance = null

        // 图例数据（包含格式化后的数据显示）
        const legendData = ref([])

        // 计算总热量
        const totalCalories = computed(() => {
            return props.nutritionData.reduce((sum, item) => sum + item.calories, 0)
        })

        // 计算总摄入量
        const totalIntake = computed(() => {
            return props.nutritionData.reduce((sum, item) => sum + item.value, 0)
        })

        /**
         * 初始化图表
         * 创建 ECharts 实例并配置饼图选项
         */
        const initChart = () => {
            // 确保 DOM 元素已挂载
            if (!chartRef.value) return

            // 销毁已存在的实例
            if (chartInstance) {
                chartInstance.dispose()
            }

            // 初始化 ECharts 实例
            chartInstance = echarts.init(chartRef.value)

            // 计算总量用于百分比计算
            const total = totalIntake.value

            // 准备图例数据
            legendData.value = props.nutritionData.map(item => ({
                name: item.name,
                value: item.value,
                percentage: ((item.value / total) * 100).toFixed(1),
                color: item.color || '#999'
            }))

            // 设置环形图的半径
            const radius = props.chartType === 'ring' ? ['40%', '70%'] : ['0%', '70%']

            // 配置 ECharts 选项
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        const item = props.nutritionData.find(d => d.name === params.name)
                        return `
                            <div style="padding: 4px 0;">
                                <strong>${params.name}</strong><br/>
                                摄入量: ${params.value}g (${params.percent}%)<br/>
                                热量: ${item?.calories || 0} 千卡
                            </div>
                        `
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: radius,
                        center: ['50%', '50%'],
                        avoidLabelOverlap: true,
                        label: {
                            show: true,
                            formatter: '{b}\n{d}%',
                            fontSize: 12,
                            color: '#666'
                        },
                        labelLine: {
                            show: true,
                            length: 10,
                            length2: 10
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 14,
                                fontWeight: 'bold'
                            },
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.3)'
                            }
                        },
                        data: props.nutritionData.map(item => ({
                            value: item.value,
                            name: item.name,
                            itemStyle: {
                                color: item.color || '#999'
                            }
                        }))
                    }
                ]
            }

            // 应用配置到图表实例
            chartInstance.setOption(option)
        }

        /**
         * 处理窗口大小变化
         * 调整图表尺寸以适应容器
         */
        const handleResize = () => {
            chartInstance?.resize()
        }

        // 组件挂载后初始化图表并监听窗口大小变化
        onMounted(() => {
            initChart()
            window.addEventListener('resize', handleResize)
        })

        // 组件卸载前清理资源
        onBeforeUnmount(() => {
            // 移除窗口大小变化监听器
            window.removeEventListener('resize', handleResize)
            // 销毁 ECharts 实例，释放内存
            chartInstance?.dispose()
        })

        // 监听营养数据变化，重新初始化图表
        watch(() => props.nutritionData, () => {
            initChart()
        }, { deep: true })

        // 监听图表类型变化
        watch(() => props.chartType, () => {
            initChart()
        })

        return {
            chartRef,
            legendData,
            totalCalories,
            totalIntake
        }
    }
}
</script>

<style scoped>
/* 营养饼图主容器 */
.nutrition-pie-chart {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
}

/* 图表标题 */
.chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    text-align: center;
}

/* 图表容器 */
.chart-container {
    width: 100%;
    height: 280px;
    margin-bottom: 20px;
}

/* 图例容器 */
.legend-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

/* 图例项 */
.legend-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: #f7f8fa;
    border-radius: 8px;
    transition: all 0.2s;
}

.legend-item:hover {
    background: #e8eaf0;
    transform: translateX(4px);
}

/* 图例颜色圆点 */
.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
    flex-shrink: 0;
}

/* 图例名称 */
.legend-name {
    color: #333;
    font-size: 14px;
    font-weight: 500;
    margin-right: 8px;
    white-space: nowrap;
}

/* 图例数值 */
.legend-value {
    color: #666;
    font-size: 13px;
    margin-left: auto;
    white-space: nowrap;
}

/* 营养总结卡片 */
.summary-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 16px;
    color: #fff;
}

.summary-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    opacity: 0.9;
}

.summary-content {
    display: flex;
    justify-content: space-around;
}

.summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.summary-label {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 4px;
}

.summary-value {
    font-size: 18px;
    font-weight: 700;
}

/* 小屏幕适配 */
@media (max-width: 375px) {
    .chart-container {
        height: 240px;
    }

    .legend-item {
        font-size: 13px;
        padding: 8px 10px;
    }

    .legend-value {
        font-size: 12px;
    }

    .summary-value {
        font-size: 16px;
    }
}
</style>
