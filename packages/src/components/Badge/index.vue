<template>
    <div class="chat-badge">
        <slot />
        <van-badge v-if="showBadge" :content="content" :max="max" :dot="dot" :color="color" :offset="offset"
            :show-zero="showZero" :position="position" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { Badge as VanBadge } from "vant";

const props = defineProps({
    content: {
        type: [Number, String],
        default: "",
    },
    max: {
        type: Number,
        default: 99,
    },
    dot: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
        default: "#ee0a24",
    },
    offset: {
        type: Array,
        default: () => [0, 0],
    },
    showZero: {
        type: Boolean,
        default: true,
    },
    position: {
        type: String,
        default: "top-right",
    },
});

const showBadge = computed(() => {
    if (props.dot) return true;
    if (props.content === 0 || props.content === "0") return props.showZero;
    return !!props.content;
});
</script>

<style scoped>
.chat-badge {
    position: relative;
    display: inline-block;
}
</style>
