<template>
  <div class="demo-page">
    <van-nav-bar
      title="MessageActions 消息操作栏"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="demo-section">
      <div class="section-title">基础用法</div>
      <div class="preview-box">
        <div class="mock-message">
          这是一条 AI 生成的消息，你可以对它进行操作。
        </div>
        <MessageActions
          content="这是一条 AI 生成的消息，你可以对它进行操作。"
          @regenerate="onRegenerate"
        />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">带文字标签</div>
      <div class="preview-box">
        <div class="mock-message">显示文字标签的操作栏。</div>
        <MessageActions
          :show-labels="true"
          content="显示文字标签的操作栏。"
          @regenerate="onRegenerate"
        />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">自定义操作项</div>
      <div class="preview-box">
        <div class="mock-message">仅显示复制和点赞。</div>
        <MessageActions
          :actions="['copy', 'like']"
          content="仅显示复制和点赞。"
        />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">模拟 Loading 状态</div>
      <div class="preview-box">
        <div class="mock-message">点击重试按钮查看 Loading 效果。</div>
        <MessageActions
          :loading="isLoading"
          content="点击重试按钮查看 Loading 效果。"
          @regenerate="startLoading"
        />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">原子组件 (独立使用)</div>
      <div class="preview-box">
        <div
          style="
            display: flex;
            gap: 16px;
            align-items: center;
            margin-bottom: 16px;
          "
        >
          <RegenerateButton @click="startLoading" :loading="isLoading" />
          <RegenerateButton disabled text="不可用" />
        </div>

        <div style="display: flex; gap: 16px; align-items: center">
          <FeedbackButton v-model="feedbackStatus" @change="onFeedbackChange" />
          <span style="font-size: 12px; color: #666"
            >当前状态: {{ feedbackStatus || "未评价" }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  MessageActions,
  RegenerateButton,
  FeedbackButton,
} from "../../../packages/src/index.js"; // Adjust path if needed
import { showToast } from "vant";

const router = useRouter();
const isLoading = ref(false);
const feedbackStatus = ref(null);

const onClickLeft = () => {
  router.back();
};

const onRegenerate = () => {
  showToast("触发重新生成");
};

const onFeedbackChange = (val) => {
  showToast(`评价: ${val || "取消"}`);
};

const startLoading = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    showToast("重试完成");
  }, 2000);
};
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  height: 100vh;
  background-color: #f7f8fa;
  overflow-y: auto;
}

.demo-page::-webkit-scrollbar {
  width: 6px;
}

.demo-page::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
  border-radius: 3px;
}

.demo-page::-webkit-scrollbar-track {
  background-color: transparent;
}

.demo-section {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
  padding-left: 16px;
}

.preview-box {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.mock-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
}
</style>
