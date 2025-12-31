<template>
    <div class="audio-waveform" :class="{ 'is-recording': isRecording }">
        <div class="waveform-container">
            <div v-for="(bar, index) in bars" :key="index" class="wave-bar" :class="{ 'is-dot': bar.isDot }"
                :style="getBarStyle(index)"></div>
        </div>

        <div v-if="showText" class="status-text">{{ statusText }}</div>

        <div v-if="showTimer" class="timer">{{ formattedTime }}</div>

        <div v-if="showLevel" class="level-indicator">
            <div class="level-bar" :style="{ width: `${audioLevel}%` }"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    isRecording: {
        type: Boolean,
        default: false
    },
    barCount: {
        type: Number,
        default: 50
    },
    barColor: {
        type: String,
        default: '#ffffff'
    },
    barActiveColor: {
        type: String,
        default: '#ffffff'
    },
    backgroundColor: {
        type: String,
        default: '#7b8fa3'
    },
    minHeight: {
        type: Number,
        default: 4
    },
    maxHeight: {
        type: Number,
        default: 80
    },
    animationSpeed: {
        type: Number,
        default: 100
    },
    showTimer: {
        type: Boolean,
        default: false
    },
    showLevel: {
        type: Boolean,
        default: false
    },
    showText: {
        type: Boolean,
        default: true
    },
    statusText: {
        type: String,
        default: 'Listening...'
    },
    audioLevel: {
        type: Number,
        default: 0
    }
})

const bars = ref([])
const animationFrame = ref(null)
const recordingTime = ref(0)
const timerInterval = ref(null)

const formattedTime = computed(() => {
    const mins = Math.floor(recordingTime.value / 60)
    const secs = recordingTime.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const initBars = () => {
    const center = Math.floor(props.barCount / 2)
    bars.value = Array.from({ length: props.barCount }, (_, index) => {
        const distanceFromCenter = Math.abs(index - center)
        const maxDistance = center
        const ratio = distanceFromCenter / maxDistance

        // 边缘的条变成点
        const isDot = ratio > 0.7

        return {
            height: props.minHeight,
            delay: Math.random() * 0.5,
            isDot,
            distanceFromCenter
        }
    })
}

const getBarStyle = (index) => {
    const bar = bars.value[index]
    const color = props.isRecording ? props.barActiveColor : props.barColor
    const center = Math.floor(props.barCount / 2)
    const distanceFromCenter = Math.abs(index - center)
    const maxDistance = center
    const ratio = distanceFromCenter / maxDistance

    // 根据距离中心的位置调整透明度
    const opacity = bar.isDot ? 0.3 + (1 - ratio) * 0.7 : 1

    return {
        height: bar.isDot ? '4px' : `${bar.height}%`,
        width: bar.isDot ? '4px' : '3px',
        backgroundColor: color,
        opacity: opacity,
        animationDelay: `${bar.delay}s`,
        transition: `all ${props.animationSpeed}ms ease-in-out`
    }
}

const animateWave = () => {
    if (!props.isRecording) return

    const center = Math.floor(props.barCount / 2)

    bars.value = bars.value.map((bar, index) => {
        const distanceFromCenter = Math.abs(index - center)
        const maxDistance = center
        const ratio = distanceFromCenter / maxDistance

        // 中间的波形高，边缘的波形低
        const heightMultiplier = 1 - ratio * 0.7
        const randomHeight = (Math.random() * (props.maxHeight - props.minHeight) + props.minHeight) * heightMultiplier

        return {
            ...bar,
            height: bar.isDot ? props.minHeight : randomHeight,
            delay: Math.random() * 0.3
        }
    })

    animationFrame.value = setTimeout(() => {
        animateWave()
    }, props.animationSpeed)
}

const startTimer = () => {
    recordingTime.value = 0
    timerInterval.value = setInterval(() => {
        recordingTime.value++
    }, 1000)
}

const stopTimer = () => {
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
    }
}

const resetWave = () => {
    bars.value = bars.value.map((bar) => ({
        ...bar,
        height: props.minHeight,
        delay: 0
    }))
}

watch(() => props.isRecording, (newVal) => {
    if (newVal) {
        animateWave()
        if (props.showTimer) {
            startTimer()
        }
    } else {
        if (animationFrame.value) {
            clearTimeout(animationFrame.value)
            animationFrame.value = null
        }
        stopTimer()
        resetWave()
    }
})

onMounted(() => {
    initBars()
})

onBeforeUnmount(() => {
    if (animationFrame.value) {
        clearTimeout(animationFrame.value)
    }
    stopTimer()
})
</script>

<style scoped lang="scss">
.audio-waveform {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 40px 20px;
    background: v-bind(backgroundColor);
    border-radius: 16px;
    min-height: 200px;
    justify-content: center;
}

.waveform-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    height: 100px;
    width: 100%;
    max-width: 600px;
}

.wave-bar {
    width: 3px;
    border-radius: 2px;
    background-color: v-bind(barColor);
    transition: all 0.1s ease-in-out;

    &.is-dot {
        width: 4px;
        height: 4px !important;
        border-radius: 50%;
    }
}

.is-recording .wave-bar {
    animation: pulse 1s ease-in-out infinite alternate;
}

@keyframes pulse {
    0% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

.status-text {
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
    letter-spacing: 0.5px;
}

.timer {
    font-size: 18px;
    font-weight: 500;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
    opacity: 0.9;
}

.level-indicator {
    width: 100%;
    max-width: 400px;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
}

.level-bar {
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 3px;
    transition: width 0.1s ease-out;
}
</style>
