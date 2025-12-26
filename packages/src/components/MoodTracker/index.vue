<template>
  <div class="mood-tracker">
    <!-- 头部月份切换 -->
    <div class="calendar-header">
      <div class="month-title">{{ currentYear }}年{{ currentMonth }}月</div>
      <div class="header-actions">
        <div class="nav-btn" @click="prevMonth">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="nav-btn" @click="nextMonth">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 星期表头 -->
    <div class="week-header">
      <div v-for="day in weekDays" :key="day" class="week-day">{{ day }}</div>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <!-- 上个月的占位 -->
      <div
        v-for="n in startDayOfWeek"
        :key="'prev-' + n"
        class="calendar-cell placeholder"
      ></div>

      <!-- 当月日期 -->
      <div
        v-for="date in daysInMonth"
        :key="date"
        class="calendar-cell"
        :class="{ today: isToday(date), 'has-mood': getMood(date) }"
        @click="handleDateClick(date)"
      >
        <div class="date-number">{{ date }}</div>
        <div v-if="getMood(date)" class="mood-indicator">
          <span class="mood-emoji">{{ getMoodIcon(getMood(date).mood) }}</span>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="mood-stats" v-if="hasMoodData">
      <div class="stat-title">本月心情分布</div>
      <div class="stat-bar">
        <div
          v-for="(stat, index) in moodStats"
          :key="index"
          class="stat-segment"
          :style="{ width: stat.percentage + '%', backgroundColor: stat.color }"
        ></div>
      </div>
      <div class="stat-legend">
        <div
          v-for="(stat, index) in moodStats"
          :key="index"
          class="legend-item"
        >
          <span
            class="legend-dot"
            :style="{ backgroundColor: stat.color }"
          ></span>
          <span class="legend-label">{{ stat.label }}</span>
          <span class="legend-count">{{ stat.count }}天</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MoodTracker",
  props: {
    /**
     * 心情数据
     * @type {Array<{date: string, mood: string, note?: string}>}
     * date format: 'YYYY-MM-DD'
     */
    moodData: {
      type: Array,
      default: () => [],
    },
    /**
     * 心情配置映射
     */
    moodConfig: {
      type: Object,
      default: () => ({
        happy: { icon: "😄", color: "#4ade80", label: "开心" },
        neutral: { icon: "😐", color: "#60a5fa", label: "平静" },
        sad: { icon: "😔", color: "#94a3b8", label: "低落" },
        angry: { icon: "😡", color: "#f87171", label: "生气" },
        anxious: { icon: "😰", color: "#fbbf24", label: "焦虑" },
      }),
    },
  },
  data() {
    const now = new Date();
    return {
      currentDate: now,
      weekDays: ["日", "一", "二", "三", "四", "五", "六"],
    };
  },
  computed: {
    currentYear() {
      return this.currentDate.getFullYear();
    },
    currentMonth() {
      return this.currentDate.getMonth() + 1;
    },
    daysInMonth() {
      return new Date(this.currentYear, this.currentMonth, 0).getDate();
    },
    startDayOfWeek() {
      // 获取当月1号是星期几 (0-6)
      return new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
    },
    currentMonthData() {
      const prefix = `${this.currentYear}-${String(this.currentMonth).padStart(
        2,
        "0"
      )}`;
      return this.moodData.filter((item) => item.date.startsWith(prefix));
    },
    hasMoodData() {
      return this.currentMonthData.length > 0;
    },
    moodStats() {
      const stats = {};
      const total = this.currentMonthData.length;

      this.currentMonthData.forEach((item) => {
        if (!stats[item.mood]) {
          stats[item.mood] = 0;
        }
        stats[item.mood]++;
      });

      return Object.keys(stats)
        .map((mood) => {
          const config = this.moodConfig[mood] || {
            color: "#ccc",
            label: mood,
          };
          return {
            mood,
            count: stats[mood],
            percentage: (stats[mood] / total) * 100,
            color: config.color,
            label: config.label,
          };
        })
        .sort((a, b) => b.count - a.count); // 按数量降序
    },
  },
  methods: {
    prevMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 2, 1);
    },
    nextMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth, 1);
    },
    isToday(date) {
      const now = new Date();
      return (
        now.getDate() === date &&
        now.getMonth() === this.currentMonth - 1 &&
        now.getFullYear() === this.currentYear
      );
    },
    formatDate(date) {
      return `${this.currentYear}-${String(this.currentMonth).padStart(
        2,
        "0"
      )}-${String(date).padStart(2, "0")}`;
    },
    getMood(date) {
      const dateStr = this.formatDate(date);
      return this.moodData.find((item) => item.date === dateStr);
    },
    getMoodIcon(mood) {
      return this.moodConfig[mood]?.icon || "❓";
    },
    handleDateClick(date) {
      const dateStr = this.formatDate(date);
      const moodItem = this.getMood(date);
      this.$emit("click-date", { date: dateStr, moodItem });
    },
  },
};
</script>

<style scoped>
.mood-tracker {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  user-select: none;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.month-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.nav-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-btn:active {
  background: #e2e8f0;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.week-day {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  padding: 4px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.calendar-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  background: #f8fafc;
  transition: all 0.2s;
}

.calendar-cell.placeholder {
  background: transparent;
  cursor: default;
}

.calendar-cell:not(.placeholder):active {
  transform: scale(0.95);
}

.calendar-cell.today {
  border: 1px solid #3b82f6;
  background: #eff6ff;
}

.date-number {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.mood-indicator {
  margin-top: 2px;
}

.mood-emoji {
  font-size: 14px;
  line-height: 1;
}

/* 统计区域 */
.mood-stats {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.stat-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.stat-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  margin-bottom: 12px;
}

.stat-segment {
  height: 100%;
}

.stat-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.legend-label {
  color: #64748b;
  margin-right: 4px;
}

.legend-count {
  color: #333;
  font-weight: 500;
}
</style>
