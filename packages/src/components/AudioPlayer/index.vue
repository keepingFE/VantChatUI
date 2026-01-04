<template>
    <div :class="audioPlayerClasses" :style="containerStyles" ref="containerRef">
        <audio ref="audioRef" :src="src" :loop="loop" :autoplay="autoplay" :preload="preload" :muted="isMuted"
            @loadstart="handleLoadStart" @loadedmetadata="handleLoadedMetadata" @canplay="handleCanPlay"
            @play="handlePlay" @pause="handlePause" @ended="handleEnded" @timeupdate="handleTimeUpdate"
            @volumechange="handleAudioVolumeChange" @error="handleError"></audio>

        <!-- 加载中 -->
        <div v-if="loading && !loadError" class="audio-player__loading">
            <slot name="loading">
                <div class="audio-player__spinner"></div>
            </slot>
        </div>

        <!-- 加载失败 -->
        <div v-if="loadError" class="audio-player__error">
            <slot name="error">
                <div class="audio-player__error-icon">🎵</div>
                <div class="audio-player__error-text">音频加载失败</div>
            </slot>
        </div>

        <!-- 主控制区 -->
        <div v-if="!loading && !loadError" class="audio-player__main">
            <!-- 封面图 -->
            <div v-if="showCover && cover && !coverError" class="audio-player__cover">
                <img :src="cover" :alt="title || '音频封面'" @error="handleCoverError" />
            </div>

            <!-- 默认封面（当没有封面或加载失败时） -->
            <div v-else-if="showCover" class="audio-player__cover audio-player__cover--placeholder">
                <div class="audio-player__cover-icon">🎵</div>
            </div>

            <!-- 信息区 -->
            <div v-if="showInfo" class="audio-player__info">
                <div v-if="title" class="audio-player__title">{{ title }}</div>
                <div v-if="artist" class="audio-player__artist">{{ artist }}</div>
            </div>

            <!-- 控制栏 -->
            <div class="audio-player__controls">
                <!-- 播放/暂停按钮 -->
                <button class="audio-player__btn audio-player__play-btn" @click="togglePlay">
                    <span v-if="isPlaying">⏸</span>
                    <span v-else>▶</span>
                </button>

                <!-- 进度条区域 -->
                <div class="audio-player__progress-area">
                    <div class="audio-player__time audio-player__time--current">
                        {{ formatTime(currentTime) }}
                    </div>

                    <div class="audio-player__progress-wrapper">
                        <input type="range" class="audio-player__progress" :value="currentProgress" min="0" max="100"
                            step="0.1" @input="handleProgressChange" />
                        <div class="audio-player__progress-bar" :style="{ width: currentProgress + '%' }"></div>
                    </div>

                    <div class="audio-player__time audio-player__time--duration">
                        {{ formatTime(duration) }}
                    </div>
                </div>

                <!-- 音量控制 -->
                <div v-if="showVolumeControl" class="audio-player__volume">
                    <button class="audio-player__btn audio-player__volume-btn" @click="toggleMute">
                        <span v-if="isMuted">🔇</span>
                        <span v-else-if="currentVolume === 0">🔇</span>
                        <span v-else-if="currentVolume < 0.5">🔉</span>
                        <span v-else>🔊</span>
                    </button>
                    <input v-if="showVolumeSlider" type="range" class="audio-player__volume-slider"
                        :value="currentVolume * 100" min="0" max="100" @input="handleVolumeSliderChange" />
                </div>

                <!-- 播放速度 -->
                <div v-if="showPlaybackRate" class="audio-player__rate">
                    <button class="audio-player__btn audio-player__rate-btn" @click="cyclePlaybackRate">
                        {{ currentRate }}x
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    // 音频地址
    src: {
        type: String,
        required: true,
    },
    // 标题
    title: {
        type: String,
        default: "",
    },
    // 艺术家/作者
    artist: {
        type: String,
        default: "",
    },
    // 封面图
    cover: {
        type: String,
        default: "",
    },
    // 是否显示封面
    showCover: {
        type: Boolean,
        default: true,
    },
    // 是否显示信息
    showInfo: {
        type: Boolean,
        default: true,
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
    // 是否显示音量控制
    showVolumeControl: {
        type: Boolean,
        default: true,
    },
    // 是否显示音量滑块
    showVolumeSlider: {
        type: Boolean,
        default: true,
    },
    // 是否显示播放速度控制
    showPlaybackRate: {
        type: Boolean,
        default: false,
    },
    // 可选的播放速度
    playbackRates: {
        type: Array,
        default: () => [0.5, 0.75, 1, 1.25, 1.5, 2],
    },
    // 主题色
    themeColor: {
        type: String,
        default: "#1989fa",
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
    "ratechange",
]);

