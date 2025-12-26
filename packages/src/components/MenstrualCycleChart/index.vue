<template>
  <div class="menstrual-cycle-chart">
    <!-- 头部信息 -->
    <div class="cycle-summary">
      <div class="status-main">
        <span v-if="daysUntilNext > 0">距离下次月经还有</span>
        <span v-else-if="daysUntilNext === 0">预计今天开始</span>
        <span v-else>月经第 {{ -daysUntilNext + 1 }} 天</span>
      </div>
      <div class="status-count" :class="{ highlight: daysUntilNext <= 3 }">
        {{ Math.abs(daysUntilNext) }}
        <span class="unit">天</span>
      </div>
      <div class="status-desc">{{ currentPhaseText }}</div>
    </div>

    <!-- 日历头部 -->
    <div class="calendar-header">
      <div class="month-selector">
        <div class="nav-btn" @click="changeMonth(-1)">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div class="current-month">{{ currentYear }}年{{ currentMonth }}月</div>
        <div class="nav-btn" @click="changeMonth(1)">
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
      <div
        v-for="n in startDayOfWeek"
        :key="'prev-' + n"
        class="calendar-cell placeholder"
      ></div>

      <div
        v-for="date in daysInMonth"
        :key="date"
        class="calendar-cell"
        :class="getDateClass(date)"
        @click="handleDateClick(date)"
      >
        <div class="date-number">{{ date }}</div>
        <div class="marker-dot"></div>
        <div class="today-indicator" v-if="isToday(date)"></div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="legend-panel">
      <div class="legend-item">
        <span class="dot period"></span>
        <span>月经期</span>
      </div>
      <div class="legend-item">
        <span class="dot predicted"></span>
        <span>预测期</span>
      </div>
      <div class="legend-item">
        <span class="dot fertile"></span>
        <span>易孕期</span>
      </div>
      <div class="legend-item">
        <span class="dot ovulation"></span>
        <span>排卵日</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenstrualCycleChart",
  props: {
    /**
     * 最近一次月经开始日期 (YYYY-MM-DD)
     */
    lastPeriodDate: {
      type: String,
      required: true,
    },
    /**
     * 平均周期长度 (天)
     */
    cycleLength: {
      type: Number,
      default: 28,
    },
    /**
     * 月经持续天数 (天)
     */
    periodLength: {
      type: Number,
      default: 5,
    },
  },
  data() {
    const now = new Date();
    return {
      currentDate: now,
      weekDays: ["日", "一", "二", "三", "四", "五", "六"],
      selectedDate: null,
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
      return new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
    },

    // 计算下一周期开始日期
    nextPeriodStartDate() {
      const last = new Date(this.lastPeriodDate);
      // 简单推算：增加一个周期
      const next = new Date(
        last.getTime() + this.cycleLength * 24 * 60 * 60 * 1000
      );
      return next;
    },

    daysUntilNext() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 如果最近一次月经还没结束，且今天在其中
      const lastStart = new Date(this.lastPeriodDate);
      const lastEnd = new Date(
        lastStart.getTime() + (this.periodLength - 1) * 24 * 3600 * 1000
      );

      if (today >= lastStart && today <= lastEnd) {
        const diff = Math.floor((today - lastStart) / (24 * 3600 * 1000));
        return -diff; // 返回负数表示第几天（0是第一天，-1是第二天，方便显示逻辑调整）
      }

      // 找未来最近的一次
      let next = new Date(this.nextPeriodStartDate);
      // 如果预测的下次已经过了，继续往后推（简单逻辑）
      while (next < today) {
        next = new Date(next.getTime() + this.cycleLength * 24 * 3600 * 1000);
      }

      const diff = Math.ceil((next - today) / (24 * 3600 * 1000));
      return diff;
    },

    currentPhaseText() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const status = this.getDayStatus(today);
      if (status.isPeriod) return "月经期";
      if (status.isOvulation) return "排卵日";
      if (status.isFertile) return "易孕期";
      if (status.isSafety) return "安全期";
      return "预测期";
    },
  },
  methods: {
    changeMonth(delta) {
      this.currentDate = new Date(
        this.currentYear,
        this.currentMonth - 1 + delta,
        1
      );
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

    // 核心算法：判断某一天的状态
    getDayStatus(dateObj) {
      const lastStart = new Date(this.lastPeriodDate);
      lastStart.setHours(0, 0, 0, 0);
      dateObj.setHours(0, 0, 0, 0);

      // 计算该日期相对于最近一次月经的天数差
      const diffTime = dateObj.getTime() - lastStart.getTime();
      const diffDays = Math.floor(diffTime / (24 * 3600 * 1000));

      // 所在的周期数（负数代表过去）
      const cycleIndex = Math.floor(diffDays / this.cycleLength);
      // 在当前周期内的第几天 (0 ~ cycleLength-1)
      let dayInCycle = diffDays % this.cycleLength;
      if (dayInCycle < 0) dayInCycle += this.cycleLength;

      // 1. 月经期 (1 ~ periodLength)
      const isPeriod = dayInCycle < this.periodLength;

      // 2. 排卵日 (倒数第14天左右，即 cycleLength - 14)
      const ovulationDay = this.cycleLength - 14;
      const isOvulation = dayInCycle === ovulationDay;

      // 3. 易孕期 (排卵日前5天 + 后4天 = 10天窗口，或者更窄前4后1)
      // 通用算法：排卵日前5天到排卵日后4天
      const isFertile =
        dayInCycle >= ovulationDay - 5 && dayInCycle <= ovulationDay + 4;

      // 区分是"预测"还是"历史"（根据是否在今天之后）
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isFuture = dateObj > today;

      return { isPeriod, isOvulation, isFertile, isFuture };
    },

    getDateClass(date) {
      const dateObj = new Date(this.currentYear, this.currentMonth - 1, date);
      const status = this.getDayStatus(dateObj);

      const classes = [];

      if (status.isPeriod) {
        // 如果是预测的未来月经
        classes.push(status.isFuture ? "is-predicted-period" : "is-period");
      } else if (status.isOvulation) {
        classes.push("is-ovulation");
      } else if (status.isFertile) {
        classes.push("is-fertile");
      }

      return classes;
    },

    handleDateClick(date) {
      this.selectedDate = date;
      const dateObj = new Date(this.currentYear, this.currentMonth - 1, date);
      const status = this.getDayStatus(dateObj);
      this.$emit("click-date", {
        date: this.formatDate(date),
        status,
      });
    },
  },
};
</script>

