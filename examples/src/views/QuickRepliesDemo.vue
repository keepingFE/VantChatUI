<template>
  <div class="demo-page">
    <van-nav-bar
      title="QuickReplies 快捷回复"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="demo-section">
      <div class="section-title">基础用法</div>
      <div class="preview-box">
        <QuickReplies :items="baseItems" @select="handleSelect" />
        <div class="log-box" v-if="lastSelected">
          已点击: {{ lastSelected }}
        </div>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">可滚动长列表</div>
      <div class="preview-box">
        <QuickReplies :items="longItems" @select="handleSelect" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">模拟对话场景</div>
      <div class="chat-preview">
        <div class="chat-content">
          <div class="msg-balloon left">
            你好！我是 AI 助手，有什么可以帮你的吗？
          </div>
        </div>
        <!-- 放置在底部的快捷回复 -->
        <QuickReplies
          :items="chatItems"
          style="background: #f7f8fa"
          @select="handleSelect"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { QuickReplies } from "../../../packages/src/index.js"; // Adjust path if needed
import { showToast } from "vant";

const router = useRouter();
const lastSelected = ref("");

const baseItems = ["写一首诗", "讲个笑话", "翻译文本"];

const longItems = [
  "如何学习 Vue3",
  "解释量子纠缠",
  "推荐一部电影",
  "今天天气怎么样",
  "生成 Python 代码",
  "写一封邮件",
  "制定旅行计划",
  "分析财报",
];

const chatItems = ["功能介绍", "联系客服", "重置对话", "帮助"];

const onClickLeft = () => {
  router.back();
};

const handleSelect = (item) => {
  const text = typeof item === "string" ? item : item.label;
  lastSelected.value = text;
  showToast(`点击了: ${text}`);
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
  padding: 16px 0; /* 上下内边距，左右由组件自己控制 */
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.log-box {
  margin-top: 12px;
  padding: 0 16px;
  font-size: 12px;
  color: #666;
}

.chat-preview {
  height: 200px;
  background: #f7f8fa;
  border-radius: 8px;
  border: 1px solid #ebedf0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-content {
  flex: 1;
  padding: 16px;
}

.msg-balloon {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 0 12px 12px 12px;
  background: #fff;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
