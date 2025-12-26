<template>
  <div class="demo-page">
    <van-nav-bar
      title="ECGChart 心电图"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
      z-index="99"
    />

    <div class="demo-content">
      <div class="section-title">实时监测</div>
      <ECGChart :bpm="75" />

      <div class="tips">模拟单导联实时波形，包含背景网格</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ECGChart } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.demo-page {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
}

.demo-content {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  margin-left: 4px;
}

.tips {
  margin-top: 16px;
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>
