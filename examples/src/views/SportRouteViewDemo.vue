<template>
  <div class="demo-page">
    <van-nav-bar
      title="SportRouteView 轨迹回放"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">晨跑轨迹</div>
      <SportRouteView />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { SportRouteView } from "chatvant";

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
  padding-bottom: 20px;
}

.demo-section {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  margin-left: 4px;
}
</style>
