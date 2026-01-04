<template>
    <div class="chat-recorder">
        <button class="chat-recorder__button" :class="{ 'chat-recorder__button--recording': isRecording }"
            @touchstart="handleTouchStart" @touchend="handleTouchEnd" @touchcancel="handleTouchCancel"
            @mousedown="handleMouseDown" @mouseup="handleMouseUp" @mouseleave="handleMouseLeave">
            <van-icon :name="isRecording ? 'pause' : 'audio'" />
            <span>{{ buttonText }}</span>
        </button>

        <Teleport to="body">
            <Transition name="recorder-modal">
                <div v-if="isRecording" class="chat-recorder-modal">
                    <div class="chat-recorder-modal__content">
                        <van-icon name="audio" class="chat-recorder-modal__icon" />
                        <div class="chat-recorder-modal__time">{{ formattedTime }}</div>
                        <div class="chat-recorder-modal__tip">{{ tip }}</div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { Icon as VanIcon } from 'vant';

const props = defineProps({
    maxDuration: {
        type: Number,
        default: 60 // 最大录音时长（秒）
    },
    minDuration: {
        type: Number,
        default: 1 // 最小录音时长（秒）
    }
});

const emit = defineEmits(['start', 'stop', 'cancel', 'complete']);

const isRecording = ref(false);
const duration = ref(0);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
let timer = null;

const buttonText = computed(() => {
    return isRecording.value ? '松开发送' : '按住说话';
});

const formattedTime = computed(() => {
    const seconds = Math.floor(duration.value / 1000);
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
});

const tip = computed(() => {
    const seconds = Math.floor(duration.value / 1000);
    if (seconds >= props.maxDuration - 10) {
        return `还可以录制 ${props.maxDuration - seconds} 秒`;
    }
    return '松开发送，上滑取消';
});

const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.value = new MediaRecorder(stream);
        audioChunks.value = [];

        mediaRecorder.value.ondataavailable = (event) => {
            audioChunks.value.push(event.data);
        };

        mediaRecorder.value.onstop = () => {
            const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
            const seconds = Math.floor(duration.value / 1000);

            if (seconds < props.minDuration) {
                emit('cancel', { reason: 'too-short', duration: seconds });
            } else {
                emit('complete', { blob: audioBlob, duration: seconds });
            }

            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.value.start();
        isRecording.value = true;
        duration.value = 0;

        timer = setInterval(() => {
            duration.value += 100;
            if (duration.value >= props.maxDuration * 1000) {
                stopRecording();
            }
        }, 100);

        emit('start');
    } catch (error) {
        console.error('Failed to start recording:', error);
        emit('cancel', { reason: 'permission-denied', error });
    }
};

const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;

        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        emit('stop', { duration: Math.floor(duration.value / 1000) });
    }
};

const cancelRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
        isRecording.value = false;

        if (timer) {
            clearInterval(timer);
            timer = null;
        }

        emit('cancel', { reason: 'user-cancel' });
    }
};

const handleTouchStart = (e) => {
    e.preventDefault();
    startRecording();
};

const handleTouchEnd = (e) => {
    e.preventDefault();
    stopRecording();
};

const handleTouchCancel = (e) => {
    e.preventDefault();
    cancelRecording();
};

const handleMouseDown = () => {
    startRecording();
};

const handleMouseUp = () => {
    stopRecording();
};

const handleMouseLeave = () => {
    if (isRecording.value) {
        cancelRecording();
    }
};

onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop();
    }
});
</script>

<style scoped>
.chat-recorder {
    width: 100%;
}

.chat-recorder__button {
    width: 100%;
    height: 40px;
    border: 1px solid #dcdee0;
    border-radius: 4px;
    background-color: #fff;
    font-size: 14px;
    color: #323233;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
    user-select: none;
}

.chat-recorder__button:active,
.chat-recorder__button--recording {
    background-color: #f2f3f5;
    border-color: #c8c9cc;
}

.chat-recorder__button .van-icon {
    font-size: 18px;
}

.chat-recorder-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.chat-recorder-modal__content {
    background-color: rgba(0, 0, 0, 0.9);
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    color: #fff;
}

.chat-recorder-modal__icon {
    font-size: 48px;
    color: #fff;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.1);
    }
}

.chat-recorder-modal__time {
    font-size: 24px;
    font-weight: 500;
    margin: 16px 0 8px;
}

.chat-recorder-modal__tip {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
}

.recorder-modal-enter-active,
.recorder-modal-leave-active {
    transition: opacity 0.3s;
}

.recorder-modal-enter-from,
.recorder-modal-leave-to {
    opacity: 0;
}
</style>
