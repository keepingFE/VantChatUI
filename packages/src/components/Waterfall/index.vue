<template>
    <div ref="containerRef" class="chat-waterfall" :style="containerStyles">
        <div class="chat-waterfall__inner" :style="innerStyles">
            <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="chat-waterfall__column"
                :style="columnStyles">
                <div v-for="item in column" :key="item[itemKey]" class="chat-waterfall__item"
                    :style="getItemStyle(item)">
                    <slot :item="item" :index="item.originalIndex">
                        <div class="chat-waterfall__content">
                            <img :src="item[srcKey]" :alt="item[altKey] || ''" class="chat-waterfall__image"
                                :loading="lazy ? 'lazy' : 'eager'" @load="handleImageLoad($event, item)"
                                @error="handleImageError($event, item)" @click="handleImageClick(item)" />
                            <div v-if="showInfo && (item[titleKey] || item[descKey])" class="chat-waterfall__info">
                                <div v-if="item[titleKey]" class="chat-waterfall__title">{{ item[titleKey] }}</div>
                                <div v-if="item[descKey]" class="chat-waterfall__desc">{{ item[descKey] }}</div>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = defineProps({
    // 图片列表数据
    list: {
        type: Array,
        default: () => [],
    },
    // 列数
    columnCount: {
        type: Number,
        default: 2,
        validator: (value) => value > 0,
    },
    // 列间距
    gap: {
        type: [String, Number],
        default: 10,
    },
    // 图片源字段名
    srcKey: {
        type: String,
        default: "src",
    },
    // 替代文本字段名
    altKey: {
        type: String,
        default: "alt",
    },
    // 标题字段名
    titleKey: {
        type: String,
        default: "title",
    },
    // 简介字段名
    descKey: {
        type: String,
        default: "description",
    },
    // 唯一标识字段名
    itemKey: {
        type: String,
        default: "id",
    },
    // 是否显示标题和简介
    showInfo: {
        type: Boolean,
        default: false,
    },
    // 是否懒加载
    lazy: {
        type: Boolean,
        default: true,
    },
    // 图片圆角
    radius: {
        type: [String, Number],
        default: 8,
    },
    // 容器高度（设置后会显示滚动条）
    height: {
        type: [String, Number],
        default: "",
    },
});

const emit = defineEmits(["load", "error", "click"]);

const containerRef = ref(null);
const columns = ref([]);
const columnHeights = ref([]);
const imageHeights = ref(new Map());

// 容器样式
const containerStyles = computed(() => {
    const styles = {};

    if (props.height) {
        styles.height = typeof props.height === "number" ? `${props.height}px` : props.height;
        styles.overflowY = "auto";
    }

    return styles;
});

// 内部容器样式
const innerStyles = computed(() => ({
    gap: typeof props.gap === "number" ? `${props.gap}px` : props.gap,
}));

// 列样式
const columnStyles = computed(() => ({
    width: `calc((100% - ${props.gap * (props.columnCount - 1)}px) / ${props.columnCount})`,
}));

// 获取项目样式
const getItemStyle = (item) => {
    const radius = typeof props.radius === "number" ? `${props.radius}px` : props.radius;
    return {
        borderRadius: radius,
        marginBottom: typeof props.gap === "number" ? `${props.gap}px` : props.gap,
    };
};

// 初始化列
const initColumns = () => {
    columns.value = Array.from({ length: props.columnCount }, () => []);
    columnHeights.value = Array(props.columnCount).fill(0);
};

// 获取最短列的索引
const getShortestColumnIndex = () => {
    let minHeight = columnHeights.value[0];
    let minIndex = 0;

    for (let i = 1; i < columnHeights.value.length; i++) {
        if (columnHeights.value[i] < minHeight) {
            minHeight = columnHeights.value[i];
            minIndex = i;
        }
    }

    return minIndex;
};

// 布局图片
const layoutImages = () => {
    initColumns();

    props.list.forEach((item, index) => {
        const enhancedItem = {
            ...item,
            originalIndex: index,
        };

        // 获取图片高度（如果已加载）
        const height = imageHeights.value.get(item[props.itemKey]);

        // 如果图片还没加载，按顺序轮流分配到各列
        // 如果图片已加载，找到最短的列
        const columnIndex = height ? getShortestColumnIndex() : index % props.columnCount;

        // 添加到该列
        columns.value[columnIndex].push(enhancedItem);

        // 更新列高度（只有已加载的图片才计算高度）
        if (height) {
            columnHeights.value[columnIndex] += height + (typeof props.gap === "number" ? props.gap : 10);
        }
    });
};

// 图片加载完成
const handleImageLoad = (event, item) => {
    const img = event.target;
    const height = img.offsetHeight;

    // 保存图片高度
    imageHeights.value.set(item[props.itemKey], height);

    // 重新布局
    nextTick(() => {
        layoutImages();
    });

    emit("load", { event, item });
};

// 图片加载失败
const handleImageError = (event, item) => {
    emit("error", { event, item });
};

// 图片点击
const handleImageClick = (item) => {
    emit("click", item);
};

// 监听列表变化
watch(
    () => props.list,
    () => {
        nextTick(() => {
            layoutImages();
        });
    },
    { deep: true }
);

// 监听列数变化
watch(
    () => props.columnCount,
    () => {
        nextTick(() => {
            layoutImages();
        });
    }
);

// 窗口大小变化时重新布局
let resizeObserver = null;

onMounted(() => {
    layoutImages();

    // 使用 ResizeObserver 监听容器大小变化
    if (containerRef.value && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            layoutImages();
        });
        resizeObserver.observe(containerRef.value);
    }
});

onBeforeUnmount(() => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
});
</script>

<style scoped lang="scss">
.chat-waterfall {
    width: 100%;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;

        &:hover {
            background: #a8a8a8;
        }
    }

    &__inner {
        display: flex;
        width: 100%;
    }

    &__column {
        display: flex;
        flex-direction: column;
    }

    &__item {
        overflow: hidden;
        background-color: #f7f8fa;
        transition: transform 0.2s ease;

        &:hover {
            transform: translateY(-2px);
        }

        &:last-child {
            margin-bottom: 0 !important;
        }
    }

    &__content {
        display: flex;
        flex-direction: column;
    }

    &__image {
        display: block;
        width: 100%;
        height: auto;
        cursor: pointer;
        transition: opacity 0.3s ease;

        &:hover {
            opacity: 0.9;
        }
    }

    &__info {
        padding: 12px;
        background-color: #fff;
    }

    &__title {
        font-size: 14px;
        font-weight: 600;
        color: #323233;
        margin-bottom: 6px;
        line-height: 1.4;
    }

    &__desc {
        font-size: 12px;
        color: #969799;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
