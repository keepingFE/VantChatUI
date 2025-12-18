<template>
    <!-- 睡眠图表主容器 -->
    <div class="sleep-chart">
        <!-- 图表容器，包含 SVG 图表和标签 -->
        <div class="chart-container" ref="chartContainer">
            <!-- SVG 睡眠曲线图，使用动态视图框和非等比缩放 -->
            <svg class="sleep-svg" :viewBox="`0 0 ${svgWidth} ${svgHeight}`" preserveAspectRatio="none">
                <!-- 遍历所有可见的睡眠片段 -->
                <g v-for="(segment, index) in visibleSegments" :key="index">
                    <!-- 绘制睡眠阶段的水平线段 (粗线) -->
                    <line :x1="segment.line.x1" :y1="segment.line.y" :x2="segment.line.x2" :y2="segment.line.y"
                        :class="`sleep-line sleep-${segment.type}`" :stroke-width="lineWidth" stroke-linecap="round"
                        :stroke="getLineColor(segment.type)" />
                    <!-- 绘制连接线 (1px 细线，带弧度) -->
                    <path v-if="segment.connectionPath" :d="segment.connectionPath" class="connect-line"
                        :stroke-width="1" fill="none" :stroke="getLineColor(segment.type)" />
                </g>
            </svg>

            <!-- 时间提示框，仅在拖动滑块时显示 -->
            <div v-if="showCursor && currentTimePoint" class="time-tooltip"
                :style="{ left: cursorLinePosition + 'px' }">
                <!-- 显示当前时间点 -->
                <div class="tooltip-time">{{ currentTimePoint.time }}</div>
                <!-- 显示当前睡眠阶段类型 -->
                <div class="tooltip-type">{{ getSleepTypeName(currentTimePoint.type) }}</div>
            </div>

            <!-- 日期和时间标签区域 -->
            <div class="labels">
                <!-- 左侧标签：开始日期和入睡时间 -->
                <div class="date-label">
                    <div class="date">{{ currentDateRange.startDate }}</div>
                    <div class="time-label">入睡{{ currentDateRange.sleepTime }}</div>
                </div>
                <!-- 右侧标签：结束日期和醒来时间 -->
                <div class="date-label end-label">
                    <div class="date">{{ currentDateRange.endDate }}</div>
                    <div class="time-label">醒来{{ currentDateRange.wakeTime }}</div>
                </div>
            </div>

        </div>

        <!-- 滑块区域 - 绝对定位到底部 -->
        <div class="slider-area" ref="sliderContainer">
            <!-- 滑块轨道线 -->
            <div class="slider-track"></div>
            <!-- 可拖动的滑块小球 -->
            <div class="slider-dot" :style="{ left: dotPosition + 'px' }" @touchstart="startDrag">
                <!-- 滑块小球的竖线 -->
                <div class="dot-line"></div>
            </div>
        </div>
    </div>
    <!-- 图例说明，展示不同睡眠阶段的颜色含义 -->
    <div class="legend">
        <div class="legend-item">
            <span class="legend-color" :style="{ background: colors.deep }"></span>
            <span class="legend-text">深睡</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" :style="{ background: colors.light }"></span>
            <span class="legend-text">浅睡</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" :style="{ background: colors.rem }"></span>
            <span class="legend-text">快速眼动</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" :style="{ background: colors.awake }"></span>
            <span class="legend-text">清醒</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SleepChart',
    props: {
        // 睡眠数据数组，每个元素包含时间、日期、睡眠类型和数值
        sleepData: { type: Array, default: () => [] },
        // 每次视图显示的片段数量（当前未使用）
        segmentsPerView: { type: Number, default: 30 },
        // 自定义睡眠阶段颜色配置
        colors: {
            type: Object,
            default: () => ({
                deep: '#6d28d9',    // 深睡颜色
                light: '#a855f7',   // 浅睡颜色
                rem: '#fb7185',     // 快速眼动颜色
                awake: '#fbbf24'    // 清醒颜色
            })
        },
        // 睡眠阶段线段的粗细（像素值）
        lineWidth: { type: Number, default: 15 },
        // 连接线的粗细（像素值）
        connectLineWidth: { type: Number, default: 1 }
    },
    data() {
        return {
            currentIndex: 0,        // 当前索引（当前未使用）
            dotPosition: 0,         // 滑块小球的位置（像素值）
            isDragging: false,      // 是否正在拖动滑块
            showCursor: false,      // 是否显示游标线和提示框
            sliderWidth: 0,         // 滑块容器的宽度
            svgWidth: 1000,         // SVG 视图框宽度
            svgHeight: 300          // SVG 视图框高度
        };
    },
    computed: {
        /**
         * 计算可见的睡眠片段
         * 将睡眠数据转换为 SVG 坐标系中的线段
         * @returns {Array} 包含每个片段的起点、终点、Y坐标和类型的数组
         */
        visibleSegments() {
            const segments = [];
            const segmentWidth = this.svgWidth / this.sleepData.length;
            const radius = 10; // 圆角关径
            const rX = Math.min(radius, segmentWidth / 2.2); // X轴方向的圆角/过渡距离

            this.sleepData.forEach((point, index) => {
                const x1 = index * segmentWidth;
                const x2 = (index + 1) * segmentWidth;
                const y = this.svgHeight - (point.value * this.svgHeight / 100);

                // 计算粗线段的起止位置
                let lineStart = x1;
                let lineEnd = x2;
                let connectionPath = '';

                // 1. 处理与前一个点的连接：如果前一个点存在且高度不同，本段起点要向后缩，为连接曲线留出空间
                const prevPoint = this.sleepData[index - 1];
                if (prevPoint && Math.abs(prevPoint.value - point.value) > 0.1) {
                    lineStart += rX;
                }

                // 2. 处理与后一个点的连接：如果后一个点存在
                const nextPoint = this.sleepData[index + 1];
                if (nextPoint) {
                    const nextY = this.svgHeight - (nextPoint.value * this.svgHeight / 100);
                    const dy = nextY - y;

                    // 如果高度不同，本段终点向前缩，并生成连接曲线
                    if (Math.abs(dy) > 0.1) {
                        lineEnd -= rX;
                        const rY = Math.min(radius, Math.abs(dy) / 2); // Y轴圆角半径
                        const sign = dy > 0 ? 1 : -1;

                        // 生成S形连接曲线 (细线)
                        // 从粗线结束点开始 -> 曲线 -> 垂直线 -> 曲线 -> 下一段粗线开始点
                        connectionPath = `M ${lineEnd} ${y} 
                                        Q ${x2} ${y}, ${x2} ${y + sign * rY}
                                        L ${x2} ${nextY - sign * rY}
                                        Q ${x2} ${nextY}, ${x2 + rX} ${nextY}`;
                    }
                }

                segments.push({
                    line: { x1: lineStart, x2: lineEnd, y },
                    connectionPath,
                    type: point.type,
                    // 原始坐标保留
                    origX1: x1,
                    origX2: x2,
                    origY: y
                });
            });
            return segments;
        },
        /**
         * 计算当前日期范围和睡眠时间
         * @returns {Object} 包含开始日期、入睡时间、结束日期、醒来时间
         */
        currentDateRange() {
            if (this.sleepData.length === 0) return {};
            const startData = this.sleepData[0];                        // 第一个数据点
            const endData = this.sleepData[this.sleepData.length - 1]; // 最后一个数据点
            return {
                startDate: startData.date,      // 开始日期
                sleepTime: startData.time,      // 入睡时间
                endDate: endData.date,          // 结束日期
                wakeTime: endData.time          // 醒来时间
            };
        },
        /**
         * 根据滑块位置计算当前时间点的数据
         * @returns {Object|null} 当前时间点的睡眠数据，包含时间、类型等信息
         */
        currentTimePoint() {
            if (this.sleepData.length === 0 || this.sliderWidth === 0) return null;
            // 计算滑块中心位置（小球半径为 10px）
            const centerPosition = this.dotPosition + 10;
            // 计算滑块在整个宽度中的比例
            const ratio = centerPosition / this.sliderWidth;
            // 根据比例计算对应的数据索引
            const index = Math.round(ratio * (this.sleepData.length - 1));
            // 返回对应索引的数据，确保索引在有效范围内
            return this.sleepData[Math.max(0, Math.min(index, this.sleepData.length - 1))];
        },
        /**
         * 计算游标线的位置（滑块中心位置）
         * @returns {Number} 游标线的 X 坐标（像素值）
         */
        cursorLinePosition() {
            return this.dotPosition + 10;
        }
    },
    mounted() {
        // 初始化滑块宽度
        this.updateSliderWidth();
        // 监听窗口大小变化，动态更新滑块宽度
        window.addEventListener('resize', this.updateSliderWidth);
    },
    beforeUnmount() {
        // 移除窗口大小变化监听器
        window.removeEventListener('resize', this.updateSliderWidth);
        // 停止拖动，清理事件监听器
        this.stopDrag();
    },
    methods: {
        /**
         * 根据睡眠类型获取线段颜色
         * @param {String} type - 睡眠类型（deep/light/rem/awake）
         * @returns {String} 对应的颜色值
         */
        getLineColor(type) {
            return this.colors[type] || '#999';
        },
        /**
         * 根据睡眠类型获取连接线的颜色
         * @param {String} type1 - 睡眠类型（deep/light/rem/awake）
         * @returns {String} 对应的颜色值
         */
        getConnectColor(type1) {
            return this.colors[type1] || '#999';
        },
        /**
         * 根据睡眠类型获取中文名称
         * @param {String} type - 睡眠类型（deep/light/rem/awake）
         * @returns {String} 对应的中文名称
         */
        getSleepTypeName(type) {
            const names = { deep: '深睡', light: '浅睡', rem: '快速眼动', awake: '清醒' };
            return names[type] || type;
        },
        /**
         * 更新滑块容器的宽度
         * 在窗口大小变化或组件挂载时调用
         */
        updateSliderWidth() {
            if (this.$refs.sliderContainer) {
                const containerWidth = this.$refs.sliderContainer.offsetWidth;
                this.sliderWidth = containerWidth;
                this.updateDotPosition();
            }
        },
        /**
         * 更新滑块小球的初始位置
         * 设置为 -10px，使小球中心对齐最左侧
         */
        updateDotPosition() {
            // 初始位置设为 -10（小球左边缘在最左，中心对齐起点）
            this.dotPosition = -10;
        },
        /**
         * 开始拖动滑块
         * @param {TouchEvent} e - 触摸事件
         */
        startDrag(e) {
            this.isDragging = true;     // 标记为拖动状态
            this.showCursor = true;     // 显示游标线和提示框
            e.preventDefault();         // 阻止默认行为
            // 添加触摸移动和结束事件监听器
            document.addEventListener('touchmove', this.onDrag);
            document.addEventListener('touchend', this.stopDrag);
        },
        /**
         * 拖动过程中更新滑块位置
         * @param {TouchEvent} e - 触摸移动事件
         */
        onDrag(e) {
            if (!this.isDragging) return;
            // 获取触摸点的 X 坐标
            const clientX = e.touches[0].clientX;
            // 获取滑块容器的位置信息
            const rect = this.$refs.sliderContainer.getBoundingClientRect();
            // 计算新位置（减去小球半径 10px，使中心对齐触摸位置）
            let newPosition = clientX - rect.left - 10;
            // 限制滑块在有效范围内移动（-10 到 sliderWidth - 10）
            newPosition = Math.max(-10, Math.min(newPosition, this.sliderWidth - 10));
            this.dotPosition = newPosition;
        },
        /**
         * 停止拖动滑块
         * 移除所有触摸事件监听器
         */
        stopDrag() {
            this.isDragging = false;
            // 移除触摸事件监听器
            document.removeEventListener('touchmove', this.onDrag);
            document.removeEventListener('touchend', this.stopDrag);
        }
    }
};
</script>

