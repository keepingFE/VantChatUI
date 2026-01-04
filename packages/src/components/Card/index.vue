<!-- File: packages/src/components/Card/index.vue -->
<template>
    <div class="chat-card" :class="[`card-size-${size}`]">
        <!-- 封面图片 -->
        <div v-if="cover" class="card-cover">
            <img :src="cover" alt="" class="cover-image" />
        </div>

        <!-- 卡片内容 -->
        <div class="card-content">
            <!-- 标题 -->
            <div v-if="title" class="card-title">{{ title }}</div>

            <!-- 描述 -->
            <div v-if="description" class="card-description">{{ description }}</div>

            <!-- 自定义内容插槽 -->
            <slot></slot>

            <!-- 按钮组 -->
            <div v-if="showActions" class="card-actions">
                <button v-if="secondaryText" class="card-button card-button-secondary" @click="handleSecondaryClick">
                    {{ secondaryText }}
                </button>
                <button v-if="primaryText" class="card-button card-button-primary" @click="handlePrimaryClick">
                    {{ primaryText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
// Props 定义
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    cover: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: 'md',
        validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'fluid'].includes(value)
    },
    primaryText: {
        type: String,
        default: ''
    },
    secondaryText: {
        type: String,
        default: ''
    },
    showActions: {
        type: Boolean,
        default: true
    }
})

// Emits 定义
const emit = defineEmits(['primary-click', 'secondary-click'])

// 处理主按钮点击
const handlePrimaryClick = (e) => {
    e.stopPropagation()
    emit('primary-click')
}

// 处理次按钮点击
const handleSecondaryClick = (e) => {
    e.stopPropagation()
    emit('secondary-click')
}
</script>

<style scoped lang="scss">
.chat-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0, 0, 0, 0.04);
    animation: card-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

    &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        transform: translateY(-4px);
    }
}

// 卡片尺寸
.card-size-xs {
    max-width: 200px;
}

.card-size-sm {
    max-width: 280px;
}

.card-size-md {
    max-width: 360px;
}

.card-size-lg {
    max-width: 440px;
}

.card-size-xl {
    max-width: 520px;
}

.card-size-fluid {
    max-width: 100%;
}

.card-cover {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    }

    .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover .cover-image {
        transform: scale(1.05);
    }
}

.card-content {
    padding: 20px;
    background: #ffffff;
}

.card-title {
    font-size: 19px;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1.4;
    margin-bottom: 10px;
    letter-spacing: 0.3px;
}

.card-description {
    font-size: 15px;
    color: #6c757d;
    line-height: 1.7;
    margin-bottom: 16px;
}

.card-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

.card-button {
    flex: 1;
    height: 46px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
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

    &:active::before {
        width: 300px;
        height: 300px;
    }

    &:active {
        transform: scale(0.96);
    }
}

.card-button-secondary {
    background: #e9ecef;
    color: #495057;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    &:hover {
        background: #dee2e6;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
}

.card-button-primary {
    background: linear-gradient(135deg, #1989fa 0%, #0e6ecd 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(25, 137, 250, 0.4);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }

    &:active {
        transform: scale(0.96);
    }
}

@keyframes card-in {
    0% {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
</style>
