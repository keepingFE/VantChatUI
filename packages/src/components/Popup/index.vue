<template>
    <Teleport to="body">
        <Transition name="popup-overlay">
            <div v-if="visible" class="chat-popup-overlay" @click="handleOverlayClick"></div>
        </Transition>
        <Transition :name="`popup-${position}`">
            <div v-if="visible" class="chat-popup" :class="[
                `chat-popup--${position}`,
                { 'chat-popup--round': round }
            ]" :style="popupStyle">
                <div v-if="showClose" class="chat-popup__close" @click="handleClose">
                    <van-icon name="cross" />
                </div>
                <slot></slot>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Icon as VanIcon } from 'vant';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    position: {
        type: String,
        default: 'bottom', // top, bottom, left, right, center
        validator: (value) => ['top', 'bottom', 'left', 'right', 'center'].includes(value)
    },
    round: {
        type: Boolean,
        default: false
    },
    closeable: {
        type: Boolean,
        default: false
    },
    closeOnClickOverlay: {
        type: Boolean,
        default: true
    },
    showClose: {
        type: Boolean,
        default: false
    },
    width: {
        type: String,
        default: ''
    },
    height: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue', 'close', 'open']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
    visible.value = val;
    if (val) {
        emit('open');
    }
});

const popupStyle = computed(() => {
    const style = {};
    if (props.width) style.width = props.width;
    if (props.height) style.height = props.height;
    return style;
});

const handleOverlayClick = () => {
    if (props.closeOnClickOverlay) {
        handleClose();
    }
};

const handleClose = () => {
    visible.value = false;
    emit('update:modelValue', false);
    emit('close');
};
</script>

<style scoped>
.chat-popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.chat-popup {
    position: fixed;
    background-color: #fff;
    z-index: 1001;
    overflow: auto;
}

.chat-popup--center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
}

.chat-popup--top {
    top: 0;
    left: 0;
    right: 0;
    max-height: 90%;
}

.chat-popup--bottom {
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 90%;
}

.chat-popup--left {
    top: 0;
    left: 0;
    bottom: 0;
    max-width: 90%;
}

.chat-popup--right {
    top: 0;
    right: 0;
    bottom: 0;
    max-width: 90%;
}

.chat-popup--round.chat-popup--top {
    border-radius: 0 0 16px 16px;
}

.chat-popup--round.chat-popup--bottom {
    border-radius: 16px 16px 0 0;
}

.chat-popup--round.chat-popup--left {
    border-radius: 0 16px 16px 0;
}

.chat-popup--round.chat-popup--right {
    border-radius: 16px 0 0 16px;
}

.chat-popup__close {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px;
    cursor: pointer;
    z-index: 1;
}

.chat-popup__close .van-icon {
    font-size: 18px;
    color: #969799;
}

/* Transitions */
.popup-overlay-enter-active,
.popup-overlay-leave-active {
    transition: opacity 0.3s;
}

.popup-overlay-enter-from,
.popup-overlay-leave-to {
    opacity: 0;
}

.popup-center-enter-active,
.popup-center-leave-active {
    transition: all 0.3s;
}

.popup-center-enter-from,
.popup-center-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
}

.popup-top-enter-active,
.popup-top-leave-active,
.popup-bottom-enter-active,
.popup-bottom-leave-active,
.popup-left-enter-active,
.popup-left-leave-active,
.popup-right-enter-active,
.popup-right-leave-active {
    transition: transform 0.3s;
}

.popup-top-enter-from,
.popup-top-leave-to {
    transform: translateY(-100%);
}

.popup-bottom-enter-from,
.popup-bottom-leave-to {
    transform: translateY(100%);
}

.popup-left-enter-from,
.popup-left-leave-to {
    transform: translateX(-100%);
}

.popup-right-enter-from,
.popup-right-leave-to {
    transform: translateX(100%);
}
</style>