const containerRef = ref(null);
const audioRef = ref(null);
const loading = ref(true);
const loadError = ref(false);
const coverError = ref(false);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const currentVolume = ref(1);
const isMuted = ref(props.muted);
const currentRate = ref(1);
const isMobile = ref(false);

const audioPlayerClasses = computed(() => {
    return [
        "audio-player",
        {
            "audio-player--loading": loading.value,
            "audio-player--error": loadError.value,
            "audio-player--playing": isPlaying.value,
            "audio-player--mobile": isMobile.value,
            "audio-player--with-cover": props.showCover && props.cover,
        },
    ];
});

const containerStyles = computed(() => {
    const styles = {};

    if (props.width) {
        styles.width =
            typeof props.width === "number" ? `${props.width}px` : props.width;
    }

    if (props.height) {
        styles.height =
            typeof props.height === "number" ? `${props.height}px` : props.height;
    }

    styles["--theme-color"] = props.themeColor;

    return styles;
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
    if (!audioRef.value) return;

    if (isPlaying.value) {
        audioRef.value.pause();
    } else {
        const playPromise = audioRef.value.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn("Audio play failed:", error);
            });
        }
    }
};

// 进度条改变
const handleProgressChange = (event) => {
    if (!audioRef.value || !duration.value || !isFinite(duration.value)) return;
    const progress = parseFloat(event.target.value);
    const newTime = (progress / 100) * duration.value;
    if (isFinite(newTime)) {
        audioRef.value.currentTime = newTime;
    }
};

// 音量滑块改变
const handleVolumeSliderChange = (event) => {
    if (!audioRef.value) return;
    const volume = parseFloat(event.target.value) / 100;
    audioRef.value.volume = volume;
    currentVolume.value = volume;

    if (volume === 0) {
        audioRef.value.muted = true;
        isMuted.value = true;
    } else if (audioRef.value.muted) {
        audioRef.value.muted = false;
        isMuted.value = false;
    }
};

// 静音切换
const toggleMute = () => {
    if (!audioRef.value) return;
    audioRef.value.muted = !audioRef.value.muted;
    isMuted.value = audioRef.value.muted;
};

// 切换播放速度
const cyclePlaybackRate = () => {
    if (!audioRef.value) return;
    const currentIndex = props.playbackRates.indexOf(currentRate.value);
    const nextIndex = (currentIndex + 1) % props.playbackRates.length;
    const newRate = props.playbackRates[nextIndex];
    audioRef.value.playbackRate = newRate;
    currentRate.value = newRate;
    emit("ratechange", newRate);
};

// 检测是否为移动设备
const checkMobile = () => {
    if (!props.responsive) return;
    isMobile.value = window.innerWidth <= 768;
};

// 事件处理
const handleLoadStart = (event) => {
    loading.value = true;
    emit("loadstart", event);
};

const handleLoadedMetadata = (event) => {
    if (audioRef.value) {
        duration.value = audioRef.value.duration;
    }
    emit("loadedmetadata", event);
};

