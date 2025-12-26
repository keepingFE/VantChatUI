<template>
  <div class="demo-page">
    <van-nav-bar
      title="WorkoutPaceChart 配速曲线"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">5公里跑</div>
      <WorkoutPaceChart :data="runData" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { WorkoutPaceChart } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

// Generate dummy data
const runData = ref([]);
for (let i = 1; i <= 20; i++) {
  runData.value.push({
    x: (i * 0.25).toFixed(2) + "km",
    pace: 300 + Math.random() * 60, // 5'00" - 6'00"
    elevation: 10 + Math.random() * 5 + i,
  });
}
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
