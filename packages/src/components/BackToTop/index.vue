<template>
    <transition name="fade">
        <div v-show="visible" class="back-to-top" :style="buttonStyle" @click="handleClick">
            <slot>
                <div class="back-to-top-icon">↑</div>
            </slot>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    // 滚动多少距离后显示按钮
    visibilityHeight: {
        type: Number,
        default: 200
    },
    // 按钮位置 - 距离右边的距离
    right: {
        type: [Number, String],
        default: 20
    },
    // 按钮位置 - 距离底部的距离
    bottom: {
        type: [Number, String],
        default: 40
    },
    // 按钮大小
    size: {
        type: [Number, String],
        default: 50
    },
    // 背景颜色
    backgroundColor: {
        type: String,
        default: '#52c41a'
    },
    // 图标颜色
    iconColor: {
        type: String,
        default: '#fff'
    },
    // 滚动容器选择器（默认为 window）
    target: {
        type: String,
        default: ''
    },
    // 层级
    zIndex: {
        type: Number,
        default: 1000
    },
    // 自定义样式
    customStyle: {
        type: Object,
        default: () => ({})
    },
    // 自定义类名
    customClass: {
        type: [String, Array, Object],
        default: ''
    }
});

const emit = defineEmits(['click']);

const visible = ref(false);
const scrollContainer = ref(null);

// 计算按钮样式
const buttonStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    backgroundColor: props.backgroundColor,
    color: props.iconColor,
    right: typeof props.right === 'number' ? `${props.right}px` : props.right,
    bottom: typeof props.bottom === 'number' ? `${props.bottom}px` : props.bottom,
    zIndex: props.zIndex,
    ...props.customStyle
}));

// 处理滚动事件
const handleScroll = () => {
    const scrollTop = scrollContainer.value === window
        ? window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        : scrollContainer.value.scrollTop;

    visible.value = scrollTop >= props.visibilityHeight;
};

// 点击返回顶部
const handleClick = () => {
    const target = scrollContainer.value;

    if (target === window) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        target.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    emit('click');
};

// 初始化滚动容器
const initScrollContainer = () => {
    if (props.target) {
        scrollContainer.value = document.querySelector(props.target);
        if (!scrollContainer.value) {
            console.warn(`BackToTop: target element "${props.target}" not found, using window as default`);
            scrollContainer.value = window;
        }
    } else {
        scrollContainer.value = window;
    }
};

onMounted(() => {
    initScrollContainer();
    scrollContainer.value.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查
});

onBeforeUnmount(() => {
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', handleScroll);
    }
});
</script>

<style scoped lang="scss">
.back-to-top {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    user-select: none;
    transition: all 0.3s;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }
}

.back-to-top-icon {
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
