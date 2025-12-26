<template>
  <div class="demo-page">
    <van-nav-bar
      title="ExerciseDetailCard 运动详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">户外跑步</div>
      <ExerciseDetailCard :data="runData" />
    </div>

    <div class="demo-section">
      <div class="section-title">瑜伽练习</div>
      <ExerciseDetailCard :data="yogaData" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ExerciseDetailCard } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const runData = ref({
  type: "running",
  startTime: "今天 07:30",
  duration: 45, // 45分钟
  calories: 420,
  distance: 5.2,
  avgHeartRate: 145,
  pace: "5'42''",
  zones: [
    { name: "极限", percent: 5, time: "2分", color: "#ef4444" },
    { name: "无氧", percent: 25, time: "11分", color: "#f97316" },
    { name: "有氧", percent: 45, time: "20分", color: "#eab308" },
    { name: "燃脂", percent: 20, time: "9分", color: "#22c55e" },
    { name: "热身", percent: 5, time: "3分", color: "#3b82f6" },
  ],
});

const yogaData = ref({
  type: "yoga",
  startTime: "昨天 19:00",
  duration: 60,
  calories: 180,
  avgHeartRate: 95,
  zones: [
    { name: "燃脂", percent: 10, time: "6分", color: "#22c55e" },
    { name: "热身", percent: 90, time: "54分", color: "#3b82f6" },
  ],
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
</style>
