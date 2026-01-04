<template>
    <div class="chat-empty">
        <div class="chat-empty__image">
            <slot name="image">
                <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" class="chat-empty__default-image">
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#f2f3f5;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#dcdee0;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <ellipse cx="80" cy="140" rx="50" ry="10" fill="url(#grad)" opacity="0.3" />
                    <path d="M80 20 L100 60 L140 60 L110 85 L120 125 L80 100 L40 125 L50 85 L20 60 L60 60 Z"
                        fill="url(#grad)" />
                    <circle cx="80" cy="80" r="40" fill="none" stroke="url(#grad)" stroke-width="2" />
                </svg>
            </slot>
        </div>
        <div v-if="description || $slots.description" class="chat-empty__description">
            <slot name="description">{{ description }}</slot>
        </div>
        <div v-if="$slots.default" class="chat-empty__bottom">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
    description: {
        type: String,
        default: '暂无数据'
    },
    imageSize: {
        type: [Number, String],
        default: 160
    }
});
</script>

<style scoped>
.chat-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    text-align: center;
}

.chat-empty__image {
    width: 160px;
    height: 160px;
    margin-bottom: 16px;
}

.chat-empty__default-image {
    width: 100%;
    height: 100%;
}

.chat-empty__description {
    font-size: 14px;
    color: #969799;
    line-height: 20px;
    padding: 0 16px;
}

.chat-empty__bottom {
    margin-top: 16px;
}
</style>
