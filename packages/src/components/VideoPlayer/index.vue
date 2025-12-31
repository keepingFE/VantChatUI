<template>
    <div :class="videoPlayerClasses" :style="containerStyles" ref="containerRef">
        <video ref="videoRef" :src="src" :poster="poster" :class="videoClasses" :style="videoStyles" :muted="isMuted"
            :loop="loop" :autoplay="autoplay" :preload="preload" playsinline webkit-playsinline
            @loadstart="handleLoadStart" @loadedmetadata="handleLoadedMetadata" @canplay="handleCanPlay"
            @play="handlePlay" @pause="handlePause" @ended="handleEnded" @timeupdate="handleTimeUpdate"
            @volumechange="handleVideoVolumeChange" @error="handleError" @click="togglePlay"></video>

        <!-- 加载中 -->
        <div v-if="loading && !loadError" class="video-player__loading">
            <slot name="loading">
                <div class="video-player__spinner"></div>
            </slot>
        </div>

        <!-- 加载失败 -->
        <div v-if="loadError" class="video-player__error">
            <slot name="error">
                <div class="video-player__error-icon">🎬</div>
                <div class="video-player__error-text">视频加载失败</div>
            </slot>
        </div>

        <!-- 控制栏 -->
        <div v-if="controls && !loadError" class="video-player__controls"
            :class="{ 'video-player__controls--visible': showControls }" @click.stop>
            <!-- 播放/暂停按钮 -->
            <button class="video-player__btn video-player__play-btn" @click="togglePlay">
                <span v-if="isPlaying">⏸</span>
                <span v-else>▶</span>
            </button>

            <!-- 进度条 -->
            <div class="video-player__progress-wrapper">
                <input type="range" class="video-player__progress" :value="currentProgress" min="0" max="100" step="0.1"
                    @input="handleProgressChange" />
                <div class="video-player__progress-bar" :style="{ width: currentProgress + '%' }"></div>
            </div>

            <!-- 时间显示 -->
            <div class="video-player__time">
                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>

            <!-- 音量控制 -->
            <div v-if="showVolumeControl" class="video-player__volume">
                <button class="video-player__btn video-player__volume-btn" @click="toggleMute">
                    <span v-if="isMuted">🔇</span>
                    <span v-else-if="currentVolume === 0">🔇</span>
                    <span v-else-if="currentVolume < 0.5">🔉</span>
                    <span v-else>🔊</span>
                </button>
                <input type="range" class="video-player__volume-slider" :value="currentVolume * 100" min="0" max="100"
                    @input="handleVolumeSliderChange" />
            </div>

            <!-- 全屏按钮 -->
            <button v-if="showFullscreenButton" class="video-player__btn video-player__fullscreen-btn"
                @click="toggleFullscreen">
                <span v-if="isFullscreen">⊡</span>
                <span v-else>⛶</span>
            </button>
        </div>

        <!-- 中央播放按钮 -->
        <div v-if="!isPlaying && !loading && !loadError" class="video-player__center-play" @click="togglePlay">
            <div class="video-player__center-play-icon">▶</div>
        </div>

        <!-- 横竖屏提示 -->
        <div v-if="showOrientationHint && isLandscape" class="video-player__orientation-hint">
            横屏观看效果更佳
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    // 视频地址
    src: {
        type: String,
        required: true,
    },
    // 封面图
    poster: {
        type: String,
        default: "",
    },
    // 宽度
    width: {
        type: [String, Number],
        default: "100%",
    },
    // 高度
    height: {
        type: [String, Number],
        default: "auto",
    },
    // 视频适配方式
    objectFit: {
        type: String,
        default: "contain",
        validator: (value) =>
            ["contain", "cover", "fill", "none", "scale-down"].includes(value),
    },
    // 是否显示控制栏
    controls: {
        type: Boolean,
        default: true,
    },
    // 是否自动播放
    autoplay: {
        type: Boolean,
        default: false,
    },
    // 是否循环播放
    loop: {
        type: Boolean,
        default: false,
    },
    // 是否静音
    muted: {
        type: Boolean,
        default: false,
    },
    // 预加载策略
    preload: {
        type: String,
        default: "metadata",
        validator: (value) => ["none", "metadata", "auto"].includes(value),
    },
    // 是否圆角
    round: {
        type: Boolean,
        default: false,
    },
    // 圆角大小
    radius: {
        type: [String, Number],
        default: "",
    },
    // 是否显示音量控制
    showVolumeControl: {
        type: Boolean,
        default: true,
    },
    // 是否显示全屏按钮
    showFullscreenButton: {
        type: Boolean,
        default: true,
    },
    // 控制栏自动隐藏时间（毫秒）
    controlsHideDelay: {
        type: Number,
        default: 3000,
    },
    // 是否显示横竖屏提示
    showOrientationHint: {
        type: Boolean,
        default: false,
    },
    // 是否响应式适配
    responsive: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits([
    "loadstart",
    "loadedmetadata",
    "canplay",
    "play",
    "pause",
    "ended",
    "timeupdate",
    "volumechange",
    "error",
    "fullscreenchange",
    "orientationchange",
]);

