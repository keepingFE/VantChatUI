<template>
  <div class="demo-page">
    <van-nav-bar
      title="BodyFatScale 体脂称"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">最新测量</div>
      <BodyFatScale
        :body-fat="18.5"
        update-time="今天 08:30"
        :metrics="metrics"
      />
    </div>

    <div class="demo-section">
      <div class="section-title">上次测量 (偏胖警告)</div>
      <BodyFatScale
        :body-fat="26.2"
        update-time="昨天 09:12"
        :metrics="metricsWarning"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { BodyFatScale } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const metrics = [
  {
    name: "肌肉量",
    value: 52.4,
    unit: "kg",
    icon: "fire-o",
    color: "#ef4444",
    status: "优",
    statusColor: "#22c55e",
  },
  {
    name: "水分",
    value: 65.2,
    unit: "%",
    icon: "revoke",
    color: "#3b82f6",
    status: "标准",
    statusColor: "#3b82f6",
  },
  {
    name: "骨量",
    value: 3.2,
    unit: "kg",
    icon: "diamond-o",
    color: "#a855f7",
    status: "标准",
    statusColor: "#3b82f6",
  },
  {
    name: "基础代谢",
    value: 1650,
    unit: "kcal",
    icon: "clock-o",
    color: "#f59e0b",
    status: "偏高",
    statusColor: "#f97316",
  },
];

const metricsWarning = [
  {
    name: "肌肉量",
    value: 48.0,
    unit: "kg",
    icon: "fire-o",
    color: "#ef4444",
    status: "低",
    statusColor: "#ef4444",
  },
  {
    name: "水分",
    value: 55.0,
    unit: "%",
    icon: "revoke",
    color: "#3b82f6",
    status: "低",
    statusColor: "#ef4444",
  },
  {
    name: "骨量",
    value: 2.9,
    unit: "kg",
    icon: "diamond-o",
    color: "#a855f7",
    status: "低",
    statusColor: "#ef4444",
  },
  {
    name: "基础代谢",
    value: 1400,
    unit: "kcal",
    icon: "clock-o",
    color: "#f59e0b",
    status: "低",
    statusColor: "#ef4444",
  },
];
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
