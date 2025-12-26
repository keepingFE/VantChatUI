<template>
  <div class="demo-page">
    <van-nav-bar
      title="HabitTracker 习惯打卡"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">冥想打卡 (年度热力图)</div>
      <HabitTracker :data="meditationData" />
    </div>

    <div class="demo-section">
      <div class="section-title">阅读打卡</div>
      <HabitTracker :data="readingData" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { HabitTracker } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const generateData = (intensity) => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    let count = 0;
    if (Math.random() > 0.3) {
      count = Math.floor(Math.random() * intensity); // 0 to intensity
    }

    if (count > 0) {
      data.push({ date: dateStr, count });
    }
  }
  return data;
};

const meditationData = ref(generateData(3));
const readingData = ref(generateData(6));
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
