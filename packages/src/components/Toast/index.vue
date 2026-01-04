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
    min-width: 96px;
    padding: 12px 16px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    z-index: 9999;
    word-break: break-word;
}

.chat-toast__icon {
    font-size: 32px;
    margin-bottom: 8px;
}

.chat-toast--success .chat-toast__icon {
    color: #07c160;
}

.chat-toast--error .chat-toast__icon {
    color: #ee0a24;
}

.chat-toast--warning .chat-toast__icon {
    color: #ff976a;
}

.chat-toast--loading .chat-toast__icon {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: opacity 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0;
}
</style>
