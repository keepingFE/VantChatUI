<template>
  <div class="demo-page">
    <van-nav-bar
      title="ErrorMessage 错误提示"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="demo-section">
      <div class="section-title">基础用法</div>
      <div class="preview-box">
        <ErrorMessage @retry="onRetry" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">自定义消息</div>
      <div class="preview-box">
        <ErrorMessage message="网络连接超时，请检查网络设置" @retry="onRetry" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">无重试按钮</div>
      <div class="preview-box">
        <ErrorMessage message="该内容涉及敏感信息，无法回答" :retry="false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ErrorMessage } from "../../../packages/src/index.js"; // Adjust path if needed
import { showToast } from "vant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const onRetry = () => {
  showToast("点击了重试");
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
</style>
