<template>
    <!-- 睡眠图表主容器 -->
    <div class="sleep-chart">
        <!-- 图表容器，包含 SVG 图表和标签 -->
        <div class="chart-container" ref="chartContainer">
            <!-- SVG 睡眠曲线图，使用动态视图框和非等比缩放 -->
            <svg class="sleep-svg" :viewBox="`0 0 ${svgWidth} ${svgHeight}`" preserveAspectRatio="none">
                <!-- 遍历所有合并后的睡眠片段 -->
                <g v-for="(segment, index) in visibleSegments" :key="index">
                    <!-- 使用 rect 绘制胶囊块 -->
                    <!-- rx 设为高度的一半实现全圆角，或者设为 6-8px 实现平滑圆角 -->
                    <rect :x="segment.x" :y="segment.y" :width="segment.width" :height="segment.height" :rx="8" :ry="8"
                        :fill="getLineColor(segment.type)" />
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

            <!-- 时间刻度轴 - Apple风格 -->
            <div v-if="showTimeAxis" class="axis-container">
                <div v-for="(tick, index) in timeTicks" :key="index" class="axis-tick" :style="{ left: tick.left }">
                    <div class="tick-mark"></div>
                    <div class="tick-label">{{ tick.label }}</div>
                </div>
                <!-- 底部横轴线 -->
                <div class="axis-line"></div>
            </div>

        </div>

        <!-- 滑块区域 - 绝对定位到底部 -->
        <div class="slider-area" ref="sliderContainer">
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
                deep: '#3D5AFE',    // 深睡颜色 - Apple风格深蓝紫
                light: '#7C4DFF',   // 浅睡颜色 - Apple风格紫色
                rem: '#00BCD4',     // 快速眼动颜色 - Apple风格青色
                awake: '#FF9500'    // 清醒颜色 - Apple风格橙色
            })
        },
        // 睡眠阶段线段的粗细（像素值）
        lineWidth: { type: Number, default: 32 },
        // 连接线的粗细（像素值）
        connectLineWidth: { type: Number, default: 2 },
        // 是否显示底部时间刻度轴
        showTimeAxis: { type: Boolean, default: true }
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
         * 计算时间轴刻度（基于物理时间的整点刻度）
         */
        timeTicks() {
            if (!this.sleepData || this.sleepData.length === 0) return [];

            // 1. 辅助函数：将 "HH:MM" 转换为分钟数
            const parseTime = (t) => {
                const [h, m] = t.split(':').map(Number);
                return h * 60 + m;
            };

            // 2. 找到整个数据集的开始和结束时间
            // 假设数据是按时间排序的
            const firstStr = this.sleepData[0].startTime;
            const lastStr = this.sleepData[this.sleepData.length - 1].endTime;

            let startMins = parseTime(firstStr);
            let endMins = parseTime(lastStr);

            // 处理跨天：如果结束时间小于开始时间，说明跨天了，加 24小时
            // 注意：这里简单的判断可能不够，如果跨度超过24小时会有问题，但睡眠数据通常不会
            // 更严谨的做法是遍历所有点，检测时间回退
            if (endMins < startMins) {
                endMins += 24 * 60;
            } else if (endMins === startMins) {
                // 极其特殊情况，不做处理或视为24h，这里暂且认为至少有一点时长
            }
            // 再次校验：如果中间有跨天的数据点，可能 startMins 比较大（比如23:00），endMins 比较小（比如07:00）已处理
            // 但需要确保中间点也能正确映射。
            // 简单起见，我们定义参考点为 startMins。

            const totalDuration = endMins - startMins;
            if (totalDuration <= 0) return [];

            // 3. 决定刻度间隔 (分钟)
            // 如果总时长小于 10 小时，每 2 小时一个刻度
            // 如果总时长大于 10 小时，每 3 或 4 小时一个刻度
            let interval = 120; // 默认 2小时
            if (totalDuration > 10 * 60) interval = 240; // 4小时

            const ticks = [];

            // 4. 寻找第一个整点刻度
            // startMins 向上取整到下一个 interval 的倍数（或者简单的下一个整点）
            // 为了美观，我们通常找下一个整点 (xx:00)
            let currentTick = Math.ceil(startMins / 60) * 60;

            // 如果第一个整点太靠近开始时间（比如开始 22:55，整点 23:00），可能会重叠，视情况显示
            // 这里为了简单，直接遍历

            while (currentTick <= endMins) {
                // 计算位置百分比
                const percent = (currentTick - startMins) / totalDuration * 100;

                // 只有位置在 5% 到 95% 之间的才显示，避免和左右边界的入睡/醒来时间打架
                // 或者用户希望显示所有整点。根据Apple风格，通常首尾会有专门的文字标签，中间显示刻度。
                // 既然下方已经有专门的“入睡/醒来”标签，这里中间的刻度可以保留，但避开极端边缘。
                if (percent >= 2 && percent <= 98) {
                    // 格式化时间 HH:MM
                    let h = Math.floor(currentTick / 60) % 24;
                    // Format output like Apple: 22:00 or just 22
                    // Apple often shows even hours.
                    // Keep it simple HH:00
                    const label = `${h.toString().padStart(2, '0')}:00`;

                    ticks.push({
                        label,
                        left: percent + '%'
                    });
                }

                currentTick += interval;
            }

            return ticks;
        },

        /**
         * 计算可见的睡眠片段
         * 将连续的相同状态点聚合为一个块 (Block)
         * @returns {Array} 包含每个块的 rect 属性 (x, y, width, height)
         */
        visibleSegments() {
            if (!this.sleepData || this.sleepData.length === 0) return [];

            const segments = [];
            const totalPoints = this.sleepData.length;
            const stepX = this.svgWidth / totalPoints;

            let currentSegment = null;

            this.sleepData.forEach((point, index) => {
                // 如果当前没有段，或者类型变了，则开启新段
                if (!currentSegment || currentSegment.type !== point.type) {
                    // 结算上一段
                    if (currentSegment) {
                        currentSegment.width = (index * stepX) - currentSegment.x;
                        // 为了视觉上的分隔，可以稍微减少宽度 (可选)
                        currentSegment.width = Math.max(0, currentSegment.width - 2);
                        segments.push(currentSegment);
                    }

                    // 计算新段的 Y 坐标
                    // 原始逻辑：normalizedValue = point.value - 20 (假设范围20-100)
                    // Y = svgHeight - (normalized * heightRatio)
                    const valueRange = 80;
                    const normalizedValue = Math.max(0, point.value - 20);
                    // 中心线 Y
                    const centerY = this.svgHeight - (normalizedValue / valueRange * this.svgHeight);
                    // Rect 的 Y (左上角)
                    const rectY = centerY - (this.lineWidth / 2);

                    currentSegment = {
                        x: index * stepX, // 起点 X
                        y: rectY,
                        width: 0, // 稍后计算
                        height: this.lineWidth,
                        type: point.type
                    };
                }
                // 如果类型相同，不需要做任何事，等待结束时结算宽度
            });

            // 结算最后一段
            if (currentSegment) {
                currentSegment.width = (totalPoints * stepX) - currentSegment.x;
                currentSegment.width = Math.max(0, currentSegment.width - 2);
                segments.push(currentSegment);
            }

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
    padding: 20px 20px 30px;
    background: #ffffff;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
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

.connect-line {
    opacity: 0.4;
}

/* 滑块区域 */
.slider-area {
    position: absolute;
    bottom: -15px;
    left: 20px;
    right: 20px;
    height: 30px;
    z-index: 10;
    /* 增加触摸区域 */
    touch-action: none;
}

/* 滑块小球 - iOS 风格 */
.slider-dot {
    position: absolute;
    top: 5px;
    width: 20px;
    height: 20px;
    background: transparent;
    border: none;
    z-index: 20;
    touch-action: none;
    cursor: grab;
}

.slider-dot::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    background: #FFFFFF;
    border-radius: 50%;
    /* iOS 风格投影 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 3px 8px rgba(0, 0, 0, 0.1);
    border: 0.5px solid rgba(0, 0, 0, 0.04);
    z-index: 2;
    transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.slider-dot:active::before {
    transform: scale(1.1);
}

/* 竖线样式 */
.dot-line {
    position: absolute;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 230px;
    /* 渐变虚线或实线，这里使用柔和的实线 */
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(60, 60, 67, 0.3) 20%, rgba(60, 60, 67, 0.3) 100%);
    pointer-events: none;
}

