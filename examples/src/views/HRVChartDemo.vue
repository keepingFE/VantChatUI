<template>
  <div class="demo-page">
    <van-nav-bar
      title="HRVChart 心率变异性"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">夜间 HRV 趋势 (状态良好)</div>
      <HRVChart :hrv-data="goodData" :baseline="55" />
    </div>

    <div class="demo-section">
      <div class="section-title">疲劳监测 (压力较大)</div>
      <HRVChart :hrv-data="stressData" :baseline="60" />
      <div class="tips">
        您的 HRV
        显著低于基准值，这可能意味着身体尚未从之前的训练或压力中恢复，建议减少运动强度，保证睡眠。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { HRVChart } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const generateData = (base, volatility) => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    const time = `12-${20 + i}`;
    const value = Math.round(base + (Math.random() - 0.5) * volatility);
    data.push({ time, value });
  }
  return data;
};

// 状态良好的数据：在 60 上下波动
const goodData = ref(generateData(60, 15));

// 压力较大的数据：在 40 上下波动，低于基准 60
const stressData = ref(generateData(40, 10));
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

.tips {
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}
</style>
