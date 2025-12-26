<template>
  <div class="hrv-chart">
    <div ref="chartContainer" class="chart-container"></div>

    <div class="stats-panel">
      <div class="stat-main">
        <div class="stat-label">平均 HRV</div>
        <div class="stat-value">
          {{ avgHRV }}
          <span class="unit">ms</span>
        </div>
        <div class="stat-eval" :class="status.class">{{ status.text }}</div>
      </div>

      <div class="stat-grid">
        <div class="stat-item">
          <div class="label">最低</div>
          <div class="val">{{ minHRV }}</div>
        </div>
        <div class="stat-item">
          <div class="label">最高</div>
          <div class="val">{{ maxHRV }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

export default {
  name: "HRVChart",
  props: {
    /**
     * HRV 数据 (rMSSD)
     * @type {Array<{time: string, value: number}>}
     */
    hrvData: {
      type: Array,
      default: () => [],
    },
    /**
     * 用户基准值（用于评估状态）
     */
    baseline: {
      type: Number,
      default: 50,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    validData() {
      return this.hrvData.filter((item) => item.value != null);
    },
    avgHRV() {
      if (this.validData.length === 0) return 0;
      const sum = this.validData.reduce((acc, cur) => acc + cur.value, 0);
      return Math.round(sum / this.validData.length);
    },
    minHRV() {
      if (this.validData.length === 0) return 0;
      return Math.min(...this.validData.map((d) => d.value));
    },
    maxHRV() {
      if (this.validData.length === 0) return 0;
      return Math.max(...this.validData.map((d) => d.value));
    },
    status() {
      if (this.avgHRV === 0) return { text: "--", class: "" };
      // 简单的评估逻辑：比基准低 10ms 以上视为疲劳
      if (this.avgHRV < this.baseline - 15)
        return { text: "压力较大", class: "stress" };
      if (this.avgHRV < this.baseline - 5)
        return { text: "略有疲劳", class: "tired" };
      if (this.avgHRV > this.baseline + 10)
        return { text: "恢复极佳", class: "great" };
      return { text: "状态平稳", class: "normal" };
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
    hrvData: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
  methods: {
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
          right: "25",
          top: "30",
          bottom: "40",
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} <br/> HRV: <b>{c} ms</b>",
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
          name: "ms",
          nameTextStyle: {
            color: "#999",
            align: "right",
            padding: [0, 10, 0, 0],
          },
          splitLine: { lineStyle: { color: "#f5f5f5" } },
          axisLabel: { color: "#999", fontSize: 10 },
        },
        visualMap: {
          show: false,
          pieces: [
            { gt: 0, lte: this.baseline - 10, color: "#f97316" }, // 低于基准 -> 橙色
            { gt: this.baseline - 10, color: "#8b5cf6" }, // 正常/高 -> 紫色
          ],
          outOfRange: {
            color: "#8b5cf6",
          },
        },
        series: [
          {
            data: values,
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              borderWidth: 2,
              borderColor: "#fff",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(139, 92, 246, 0.2)" },
                { offset: 1, color: "rgba(139, 92, 246, 0.01)" },
              ]),
            },
            markLine: {
              silent: true,
              symbol: "none",
              lineStyle: {
                type: "dashed",
                color: "#cbd5e1",
              },
              label: {
                position: "end",
                formatter: "基准",
                color: "#94a3b8",
                fontSize: 10,
              },
              data: [{ yAxis: this.baseline }],
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
.hrv-chart {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.chart-container {
  width: 100%;
  height: 220px;
  margin-bottom: 16px;
}

.stats-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.stat-main {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1.1;
  margin-bottom: 6px;
}

.unit {
  font-size: 12px;
  font-weight: normal;
  color: #94a3b8;
  margin-left: 2px;
}

.stat-eval {
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.stat-eval::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
}

.stat-eval.great {
  color: #22c55e;
}
.stat-eval.great::before {
  background: #22c55e;
}

.stat-eval.normal {
  color: #8b5cf6;
}
.stat-eval.normal::before {
  background: #8b5cf6;
}

.stat-eval.tired {
  color: #f97316;
}
.stat-eval.tired::before {
  background: #f97316;
}

.stat-eval.stress {
  color: #ef4444;
}
.stat-eval.stress::before {
  background: #ef4444;
}

.stat-grid {
  display: flex;
  gap: 20px;
}

.stat-item {
  text-align: right;
}

.stat-item .label {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 2px;
}

.stat-item .val {
  font-size: 16px;
  font-weight: 600;
  color: #475569;
}
</style>
