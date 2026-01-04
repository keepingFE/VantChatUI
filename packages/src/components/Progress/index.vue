<template>
    <div class="chat-progress">
        <div class="chat-progress__outer" :style="outerStyle">
            <div class="chat-progress__inner" :class="{ 'chat-progress__inner--animate': animate }" :style="innerStyle">
                <div v-if="showPivot && !textInside" class="chat-progress__pivot" :style="pivotStyle">
                    {{ pivotText }}
                </div>
            </div>
        </div>
        <div v-if="textInside && showPivot" class="chat-progress__text">
            {{ pivotText }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    percentage: {
        type: Number,
        default: 0,
        validator: (val) => val >= 0 && val <= 100
    },
    strokeWidth: {
        type: [Number, String],
        default: 8
    },
    color: {
        type: [String, Array, Function],
        default: '#1989fa'
    },
    trackColor: {
        type: String,
        default: '#e5e5e5'
    },
    pivotText: {
        type: String,
        default: ''
    },
    pivotColor: {
        type: String,
        default: ''
    },
    textColor: {
        type: String,
        default: '#fff'
    },
    showPivot: {
        type: Boolean,
        default: true
    },
    textInside: {
        type: Boolean,
        default: false
    },
    animate: {
        type: Boolean,
        default: true
    }
});

const currentColor = computed(() => {
    const { color, percentage } = props;
    if (typeof color === 'function') {
        return color(percentage);
    }
    if (Array.isArray(color)) {
        const span = 100 / color.length;
        const colorIndex = Math.floor(percentage / span);
        return color[Math.min(colorIndex, color.length - 1)];
    }
    return color;
});

const outerStyle = computed(() => ({
    height: `${props.strokeWidth}px`,
    backgroundColor: props.trackColor
}));

const innerStyle = computed(() => ({
    width: `${props.percentage}%`,
    backgroundColor: currentColor.value
}));

const pivotStyle = computed(() => ({
    color: props.textColor,
    backgroundColor: props.pivotColor || currentColor.value
}));

const pivotText = computed(() => {
    return props.pivotText || `${props.percentage}%`;
});
</script>

<style scoped>
.chat-progress {
    position: relative;
}

.chat-progress__outer {
    position: relative;
    border-radius: 999px;
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chat-progress__inner {
    position: relative;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.chat-progress__inner::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

.chat-progress__inner--animate {
    animation: progress-pulse 2s ease-in-out infinite;
}

.chat-progress__pivot {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.4;
    border-radius: 999px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    letter-spacing: 0.3px;
}

.chat-progress__text {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
    color: #6c757d;
    text-align: right;
}

@keyframes progress-pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}
</style>
