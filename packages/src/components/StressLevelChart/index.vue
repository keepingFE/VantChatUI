<template>
  <div class="stress-level-chart">
    <div ref="chartContainer" class="chart-container"></div>

    <!-- 统计摘要 -->
    <div class="stats-grid">
      <div class="stat-main">
        <div class="label">平均压力</div>
        <div class="value-group">
          <span class="value" :style="{ color: getLevelColor(avgScore) }">{{
            avgScore
          }}</span>
          <span
            class="level-text"
            :style="{ backgroundColor: getLevelColor(avgScore) }"
            >{{ getLevelLabel(avgScore) }}</span
          >
        </div>
      </div>

      <div class="distribution-bar">
        <div class="dist-label">压力分布</div>
        <div class="bar-track">
          <div
            class="bar-segment relaxed"
            :style="{ width: distribution.relaxed + '%' }"
          ></div>
          <div
            class="bar-segment low"
            :style="{ width: distribution.low + '%' }"
          ></div>
          <div
            class="bar-segment medium"
            :style="{ width: distribution.medium + '%' }"
          ></div>
          <div
            class="bar-segment high"
            :style="{ width: distribution.high + '%' }"
          ></div>
        </div>
        <div class="legend">
          <div class="leg-item"><span class="dot relaxed"></span>放松</div>
          <div class="leg-item"><span class="dot low"></span>正常</div>
          <div class="leg-item"><span class="dot medium"></span>中等</div>
          <div class="leg-item"><span class="dot high"></span>偏高</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  BarChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

export default {
  name: "StressLevelChart",
  props: {
    /**
     * 压力数据
     * @type {Array<{time: string, value: number}>}
     */
    stressData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    validData() {
      return this.stressData.filter((item) => item.value != null);
    },
    avgScore() {
      if (this.validData.length === 0) return 0;
      const sum = this.validData.reduce((acc, cur) => acc + cur.value, 0);
      return Math.round(sum / this.validData.length);
    },
    distribution() {
      if (this.validData.length === 0)
        return { relaxed: 0, low: 0, medium: 0, high: 0 };

      const counts = { relaxed: 0, low: 0, medium: 0, high: 0 };
      this.validData.forEach((d) => {
        if (d.value < 30) counts.relaxed++;
        else if (d.value < 60) counts.low++;
        else if (d.value < 80) counts.medium++;
        else counts.high++;
      });

      const total = this.validData.length;
      return {
        relaxed: (counts.relaxed / total) * 100,
        low: (counts.low / total) * 100,
        medium: (counts.medium / total) * 100,
        high: (counts.high / total) * 100,
      };
    },
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) {
      this.chart.dispose();
    }
  },
  watch: {
    stressData: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
  methods: {
    getLevelColor(val) {
      if (val < 30) return "#3b82f6"; // relaxed
      if (val < 60) return "#22c55e"; // low/normal
      if (val < 80) return "#f97316"; // medium
      return "#ef4444"; // high
    },
    getLevelLabel(val) {
      if (val < 30) return "放松";
      if (val < 60) return "正常";
      if (val < 80) return "中等";
      return "偏高";
    },
    initChart() {
      if (!this.$refs.chartContainer) return;
      this.chart = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart || this.validData.length === 0) return;

      const times = this.validData.map((item) => item.time);
      const values = this.validData.map((item) => item.value);

      const option = {
        grid: {
          left: "40",
          right: "20",
          top: "20",
          bottom: "40",
        },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            const val = params[0].value;
            const label = this.getLevelLabel(val);
            return `${params[0].name}<br/>压力值: <b>${val}</b> (${label})`;
          },
        },
        visualMap: {
          show: false,
          pieces: [
            { gt: 0, lte: 29, color: "#3b82f6" },
            { gt: 29, lte: 59, color: "#22c55e" },
            { gt: 59, lte: 79, color: "#f97316" },
            { gt: 79, lte: 100, color: "#ef4444" },
          ],
          outOfRange: {
            color: "#999",
          },
        },
        xAxis: {
          type: "category",
          data: times,
          axisLine: { lineStyle: { color: "#eee" } },
          axisLabel: { color: "#999", fontSize: 10 },
          axisTick: { show: false },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          interval: 25,
          splitLine: { lineStyle: { color: "#f5f5f5" } },
          axisLabel: { color: "#999", fontSize: 10 },
        },
        series: [
          {
            data: values,
            type: "bar",
            barMaxWidth: 12,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
            },
          },
        ],
      };

      this.chart.setOption(option);
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style scoped>
.stress-level-chart {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.chart-container {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
}

.stats-grid {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.stat-main {
  display: flex;
  flex-direction: column;
  min-width: 80px;
}

.label {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 6px;
}

.value-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.level-text {
  font-size: 10px;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}

.distribution-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dist-label {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.bar-track {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-segment {
  height: 100%;
}
.bar-segment.relaxed {
  background: #3b82f6;
}
.bar-segment.low {
  background: #22c55e;
}
.bar-segment.medium {
  background: #f97316;
}
.bar-segment.high {
  background: #ef4444;
}

.legend {
  display: flex;
  gap: 12px;
  font-size: 10px;
  color: #6b7280;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.dot.relaxed {
  background: #3b82f6;
}
.dot.low {
  background: #22c55e;
}
.dot.medium {
  background: #f97316;
}
.dot.high {
  background: #ef4444;
}
</style>
