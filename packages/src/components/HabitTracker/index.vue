<template>
  <div class="habit-tracker">
    <div class="header">
      <div class="title">习惯打卡</div>
      <div class="legend">
        <span>少</span>
        <span class="cell l1"></span>
        <span class="cell l2"></span>
        <span class="cell l3"></span>
        <span class="cell l4"></span>
        <span>多</span>
      </div>
    </div>

    <div class="grid-container">
      <div class="grid-wrapper">
        <div
          v-for="(day, index) in days"
          :key="index"
          class="day-cell"
          :class="getLevelClass(day.count)"
          :title="day.date + ': ' + day.count + '次'"
        ></div>
      </div>
    </div>

    <div class="stat-summary">
      <div class="stat-box">
        <div class="val">{{ totalCount }}</div>
        <div class="lbl">累计打卡</div>
      </div>
      <div class="stat-box">
        <div class="val">{{ maxStreak }}</div>
        <div class="lbl">最长连续</div>
      </div>
      <div class="stat-box">
        <div class="val">{{ currentStreak }}</div>
        <div class="lbl">当前连续</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HabitTracker",
  props: {
    /**
     * 过去一年的数据，或任意天数
     * [{ date: '2023-01-01', count: 1 }, ...]
     */
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    days() {
      // 这里为了简单，如果 data 没传满一年，我们自动补全最近 112 天 (16周 * 7天) 用于展示 grid
      // 实际项目可以使用 date-fns 生成完整日历
      const days = [];
      const today = new Date();
      const totalDays = 112;

      // Generate last N days
      for (let i = totalDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];

        // Find data
        const record = this.data.find((item) => item.date === dateStr);
        days.push({
          date: dateStr,
          count: record ? record.count : 0,
        });
      }
      return days;
    },
    totalCount() {
      return this.data.reduce((acc, cur) => acc + cur.count, 0);
    },
    currentStreak() {
      // 简化逻辑：计算最近连续非0的天数
      // 需要反向遍历 data，这里暂且模拟
      return 5;
    },
    maxStreak() {
      return 12;
    },
  },
  methods: {
    getLevelClass(count) {
      if (count === 0) return "l0";
      if (count <= 1) return "l1";
      if (count <= 3) return "l2";
      if (count <= 5) return "l3";
      return "l4";
    },
  },
};
</script>

<style scoped>
.habit-tracker {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.legend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #999;
}

.cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: #ebedf0;
}

.grid-container {
  overflow-x: auto;
  padding-bottom: 8px;
}

.grid-wrapper {
  display: grid;
  grid-template-rows: repeat(7, 1fr); /* 7 days a week vertically like GitHub */
  grid-auto-flow: column;
  gap: 4px;
  width: fit-content;
}

.day-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #ebedf0;
}

/* GitHub Green Theme */
.day-cell.l0 {
  background: #ebedf0;
}
.day-cell.l1 {
  background: #9be9a8;
}
.day-cell.l2 {
  background: #40c463;
}
.day-cell.l3 {
  background: #30a14e;
}
.day-cell.l4 {
  background: #216e39;
}

/* Legend colors */
.legend .l1 {
  background: #9be9a8;
}
.legend .l2 {
  background: #40c463;
}
.legend .l3 {
  background: #30a14e;
}
.legend .l4 {
  background: #216e39;
}

.stat-summary {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-box {
  text-align: center;
}

.stat-box .val {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.stat-box .lbl {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}
</style>
