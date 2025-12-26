<template>
  <div class="body-measurements">
    <!-- 头部摘要 -->
    <div class="summary-cards">
      <div class="summary-card" v-for="(item, index) in summary" :key="index">
        <div class="label">{{ item.label }}</div>
        <div class="value-group">
          <span class="value">{{ item.value }}</span>
          <span class="unit">{{ item.unit }}</span>
        </div>
        <div class="change" :class="item.change >= 0 ? 'up' : 'down'">
          {{ item.change > 0 ? "+" : "" }}{{ item.change }}cm
        </div>
      </div>
    </div>

    <!-- 历史记录列表 -->
    <div class="history-list">
      <div class="list-header">历史记录</div>
      <div class="list-item" v-for="(record, index) in history" :key="index">
        <div class="date-col">
          <div class="date">{{ record.date }}</div>
        </div>
        <!-- 动态展示列 -->
        <div class="measure-col" v-for="(m, k) in record.data" :key="k">
          <div class="m-label">{{ k }}</div>
          <div class="m-value">{{ m }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BodyMeasurements",
  props: {
    summary: {
      type: Array, // [{ label: '腰围', value: 72, unit: 'cm', change: -1.5 }]
      default: () => [],
    },
    history: {
      type: Array, // [{ date: '10-24', data: { '腰围': 72, '臀围': 94 } }]
      default: () => [],
    },
  },
};
</script>

<style scoped>
.body-measurements {
  padding: 16px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.summary-cards {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.summary-card {
  flex: 0 0 100px;
  background: #f7f8fa;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.summary-card .label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.summary-card .value-group {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.summary-card .value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.summary-card .unit {
  font-size: 10px;
  color: #999;
  margin-left: 2px;
}

.summary-card .change {
  font-size: 10px;
  font-weight: 500;
}

.summary-card .change.down {
  color: #22c55e;
}
.summary-card .change.up {
  color: #ef4444;
}

.list-header {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f9f9f9;
}

.list-item:last-child {
  border-bottom: none;
}

.date-col {
  width: 60px;
  font-size: 12px;
  color: #999;
}

.measure-col {
  flex: 1;
  text-align: center;
}

.m-label {
  font-size: 10px;
  color: #ccc;
  margin-bottom: 2px;
}

.m-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}
</style>
