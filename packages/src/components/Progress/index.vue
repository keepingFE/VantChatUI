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
}

.chat-progress__inner {
    position: relative;
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s ease;
}

.chat-progress__inner--animate {
    animation: progress-active 2s ease-in-out infinite;
}

.chat-progress__pivot {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
    padding: 0 8px;
    font-size: 10px;
    line-height: 20px;
    border-radius: 999px;
    white-space: nowrap;
}

.chat-progress__text {
    margin-top: 8px;
    font-size: 14px;
    color: #646566;
    text-align: right;
}

@keyframes progress-active {
    0% {
        opacity: 0.3;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.3;
    }
}
</style>
