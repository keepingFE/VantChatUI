<template>
  <div class="demo-page">
    <van-nav-bar
      title="FastingTimer 断食计时"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">今日断食 (进行中)</div>
      <FastingTimer
        :startTime="'20:00'"
        :endTime="'12:00'"
        :progress="progress"
        :timeLeft="timeLeft"
        :isFasting="true"
      />

      <div class="controls">
        <van-button size="small" @click="addTime">增加进度(演示)</van-button>
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">进食窗口</div>
      <FastingTimer
        :startTime="'12:00'"
        :endTime="'20:00'"
        :progress="100"
        :timeLeft="0"
        :isFasting="false"
        planName="自由进食"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { FastingTimer } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const timeLeft = ref(15642); // 4h 20m 42s
const progress = ref(72);

const timer = setInterval(() => {
  if (timeLeft.value > 0) timeLeft.value--;
}, 1000);

const addTime = () => {
  progress.value = (progress.value + 10) % 100;
};

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.demo-page {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.demo-page::-webkit-scrollbar {
  width: 6px;
}

.demo-page::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
  border-radius: 3px;
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

.controls {
  text-align: center;
  margin-top: 16px;
}
</style>
