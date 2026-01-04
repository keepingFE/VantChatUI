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
    padding: 48px 24px;
    text-align: center;
    animation: empty-fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-empty__image {
    width: 180px;
    height: 180px;
    margin-bottom: 24px;
    animation: float 3s ease-in-out infinite;
}

.chat-empty__default-image {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
}

.chat-empty__description {
    font-size: 15px;
    font-weight: 500;
    color: #8c8c8c;
    line-height: 22px;
    padding: 0 20px;
    letter-spacing: 0.3px;
}

.chat-empty__bottom {
    margin-top: 24px;
    animation: slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes empty-fade-in {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes slide-up {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
