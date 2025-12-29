<template>
  <transition name="van-fade">
    <div v-if="visible && items.length > 0" class="quick-replies">
      <div class="quick-reply-scroll" :class="{ 'is-sticky': sticky }">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="quick-reply-item"
          @click="handleClick(item)"
        >
          {{ typeof item === "string" ? item : item.label }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  // 建议列表，支持字符串数组或对象数组 [{ label: 'text', value: 'val' }]
  items: {
    type: Array,
    default: () => [],
  },
  // 是否可见
  visible: {
    type: Boolean,
    default: true,
  },
  // 是否吸底（粘性定位）
  sticky: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["select"]);

const handleClick = (item) => {
  emit("select", item);
};
</script>

<style scoped lang="scss">
.quick-replies {
  width: 100%;
  padding: 8px 0;
  overflow: hidden;
}

.quick-reply-scroll {
  display: flex;
  overflow-x: auto;
  padding: 0 16px;
  gap: 8px;

  // 隐藏滚动条
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */

  &.is-sticky {
    position: sticky;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 20%
    );
    padding-bottom: 12px;
    z-index: 10;
  }
}

.quick-reply-item {
  flex-shrink: 0;
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #ebedf0;
  border-radius: 16px;
  font-size: 13px;
  color: #323233;
  cursor: pointer;
  transition: all 0.2s;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:active {
    background-color: #f2f3f5;
    border-color: #dcdee0;
  }
}
</style>
