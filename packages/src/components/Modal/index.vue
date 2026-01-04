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
    background-color: rgba(0, 0, 0, 0.5);
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
    width: 320px;
    max-width: 90vw;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
}

.chat-modal__header {
    padding: 20px 24px 12px;
}

.chat-modal__title {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
    text-align: center;
}

.chat-modal__body {
    padding: 12px 24px 20px;
    font-size: 14px;
    color: #646566;
    text-align: center;
    line-height: 1.5;
}

.chat-modal__footer {
    display: flex;
    border-top: 1px solid #ebedf0;
}

.chat-modal__button {
    flex: 1;
    height: 48px;
    border: none;
    background-color: transparent;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.chat-modal__button:active {
    background-color: #f2f3f5;
}

.chat-modal__button--cancel {
    color: #646566;
    border-right: 1px solid #ebedf0;
}

.chat-modal__button--confirm {
    color: #1989fa;
    font-weight: 500;
}

/* Transitions */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
    transition: opacity 0.3s;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
    opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
}
</style>
