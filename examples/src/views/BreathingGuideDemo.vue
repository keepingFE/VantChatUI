<template>
  <div class="demo-page">
    <van-nav-bar
      title="BreathingGuide 呼吸训练"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="fullscreen-container">
      <BreathingGuide />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { BreathingGuide } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};
</script>

<style scoped>
.demo-page {
  height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.fullscreen-container {
  flex: 1;
  background: #fff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
  margin-top: 10px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.02);
}
</style>
