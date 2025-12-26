<template>
  <div class="workout-pace-chart">
    <div ref="chartContainer" class="chart-container"></div>
    <div class="stats-panel" v-if="stats">
      <div class="stat-item">
        <div class="label">平均配速</div>
        <div class="value">{{ stats.avgPace }}</div>
      </div>
      <div class="stat-item">
        <div class="label">最快配速</div>
        <div class="value">{{ stats.bestPace }}</div>
      </div>
      <div class="stat-item">
        <div class="label">总爬升</div>
        <div class="value">{{ stats.totalClimb }}m</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
]);

export default {
  name: "WorkoutPaceChart",
  props: {
    data: {
      type: Array, // [{ x: '1km', pace: 330 (seconds), elevation: 12 }]
      default: () => [],
    },
    stats: {
      type: Object,
      default: () => ({
        avgPace: "5'30\"",
        bestPace: "4'15\"",
        totalClimb: 120,
      }),
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) this.chart.dispose();
  },
  methods: {
    formatPace(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}'${String(s).padStart(2, "0")}"`;
    },
    initChart() {
      if (!this.$refs.chartContainer) return;
      this.chart = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart) return;

      const xData = this.data.map((item) => item.x);
      const paceData = this.data.map((item) => item.pace);
      const elevationData = this.data.map((item) => item.elevation);

      const option = {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            let res = params[0].name + "<br/>";
            params.forEach((param) => {
              if (param.seriesName === "配速") {
                res += `配速: ${this.formatPace(param.value)}<br/>`;
              } else {
                res += `海拔: ${param.value}m<br/>`;
              }
            });
            return res;
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "10%",
          top: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData,
          axisLine: { lineStyle: { color: "#eee" } },
          axisLabel: { color: "#999", fontSize: 10 },
        },
        yAxis: [
          {
            type: "value",
            name: "配速",
            inverse: true, // 配速越快数值越小，通常 inverse
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { type: "dashed", color: "#f5f5f5" } },
            axisLabel: {
              formatter: (val) => {
                const m = Math.floor(val / 60);
                return `${m}'`;
              },
              color: "#999",
            },
          },
          {
            type: "value",
            name: "海拔",
            position: "right",
            axisLine: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false }, // Hide label to keep clean
          },
        ],
        series: [
          {
            name: "配速",
            type: "line",
            smooth: true,
            data: paceData,
            symbol: "none",
            lineStyle: { color: "#3b82f6", width: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
                { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
              ]),
            },
          },
          {
            name: "海拔",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            data: elevationData,
            symbol: "none",
            lineStyle: { color: "#a8a29e", width: 1, type: "dashed" },
            areaStyle: {
              color: "rgba(168, 162, 158, 0.1)",
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
    handleResize() {
      this.chart?.resize();
    },
  },
};
</script>

<style scoped>
.workout-pace-chart {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.chart-container {
  width: 100%;
  height: 240px;
}

.stats-panel {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f9f9f9;
}

.stat-item {
  text-align: center;
}

.label {
  font-size: 12px;
  color: #999;
}

.value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 4px;
}
</style>
