<template>
    <Teleport to="body">
        <Transition name="modal-overlay">
            <div v-if="visible" class="chat-modal-overlay" @click="handleOverlayClick"></div>
        </Transition>
        <Transition name="modal">
            <div v-if="visible" class="chat-modal">
                <div class="chat-modal__content">
                    <div v-if="title" class="chat-modal__header">
                        <div class="chat-modal__title">{{ title }}</div>
                    </div>
                    <div class="chat-modal__body">
                        <slot>{{ message }}</slot>
                    </div>
                    <div class="chat-modal__footer">
                        <button v-if="showCancelButton" class="chat-modal__button chat-modal__button--cancel"
                            @click="handleCancel">
                            {{ cancelButtonText }}
                        </button>
                        <button v-if="showConfirmButton" class="chat-modal__button chat-modal__button--confirm"
                            @click="handleConfirm">
                            {{ confirmButtonText }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    showCancelButton: {
        type: Boolean,
        default: true
    },
    showConfirmButton: {
        type: Boolean,
        default: true
    },
    cancelButtonText: {
        type: String,
        default: '取消'
    },
    confirmButtonText: {
        type: String,
        default: '确定'
    },
    closeOnClickOverlay: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
    visible.value = val;
});

const handleOverlayClick = () => {
    if (props.closeOnClickOverlay) {
        handleClose();
    }
};

const handleConfirm = () => {
    emit('confirm');
    handleClose();
};

const handleCancel = () => {
    emit('cancel');
    handleClose();
};

const handleClose = () => {
    visible.value = false;
    emit('update:modelValue', false);
    emit('close');
};
</script>

<style scoped>
.chat-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%);
    backdrop-filter: blur(4px);
    z-index: 2000;
}

.chat-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2001;
}

.chat-modal__content {
    width: 340px;
    max-width: 90vw;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.8);
}

.chat-modal__header {
    padding: 24px 24px 12px;
}

.chat-modal__title {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.5px;
}

.chat-modal__body {
    padding: 20px 24px 24px;
    font-size: 15px;
    color: #495057;
    text-align: center;
    line-height: 1.6;
}

.chat-modal__footer {
    display: flex;
    gap: 12px;
    padding: 0 16px 16px;
}

.chat-modal__button {
    flex: 1;
    height: 44px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.chat-modal__button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.chat-modal__button:active::before {
    width: 300px;
    height: 300px;
}

.chat-modal__button--cancel {
    background: #e9ecef;
    color: #6c757d;
}

.chat-modal__button--cancel:hover {
    background: #dee2e6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chat-modal__button--cancel:active {
    transform: translateY(0);
}

.chat-modal__button--confirm {
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(25, 137, 250, 0.4);
}

.chat-modal__button--confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.chat-modal__button--confirm:active {
    transform: translateY(0);
}

/* Transitions */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
    opacity: 0;
}

.modal-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.7) rotateX(10deg);
}

.modal-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
}
</style>
