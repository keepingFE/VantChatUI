<template>
  <div class="demo-page">
    <van-nav-bar
      title="TemperatureChart 体温趋势"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">基础体温记录 (BBT)</div>
      <TemperatureChart :temperature-data="bbtData" />
    </div>

    <div class="demo-section">
      <div class="section-title">发热监测 (模拟)</div>
      <TemperatureChart :temperature-data="feverData" :fever-threshold="37.3" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { TemperatureChart } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

// 模拟基础体温数据 (正常排卵周期)
const generateBBTData = () => {
  const data = [];
  // 假设 14天低温，14天高温
  for (let i = 1; i <= 28; i++) {
    let temp;
    if (i < 14) {
      // 卵泡期低温 36.4 - 36.6
      temp = 36.4 + Math.random() * 0.2;
    } else if (i === 14) {
      // 排卵日最低
      temp = 36.2 + Math.random() * 0.1;
    } else {
      // 黄体期高温 36.8 - 37.1
      temp = 36.8 + Math.random() * 0.3;
    }

    data.push({
      time: `12-${String(i).padStart(2, "0")}`,
      value: Number(temp.toFixed(2)),
    });
  }
  return data;
};

// 模拟发热数据
const feverData = ref([
  { time: "08:00", value: 36.8 },
  { time: "12:00", value: 37.2 },
  { time: "16:00", value: 38.5 },
  { time: "20:00", value: 39.1 },
  { time: "22:00", value: 38.8 },
  { time: "02:00", value: 38.0 },
  { time: "08:00", value: 37.4 },
]);

const bbtData = ref(generateBBTData());
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
