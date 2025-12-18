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

            <!-- 时间提示框 - 顶部居中显示详情 -->
            <div v-if="showCursor && currentSegmentDetails" class="segment-info">
                <span class="info-type">{{ currentSegmentDetails.typeName }}</span>
                <span class="info-duration">{{ currentSegmentDetails.duration }} 分钟</span>
                <span class="info-time">{{ currentSegmentDetails.startTime }}-{{ currentSegmentDetails.endTime }}</span>
            </div>

            <!-- 日期和时间标签区域 -->
            <div class="labels">
                <!-- 左侧标签：开始日期和入睡时间 -->
                <div class="date-label">
                    <div class="date">{{ currentDateRange.startDate }}</div>
                    <div class="time-label">入睡 {{ currentDateRange.sleepTime }}</div>
                </div>
                <!-- 右侧标签：结束日期和醒来时间 -->
                <div class="date-label end-label">
                    <div class="date">{{ currentDateRange.endDate }}</div>
                    <div class="time-label">醒来 {{ currentDateRange.wakeTime }}</div>
                </div>
            </div>

        </div>

        <!-- 滑块区域 - 绝对定位到底部 -->
        <div class="slider-area" ref="sliderContainer">
            <!-- 滑块轨道线 -->
            <!-- <div class="slider-track"></div> -->
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
        lineWidth: { type: Number, default: 36 },
        // 连接线的粗细（像素值）
        connectLineWidth: { type: Number, default: 1 }
    },
    data() {
        return {
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

                // 调整 Y 轴映射，将 20-100 的数值映射到图表高度
                const valueRange = 80;
                const normalizedValue = Math.max(0, point.value - 20);
                const y = this.svgHeight - (normalizedValue / valueRange * this.svgHeight);

                // 计算粗线段的起止位置
                let lineStart = x1;
                let lineEnd = x2;
                let connectionPath = '';

                // 1. 处理与前一个点的连接
                const prevPoint = this.sleepData[index - 1];
                if (prevPoint && Math.abs(prevPoint.value - point.value) > 0.1) {
                    lineStart += rX;
                }

                // 2. 处理与后一个点的连接
                const nextPoint = this.sleepData[index + 1];
                if (nextPoint) {
                    const normNext = Math.max(0, nextPoint.value - 20);
                    const nextY = this.svgHeight - (normNext / valueRange * this.svgHeight);
                    const dy = nextY - y;

                    // 如果高度不同，本段终点向前缩，并生成连接曲线
                    if (Math.abs(dy) > 0.1) {
                        lineEnd -= rX;
                        const rY = Math.min(radius, Math.abs(dy) / 2); // Y轴圆角半径
                        const sign = dy > 0 ? 1 : -1;

                        // 生成S形连接曲线 (细线)
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
                startDate: startData.date,          // 开始日期
                sleepTime: startData.startTime,     // 入睡时间
                endDate: endData.date,              // 结束日期
                wakeTime: endData.endTime           // 醒来时间
            };
        },

        /**
         * 计算当前选中索引
         */
        currentIndex() {
            if (this.sleepData.length === 0 || this.sliderWidth === 0) return -1;
            const centerPosition = this.dotPosition + 10;
            const ratio = centerPosition / this.sliderWidth;
            // 使用 Math.floor 确保均匀分布的每个片段都能被正确选中
            const index = Math.floor(ratio * this.sleepData.length);
            return Math.max(0, Math.min(index, this.sleepData.length - 1));
        },
        /**
         * 计算当前选中片段的详情（类型、时长、起止时间）
         */
        currentSegmentDetails() {
            if (this.currentIndex === -1) return null;

            const currentPoint = this.sleepData[this.currentIndex];
            if (!currentPoint) return null;

            const type = currentPoint.type;

            // 向前查找连续同类型片段的起点
            let start = this.currentIndex;
            while (start > 0 && this.sleepData[start - 1].type === type) {
                start--;
            }

            // 向后查找连续同类型片段的终点
            let end = this.currentIndex;
            while (end < this.sleepData.length - 1 && this.sleepData[end + 1].type === type) {
                end++;
            }

            const startSegment = this.sleepData[start];
            const endSegment = this.sleepData[end];

            // 计算时长（分钟）
            let duration = 0;
            try {
                const parseTime = (t) => {
                    const [h, m] = t.split(':').map(Number);
                    return h * 60 + m;
                };
                let startMins = parseTime(startSegment.startTime);
                let endMins = parseTime(endSegment.endTime);

                // 处理跨天的情况（假设睡眠不超过24小时）
                if (endMins < startMins) {
                    endMins += 24 * 60;
                }

                duration = endMins - startMins;
            } catch (e) {
                console.error('Time calc error', e);
            }

            return {
                typeName: this.getSleepTypeName(type),
                duration,
                startTime: startSegment.startTime,
                endTime: endSegment.endTime
            };
        },
        /**
         * 根据滑块位置计算当前时间点的数据
         * @returns {Object|null} 当前时间点的睡眠数据，包含时间、类型等信息
         */
        currentTimePoint() {
            if (this.currentIndex === -1) return null;
            return this.sleepData[this.currentIndex];
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
    padding: 0 16px 16px;
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
    height: 200px;
}

/* 睡眠线段样式由 :stroke 属性动态设置，不再需要固定的 CSS 类 */

.connect-line {
    opacity: 0.6;
}

/* 滑块区域 - 在图表底部和日期标签之间 */
.slider-area {
    position: absolute;
    bottom: -10px;
    left: 16px;
    right: 16px;
    height: 20px;
    padding: 0 10px;
    z-index: 10;
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
    /* Remove visuals from container, use ::before for the ball */
    background: transparent;
    border: none;
    box-shadow: none;
    z-index: 20;
    touch-action: none;
}

/* The actual white ball - high z-index */
.slider-dot::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%);
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 2;
}

/* The fan shadow - low z-index */
.slider-dot::after {
    content: "";
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 50px;
    border-radius: 50%;
    /* 径向渐变：上半部分灰色，下半部分透明 */
    background: radial-gradient(circle at 50% 0%, #f7f8fa 0%, #f7f8fa 50%, transparent 0);
    z-index: 1;
}

.slider-dot:active {
    transform: scale(1.1);
}

/* 从小球向上延伸的竖线 - 穿过图表 */
.dot-line {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 180px;
    background: linear-gradient(180deg, rgba(255, 150, 100, 0) 0%, rgba(255, 150, 100, 1) 50%, rgba(255, 150, 100, 0) 100%);
    pointer-events: none;
    border-radius: 1px;
}

/* 日期标签区域 */
.labels {
    display: flex;
    justify-content: space-between;
    padding: 10px 0 5px;
}

.date-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.date {
    font-size: 13px;
    font-weight: 600;
    color: #999;
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


.segment-info {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    line-height: 1;
    color: #888;
    pointer-events: none;
    z-index: 25;
    white-space: nowrap;
    display: flex;
    gap: 8px;
    align-items: center;
    /* Ensures flex items are vertically centered */
}

.info-type {
    font-size: 14px;
    color: #333;
    /* 稍微深一点的颜色 */
}

/* 移除旧的 time-tooltip 样式，或保留以防万一，但这里我们不再使用它 */
.time-tooltip {
    display: none;
}
</style>