const handleCanPlay = (event) => {
    loading.value = false;
    emit("canplay", event);
};

const handlePlay = (event) => {
    isPlaying.value = true;
    emit("play", event);
};

const handlePause = (event) => {
    isPlaying.value = false;
    emit("pause", event);
};

const handleEnded = (event) => {
    isPlaying.value = false;
    emit("ended", event);
};

const handleTimeUpdate = (event) => {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime;
    }
    emit("timeupdate", event);
};

const handleAudioVolumeChange = (event) => {
    if (audioRef.value) {
        currentVolume.value = audioRef.value.volume;
        isMuted.value = audioRef.value.muted;
    }
    emit("volumechange", event);
};

const handleError = (event) => {
    loading.value = false;
    loadError.value = true;
    emit("error", event);
};

const handleCoverError = () => {
    coverError.value = true;
};

// 监听 props 变化
watch(() => props.muted, (newVal) => {
    if (audioRef.value && audioRef.value.muted !== newVal) {
        audioRef.value.muted = newVal;
        isMuted.value = newVal;
    }
});

watch(() => props.src, () => {
    loading.value = true;
    loadError.value = false;
    coverError.value = false;
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0;
});

watch(() => props.cover, () => {
    coverError.value = false;
});

onMounted(() => {
    if (audioRef.value) {
        currentVolume.value = audioRef.value.volume;
        isMuted.value = audioRef.value.muted;
        currentRate.value = audioRef.value.playbackRate;
    }

    if (props.responsive) {
        checkMobile();
        window.addEventListener("resize", checkMobile);
    }
});

onBeforeUnmount(() => {
    if (props.responsive) {
        window.removeEventListener("resize", checkMobile);
    }
});

// 暴露方法给父组件
defineExpose({
    play: () => {
        const playPromise = audioRef.value?.play();
        if (playPromise !== undefined) {
            return playPromise.catch((error) => {
                console.warn("Audio play failed:", error);
                throw error;
            });
        }
        return playPromise;
    },
    pause: () => audioRef.value?.pause(),
    seek: (time) => {
        if (audioRef.value && !isNaN(time) && isFinite(time)) {
            audioRef.value.currentTime = Math.max(0, Math.min(time, duration.value || 0));
        }
    },
    setVolume: (volume) => {
        if (audioRef.value) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            audioRef.value.volume = clampedVolume;
            currentVolume.value = clampedVolume;

            if (clampedVolume === 0) {
                audioRef.value.muted = true;
                isMuted.value = true;
            } else if (audioRef.value.muted) {
                audioRef.value.muted = false;
                isMuted.value = false;
            }
        }
    },
    setPlaybackRate: (rate) => {
        if (audioRef.value && props.playbackRates.includes(rate)) {
            audioRef.value.playbackRate = rate;
            currentRate.value = rate;
            emit("ratechange", rate);
        }
    },
});
</script>

