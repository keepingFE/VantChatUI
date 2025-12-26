<template>
  <div class="fasting-timer">
    <div class="timer-circle-wrapper">
      <svg class="timer-svg" viewBox="0 0 200 200">
        <!-- 背景圆环 -->
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          class="circle-bg"
          stroke-width="12"
        />
        <!-- 进度圆环 -->
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          class="circle-progress"
          stroke-width="12"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
      <div class="timer-content">
        <div class="timer-status">{{ isFasting ? "断食中" : "进食窗口" }}</div>
        <div class="timer-countdown">{{ formattedTimeLeft }}</div>
        <div class="timer-percent">已完成 {{ progress }}%</div>
      </div>
    </div>

    <div class="time-info">
      <div class="time-block">
        <div class="label">开始时间</div>
        <div class="value">{{ startTime }}</div>
      </div>
      <div class="time-divider"></div>
      <div class="time-block">
        <div class="label">结束时间</div>
        <div class="value">{{ endTime }}</div>
      </div>
    </div>

    <div class="plan-tag">{{ planName }}</div>
  </div>
</template>

<script>
export default {
  name: "FastingTimer",
  props: {
    startTime: { type: String, default: "20:00" },
    endTime: { type: String, default: "12:00" },
    progress: { type: Number, default: 0 }, // 0 - 100
    timeLeft: { type: Number, default: 0 }, // seconds
    isFasting: { type: Boolean, default: true },
    planName: { type: String, default: "16:8 计划" },
  },
  computed: {
    radius() {
      return 88;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    dashOffset() {
      // progress 0 -> offset circumference
      // progress 100 -> offset 0
      return this.circumference * (1 - this.progress / 100);
    },
    formattedTimeLeft() {
      const h = Math.floor(this.timeLeft / 3600);
      const m = Math.floor((this.timeLeft % 3600) / 60);
      const s = this.timeLeft % 60;
      const pad = (n) => String(n).padStart(2, "0");
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    },
  },
};
</script>

<style scoped>
.fasting-timer {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.timer-circle-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  margin-bottom: 24px;
}

.timer-svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.circle-bg {
  stroke: #f3f4f6;
}

.circle-progress {
  stroke: #3b82f6; /* Default Blue */
  transition: stroke-dashoffset 0.5s ease;
}

.timer-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.timer-status {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
}

.timer-countdown {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  font-family: monospace;
  line-height: 1.2;
}

.timer-percent {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.time-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.time-block {
  text-align: center;
}

.time-block .label {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.time-block .value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.time-divider {
  height: 1px;
  width: 40px;
  background: #e2e8f0;
}

.plan-tag {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #edf6ff;
  color: #3b82f6;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 100px;
  font-weight: 600;
}
</style>
