<template>
  <div class="demo-page">
    <van-nav-bar
      title="RunningDashboard 运动仪表盘"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
      z-index="99"
    />

    <div class="demo-content">
      <RunningDashboard
        :status="status"
        :distance="distance"
        :duration="duration"
        :pace="pace"
        :calories="calories"
        :heart-rate="heartRate"
        :cadence="cadence"
        @start="handleStart"
        @pause="handlePause"
        @resume="handleResume"
        @stop="handleStop"
      />

      <div class="tips">
        提示：这是一个用于演示的仪表盘。点击“开始”或图标按钮可模拟运动状态变化。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { RunningDashboard } from "chatvant";
import { showToast } from "vant";

const router = useRouter();

const status = ref("idle");
const duration = ref(0);
const distance = ref(0);
const calories = ref(0);
const heartRate = ref(80);
const cadence = ref(0);
let timer = null;

const pace = computed(() => {
  // 简单模拟配速：5'30" 左右
  return "5'32\"";
});

const onClickLeft = () => {
  router.back();
};

const handleStart = () => {
  status.value = "running";
  startTimer();
  showToast("运动开始");
};

const handlePause = () => {
  status.value = "paused";
  stopTimer();
  showToast("运动暂停");
};

const handleResume = () => {
  status.value = "running";
  startTimer();
  showToast("运动继续");
};

const handleStop = () => {
  status.value = "idle";
  stopTimer();
  // Reset or summaries
  duration.value = 0;
  distance.value = 0;
  calories.value = 0;
  heartRate.value = 80;
  showToast("运动结束");
};

const startTimer = () => {
  if (timer) return;
  timer = setInterval(() => {
    duration.value++;

    // Simulate data changes
    distance.value += 0.003; // ~10km/h
    calories.value += 0.15;

    // Simulate heart rate fluctuation
    const baseHR = 145;
    const noise = Math.floor(Math.random() * 10) - 5;
    heartRate.value = baseHR + noise;

    cadence.value = 175 + Math.floor(Math.random() * 6);
  }, 1000);
};

const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
.demo-page {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
}

.demo-content {
  padding: 16px;
  padding-top: 20px;
}

.tips {
  margin-top: 20px;
  color: #666;
  font-size: 12px;
  text-align: center;
}
</style>
