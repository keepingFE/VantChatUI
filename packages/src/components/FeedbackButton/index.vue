<template>
  <div class="feedback-group">
    <div
      class="feedback-item like"
      :class="{ 'is-active': modelValue === 'like', 'is-disabled': disabled }"
      @click="toggle('like')"
      title="点赞"
    >
      <van-icon :name="modelValue === 'like' ? 'good-job' : 'good-job-o'" />
    </div>

    <div class="divider" v-if="direction === 'horizontal'"></div>

    <div
      class="feedback-item dislike"
      :class="{
        'is-active': modelValue === 'dislike',
        'is-disabled': disabled,
      }"
      @click="toggle('dislike')"
      title="不喜欢"
    >
      <van-icon
        :name="modelValue === 'dislike' ? 'good-job' : 'good-job-o'"
        style="transform: rotate(180deg)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // 'like' | 'dislike' | null
  modelValue: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // 排列方向: horizontal | vertical (目前主要是水平，预留接口)
  direction: {
    type: String,
    default: "horizontal",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const toggle = (val) => {
  if (props.disabled) return;

  const newValue = props.modelValue === val ? null : val;
  emit("update:modelValue", newValue);
  emit("change", newValue);
};
</script>

<style scoped lang="scss">
.feedback-group {
  display: inline-flex;
  align-items: center;
  background-color: #f7f8fa;
  border-radius: 16px;
  padding: 2px;
}

.feedback-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #969799;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;

  &:hover:not(.is-disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.is-active {
    &.like {
      color: #1989fa;
      background-color: #e8f3ff;
    }
    &.dislike {
      color: #ff976a;
      background-color: #fff3e0;
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.divider {
  width: 1px;
  height: 14px;
  background-color: #dcdee0;
  margin: 0 2px;
}
</style>
