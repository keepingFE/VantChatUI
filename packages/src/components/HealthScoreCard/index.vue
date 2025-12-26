<template>
  <div class="health-score-card">
    <div class="score-header">
      <div class="score-circle">
        <svg viewBox="-10 -10 120 120">
          <!-- 背景圆环 -->
          <path
            d="M 15 85 A 50 50 0 1 1 85 85"
            fill="none"
            stroke="#f3f4f6"
            stroke-width="8"
            stroke-linecap="round"
          />
          <!-- 进度圆环 -->
          <path
            d="M 15 85 A 50 50 0 1 1 85 85"
            fill="none"
            :stroke="scoreColor"
            stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="dashArray"
            :stroke-dashoffset="dashOffset"
            class="progress-path"
          />
        </svg>
        <div class="score-content">
          <div class="score-label">健康评分</div>
          <div class="score-value" :style="{ color: scoreColor }">
            {{ animatedScore }}
          </div>
          <div class="score-eval">{{ evaluation }}</div>
        </div>
      </div>
    </div>

    <div class="dimensions-list">
      <div v-for="item in dimensions" :key="item.label" class="dimension-item">
        <div class="dim-header">
          <div class="dim-label">{{ item.label }}</div>
          <div class="dim-value" :class="item.status">{{ item.valueText }}</div>
        </div>
        <div class="dim-bar-bg">
          <div
            class="dim-bar-fill"
            :style="{
              width: item.score + '%',
              backgroundColor: item.color || '#3b82f6',
            }"
          ></div>
        </div>
      </div>
    </div>

    <div class="card-footer" v-if="date">
      <div class="update-time">更新于 {{ date }}</div>
      <div class="compare" v-if="compareText">
        {{ compareText }}
        <span
          :class="compareTrend === 'up' ? 'trend-up' : 'trend-down'"
          v-if="compareTrend"
        >
          {{ compareTrend === "up" ? "↑" : "↓" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HealthScoreCard",
  props: {
    score: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: "",
    },
    compareText: String,
    compareTrend: String, // 'up' | 'down'
    /**
     * 维度数据
     * @type {Array<{label: string, score: number, valueText: string, status: string, color: string}>}
     * status: 'good' | 'warning' | 'danger'
     */
    dimensions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      animatedScore: 0,
    };
  },
  computed: {
    circumference() {
      // 半径 50，角度约 270度 (实际上是 360 - 底部缺口)
      // 简单估算：path长度约为 235
      return 235;
    },
    dashArray() {
      return this.circumference;
    },
    dashOffset() {
      return this.circumference * (1 - this.score / 100);
    },
    scoreColor() {
      if (this.score >= 85) return "#22c55e"; // green
      if (this.score >= 70) return "#3b82f6"; // blue
      if (this.score >= 60) return "#eab308"; // yellow
      return "#ef4444"; // red
    },
    evaluation() {
      if (this.score >= 90) return "状态极佳";
      if (this.score >= 80) return "非常健康";
      if (this.score >= 70) return "状态良好";
      if (this.score >= 60) return "继续加油";
      return "需要改善";
    },
  },
  watch: {
    score: {
      handler(newVal) {
        this.animateScore(newVal);
      },
      immediate: true,
    },
  },
  methods: {
    animateScore(target) {
      let start = this.animatedScore;
      const duration = 1000;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        if (elapsed < duration) {
          this.animatedScore = Math.round(
            start + (target - start) * (elapsed / duration)
          );
          requestAnimationFrame(animate);
        } else {
          this.animatedScore = target;
        }
      };
      requestAnimationFrame(animate);
    },
  },
};
</script>

<style scoped>
.health-score-card {
  background: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.score-header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.score-circle {
  width: 220px;
  height: 140px; /* SVG 虽然是 100x100，但这是 viewBox，实际可以截取底部 */
  position: relative;
  overflow: hidden;
}

.score-circle svg {
  width: 100%;
  height: 180px; /* 拉高 svg 让圆环底部不可见部分溢出容器，或者靠 path data 控制 */
  transform: rotate(0deg);
}

.progress-path {
  transition: stroke-dashoffset 1s ease-out, stroke 0.3s;
}

.score-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  text-align: center;
  width: 100%;
}

.score-label {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.score-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.score-eval {
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
  margin-top: 4px;
}

/* 维度列表 */
.dimensions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
}

.dimension-item {
  display: flex;
  flex-direction: column;
}

.dim-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.dim-label {
  color: #4b5563;
  font-weight: 500;
}

.dim-value {
  color: #6b7280;
}
.dim-value.good {
  color: #22c55e;
}
.dim-value.warning {
  color: #f59e0b;
}
.dim-value.danger {
  color: #ef4444;
}

.dim-bar-bg {
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.dim-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease-out;
}

/* 底部 */
.card-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #9ca3af;
}

.compare {
  display: flex;
  align-items: center;
  gap: 2px;
}

.trend-up {
  color: #22c55e;
}
.trend-down {
  color: #ef4444;
}
</style>