<style scoped>
.sleep-chart {
    position: relative;
    width: 100%;
    padding: 0 16px 20px;
    /* 底部增加 padding 给绝对定位的滑块 */
    background: #fff;
    border-radius: 16px;
}

.chart-container {
    position: relative;
    margin-bottom: 0;
    overflow: visible;
}

.sleep-svg {
    width: 100%;
    height: 260px;
}

/* 睡眠线段样式由 :stroke 属性动态设置，不再需要固定的 CSS 类 */

.connect-line {
    opacity: 0.6;
}

/* 滑块区域 - 在图表底部和日期标签之间 */
.slider-area {
    position: absolute;
    bottom: -14px;
    left: 16px;
    right: 16px;
    /* 左右与 padding 对齐 */
    height: 24px;
    margin-top: 0px;
    padding: 0 10px;
}

/* 滑块轨道线 */
.slider-track {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    height: 1px;
    background: #e0e0e0;
}

/* 滑块小球 - 中心在轨道线上 */
.slider-dot {
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
    background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
    border-radius: 50%;
    z-index: 20;
    touch-action: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.slider-dot:active {
    transform: scale(1.1);
}

/* 从小球向上延伸的竖线 - 穿过图表 */
.dot-line {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 330px;
    background: linear-gradient(to bottom, rgba(255, 180, 100, 0.9), rgba(255, 200, 120, 0.6));
    pointer-events: none;
    border-radius: 1px;
}

/* 日期标签区域 */
.labels {
    display: flex;
    justify-content: space-between;
    padding: 10px 10px 5px;
}

.date-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.date {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.time-label {
    font-size: 13px;
    color: #999;
    font-weight: 400;
}

.end-label {
    text-align: right;
}

/* 底部分隔线 */
.bottom-line {
    height: 1px;
    background: #e0e0e0;
    margin: 0 10px;
}

.legend {
    display: flex;
    justify-content: center;
    gap: 28px;
    flex-wrap: nowrap;
    padding: 0 10px;
    margin-top: 20px;
    margin-bottom: 40px;
    position: relative;
    z-index: 10;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

/* 图例颜色由 :style 动态绑定，不再需要固定的 CSS 类 */

.legend-text {
    font-size: 14px;
    color: #666;
}

.time-tooltip {
    position: absolute;
    top: -10px;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    white-space: nowrap;
    font-size: 13px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 25;
}

.tooltip-time {
    font-weight: 600;
    margin-bottom: 2px;
}

.tooltip-type {
    font-size: 12px;
    opacity: 0.9;
}
</style>