const containerRef = ref(null);
const videoRef = ref(null);
const loading = ref(true);
const loadError = ref(false);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const currentVolume = ref(1);
const isMuted = ref(props.muted);
const showControls = ref(true);
const isFullscreen = ref(false);
const isLandscape = ref(false);
let controlsTimer = null;

const videoPlayerClasses = computed(() => {
    return [
        "video-player",
        {
            "video-player--round": props.round,
            "video-player--loading": loading.value,
            "video-player--error": loadError.value,
            "video-player--playing": isPlaying.value,
            "video-player--landscape": isLandscape.value,
            "video-player--portrait": !isLandscape.value,
            "video-player--fullscreen": isFullscreen.value,
        },
    ];
});

const videoClasses = computed(() => {
    return ["video-player__video"];
});

const containerStyles = computed(() => {
    const styles = {};

    // 全屏时不应用宽高限制
    if (!isFullscreen.value) {
        if (props.width) {
            styles.width =
                typeof props.width === "number" ? `${props.width}px` : props.width;
        }

        if (props.height) {
            styles.height =
                typeof props.height === "number" ? `${props.height}px` : props.height;
        }
    }

    if (props.radius && !props.round) {
        styles.borderRadius =
            typeof props.radius === "number" ? `${props.radius}px` : props.radius;
    }

    return styles;
});

const videoStyles = computed(() => {
    return {
        objectFit: props.objectFit,
    };
});

const currentProgress = computed(() => {
    if (duration.value === 0) return 0;
    return (currentTime.value / duration.value) * 100;
});

// 格式化时间
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

// 播放/暂停切换
const togglePlay = () => {
    if (!videoRef.value) return;

    if (isPlaying.value) {
        videoRef.value.pause();
    } else {
        const playPromise = videoRef.value.play();
        // 处理自动播放策略限制
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn("Video play failed:", error);
            });
        }
    }
};

// 进度条改变
const handleProgressChange = (event) => {
    if (!videoRef.value || !duration.value || !isFinite(duration.value)) return;
    const progress = parseFloat(event.target.value);
    const newTime = (progress / 100) * duration.value;
    if (isFinite(newTime)) {
        videoRef.value.currentTime = newTime;
    }
};

// 音量滑块改变
const handleVolumeSliderChange = (event) => {
    if (!videoRef.value) return;
    const volume = parseFloat(event.target.value) / 100;
    videoRef.value.volume = volume;
    currentVolume.value = volume;

    // 同步静音状态
    if (volume === 0) {
        videoRef.value.muted = true;
        isMuted.value = true;
    } else if (videoRef.value.muted) {
        videoRef.value.muted = false;
        isMuted.value = false;
    }
};

// 静音切换
const toggleMute = () => {
    if (!videoRef.value) return;
    videoRef.value.muted = !videoRef.value.muted;
    isMuted.value = videoRef.value.muted;
};

