<template>
    <div class="chat-carousel">
        <div class="chat-carousel__container" ref="containerRef">
            <div class="chat-carousel__track" :style="trackStyle" @touchstart="handleTouchStart"
                @touchmove="handleTouchMove" @touchend="handleTouchEnd">
                <div v-for="(item, index) in items" :key="index" class="chat-carousel__item" :style="itemStyle"
                    @click="handleItemClick(item, index)">
                    <slot :item="item" :index="index">
                        <div class="chat-carousel__default-item">
                            <img v-if="item.image" :src="item.image" :alt="item.title" class="chat-carousel__image" />
                            <div class="chat-carousel__content">
                                <div v-if="item.title" class="chat-carousel__title">{{ item.title }}</div>
                                <div v-if="item.description" class="chat-carousel__description">{{ item.description }}
                                </div>
                                <div v-if="item.price" class="chat-carousel__price">{{ item.price }}</div>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        </div>

        <div v-if="showIndicators" class="chat-carousel__indicators">
            <span v-for="(item, index) in items" :key="index" class="chat-carousel__indicator"
                :class="{ 'chat-carousel__indicator--active': index === currentIndex }"
                @click="goToSlide(index)"></span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    autoplay: {
        type: Boolean,
        default: false
    },
    interval: {
        type: Number,
        default: 3000
    },
    showIndicators: {
        type: Boolean,
        default: true
    },
    itemWidth: {
        type: String,
        default: '100%'
    },
    gap: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['change', 'click']);

const containerRef = ref(null);
const currentIndex = ref(0);
const touchStartX = ref(0);
const touchCurrentX = ref(0);
const isDragging = ref(false);
let autoplayTimer = null;

const trackStyle = computed(() => {
    const itemWidthValue = props.itemWidth === '100%' ? window.innerWidth : parseInt(props.itemWidth);
    const offset = isDragging.value
        ? -(currentIndex.value * (itemWidthValue + props.gap)) + (touchCurrentX.value - touchStartX.value)
        : -(currentIndex.value * (itemWidthValue + props.gap));

    return {
        transform: `translateX(${offset}px)`,
        transition: isDragging.value ? 'none' : 'transform 0.3s ease'
    };
});

const itemStyle = computed(() => {
    if (props.gap > 0) {
        return {
            width: props.itemWidth === '100%' ? `calc(100% - ${props.gap}px)` : props.itemWidth,
            marginRight: `${props.gap}px`
        };
    }
    return {
        width: props.itemWidth,
        marginRight: `${props.gap}px`
    };
});

const handleTouchStart = (e) => {
    touchStartX.value = e.touches[0].clientX;
    touchCurrentX.value = e.touches[0].clientX;
    isDragging.value = true;
    stopAutoplay();
};

const handleTouchMove = (e) => {
    if (!isDragging.value) return;
    touchCurrentX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
    if (!isDragging.value) return;

    const diff = touchCurrentX.value - touchStartX.value;
    const threshold = 50;

    if (diff > threshold && currentIndex.value > 0) {
        currentIndex.value--;
    } else if (diff < -threshold && currentIndex.value < props.items.length - 1) {
        currentIndex.value++;
    }

    isDragging.value = false;
    emit('change', currentIndex.value);

    if (props.autoplay) {
        startAutoplay();
    }
};

const handleItemClick = (item, index) => {
    emit('click', { item, index });
};

const goToSlide = (index) => {
    currentIndex.value = index;
    emit('change', index);
};

const next = () => {
    if (currentIndex.value < props.items.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
    emit('change', currentIndex.value);
};

const prev = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else {
        currentIndex.value = props.items.length - 1;
    }
    emit('change', currentIndex.value);
};

const startAutoplay = () => {
    if (!props.autoplay) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
        next();
    }, props.interval);
};

const stopAutoplay = () => {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
};

onMounted(() => {
    if (props.autoplay) {
        startAutoplay();
    }
});

onUnmounted(() => {
    stopAutoplay();
});

defineExpose({
    next,
    prev,
    goToSlide
});
</script>

<style scoped>
.chat-carousel {
    width: 100%;
    overflow: hidden;
}

.chat-carousel__container {
    overflow: hidden;
    padding: 8px 0;
}

.chat-carousel__track {
    display: flex;
    will-change: transform;
}

.chat-carousel__item {
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
}

.chat-carousel__default-item {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.chat-carousel__default-item:active {
    transform: scale(0.98);
}

.chat-carousel__image {
    width: 100%;
    height: 160px;
    object-fit: cover;
}

.chat-carousel__content {
    padding: 12px;
}

.chat-carousel__title {
    font-size: 14px;
    font-weight: 500;
    color: #323233;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chat-carousel__description {
    font-size: 12px;
    color: #969799;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.chat-carousel__price {
    font-size: 16px;
    font-weight: 500;
    color: #ee0a24;
}

.chat-carousel__indicators {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 12px;
}

.chat-carousel__indicator {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: #dcdee0;
    cursor: pointer;
    transition: all 0.3s;
}

.chat-carousel__indicator--active {
    width: 16px;
    background-color: #1989fa;
}
</style>
