<template>
    <div class="chat-navbar" :class="{ 'chat-navbar--fixed': fixed }">
        <div class="chat-navbar__left" @click="handleLeftClick">
            <slot name="left">
                <van-icon v-if="showBack" name="arrow-left" />
            </slot>
        </div>
        <div class="chat-navbar__title">
            <slot name="title">{{ title }}</slot>
        </div>
        <div class="chat-navbar__right" @click="handleRightClick">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup>
import { Icon as VanIcon } from 'vant';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    showBack: {
        type: Boolean,
        default: true
    },
    fixed: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['back', 'click-left', 'click-right']);

const handleLeftClick = () => {
    emit('back');
    emit('click-left');
};

const handleRightClick = () => {
    emit('click-right');
};
</script>

<style scoped>
.chat-navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.chat-navbar--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
}

.chat-navbar__left,
.chat-navbar__right {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 60px;
}

.chat-navbar__left {
    justify-content: flex-start;
}

.chat-navbar__right {
    justify-content: flex-end;
}

.chat-navbar__title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.5px;
}

.chat-navbar__left :deep(.van-icon),
.chat-navbar__right :deep(.van-icon) {
    font-size: 22px;
    color: #323233;
    cursor: pointer;
    padding: 6px;
    min-width: 32px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-navbar__left :deep(.van-icon:hover),
.chat-navbar__right :deep(.van-icon:hover) {
    background: rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
}

.chat-navbar__left :deep(.van-icon:active),
.chat-navbar__right :deep(.van-icon:active) {
    transform: scale(0.95);
    background: rgba(0, 0, 0, 0.08);
}
</style>
