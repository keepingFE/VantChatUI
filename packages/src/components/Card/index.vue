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
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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
    background: #f7f8fa;

    .cover-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
}

.card-content {
    padding: 16px;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.4;
    margin-bottom: 8px;
}

.card-description {
    font-size: 14px;
    color: #666666;
    line-height: 1.6;
    margin-bottom: 16px;
}

.card-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
}

.card-button {
    flex: 1;
    height: 44px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &:active {
        transform: scale(0.98);
    }
}

.card-button-secondary {
    background: #ffffff;
    color: #666666;
    border: 1px solid #e0e0e0;

    &:hover {
        background: #f5f5f5;
        border-color: #d0d0d0;
    }
}

.card-button-primary {
    background: #ff6600;
    color: #ffffff;

    &:hover {
        background: #ff7700;
    }

    &:active {
        background: #ee5500;
    }
}
</style>
