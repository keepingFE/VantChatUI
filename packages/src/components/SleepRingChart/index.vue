<template>
    <!-- 睡眠环形图容器 -->
    <div class="sleep-ring-chart">
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
                <!-- 图例数值（格式化后的时间） -->
                <span class="legend-value">
                    {{ item.value }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
// 按需引入 ECharts 核心模块
import * as echarts from 'echarts/core'
// 引入饼图组件
import { PieChart } from 'echarts/charts'
// 引入 Canvas 渲染器
import { CanvasRenderer } from 'echarts/renderers'
// 引入标签布局功能
import { LabelLayout } from 'echarts/features'

// 注册 ECharts 所需组件
echarts.use([PieChart, CanvasRenderer, LabelLayout])

export default {
    name: 'SleepRingChart',
    props: {
        /**
         * 睡眠数据数组
         * @type {Array<{name: string, value: number, color: string}>}
         * @property {string} name - 睡眠阶段名称（如：深睡、浅睡、快速眼动、清醒）
         * @property {number} value - 睡眠时长（单位：分钟）
         * @property {string} color - 对应的颜色值（十六进制格式）
         */
        sleepData: {
            type: Array,
            default: () => [
                { name: '深睡', value: 129, color: '#6C5CE7' },
                { name: '浅睡', value: 143, color: '#A29BFE' },
                { name: '快速眼动', value: 62, color: '#FD79A8' },
                { name: '清醒', value: 154, color: '#FDCB6E' }
            ]
        },
        /**
         * 环形图尺寸（暂未使用，保留用于扩展）
         * @type {number}
         */
        size: {
            type: Number,
            default: 200
        },
        /**
         * 环形图粗细（暂未使用，保留用于扩展）
         * @type {number}
         */
        ringWidth: {
            type: Number,
            default: 40
        }
    },
    setup(props) {
        // 图表 DOM 元素引用
        const chartRef = ref(null)
        // ECharts 实例对象
        let chartInstance = null

        // 图例数据（包含格式化后的时间显示）
        const legendData = ref([])

        /**
         * 格式化时间显示
         * 将分钟数转换为 "X 小时 Y 分钟" 的格式
         * @param {number} minutes - 分钟数
         * @returns {string} 格式化后的时间字符串
         */
        const formatTime = (minutes) => {
            const hours = Math.floor(minutes / 60)
            const mins = minutes % 60
            if (mins === 0) {
                return `${hours} 小时`
            }
            return `${hours} 小时 ${mins} 分钟`
        }

        /**
         * 初始化图表
         * 创建 ECharts 实例并配置环形图选项
         */
        const initChart = () => {
            // 确保 DOM 元素已挂载
            if (!chartRef.value) return

            // 初始化 ECharts 实例
            chartInstance = echarts.init(chartRef.value)

            // 准备图例数据，将分钟数转换为可读的时间格式
            legendData.value = props.sleepData.map(item => ({
                name: item.name,
                value: formatTime(item.value),
                color: item.color
            }))

            // 配置 ECharts 选项
            const option = {
                series: [
                    {
                        type: 'pie', // 饼图类型
                        radius: ['50%', '75%'], // 内外半径，形成环形效果
                        center: ['50%', '50%'], // 圆心位置
                        avoidLabelOverlap: false, // 不避免标签重叠
                        label: {
                            show: true, // 显示标签
                            position: 'center', // 标签位置在中心
                            formatter: '睡眠\n比例', // 标签文本内容
                            fontSize: 13, // 字体大小
                            color: '#999', // 字体颜色
                            lineHeight: 18 // 行高
                        },
                        labelLine: {
                            show: false // 不显示标签引导线
                        },
                        // 映射睡眠数据到图表数据格式
                        data: props.sleepData.map(item => ({
                            value: item.value, // 数值（分钟数）
                            name: item.name, // 名称
                            itemStyle: {
                                color: item.color // 扇区颜色
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

        // 监听睡眠数据变化，重新初始化图表
        watch(() => props.sleepData, () => {
            initChart()
        }, { deep: true }) // 深度监听数组内部变化

        return {
            chartRef,
            legendData
        }
    }
}
</script>

<style scoped>
/* 睡眠环形图主容器 */
.sleep-ring-chart {
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    padding: 16px 16px 16px 0;
    /* 内边距 */
    background: #fff;
    /* 白色背景 */
    border-radius: 12px;
    /* 圆角 */
}

/* 图表容器 */
.chart-container {
    width: 140px;
    /* 固定宽度 */
    height: 140px;
    /* 固定高度 */
    flex-shrink: 0;
    /* 不允许收缩 */
}

/* 图例容器 */
.legend-container {
    flex: 1;
    /* 占据剩余空间 */
    padding-left: 12px;
    /* 左侧内边距 */
    min-width: 0;
    /* 允许内容收缩 */
}

/* 图例项 */
.legend-item {
    display: flex;
    align-items: center;
    /* 垂直居中对齐 */
    margin-bottom: 12px;
    /* 底部间距 */
    font-size: 14px;
    /* 字体大小 */
}

/* 最后一个图例项不需要底部间距 */
.legend-item:last-child {
    margin-bottom: 0;
}

/* 图例颜色圆点 */
.legend-dot {
    width: 8px;
    /* 圆点宽度 */
    height: 8px;
    /* 圆点高度 */
    border-radius: 50%;
    /* 圆形 */
    margin-right: 6px;
    /* 右侧间距 */
    flex-shrink: 0;
    /* 不允许收缩 */
}

/* 图例名称 */
.legend-name {
    color: #333;
    /* 文字颜色 */
    margin-right: 8px;
    /* 右侧间距 */
    white-space: nowrap;
    /* 不换行 */
}

/* 图例数值 */
.legend-value {
    color: #333;
    /* 文字颜色 */
    font-weight: 500;
    /* 字体粗细 */
    margin-left: auto;
    /* 自动左边距，推到右侧 */
    font-size: 13px;
    /* 字体大小 */
    white-space: nowrap;
    /* 不换行 */
}

/* 小屏幕适配（宽度小于等于 375px） */
@media (max-width: 375px) {
    .chart-container {
        width: 120px;
        /* 缩小图表宽度 */
        height: 120px;
        /* 缩小图表高度 */
    }

    .legend-item {
        font-size: 13px;
        /* 缩小字体 */
        margin-bottom: 10px;
        /* 减小间距 */
    }

    .legend-value {
        font-size: 12px;
        /* 缩小数值字体 */
    }
}
</style>
