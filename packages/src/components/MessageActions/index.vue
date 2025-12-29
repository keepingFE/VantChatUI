<template>
  <div class="message-actions">
    <div
      v-if="actions.includes('copy')"
      class="action-item"
      @click="handleCopy"
      title="复制"
    >
      <van-icon name="description" />
      <span class="action-text" v-if="showLabels">复制</span>
    </div>

    <div
      v-if="actions.includes('regenerate')"
      class="action-item"
      :class="{ 'is-loading': loading }"
      @click="handleRegenerate"
      title="重新生成"
    >
      <van-icon name="replay" :class="{ 'spin-icon': loading }" />
      <span class="action-text" v-if="showLabels">重试</span>
    </div>

    <div
      class="divider"
      v-if="
        hasFeedback &&
        (actions.includes('copy') || actions.includes('regenerate'))
      "
    ></div>

    <div
      v-if="actions.includes('like')"
      class="action-item"
      :class="{ 'is-active': liked === true }"
      @click="handleLike"
      title="赞"
    >
      <van-icon :name="liked === true ? 'good-job' : 'good-job-o'" />
    </div>

    <div
      v-if="actions.includes('dislike')"
      class="action-item"
      :class="{ 'is-active': liked === false }"
      @click="handleDislike"
      title="踩"
    >
      <van-icon
        :name="liked === false ? 'good-job' : 'good-job-o'"
        style="transform: rotate(180deg)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";

const props = defineProps({
  // 支持的操作列表: ['copy', 'regenerate', 'like', 'dislike']
  actions: {
    type: Array,
    default: () => ["copy", "regenerate", "like", "dislike"],
  },
  // 消息内容（用于复制）
  content: {
    type: String,
    default: "",
  },
  // 是否显示文字标签
  showLabels: {
    type: Boolean,
    default: false,
  },
  // 重试按钮 loading 状态
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["copy", "regenerate", "like", "dislike"]);

const liked = ref(null); // null: 未评价, true: 赞, false: 踩

const hasFeedback =
  props.actions.includes("like") || props.actions.includes("dislike");

const handleCopy = async () => {
  if (props.content) {
    try {
      await navigator.clipboard.writeText(props.content);
      showToast("已复制");
      emit("copy");
    } catch (err) {
      console.error("Copy failed", err);
      showToast("复制失败");
    }
  } else {
    emit("copy");
  }
};

const handleRegenerate = () => {
  if (props.loading) return;
  emit("regenerate");
};

const handleLike = () => {
  if (liked.value === true) {
    liked.value = null; // 取消
  } else {
    liked.value = true;
    emit("like");
  }
};

const handleDislike = () => {
  if (liked.value === false) {
    liked.value = null; // 取消
  } else {
    liked.value = false;
    emit("dislike");
  }
};
</script>

<style scoped lang="scss">
.message-actions {
  display: inline-flex;
  align-items: center;
  background-color: #f7f8fa;
  border-radius: 4px;
  padding: 4px;
  gap: 4px;
  margin-top: 4px;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #969799;
  font-size: 14px;
  transition: all 0.2s;
  user-select: none;

  &:active {
    background-color: #ebedf0;
  }

  &.is-active {
    color: #1989fa;
    background-color: #e8f3ff;
  }

  &.is-loading {
    cursor: wait;
    opacity: 0.7;
  }
}

.action-text {
  font-size: 12px;
}

.divider {
  width: 1px;
  height: 12px;
  background-color: #dcdee0;
  margin: 0 4px;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
