<template>
  <div class="demo-page">
    <van-nav-bar
      title="HealthScoreCard 健康评分"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">高分状态</div>
      <HealthScoreCard
        :score="88"
        :dimensions="goodDimensions"
        date="2025-12-26 20:00"
        compare-text="比昨天提升 2 分"
        compare-trend="up"
      />
    </div>

    <div class="demo-section">
      <div class="section-title">一般状态</div>
      <HealthScoreCard
        :score="65"
        :dimensions="avgDimensions"
        date="2025-12-25 18:00"
        compare-text="睡眠不足，注意休息"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { HealthScoreCard } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const goodDimensions = ref([
  {
    label: "BMI",
    score: 95,
    valueText: "22.4 (正常)",
    status: "good",
    color: "#22c55e",
  },
  {
    label: "睡眠",
    score: 90,
    valueText: "7.5小时 (充足)",
    status: "good",
    color: "#22c55e",
  },
  {
    label: "步数",
    score: 80,
    valueText: "8432步 (达标)",
    status: "good",
    color: "#3b82f6",
  },
]);

const avgDimensions = ref([
  {
    label: "BMI",
    score: 60,
    valueText: "26.1 (偏胖)",
    status: "warning",
    color: "#eab308",
  },
  {
    label: "睡眠",
    score: 40,
    valueText: "5.2小时 (不足)",
    status: "danger",
    color: "#ef4444",
  },
  {
    label: "步数",
    score: 85,
    valueText: "10231步 (优秀)",
    status: "good",
    color: "#22c55e",
  },
]);
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
