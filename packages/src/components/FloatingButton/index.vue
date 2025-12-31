<template>
    <div class="floating-button-wrapper">
        <!-- 主按钮 -->
        <div ref="mainBtn" class="floating-button-main" :class="[{ 'is-dragging': isDragging }, props.mainButtonClass]"
            :style="computedMainButtonStyle" @mousedown="handleMouseDown" @touchstart="handleTouchStart"
            @click="handleMainClick">
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    // 初始位置 X 坐标（像素或百分比）
    initialX: {
        type: [Number, String],
        default: 'auto'
    },
    // 初始位置 Y 坐标（像素或百分比）
    initialY: {
        type: [Number, String],
        default: 'auto'
    },
    // 初始位置（预设位置）: top-left, top-right, bottom-left, bottom-right, center-right
    position: {
        type: String,
        default: 'center-right',
        validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center-right', 'center-left'].includes(value)
    },
    // 主按钮图标
    mainIcon: {
        type: String,
        default: 'plus'
    },
    // 主按钮图标大小
    iconSize: {
        type: [Number, String],
        default: 24
    },
    // 主按钮大小
    size: {
        type: [Number, String],
        default: 56
    },
    // 主按钮背景颜色
    backgroundColor: {
        type: String,
        default: '#1677ff'
    },
    // 主按钮自定义样式
    mainButtonStyle: {
        type: Object,
        default: () => ({})
    },
    // 主按钮自定义类名
    mainButtonClass: {
        type: [String, Array, Object],
        default: ''
    },
    // 距离边缘的安全距离
    safeDistance: {
        type: Number,
        default: 20
    },
    // 是否吸附边缘
    magneticEdge: {
        type: Boolean,
        default: true
    },
    // 层级
    zIndex: {
        type: Number,
        default: 1000
    }
});

const emit = defineEmits(['click', 'dragStart', 'dragEnd']);

const mainBtn = ref(null);
const isDragging = ref(false);
const position = ref({ x: 0, y: 0 });
const startPos = ref({ x: 0, y: 0 });
const hasMoved = ref(false);

// 计算主按钮样式
const computedMainButtonStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundColor: props.backgroundColor,
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    zIndex: props.zIndex,
    ...props.mainButtonStyle
}));

// 初始化位置
const initPosition = () => {
    if (!mainBtn.value) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnSize = props.size;

    let x, y;

    if (props.initialX !== 'auto' && props.initialY !== 'auto') {
        // 使用自定义初始位置
        x = typeof props.initialX === 'string' && props.initialX.includes('%')
            ? (viewportWidth * parseFloat(props.initialX)) / 100
            : parseFloat(props.initialX);
        y = typeof props.initialY === 'string' && props.initialY.includes('%')
            ? (viewportHeight * parseFloat(props.initialY)) / 100
            : parseFloat(props.initialY);
    } else {
        // 使用预设位置
        const positions = {
            'top-left': { x: props.safeDistance, y: props.safeDistance },
            'top-right': { x: viewportWidth - btnSize - props.safeDistance, y: props.safeDistance },
            'bottom-left': { x: props.safeDistance, y: viewportHeight - btnSize - props.safeDistance },
            'bottom-right': { x: viewportWidth - btnSize - props.safeDistance, y: viewportHeight - btnSize - props.safeDistance },
            'center-right': { x: viewportWidth - btnSize - props.safeDistance, y: (viewportHeight - btnSize) / 2 },
            'center-left': { x: props.safeDistance, y: (viewportHeight - btnSize) / 2 }
        };
        ({ x, y } = positions[props.position]);
    }

    position.value = { x, y };
};

// 限制位置在可视区域内
const constrainPosition = (x, y) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnSize = props.size;

    x = Math.max(props.safeDistance, Math.min(x, viewportWidth - btnSize - props.safeDistance));
    y = Math.max(props.safeDistance, Math.min(y, viewportHeight - btnSize - props.safeDistance));

    return { x, y };
};

// 吸附到边缘
const snapToEdge = () => {
    if (!props.magneticEdge) return;

    const viewportWidth = window.innerWidth;
    const centerX = position.value.x + props.size / 2;

    // 判断靠近左边还是右边
    if (centerX < viewportWidth / 2) {
        position.value.x = props.safeDistance;
    } else {
        position.value.x = viewportWidth - props.size - props.safeDistance;
    }
};

// 鼠标/触摸开始
const handleStart = (clientX, clientY) => {
    isDragging.value = true;
    hasMoved.value = false;
    startPos.value = {
        x: clientX - position.value.x,
        y: clientY - position.value.y
    };
    emit('dragStart');
};

const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
};

const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
};

// 鼠标/触摸移动
const handleMove = (clientX, clientY) => {
    if (!isDragging.value) return;

    hasMoved.value = true;

    let newX = clientX - startPos.value.x;
    let newY = clientY - startPos.value.y;

    const constrained = constrainPosition(newX, newY);
    position.value = constrained;
};

const handleMouseMove = (e) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
};

const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
};

// 鼠标/触摸结束
const handleEnd = () => {
    if (isDragging.value) {
        snapToEdge();
        isDragging.value = false;
        emit('dragEnd', position.value);
    }
};

const handleMouseUp = () => {
    handleEnd();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
};

const handleTouchEnd = () => {
    handleEnd();
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
};

// 主按钮点击事件
const handleMainClick = (e) => {
    // 如果拖动过，不触发点击事件
    if (hasMoved.value) {
        e.stopPropagation();
        return;
    }

    emit('click');
};

// 窗口大小改变时重新计算位置
const handleResize = () => {
    const constrained = constrainPosition(position.value.x, position.value.y);
    position.value = constrained;
};

// 点击外部区域（移除相关逻辑）
// 不再需要处理展开/收起

onMounted(() => {
    initPosition();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style scoped lang="scss">
.floating-button-wrapper {
    position: fixed;
    pointer-events: none;
    z-index: 1000;
}

.floating-button-main {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    user-select: none;
    transition: box-shadow 0.3s, transform 0.3s;
    color: #fff;
    pointer-events: auto;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }

    &.is-dragging {
        transition: none;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        transform: scale(1.1);
        cursor: move;
    }
}
</style>