/* 顶部信息面板 - 模仿iOS长按提示 */
.segment-info {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 8px 16px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    font-size: 13px;
    color: #1c1c1e;
    pointer-events: none;
    z-index: 30;
    white-space: nowrap;
    display: flex;
    gap: 8px;
    align-items: center;
    border: 0.5px solid rgba(0, 0, 0, 0.05);
}

.info-type {
    font-weight: 600;
}

.info-duration {
    color: #8e8e93;
}

.info-time {
    font-variant-numeric: tabular-nums;
    color: #8e8e93;
}

/* 标签区域 */
.labels {
    display: flex;
    justify-content: space-between;
    padding: 15px 0 5px;
    border-top: 1px solid rgba(60, 60, 67, 0.06);
    margin-top: 10px;
}

.date-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.date {
    font-size: 13px;
    font-weight: 600;
    color: #1c1c1e;
    /* 系统主要文字颜色 */
    letter-spacing: -0.2px;
}

.time-label {
    font-size: 11px;
    color: #8e8e93;
    /* 系统次要文字颜色 */
    font-weight: 500;
}

.end-label {
    text-align: right;
}

/* 时间刻度轴样式 */
.axis-container {
    position: relative;
    height: 30px;
    margin-top: 10px;
    width: 100%;
    /* 确保容器有宽度供子元素绝对定位 */
}

.axis-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #f2f2f7;
    /* 如果不想显示横线，保持 display: none */
    display: none;
}

.axis-tick {
    position: absolute;
    top: 0;
    /* left 由内联样式控制，直接生效 */
    transform: translateX(-50%);
    /* 居中对齐 */
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 增加宽度防止文字挤压 */
    width: 40px;
    pointer-events: none;
}

.tick-mark {
    width: 1px;
    height: 4px;
    background-color: #c7c7cc;
    margin-bottom: 4px;
}

.tick-label {
    font-size: 11px;
    color: #8e8e93;
    font-weight: 500;
    white-space: nowrap;
    text-align: center;
    line-height: 1;
}

.legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: nowrap;
    margin-top: 24px;
    margin-bottom: 20px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.legend-color {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.legend-text {
    font-size: 12px;
    color: #636366;
    /* 系统第三级文字颜色 */
    font-weight: 500;
}
</style>
