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
    height: 46px;
    padding: 0 16px;
    background-color: #fff;
    border-bottom: 1px solid #ebedf0;
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
    gap: 8px;
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
    font-size: 16px;
    font-weight: 500;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chat-navbar__left :deep(.van-icon),
.chat-navbar__right :deep(.van-icon) {
    font-size: 20px;
    color: #323233;
    cursor: pointer;
    padding: 4px;
    min-width: 28px;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chat-navbar__left :deep(.van-icon:active),
.chat-navbar__right :deep(.van-icon:active) {
    opacity: 0.6;
}
</style>
