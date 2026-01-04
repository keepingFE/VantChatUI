<template>
    <div :class="audioMessageClasses" :style="containerStyles" @click="handleClick">
        <audio
            ref="audioRef"
            :src="src"
            :muted="isMuted"
            :loop="loop"
            :autoplay="autoplay"
            :preload="preload"
            @loadstart="handleLoadStart"
            @loadedmetadata="handleLoadedMetadata"
            @canplay="handleCanPlay"
            @play="handlePlay"
            @pause="handlePause"
            @ended="handleEnded"
            @timeupdate="handleTimeUpdate"
            @error="handleError"
        />

        <!-- 播放按钮 -->
        <div class="chat-audio__play-btn">
            <van-icon
                :name="isPlaying ? 'pause' : 'play'"
                :size="24"
                :color="themeColor"
                class="chat-audio__icon"
            />
        </div>

        <!-- 波形动画 -->
        <div v-if="isPlaying" class="chat-audio__waveform">
            <div
                v-for="(height, index) in waveformBars"
                :key="index"
                :class="['chat-audio__wave-bar', `chat-audio__wave-bar--${index}`]"
                :style="{ height, backgroundColor: themeColor }"
            />
        </div>

        <!-- 时长显示 -->
        <div class="chat-audio__duration">
            {{ formatTime(isPlaying ? currentTime : duration) }}
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="chat-audio__loading">
            <van-loading type="spinner" size="16" :color="themeColor" />
        </div>

        <!-- 加载失败 -->
        <div v-if="loadError" class="chat-audio__error">
            <van-icon name="warning-o" size="16" color="#ee0a24" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Icon as VanIcon, Loading as VanLoading } from "vant";

const props = defineProps({
    // 音频地址
    src: {
        type: String,
        required: true,
    },
    // 音频时长（秒）
    duration: {
        type: Number,
        default: 0,
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
    // 主题色
    themeColor: {
        type: String,
        default: "#1989fa",
    },
    // 是否可点击
    clickable: {
        type: Boolean,
        default: true,
    },
    // 最大宽度
    maxWidth: {
        type: [String, Number],
        default: "100%",
    },
});

const emit = defineEmits([
    "click",
    "play",
    "pause",
    "ended",
    "timeupdate",
    "error",
]);

const audioRef = ref(null);
const loading = ref(true);
const loadError = ref(false);
const isPlaying = ref(false);
const currentTime = ref(0);
const durationTime = ref(props.duration);
const isMuted = ref(props.muted);

const audioMessageClasses = computed(() => {
    return [
        "chat-audio",
        {
            "chat-audio--playing": isPlaying.value,
            "chat-audio--error": loadError.value,
            "chat-audio--clickable": props.clickable,
        },
    ];
});

const containerStyles = computed(() => {
    const styles = {};
    if (props.maxWidth) {
        styles.maxWidth = typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth;
    }
    styles["--theme-color"] = props.themeColor;
    return styles;
});

// 波形条高度
const waveformBars = computed(() => {
    const baseHeight = 8;
    const heights = [];
    for (let i = 0; i < 5; i++) {
        const variation = Math.random() * 12;
        heights.push(`${baseHeight + variation}px`);
    }
    return heights;
});

// 格式化时间
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return "0\"";
    const displaySeconds = Math.floor(seconds);
    return `${displaySeconds}"`;
};

// 点击容器
const handleClick = () => {
    if (!props.clickable || loadError.value) return;
    emit("click");
    togglePlay();
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

// 事件处理
const handleLoadStart = () => {
    loading.value = true;
    loadError.value = false;
};

const handleLoadedMetadata = () => {
    if (audioRef.value) {
        durationTime.value = audioRef.value.duration || props.duration;
    }
    loading.value = false;
};

const handleCanPlay = () => {
    loading.value = false;
};

const handlePlay = () => {
    isPlaying.value = true;
    emit("play");
};

const handlePause = () => {
    isPlaying.value = false;
    emit("pause");
};

const handleEnded = () => {
    isPlaying.value = false;
    currentTime.value = 0;
    emit("ended");
};

const handleTimeUpdate = () => {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime;
        emit("timeupdate", currentTime.value);
    }
};

