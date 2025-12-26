<template>
  <div class="running-dashboard" :class="status">
    <!-- 顶部地图占位 (可选) -->
    <div class="map-placeholder" v-if="showMap">
      <van-icon name="location" class="map-icon" />
      <span class="map-text">GPS 信号强</span>
    </div>

    <!-- 核心数据区 -->
    <div class="main-stats">
      <div class="stat-big">
        <div class="label">距离 (km)</div>
        <div class="value">{{ distance.toFixed(2) }}</div>
      </div>
      <div class="stat-big">
        <div class="label">时长</div>
        <div class="value duration">{{ formattedDuration }}</div>
      </div>
    </div>

    <!-- 次要数据网格 -->
    <div class="sub-stats-grid">
      <div class="stat-item">
        <div class="sub-label">配速</div>
        <div class="sub-value">{{ pace }}</div>
      </div>
      <div class="stat-item">
        <div class="sub-label">卡路里</div>
        <div class="sub-value">{{ calories.toFixed(2) }}</div>
      </div>
      <div class="stat-item heart-rate" :style="{ color: heartRateColor }">
        <div class="sub-label">心率</div>
        <div class="sub-value">
          <van-icon name="like" class="heart-icon" />{{ heartRate }}
        </div>
        <div class="zone-tag" :style="{ background: heartRateColor }">
          {{ heartRateZone }}
        </div>
      </div>
      <div class="stat-item">
        <div class="sub-label">步频</div>
        <div class="sub-value">{{ cadence }}</div>
      </div>
    </div>

    <!-- 状态控制栏 -->
    <div class="control-bar">
      <!-- 暂停状态下显示：继续 & 结束 -->
      <template v-if="status === 'paused'">
        <button class="ctrl-btn resume" @click="handleResume">
          <van-icon name="play" />继续
        </button>
        <button class="ctrl-btn stop" @click="handleStop">
          <van-icon name="stop" />结束
        </button>
      </template>

      <!-- 运行状态下显示：暂停 -->
      <template v-else-if="status === 'running'">
        <button class="ctrl-btn pause" @click="handlePause">
          <van-icon name="pause" />暂停
        </button>
      </template>

      <!-- 停止状态下显示：开始（用于Demo） -->
      <template v-else>
        <button class="ctrl-btn start" @click="handleStart">
          <van-icon name="play" />开始运动
        </button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "RunningDashboard",
  props: {
    distance: { type: Number, default: 0.0 },
    duration: { type: Number, default: 0 }, // seconds
    pace: { type: String, default: "0'00\"" },
    calories: { type: Number, default: 0 },
    heartRate: { type: Number, default: 0 },
    cadence: { type: Number, default: 0 },
    status: { type: String, default: "idle" }, // idle, running, paused
    showMap: { type: Boolean, default: true },
  },
  emits: ["start", "pause", "resume", "stop"],
  computed: {
    formattedDuration() {
      const h = Math.floor(this.duration / 3600);
      const m = Math.floor((this.duration % 3600) / 60);
      const s = this.duration % 60;
      const pad = (n) => String(n).padStart(2, "0");
      if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
      return `${pad(m)}:${pad(s)}`;
    },
    heartRateZone() {
      const hr = this.heartRate;
      if (hr < 100) return "热身";
      if (hr < 130) return "燃脂";
      if (hr < 160) return "有氧";
      if (hr < 180) return "无氧";
      return "极限";
    },
    heartRateColor() {
      const hr = this.heartRate;
      if (hr < 100) return "#3b82f6";
      if (hr < 130) return "#22c55e";
      if (hr < 160) return "#f59e0b";
      if (hr < 180) return "#f97316";
      return "#ef4444";
    },
  },
  methods: {
    handleStart() {
      this.$emit("start");
    },
    handlePause() {
      this.$emit("pause");
    },
    handleResume() {
      this.$emit("resume");
    },
    handleStop() {
      this.$emit("stop");
    },
  },
};
</script>

<style scoped>
.running-dashboard {
  background: #ffffff;
  color: #333;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.running-dashboard.paused {
  opacity: 0.95;
  background: #fff;
}

.map-placeholder {
  height: 80px;
  background: #f0fdf4;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #22c55e;
  font-size: 14px;
  border: 1px dashed #bbf7d0;
}

.main-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.stat-big {
  display: flex;
  flex-direction: column;
}

.stat-big .label {
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-big .value {
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  font-family: monospace;
  color: #333;
}

.stat-big .value.duration {
  font-size: 48px;
}

.sub-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: auto;
}

.stat-item {
  background: #f7f8fa;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.sub-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.sub-value {
  font-size: 24px;
  font-weight: 700;
  font-family: monospace;
  color: #333;
}

.heart-icon {
  margin-right: 4px;
  animation: pulse 1s infinite;
}

.zone-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 10px;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}

.control-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.ctrl-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: transform 0.1s;
  gap: 4px;
}

.ctrl-btn:active {
  transform: scale(0.95);
}

.ctrl-btn .van-icon {
  font-size: 24px;
  margin-bottom: 2px;
}

.ctrl-btn.start {
  background: #22c55e;
  width: 90px;
  height: 90px;
  font-size: 16px;
}

.ctrl-btn.pause {
  background: #f59e0b;
  width: 90px;
  height: 90px;
  font-size: 16px;
}

.ctrl-btn.resume {
  background: #22c55e;
}

.ctrl-btn.stop {
  background: #ef4444;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
