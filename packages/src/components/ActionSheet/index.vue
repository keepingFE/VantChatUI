<template>
    <van-action-sheet v-model:show="visible" :title="title" :cancel-text="cancelText" :description="description"
        :closeable="closeable" :close-on-click-action="closeOnClickAction" @select="handleSelect" @cancel="handleCancel"
        @close="handleClose">
        <div class="chat-action-sheet">
            <div v-for="(action, index) in actions" :key="index" class="chat-action-sheet__item"
                :class="{ 'chat-action-sheet__item--disabled': action.disabled, 'chat-action-sheet__item--loading': action.loading }"
                @click="handleActionClick(action, index)">
                <van-icon v-if="action.icon" :name="action.icon" :color="action.color"
                    class="chat-action-sheet__icon" />
                <span class="chat-action-sheet__name" :style="{ color: action.color }">
                    {{ action.name }}
                </span>
                <span v-if="action.subname" class="chat-action-sheet__subname">
                    {{ action.subname }}
                </span>
                <van-loading v-if="action.loading" size="20" class="chat-action-sheet__loading" />
            </div>
        </div>

        <template v-if="$slots.default" #default>
            <slot />
        </template>
    </van-action-sheet>
</template>

<script setup>
import { ref, watch } from "vue";
import { ActionSheet as VanActionSheet, Icon as VanIcon, Loading as VanLoading } from "vant";

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    actions: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: "",
    },
    cancelText: {
        type: String,
        default: "取消",
    },
    description: {
        type: String,
        default: "",
    },
    closeable: {
        type: Boolean,
        default: true,
    },
    closeOnClickAction: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["update:show", "select", "cancel", "close"]);

const visible = ref(props.show);

watch(
    () => props.show,
    (val) => {
        visible.value = val;
    }
);

watch(visible, (val) => {
    emit("update:show", val);
});

const handleSelect = (action, index) => {
    emit("select", { action, index });
};

const handleActionClick = (action, index) => {
    if (action.disabled || action.loading) return;
    handleSelect(action, index);
};

const handleCancel = () => {
    emit("cancel");
};

const handleClose = () => {
    emit("close");
};
</script>

<style scoped>
.chat-action-sheet {
    padding: 12px 0;
}

.chat-action-sheet__item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.chat-action-sheet__item::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.chat-action-sheet__item:active::before {
    width: 500px;
    height: 500px;
}

.chat-action-sheet__item:hover {
    background: linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.05) 50%, transparent 100%);
}

.chat-action-sheet__item:active {
    background-color: rgba(102, 126, 234, 0.08);
}

.chat-action-sheet__item--disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.chat-action-sheet__item--disabled:hover,
.chat-action-sheet__item--disabled:active {
    background-color: transparent;
}

.chat-action-sheet__item--loading {
    cursor: not-allowed;
}

.chat-action-sheet__item--loading:hover,
.chat-action-sheet__item--loading:active {
    background-color: transparent;
}

.chat-action-sheet__icon {
    margin-right: 14px;
    font-size: 22px;
    position: relative;
    z-index: 1;
}

.chat-action-sheet__name {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    color: #2c3e50;
    position: relative;
    z-index: 1;
}

.chat-action-sheet__subname {
    margin-left: 10px;
    font-size: 13px;
    color: #8c8c8c;
    position: relative;
    z-index: 1;
}

.chat-action-sheet__loading {
    margin-left: 10px;
    position: relative;
    z-index: 1;
}
</style>