const handleError = () => {
    loading.value = false;
    loadError.value = true;
    isPlaying.value = false;
    emit("error");
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
    isPlaying.value = false;
    currentTime.value = 0;
});

watch(() => props.duration, (newVal) => {
    if (newVal > 0) {
        durationTime.value = newVal;
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
    togglePlay,
});
</script>

<style scoped lang="scss">
.chat-audio {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    background-color: #fff;
    border: 1px solid #ebedf0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;

    &--clickable {
        &:hover {
            border-color: var(--theme-color, #1989fa);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        &:active {
            transform: translateY(0);
        }
    }

    &__play-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(25, 137, 250, 0.1), rgba(25, 137, 250, 0.05));
        flex-shrink: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        .chat-audio--clickable:hover & {
            background: linear-gradient(135deg, rgba(25, 137, 250, 0.15), rgba(25, 137, 250, 0.1));
            transform: scale(1.05);
        }

        .chat-audio--clickable:active & {
            transform: scale(0.95);
        }
    }

    &__icon {
        flex-shrink: 0;
        transition: transform 0.2s;

        .chat-audio--playing & {
            transform: scale(0.9);
        }
    }

    &__waveform {
        display: flex;
        align-items: center;
        gap: 3px;
        flex: 1;
        min-width: 60px;
        height: 24px;
    }

    &__wave-bar {
        width: 3px;
        border-radius: 2px;
        animation: wave 1s ease-in-out infinite;

        &--0 { animation-delay: 0s; }
        &--1 { animation-delay: 0.2s; }
        &--2 { animation-delay: 0.4s; }
        &--3 { animation-delay: 0.6s; }
        &--4 { animation-delay: 0.8s; }
    }

    &__duration {
        font-size: 13px;
        color: #969799;
        font-weight: 500;
        flex-shrink: 0;
        min-width: 32px;
        font-variant-numeric: tabular-nums;
    }

    &__loading,
    &__error {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 4px;
        padding: 4px 8px;
        z-index: 2;
    }
}

@keyframes wave {
    0%, 100% {
        height: 8px;
    }
    50% {
        height: 20px;
    }
}

// 响应式适配
@media (max-width: 768px) {
    .chat-audio {
        padding: 8px 12px;
        gap: 10px;

        &__play-btn {
            width: 32px;
            height: 32px;
        }

        &__waveform {
            gap: 2px;
            min-width: 50px;
            height: 20px;
        }

        &__wave-bar {
            width: 2.5px;
        }

        &__duration {
            font-size: 12px;
            min-width: 28px;
        }
    }
}

@media (max-width: 480px) {
    .chat-audio {
        padding: 6px 10px;
        gap: 8px;

        &__play-btn {
            width: 28px;
            height: 28px;
        }

        &__waveform {
            gap: 2px;
            min-width: 40px;
            height: 18px;
        }

        &__wave-bar {
            width: 2px;
        }

        &__duration {
            font-size: 11px;
            min-width: 24px;
        }
    }
}

// 浅色主题适配（如果在外层有浅色背景）
.chat-audio {
    &:not(.chat-audio--error) {
        background-color: #f7f8fa;
        border-color: #ebedf0;
    }
}

// 深色主题适配
@media (prefers-color-scheme: dark) {
    .chat-audio {
        background-color: #2a2a2a;
        border-color: #3a3a3a;

        &__duration {
            color: #c8c9cc;
        }

        &__play-btn {
            background-color: rgba(25, 137, 250, 0.2);
        }

        &--clickable:hover {
            border-color: var(--theme-color, #1989fa);
        }

        &__loading,
        &__error {
            background-color: rgba(42, 42, 42, 0.95);
        }
    }
}
</style>
