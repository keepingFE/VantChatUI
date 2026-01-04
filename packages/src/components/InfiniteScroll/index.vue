<template>
    <div class="chat-infinite-scroll" ref="containerRef">
        <slot />

        <div v-if="loading" class="chat-infinite-scroll__loading">
            <van-loading size="24">{{ loadingText }}</van-loading>
        </div>

        <div v-if="finished && !loading" class="chat-infinite-scroll__finished">
            <slot name="finished">
                {{ finishedText }}
            </slot>
        </div>

        <div v-if="error && !loading" class="chat-infinite-scroll__error" @click="handleErrorClick">
            <slot name="error">
                {{ errorText }}
            </slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Loading as VanLoading } from "vant";

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    finished: {
        type: Boolean,
        default: false,
    },
    error: {
        type: Boolean,
        default: false,
    },
    offset: {
        type: Number,
        default: 300,
    },
    loadingText: {
        type: String,
        default: "加载中...",
    },
    finishedText: {
        type: String,
        default: "没有更多了",
    },
    errorText: {
        type: String,
        default: "加载失败，点击重试",
    },
    direction: {
        type: String,
        default: "down",
        validator: (value) => ["up", "down"].includes(value),
    },
    immediateCheck: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["load", "error-click"]);

const containerRef = ref(null);

const check = () => {
    if (props.loading || props.finished || props.error) return;

    const container = containerRef.value;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (props.direction === "down") {
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        if (distanceToBottom <= props.offset) {
            emit("load");
        }
    } else {
        if (scrollTop <= props.offset) {
            emit("load");
        }
    }
};

const handleScroll = () => {
    check();
};

const handleErrorClick = () => {
    emit("error-click");
};

onMounted(() => {
    const container = containerRef.value;
    if (container) {
        container.addEventListener("scroll", handleScroll);

        if (props.immediateCheck) {
            check();
        }
    }
});

onUnmounted(() => {
    const container = containerRef.value;
    if (container) {
        container.removeEventListener("scroll", handleScroll);
    }
});

defineExpose({
    check,
});
</script>

<style scoped>
.chat-infinite-scroll {
    overflow-y: auto;
}

.chat-infinite-scroll__loading,
.chat-infinite-scroll__finished,
.chat-infinite-scroll__error {
    padding: 16px;
    text-align: center;
    font-size: 14px;
    color: #969799;
}

.chat-infinite-scroll__error {
    cursor: pointer;
    color: #1989fa;
}

.chat-infinite-scroll__error:active {
    opacity: 0.7;
}
</style>