<style scoped lang="scss">
.audio-player {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 100%;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &--loading,
    &--error {
        min-height: 120px;
    }

    &__loading,
    &__error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
    }

    &__error-icon {
        font-size: 48px;
        margin-bottom: 12px;
    }

    &__error-text {
        font-size: 14px;
        color: #666;
    }

    &__spinner {
        width: 32px;
        height: 32px;
        border: 3px solid rgba(0, 0, 0, 0.1);
        border-top-color: var(--theme-color, #1989fa);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    &__main {
        padding: 20px;
    }

    &__cover {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 16px;
        background-color: #f5f5f5;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        &--placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
        }
    }

    &__cover-icon {
        font-size: 80px;
        opacity: 0.8;
    }

    &__info {
        margin-bottom: 16px;
        text-align: center;
    }

    &__title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__artist {
        font-size: 14px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__btn {
        background: none;
        border: none;
        color: #333;
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
        border-radius: 50%;

        &:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    &__play-btn {
        width: 48px;
        height: 48px;
        font-size: 24px;
        background-color: var(--theme-color, #1989fa);
        color: #fff;
        margin: 0 auto;

        &:hover {
            background-color: var(--theme-color, #1989fa);
            opacity: 0.9;
        }
    }

    &__progress-area {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    &__time {
        font-size: 12px;
        color: #666;
        white-space: nowrap;
        user-select: none;
        flex-shrink: 0;
        min-width: 40px;

        &--current {
            text-align: right;
        }

        &--duration {
            text-align: left;
        }
    }

    &__progress-wrapper {
        flex: 1;
        position: relative;
        height: 4px;
        background-color: #e5e5e5;
        border-radius: 2px;
        cursor: pointer;
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
        background-color: var(--theme-color, #1989fa);
        border-radius: 2px;
        transition: width 0.1s;
        pointer-events: none;
    }

    &__volume,
    &__rate {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    &__volume-slider {
        flex: 1;
        max-width: 100px;
        height: 4px;
        background-color: #e5e5e5;
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
            background-color: var(--theme-color, #1989fa);
            border-radius: 50%;
            cursor: pointer;
        }

        &::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background-color: var(--theme-color, #1989fa);
            border-radius: 50%;
            border: none;
            cursor: pointer;
        }
    }

    &__rate-btn {
        min-width: 48px;
        font-size: 14px;
        font-weight: 600;
        color: var(--theme-color, #1989fa);
    }

    // 移动端适配
    &--mobile {
        .audio-player__main {
            padding: 16px;
        }

        .audio-player__cover {
            margin-bottom: 12px;
        }

        .audio-player__info {
            margin-bottom: 12px;
        }

        .audio-player__title {
            font-size: 15px;
        }

        .audio-player__artist {
            font-size: 13px;
        }

        .audio-player__play-btn {
            width: 44px;
            height: 44px;
            font-size: 22px;
        }

        .audio-player__time {
            font-size: 11px;
            min-width: 36px;
        }

        .audio-player__volume-slider {
            max-width: 80px;
        }
    }

    // 无封面时的紧凑布局
    &:not(&--with-cover) {
        .audio-player__main {
            padding: 16px 20px;
        }

        .audio-player__controls {
            flex-direction: row;
            align-items: center;
            gap: 16px;
        }

        .audio-player__play-btn {
            margin: 0;
        }

        .audio-player__progress-area {
            flex: 1;
        }

        .audio-player__info {
            margin-bottom: 12px;
            text-align: left;
        }
    }
}

// 响应式适配
@media (max-width: 768px) {
    .audio-player {
        border-radius: 8px;

        &__main {
            padding: 16px;
        }

        &__cover {
            margin-bottom: 12px;
        }

        &__title {
            font-size: 15px;
        }

        &__artist {
            font-size: 13px;
        }

        &__play-btn {
            width: 44px;
            height: 44px;
            font-size: 22px;
        }

        &__time {
            font-size: 11px;
            min-width: 36px;
        }

        &__progress-area {
            gap: 8px;
        }

        &__volume-slider {
            max-width: 80px;
        }

        &__btn {
            font-size: 16px;
            padding: 6px;
        }
    }
}

@media (max-width: 480px) {
    .audio-player {
        &__main {
            padding: 12px;
        }

        &__cover {
            margin-bottom: 10px;
        }

        &__info {
            margin-bottom: 10px;
        }

        &__title {
            font-size: 14px;
        }

        &__artist {
            font-size: 12px;
        }

        &__play-btn {
            width: 40px;
            height: 40px;
            font-size: 20px;
        }

        &__time {
            font-size: 10px;
            min-width: 32px;
        }

        &__progress-area {
            gap: 6px;
        }

        &__controls {
            gap: 10px;
        }

        &__volume-slider {
            max-width: 60px;
        }

        &__btn {
            font-size: 14px;
            padding: 5px;
        }
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
