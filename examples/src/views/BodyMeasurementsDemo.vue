<template>
  <div class="demo-page">
    <van-nav-bar
      title="BodyMeasurements 围度记录"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">我的围度</div>
      <BodyMeasurements :summary="summaryData" :history="historyData" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { BodyMeasurements } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const summaryData = ref([
  { label: "腰围", value: 72.5, unit: "cm", change: -1.5 },
  { label: "臀围", value: 94.0, unit: "cm", change: -0.5 },
  { label: "大腿围", value: 52.0, unit: "cm", change: 0 },
  { label: "臂围", value: 28.5, unit: "cm", change: +0.2 },
]);

const historyData = ref([
  { date: "12-25", data: { 腰围: 72.5, 臀围: 94.0, 大腿: 52.0 } },
  { date: "12-18", data: { 腰围: 73.0, 臀围: 94.2, 大腿: 52.2 } },
  { date: "12-11", data: { 腰围: 74.0, 臀围: 94.5, 大腿: 52.5 } },
  { date: "12-04", data: { 腰围: 74.2, 臀围: 94.5, 大腿: 52.5 } },
  { date: "11-27", data: { 腰围: 74.5, 臀围: 94.8, 大腿: 52.8 } },
]);
</script>

<style scoped>
.demo-page {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
  padding-bottom: 20px;
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