<style scoped>
.menstrual-cycle-chart {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  user-select: none;
}

.cycle-summary {
  text-align: center;
  margin-bottom: 24px;
  padding: 8px 0;
}

.status-main {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.status-count {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
  margin-bottom: 4px;
}

.status-count.highlight {
  color: #fb7185;
}

.status-count .unit {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
  margin-left: 2px;
}

.status-desc {
  font-size: 14px;
  color: #fb7185;
  font-weight: 500;
  background: #fff1f2;
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
}

.calendar-header {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-month {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 100px;
  text-align: center;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f8fafc;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  color: #333;
  transition: all 0.2s;
}

.calendar-cell.placeholder {
  pointer-events: none;
}

/* 状态样式 */
.calendar-cell.is-period {
  background-color: #fb7185;
  color: #fff;
  box-shadow: 0 2px 8px rgba(251, 113, 133, 0.3);
}

.calendar-cell.is-predicted-period {
  background-color: #fecdd3;
  color: #be123c;
  border: 1px dashed #fb7185;
}

.calendar-cell.is-fertile {
  /* background-color: #f3e8ff; */
  /* color: #9333ea; */
  position: relative;
}

.calendar-cell.is-fertile::after {
  content: "";
  position: absolute;
  bottom: 4px;
  width: 4px;
  height: 4px;
  background: #a855f7;
  border-radius: 50%;
}

.calendar-cell.is-ovulation {
  border: 2px solid #a855f7;
  background: #f3e8ff;
  color: #7e22ce;
  font-weight: bold;
}

.calendar-cell.is-ovulation::after {
  display: none;
}

.today-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  background-color: #3b82f6;
  border-radius: 50%;
  border: 1px solid #fff;
}

.legend-panel {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.dot.period {
  background: #fb7185;
}
.dot.predicted {
  background: #fecdd3;
  border: 1px dashed #fb7185;
  box-sizing: border-box;
}
.dot.fertile {
  background: #a855f7;
}
.dot.ovulation {
  border: 2px solid #a855f7;
  background: #f3e8ff;
  box-sizing: border-box;
}
</style>
