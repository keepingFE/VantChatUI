<template>
  <div class="demo-page">
    <van-nav-bar
      title="StressLevelChart 压力水平"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">今日压力概览</div>
      <StressLevelChart :stress-data="stressData" />
    </div>

    <div class="demo-tips">
      <p>压力数值说明：</p>
      <ul>
        <li>
          <span class="dot" style="background: #3b82f6"></span> 1-29: 放松
        </li>
        <li>
          <span class="dot" style="background: #22c55e"></span> 30-59: 正常
        </li>
        <li>
          <span class="dot" style="background: #f97316"></span> 60-79: 中等
        </li>
        <li>
          <span class="dot" style="background: #ef4444"></span> 80-100: 偏高
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { StressLevelChart } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const generateData = () => {
  const data = [];
  const baseHour = 8; // 8:00 AM start

  for (let i = 0; i < 16; i++) {
    // 每小时 generate 一个数据
    const hour = baseHour + i;
    const time = `${hour}:00`;

    let value = Math.floor(Math.random() * 60) + 20; // 20-80 base

    // 模拟特定时间段压力大
    if (hour >= 10 && hour <= 11) value += 20; // morning work
    if (hour >= 14 && hour <= 15) value += 15; // afternoon
    if (hour >= 20) value -= 20; // evening relax

    if (value > 99) value = 99;
    if (value < 5) value = 5;

    data.push({ time, value });
  }
  return data;
};

const stressData = ref(generateData());
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

.demo-tips {
  padding: 16px 24px;
  font-size: 12px;
  color: #999;
}

.demo-tips p {
  margin-bottom: 8px;
  color: #666;
}

.demo-tips ul {
  list-style: none;
  padding: 0;
}

.demo-tips li {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
</style>
