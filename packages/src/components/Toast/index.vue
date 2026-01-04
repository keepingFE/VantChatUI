<template>
    <Teleport to="body">
        <Transition name="toast-fade">
            <div v-if="visible" class="chat-toast" :class="`chat-toast--${type}`">
                <van-icon v-if="icon" :name="icon" class="chat-toast__icon" />
                <div class="chat-toast__text">{{ message }}</div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Icon as VanIcon } from 'vant';

const props = defineProps({
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'info', // info, success, error, warning, loading
        validator: (value) => ['info', 'success', 'error', 'warning', 'loading'].includes(value)
    },
    duration: {
        type: Number,
        default: 2000
    },
    icon: {
        type: String,
        default: ''
    }
});

const visible = ref(false);
let timer = null;

const show = () => {
    visible.value = true;
    if (props.duration > 0 && props.type !== 'loading') {
        timer = setTimeout(() => {
            hide();
        }, props.duration);
    }
};

const hide = () => {
    visible.value = false;
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
};

watch(() => props.message, (newVal) => {
    if (newVal) {
        show();
    }
});

defineExpose({
    show,
    hide
});
</script>

<style scoped>
.chat-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 70%;
    min-width: 120px;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.85) 100%);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    color: #fff;
    font-size: 15px;
    text-align: center;
    z-index: 9999;
    word-break: break-word;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-toast__icon {
    font-size: 36px;
    margin-bottom: 10px;
    animation: icon-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-toast__text {
    font-weight: 500;
    letter-spacing: 0.3px;
}

.chat-toast--success .chat-toast__icon {
    color: #52c41a;
    filter: drop-shadow(0 0 8px rgba(82, 196, 26, 0.6));
}

.chat-toast--error .chat-toast__icon {
    color: #ff4d4f;
    filter: drop-shadow(0 0 8px rgba(255, 77, 79, 0.6));
}

.chat-toast--warning .chat-toast__icon {
    color: #faad14;
    filter: drop-shadow(0 0 8px rgba(250, 173, 20, 0.6));
}

.chat-toast--loading .chat-toast__icon {
    animation: rotate 1s linear infinite, icon-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes icon-bounce {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.toast-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-fade-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7);
}

.toast-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
}
</style>
