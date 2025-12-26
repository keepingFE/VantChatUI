<template>
  <div class="demo-page">
    <van-nav-bar
      title="BloodSugarChart 血糖趋势图"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">基础用法</div>
      <div class="chart-wrapper">
        <BloodSugarChart :sugar-data="sugarData" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">模拟数据更新</div>
      <div class="control-panel">
        <van-button type="primary" size="small" @click="refreshData"
          >刷新数据</van-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { BloodSugarChart } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const generateData = () => {
  const data = [];
  const types = ["fasting", "after_meal", "before_meal", "other"];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    // 每天生成 2-4 条数据
    const count = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < count; j++) {
      const time = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      time.setHours(7 + j * 5); // 7am, 12pm, 5pm...

      let type;
      if (j === 0) type = "fasting";
      else if (j === 1) type = "after_meal"; // lunch
      else type = "before_meal"; // dinner

      // 模拟数值
      let value;
      if (type === "fasting" || type === "before_meal") {
        value = (3.5 + Math.random() * 3.5).toFixed(1); // 3.5 - 7.0
      } else {
        value = (5.0 + Math.random() * 5.0).toFixed(1); // 5.0 - 10.0
      }

      data.push({
        date: `${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${
          time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
        }`,
        value: parseFloat(value),
        type: type,
      });
    }
  }
  return data;
};

const sugarData = ref(generateData());

const refreshData = () => {
  sugarData.value = generateData();
};
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
  margin: 16px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  margin-left: 4px;
}

.chart-wrapper {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
}

.control-panel {
  display: flex;
  justify-content: center;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
}
</style>
