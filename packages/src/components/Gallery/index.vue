<template>
    <div :class="galleryClasses" :style="containerStyles">
        <!-- 图片网格 -->
        <div class="chat-gallery__grid" :style="gridStyles">
            <div
                v-for="(image, index) in images"
                :key="index"
                :class="getItemClasses(index)"
                :style="getItemStyles(index)"
                @click="handleImageClick(index)"
            >
                <img
                    :src="image.url || image"
                    :alt="image.alt || `图片 ${index + 1}`"
                    class="chat-gallery__img"
                    :loading="lazy ? 'lazy' : 'eager'"
                    @error="handleImageError(index)"
                />
                <div v-if="hasMore && index === visibleCount - 1" class="chat-gallery__more">
                    +{{ images.length - visibleCount }}
                </div>
            </div>
        </div>

        <!-- 图片预览 -->
        <van-image-preview
            v-model:show="showPreview"
            :images="previewImages"
            :start-position="currentPreviewIndex"
            :close-on-click-image="closeOnClickImage"
            @change="handlePreviewChange"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { ImagePreview as VanImagePreview } from "vant";

const props = defineProps({
    // 图片列表（支持字符串数组或对象数组）
    images: {
        type: Array,
        default: () => [],
        validator: (value) => {
            return value.every(item => typeof item === 'string' || (typeof item === 'object' && item.url));
        },
    },
    // 最大显示数量（超过则折叠）
    maxCount: {
        type: Number,
        default: 9,
    },
    // 图片宽度
    width: {
        type: [String, Number],
        default: "auto",
    },
    // 图片高度
    height: {
        type: [String, Number],
        default: "auto",
    },
    // 图片间距
    gap: {
        type: [String, Number],
        default: 8,
    },
    // 每行显示数量（响应式）
    columns: {
        type: [Number, Object],
        default: () => ({ xs: 3, sm: 3, md: 4, lg: 5 }),
    },
    // 图片适配方式
    fit: {
        type: String,
        default: "cover",
        validator: (value) =>
            ["contain", "cover", "fill", "none", "scale-down"].includes(value),
    },
    // 是否圆角
    round: {
        type: Boolean,
        default: false,
    },
    // 圆角大小
    radius: {
        type: [String, Number],
        default: "",
    },
    // 是否懒加载
    lazy: {
        type: Boolean,
        default: true,
    },
    // 点击图片是否关闭预览
    closeOnClickImage: {
        type: Boolean,
        default: true,
    },
    // 是否可点击预览
    clickable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["click", "preview-change", "error"]);

const showPreview = ref(false);
const currentPreviewIndex = ref(0);

const galleryClasses = computed(() => {
    return [
        "chat-gallery",
        {
            "chat-gallery--round": props.round,
            "chat-gallery--clickable": props.clickable,
        },
    ];
});

const containerStyles = computed(() => {
    const styles = {};
    if (props.width) {
        styles.width = typeof props.width === "number" ? `${props.width}px` : props.width;
    }
    if (props.radius && !props.round) {
        styles.borderRadius = typeof props.radius === "number" ? `${props.radius}px` : props.radius;
    }
    return styles;
});

// 计算实际显示的图片数量
const visibleCount = computed(() => {
    return Math.min(props.images.length, props.maxCount);
});

// 是否有更多图片
const hasMore = computed(() => {
    return props.images.length > props.maxCount;
});

// 预览图片列表
const previewImages = computed(() => {
    return props.images.map(img => typeof img === 'string' ? img : img.url);
});

// 获取每行显示的列数
const getColumns = () => {
    if (typeof props.columns === "number") {
        return props.columns;
    }
    const width = window.innerWidth;
    if (width < 576) return props.columns.xs || 3;
    if (width < 768) return props.columns.sm || 3;
    if (width < 992) return props.columns.md || 4;
    return props.columns.lg || 5;
};

const gridStyles = computed(() => {
    const columns = getColumns();
    const gap = typeof props.gap === "number" ? `${props.gap}px` : props.gap;
    return {
        gap,
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
    };
});

// 获取图片项的样式
const getItemStyles = (index) => {
    const styles = {};
    if (props.height && typeof props.height !== "number") {
        styles.height = props.height;
    } else if (props.images.length === 1) {
        // 单张图片时显示更大
        styles.maxWidth = "100%";
        styles.maxHeight = "300px";
    } else {
        // 多张图片时保持统一高度
        styles.aspectRatio = "1 / 1";
    }
    return styles;
};

// 获取图片项的类名
const getItemClasses = (index) => {
    const classes = ["chat-gallery__item"];
    if (hasMore.value && index === visibleCount.value - 1) {
        classes.push("chat-gallery__item--more");
    }
    return classes;
};

// 点击图片
const handleImageClick = (index) => {
    if (!props.clickable) return;
    emit("click", { index, image: props.images[index] });
    currentPreviewIndex.value = index;
    showPreview.value = true;
};

// 预览切换
const handlePreviewChange = (index) => {
    currentPreviewIndex.value = index;
    emit("preview-change", {
        index,
        image: props.images[index],
    });
};

// 图片加载错误
const handleImageError = (index) => {
    emit("error", { index, image: props.images[index] });
};

// 监听窗口大小变化以更新列数
let resizeObserver = null;

if (typeof window !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
        // 触发重新计算
        getColumns();
    });
}

// 监听 images 变化
watch(() => props.images, () => {
    if (showPreview.value && currentPreviewIndex.value >= props.images.length) {
        showPreview.value = false;
    }
}, { deep: true });
</script>

<style scoped lang="scss">
.chat-gallery {
    position: relative;
    display: inline-block;
    width: 100%;

    &__grid {
        display: grid;
        width: 100%;
    }

    &__item {
        position: relative;
        overflow: hidden;
        background-color: #f7f8fa;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 6px;

        &:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        &:active {
            transform: translateY(-1px) scale(1.01);
        }

        &--more {
            cursor: pointer;

            &:hover {
                transform: translateY(-3px) scale(1.02);
            }
        }
    }

    &__img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: var(--fit, cover);
        transition: transform 0.3s;

        .chat-gallery__item:hover & {
            transform: scale(1.05);
        }
    }

    &__more {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.75));
        color: #fff;
        font-size: 28px;
        font-weight: 700;
        backdrop-filter: blur(4px);
        transition: all 0.3s;

        span {
            font-size: 14px;
            font-weight: 500;
            margin-top: 4px;
            opacity: 0.9;
        }

        .chat-gallery__item:hover & {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85));
            backdrop-filter: blur(6px);
        }
    }

    &--round {
        .chat-gallery__item {
            &:first-child {
                border-radius: 8px 0 0 8px;
            }

            &:last-child {
                border-radius: 0 8px 8px 0;
            }

            &:only-child {
                border-radius: 8px;
            }
        }
    }

    &--clickable {
        .chat-gallery__item {
            cursor: pointer;

            &:active {
                transform: scale(0.98);
            }
        }
    }
}

// 响应式适配
@media (max-width: 576px) {
    .chat-gallery {
        &__item {
            border-radius: 4px;
        }

        &__more {
            font-size: 20px;
        }
    }
}

@media (max-width: 480px) {
    .chat-gallery {
        &__item {
            border-radius: 2px;
        }

        &__more {
            font-size: 18px;
        }
    }
}

// 单张图片特殊样式
.chat-gallery {
    &:has(.chat-gallery__item:only-child) {
        .chat-gallery__grid {
            display: block;
        }

        .chat-gallery__item {
            border-radius: 8px;
            display: inline-block;
            max-width: 100%;

            img {
                max-height: 300px;
            }
        }
    }
}
</style>