// 全屏切换
const toggleFullscreen = () => {
    if (!containerRef.value) return;

    if (!isFullscreen.value) {
        if (containerRef.value.requestFullscreen) {
            containerRef.value.requestFullscreen();
        } else if (containerRef.value.webkitRequestFullscreen) {
            containerRef.value.webkitRequestFullscreen();
        } else if (containerRef.value.mozRequestFullScreen) {
            containerRef.value.mozRequestFullScreen();
        } else if (containerRef.value.msRequestFullscreen) {
            containerRef.value.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
};

// 控制栏自动隐藏
const resetControlsTimer = () => {
    if (!isPlaying.value) return;

    showControls.value = true;

    if (controlsTimer) {
        clearTimeout(controlsTimer);
    }

    controlsTimer = setTimeout(() => {
        showControls.value = false;
    }, props.controlsHideDelay);
};

// 检测横竖屏
const checkOrientation = () => {
    if (!props.responsive) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const newIsLandscape = width > height;

    if (newIsLandscape !== isLandscape.value) {
        isLandscape.value = newIsLandscape;
        emit("orientationchange", {
            isLandscape: newIsLandscape,
            width,
            height,
        });
    }
};

// 事件处理
const handleLoadStart = (event) => {
    loading.value = true;
    emit("loadstart", event);
};

const handleLoadedMetadata = (event) => {
    if (videoRef.value) {
        duration.value = videoRef.value.duration;
    }
    emit("loadedmetadata", event);
};

const handleCanPlay = (event) => {
    loading.value = false;
    emit("canplay", event);
};

const handlePlay = (event) => {
    isPlaying.value = true;
    resetControlsTimer();
    emit("play", event);
};

const handlePause = (event) => {
    isPlaying.value = false;
    showControls.value = true;
    if (controlsTimer) {
        clearTimeout(controlsTimer);
    }
    emit("pause", event);
};

const handleEnded = (event) => {
    isPlaying.value = false;
    showControls.value = true;
    if (controlsTimer) {
        clearTimeout(controlsTimer);
    }
    emit("ended", event);
};

const handleTimeUpdate = (event) => {
    if (videoRef.value) {
        currentTime.value = videoRef.value.currentTime;
    }
    emit("timeupdate", event);
};

const handleVideoVolumeChange = (event) => {
    if (videoRef.value) {
        currentVolume.value = videoRef.value.volume;
        isMuted.value = videoRef.value.muted;
    }
    emit("volumechange", event);
};

const handleError = (event) => {
    loading.value = false;
    loadError.value = true;
    emit("error", event);
};

const handleFullscreenChange = () => {
    isFullscreen.value = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    );
    emit("fullscreenchange", isFullscreen.value);
};

// 监听鼠标移动显示控制栏
const handleMouseMove = () => {
    resetControlsTimer();
};

// 监听触摸显示控制栏
const handleTouchStart = (event) => {
    // 阻止事件冒泡，避免触发 video 的 click 事件
    if (event.target !== videoRef.value) {
        return;
    }

    if (isPlaying.value) {
        showControls.value = !showControls.value;
        if (showControls.value) {
            resetControlsTimer();
        } else if (controlsTimer) {
            clearTimeout(controlsTimer);
        }
    } else {
        // 暂停时也显示控制栏
        showControls.value = true;
    }
};

// 监听 props 变化
watch(() => props.muted, (newVal) => {
    if (videoRef.value && videoRef.value.muted !== newVal) {
        videoRef.value.muted = newVal;
        isMuted.value = newVal;
    }
});

watch(() => props.src, () => {
    // 视频源改变时重置状态
    loading.value = true;
    loadError.value = false;
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
    showControls.value = true;
    if (controlsTimer) {
        clearTimeout(controlsTimer);
        controlsTimer = null;
    }
});

onMounted(() => {
    if (videoRef.value) {
        currentVolume.value = videoRef.value.volume;
        isMuted.value = videoRef.value.muted;
    }

    // 监听全屏变化
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    // 监听鼠标移动
    if (containerRef.value) {
        containerRef.value.addEventListener("mousemove", handleMouseMove);
        containerRef.value.addEventListener("touchstart", handleTouchStart);
    }

    // 监听横竖屏变化
    if (props.responsive) {
        checkOrientation();
        window.addEventListener("resize", checkOrientation);
        window.addEventListener("orientationchange", checkOrientation);
    }
});

onBeforeUnmount(() => {
    if (controlsTimer) {
        clearTimeout(controlsTimer);
    }

    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    document.removeEventListener("msfullscreenchange", handleFullscreenChange);

    const container = containerRef.value;
    if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchstart", handleTouchStart);
    }

    if (props.responsive) {
        window.removeEventListener("resize", checkOrientation);
        window.removeEventListener("orientationchange", checkOrientation);
    }
});

// 暴露方法给父组件
defineExpose({
    play: () => {
        const playPromise = videoRef.value?.play();
        if (playPromise !== undefined) {
            return playPromise.catch((error) => {
                console.warn("Video play failed:", error);
                throw error;
            });
        }
        return playPromise;
    },
    pause: () => videoRef.value?.pause(),
    seek: (time) => {
        if (videoRef.value && !isNaN(time) && isFinite(time)) {
            videoRef.value.currentTime = Math.max(0, Math.min(time, duration.value || 0));
        }
    },
    setVolume: (volume) => {
        if (videoRef.value) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            videoRef.value.volume = clampedVolume;
            currentVolume.value = clampedVolume;

            // 同步静音状态
            if (clampedVolume === 0) {
                videoRef.value.muted = true;
                isMuted.value = true;
            } else if (videoRef.value.muted) {
                videoRef.value.muted = false;
                isMuted.value = false;
            }
        }
    },
    toggleFullscreen,
    getOrientation: () => ({
        isLandscape: isLandscape.value,
        width: window.innerWidth,
        height: window.innerHeight,
    }),
});
</script>

