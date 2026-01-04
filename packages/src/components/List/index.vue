<template>
    <div class="chat-list">
        <div v-for="(item, index) in items" :key="item.id || index" class="chat-list__item"
            :class="{ 'chat-list__item--clickable': clickable }" @click="handleClick(item, index)">
            <div v-if="item.avatar || $slots.avatar" class="chat-list__avatar">
                <slot name="avatar" :item="item" :index="index">
                    <img v-if="item.avatar" :src="item.avatar" :alt="item.title" class="chat-list__avatar-img" />
                </slot>
            </div>

            <div class="chat-list__content">
                <div class="chat-list__header">
                    <div class="chat-list__title">
                        <slot name="title" :item="item" :index="index">
                            {{ item.title }}
                        </slot>
                    </div>
                    <div v-if="item.time || $slots.extra" class="chat-list__extra">
                        <slot name="extra" :item="item" :index="index">
                            {{ item.time }}
                        </slot>
                    </div>
                </div>

                <div class="chat-list__body">
                    <div class="chat-list__description">
                        <slot name="description" :item="item" :index="index">
                            {{ item.description }}
                        </slot>
                    </div>
                    <van-badge v-if="item.badge" :content="item.badge" :max="99" class="chat-list__badge" />
                </div>
            </div>
        </div>

        <div v-if="items.length === 0" class="chat-list__empty">
            <slot name="empty">
                <van-empty description="暂无数据" />
            </slot>
        </div>
    </div>
</template>

<script setup>
import { Badge as VanBadge, Empty as VanEmpty } from "vant";

defineProps({
    items: {
        type: Array,
        default: () => [],
    },
    clickable: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["click"]);

const handleClick = (item, index) => {
    emit("click", { item, index });
};
</script>

<style scoped>
.chat-list {
    background-color: #fff;
}

.chat-list__item {
    display: flex;
    padding: 12px 16px;
    border-bottom: 1px solid #ebedf0;
    transition: background-color 0.2s;
}

.chat-list__item--clickable {
    cursor: pointer;
}

.chat-list__item--clickable:active {
    background-color: #f7f8fa;
}

.chat-list__avatar {
    flex-shrink: 0;
    margin-right: 12px;
}

.chat-list__avatar-img {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    object-fit: cover;
}

.chat-list__content {
    flex: 1;
    min-width: 0;
}

.chat-list__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.chat-list__title {
    font-size: 15px;
    font-weight: 500;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chat-list__extra {
    flex-shrink: 0;
    margin-left: 8px;
    font-size: 12px;
    color: #969799;
}

.chat-list__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-list__description {
    flex: 1;
    font-size: 13px;
    color: #969799;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chat-list__badge {
    flex-shrink: 0;
    margin-left: 8px;
}

.chat-list__empty {
    padding: 40px 0;
}
</style>
