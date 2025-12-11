<!-- File: packages/src/components/Loading/index.vue -->
<template>
    <van-popup v-model:show="visible" :overlay="overlay" :close-on-click-overlay="closeOnClickOverlay"
        :lock-scroll="lockScroll" :teleport="teleport" round class="cv-loading-popup">
        <div class="cv-loading-content" :style="contentStyle">
            <!-- 自定义图标插槽 -->
            <slot name="icon">
                <van-loading :type="type" :size="size" :color="color" :vertical="vertical" :text-size="textSize"
                    :text-color="textColor">
                    {{ text }}
                </van-loading>
            </slot>

            <!-- 如果使用自定义图标且有文字，单独显示文字 -->
            <div v-if="$slots.icon && text" class="cv-loading-text" :style="textStyle">
                {{ text }}
            </div>
        </div>
    </van-popup>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// Props 定义
const props = defineProps({
    // 是否显示加载弹框
    show: {
        type: Boolean,
        default: false
    },
    // 加载文字
    text: {
        type: String,
        default: 'Loading...'
    },
    // 加载图标类型 circular | spinner
    type: {
        type: String,
        default: 'circular'
    },
    // 加载图标大小
    size: {
        type: [String, Number],
        default: '30px'
    },
    // 加载图标颜色
    color: {
        type: String,
        default: '#1989fa'
    },
    // 是否垂直排列图标和文字
    vertical: {
        type: Boolean,
        default: true
    },
    // 文字大小
    textSize: {
        type: [String, Number],
        default: '14px'
    },
    // 文字颜色
    textColor: {
        type: String,
        default: '#969799'
    },
    // 是否显示遮罩层
    overlay: {
        type: Boolean,
        default: true
    },
    // 是否在点击遮罩层后关闭
    closeOnClickOverlay: {
        type: Boolean,
        default: false
    },
    // 是否锁定背景滚动
    lockScroll: {
        type: Boolean,
        default: true
    },
    // 指定挂载的节点
    teleport: {
        type: [String, Object],
        default: 'body'
    },
    // 弹框背景颜色
    backgroundColor: {
        type: String,
        default: 'rgba(0, 0, 0, 0.7)'
    },
    // 弹框圆角
    borderRadius: {
        type: [String, Number],
        default: '8px'
    },
    // 弹框内边距
    padding: {
        type: [String, Number],
        default: '24px'
    },
    // 弹框最小宽度
    minWidth: {
        type: [String, Number],
        default: '88px'
    }
})

// Emits 定义
const emit = defineEmits(['update:show'])

// 内部状态
const visible = ref(props.show)

// 计算弹框内容样式
const contentStyle = computed(() => ({
    background: props.backgroundColor,
    borderRadius: typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
    padding: typeof props.padding === 'number' ? `${props.padding}px` : props.padding,
    minWidth: typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth
}))

// 计算文字样式（用于自定义图标时）
const textStyle = computed(() => ({
    fontSize: typeof props.textSize === 'number' ? `${props.textSize}px` : props.textSize,
    color: props.textColor,
    marginTop: '8px'
}))

// 监听 show 变化
watch(() => props.show, (newVal) => {
    visible.value = newVal
})

// 监听 visible 变化
watch(visible, (newVal) => {
    emit('update:show', newVal)
})
</script>

<style scoped lang="scss">
.cv-loading-popup {
    background: transparent;

    :deep(.van-popup__content) {
        background: transparent;
    }
}

.cv-loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.cv-loading-text {
    text-align: center;
}
</style>
