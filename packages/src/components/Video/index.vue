<template>
    <div :class="videoMessageClasses" :style="containerStyles" @click="handleClick">
        <video
            ref="videoRef"
            :src="src"
            :poster="thumbnail"
            :class="videoClasses"
            :muted="isMuted"
            :loop="loop"
            :autoplay="autoplay"
            :preload="preload"
            playsinline
            webkit-playsinline
            @click.stop
            @loadstart="handleLoadStart"
            @loadedmetadata="handleLoadedMetadata"
            @canplay="handleCanPlay"
            @play="handlePlay"
            @pause="handlePause"
            @ended="handleEnded"
            @timeupdate="handleTimeUpdate"
            @error="handleError"
        />

        <!-- 加载中 -->
        <div v-if="loading && !loadError" class="chat-video__loading">
            <slot name="loading">
                <van-loading type="spinner" size="24" />
            </slot>
        </div>

        <!-- 加载失败 -->
        <div v-if="loadError" class="chat-video__error">
            <slot name="error">
                <div class="chat-video__error-icon">🎬</div>
                <div class="chat-video__error-text">视频加载失败</div>
            </slot>
        </div>

        <!-- 播放按钮遮罩 -->
        <div v-if="!isPlaying && !loading && !loadError" class="chat-video__overlay">
            <div class="chat-video__play-icon">
                <van-icon name="play-circle-o" size="56" color="#fff" />
            </div>
        </div>

        <!-- 时长显示 -->
        <div v-if="duration > 0 && !loadError" class="chat-video__duration">
            {{ formatTime(isPlaying ? currentTime : duration) }}
        </div>

        <!-- 暂停状态指示器 -->
        <div v-if="isPaused && isPlaying" class="chat-video__paused">
            <van-icon name="pause-circle-o" size="36" color="#fff" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { Loading as VanLoading, Icon as VanIcon } from "vant";

const props = defineProps({
    // 视频地址
    src: {
        type: String,
        required: true,
    },
    // 缩略图
    thumbnail: {
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
        default: "200px",
    },
    // 视频适配方式
    fit: {
        type: String,
        default: "cover",
        validator: (value) =>
            ["contain", "cover", "fill", "none", "scale-down"].includes(value),
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
        default: true,
    },
    // 圆角大小
    radius: {
        type: [String, Number],
        default: "",
    },
    // 是否可点击
    clickable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits([
    "click",
    "loadstart",
    "loadedmetadata",
    "canplay",
    "play",
    "pause",
    "ended",
    "timeupdate",
    "error",
]);

const videoRef = ref(null);
const loading = ref(true);
const loadError = ref(false);
const isPlaying = ref(false);
const isPaused = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isMuted = ref(props.muted);

const videoMessageClasses = computed(() => {
    return [
        "chat-video",
        {
            "chat-video--round": props.round,
            "chat-video--loading": loading.value,
            "chat-video--error": loadError.value,
            "chat-video--playing": isPlaying.value,
            "chat-video--clickable": props.clickable,
        },
    ];
});

const videoClasses = computed(() => {
    return ["chat-video__video"];
});

const containerStyles = computed(() => {
    const styles = {};
    if (props.width) {
        styles.width = typeof props.width === "number" ? `${props.width}px` : props.width;
    }
    if (props.height) {
        styles.height = typeof props.height === "number" ? `${props.height}px` : props.height;
    }
    if (props.radius && !props.round) {
        styles.borderRadius = typeof props.radius === "number" ? `${props.radius}px` : props.radius;
    }
    return styles;
});

// 格式化时间
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `0:${String(secs).padStart(2, "0")}`;
};

// 点击容器
const handleClick = () => {
    if (!props.clickable || loadError.value) return;
    emit("click");
    togglePlay();
};

// 播放/暂停切换
const togglePlay = () => {
    if (!videoRef.value) return;

    if (isPlaying.value) {
        videoRef.value.pause();
    } else {
        const playPromise = videoRef.value.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn("Video play failed:", error);
            });
        }
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
    isPaused.value = false;
    emit("play", event);
};

const handlePause = (event) => {
    isPlaying.value = false;
    isPaused.value = true;
    // 延迟隐藏暂停状态
    setTimeout(() => {
        isPaused.value = false;
    }, 500);
    emit("pause", event);
};

const handleEnded = (event) => {
    isPlaying.value = false;
    isPaused.value = false;
    currentTime.value = 0;
    emit("ended", event);
};

const handleTimeUpdate = (event) => {
    if (videoRef.value) {
        currentTime.value = videoRef.value.currentTime;
    }
    emit("timeupdate", event);
};

const handleError = (event) => {
    loading.value = false;
    loadError.value = true;
    isPlaying.value = false;
    emit("error", event);
};

// 监听 props 变化
watch(() => props.muted, (newVal) => {
    if (videoRef.value && videoRef.value.muted !== newVal) {
        videoRef.value.muted = newVal;
        isMuted.value = newVal;
    }
});

watch(() => props.src, () => {
    loading.value = true;
    loadError.value = false;
    isPlaying.value = false;
    isPaused.value = false;
    currentTime.value = 0;
    duration.value = 0;
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
    togglePlay,
});
</script>

<style scoped lang="scss">
.chat-video {
    position: relative;
    display: inline-block;
    overflow: hidden;
    background-color: #000;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &--clickable {
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &:active {
            transform: translateY(0);
        }
    }

    &--round {
        border-radius: 12px;
        overflow: hidden;
    }

    &__video {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--fit, cover);
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

    &__overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.4);
        transition: background-color 0.2s;
        z-index: 3;

        .chat-video:hover & {
            background-color: rgba(0, 0, 0, 0.5);
        }

        .chat-video--clickable:hover & {
            background-color: rgba(0, 0, 0, 0.6);
        }
    }

    &__play-icon {
        animation: pulse 2s infinite;

        :deep(.van-icon) {
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }
    }

    &__duration {
        position: absolute;
        bottom: 12px;
        right: 12px;
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.75);
        color: #fff;
        font-size: 13px;
        border-radius: 20px;
        font-weight: 600;
        z-index: 4;
        backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        letter-spacing: 0.5px;
    }

    &__paused {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        padding: 12px;
        z-index: 3;
        animation: fadeIn 0.2s ease-in-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

        :deep(.van-icon) {
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
    }
}

@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

// 响应式适配
@media (max-width: 768px) {
    .chat-video {
        &__duration {
            bottom: 6px;
            right: 6px;
            padding: 3px 6px;
            font-size: 11px;
        }

        &__play-icon {
            :deep(.van-icon) {
                font-size: 40px !important;
            }
        }
    }
}

@media (max-width: 480px) {
    .chat-video {
        &__duration {
            bottom: 4px;
            right: 4px;
            padding: 2px 5px;
            font-size: 10px;
        }

        &__play-icon {
            :deep(.van-icon) {
                font-size: 36px !important;
            }
        }

        &__paused {
            :deep(.van-icon) {
                font-size: 24px !important;
            }
        }
    }
}
</style>