<style scoped lang="scss">
.video-player {
    position: relative;
    display: inline-block;
    overflow: hidden;
    background-color: #000;
    width: 100%;
    max-width: 100%;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &--round {
        border-radius: 50%;
        overflow: hidden;
    }

    &--fullscreen {
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
    }

    // 横屏适配
    &--landscape {
        .video-player__controls {
            padding: 16px 24px;
        }

        .video-player__time {
            font-size: 14px;
        }

        .video-player__btn {
            font-size: 20px;
        }
    }

    // 竖屏适配
    &--portrait {
        .video-player__controls {
            padding: 10px 12px;
        }

        .video-player__time {
            font-size: 11px;
        }

        .video-player__btn {
            font-size: 16px;
        }

        .video-player__volume {
            display: none; // 竖屏时隐藏音量控制以节省空间
        }
    }

    &__video {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 100%;
        cursor: pointer;
    }

    &__loading,
    &__error {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 2;
    }

    &__error-icon {
        font-size: 48px;
        margin-bottom: 12px;
    }

    &__error-text {
        font-size: 14px;
        color: #fff;
    }

    &__spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    &__center-play {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 64px;
        height: 64px;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        z-index: 3;

        &:hover {
            background-color: rgba(0, 0, 0, 0.8);
            transform: translate(-50%, -50%) scale(1.1);
        }

        &-icon {
            font-size: 24px;
            color: #fff;
            margin-left: 4px;
        }
    }

    &__controls {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px 16px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        display: flex;
        align-items: center;
        gap: 12px;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 4;

        &--visible {
            opacity: 1;
        }
    }

    &:hover &__controls {
        opacity: 1;
    }

    &__btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        flex-shrink: 0;

        &:hover {
            transform: scale(1.1);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    &__play-btn {
        font-size: 20px;
    }

    &__progress-wrapper {
        flex: 1;
        position: relative;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        cursor: pointer;
        min-width: 60px;
    }

    &__progress {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateY(-50%);
        opacity: 0;
        cursor: pointer;
        z-index: 2;
    }

    &__progress-bar {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #1989fa;
        border-radius: 2px;
        transition: width 0.1s;
        pointer-events: none;
    }

    &__time {
        font-size: 12px;
        color: #fff;
        white-space: nowrap;
        user-select: none;
        flex-shrink: 0;
    }

    &__volume {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
    }

    &__volume-slider {
        width: 60px;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background-color: #fff;
            border-radius: 50%;
            cursor: pointer;
        }

        &::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background-color: #fff;
            border-radius: 50%;
            border: none;
            cursor: pointer;
        }
    }

    &__fullscreen-btn {
        font-size: 20px;
    }

    &__orientation-hint {
        position: absolute;
        top: 16px;
        right: 16px;
        padding: 8px 12px;
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 12px;
        border-radius: 4px;
        z-index: 5;
        animation: fadeInOut 3s ease-in-out;
    }
}

// 全屏样式
:fullscreen .video-player,
:-webkit-full-screen .video-player,
:-moz-full-screen .video-player,
:-ms-fullscreen .video-player {
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
}

// 响应式适配
@media (max-width: 768px) {
    .video-player {
        max-width: 100vw;

        &__controls {
            gap: 8px;
            padding: 10px 12px;
        }

        &__btn {
            font-size: 16px;
            padding: 4px 6px;
        }

        &__time {
            font-size: 11px;
        }

        &__volume-slider {
            width: 50px;
        }

        &__center-play {
            width: 56px;
            height: 56px;

            &-icon {
                font-size: 20px;
            }
        }

        &__progress-wrapper {
            min-width: 50px;
        }
    }
}

@media (max-width: 480px) {
    .video-player {
        &__controls {
            gap: 6px;
            padding: 8px 10px;
        }

        &__btn {
            font-size: 14px;
            padding: 3px 5px;
        }

        &__time {
            font-size: 10px;
        }

        &__progress-wrapper {
            min-width: 40px;
        }

        &__center-play {
            width: 48px;
            height: 48px;

            &-icon {
                font-size: 18px;
            }
        }

        &__volume {
            display: none; // 小屏幕隐藏音量控制
        }
    }
}

// 横屏模式下的特殊样式
@media (orientation: landscape) and (max-height: 500px) {
    .video-player {
        &__controls {
            padding: 8px 16px;
        }

        &__center-play {
            width: 48px;
            height: 48px;

            &-icon {
                font-size: 18px;
            }
        }
    }
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    10% {
        opacity: 1;
        transform: translateY(0);
    }

    90% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(-10px);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
