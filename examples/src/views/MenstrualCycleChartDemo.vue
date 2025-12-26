<template>
  <div class="demo-page">
    <van-nav-bar
      title="MenstrualCycleChart 经期日历"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">生理周期追踪</div>

      <MenstrualCycleChart
        :last-period-date="lastPeriodDate"
        :cycle-length="cycleLength"
        :period-length="periodLength"
        @click-date="handleDateClick"
      />
    </div>

    <div class="demo-section">
      <div class="settings-panel">
        <div class="panel-title">周期设置</div>

        <van-field
          label="最近经期"
          :model-value="lastPeriodDate"
          readonly
          is-link
          @click="showCalendar = true"
        />

        <van-field label="周期长度">
          <template #input>
            <van-stepper v-model="cycleLength" :min="21" :max="45" />
            <span class="unit">天</span>
          </template>
        </van-field>

        <van-field label="经期长度">
          <template #input>
            <van-stepper v-model="periodLength" :min="3" :max="10" />
            <span class="unit">天</span>
          </template>
        </van-field>
      </div>
    </div>

    <!-- 日期选择器 -->
    <van-calendar v-model:show="showCalendar" @confirm="onConfirm" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { MenstrualCycleChart } from "chatvant";
import { showToast } from "vant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const lastPeriodDate = ref("2025-12-05"); // 假设上一次是 12月05日
const cycleLength = ref(28);
const periodLength = ref(5);
const showCalendar = ref(false);

const onConfirm = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  lastPeriodDate.value = `${year}-${month}-${day}`;
  showCalendar.value = false;
};

const handleDateClick = ({ date, status }) => {
  let msg = `选中日期：${date}`;
  if (status.isPeriod) msg += " [预计经期]";
  if (status.isOvulation) msg += " [排卵日]";
  if (status.isFertile) msg += " [易孕期]";
  showToast(msg);
};
</script>

<style scoped>
.demo-page {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
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

.settings-panel {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.panel-title {
  padding: 16px 16px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.unit {
  margin-left: 8px;
  color: #666;
  font-size: 14px;
}
</style>
