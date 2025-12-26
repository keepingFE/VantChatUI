<template>
  <div class="temperature-chart">
    <div ref="chartContainer" class="chart-container"></div>

    <!-- 统计面板 -->
    <div class="stats-panel">
      <div class="stat-item">
        <div class="label">最高体温</div>
        <div class="value high">{{ maxTemp }}<span class="unit">°C</span></div>
      </div>
      <div class="stat-item">
        <div class="label">最低体温</div>
        <div class="value low">{{ minTemp }}<span class="unit">°C</span></div>
      </div>
      <div class="stat-item">
        <div class="label">平均体温</div>
        <div class="value">{{ avgTemp }}<span class="unit">°C</span></div>
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
  name: "TemperatureChart",
  props: {
    /**
     * 体温数据
     * @type {Array<{time: string, value: number}>}
     */
    temperatureData: {
      type: Array,
      default: () => [],
    },
    /**
     * 发烧警戒线
     */
    feverThreshold: {
      type: Number,
      default: 37.3,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  computed: {
    validData() {
      return this.temperatureData.filter((item) => item.value != null);
    },
    maxTemp() {
      if (this.validData.length === 0) return "--";
      return Math.max(...this.validData.map((d) => d.value)).toFixed(1);
    },
    minTemp() {
      if (this.validData.length === 0) return "--";
      return Math.min(...this.validData.map((d) => d.value)).toFixed(1);
    },
    avgTemp() {
      if (this.validData.length === 0) return "--";
      const sum = this.validData.reduce((acc, cur) => acc + cur.value, 0);
      return (sum / this.validData.length).toFixed(1);
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
    temperatureData: {
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

      // 动态计算 Y 轴范围，保持 0.5 的余量
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const yMin = (Math.floor(minVal * 10) / 10 - 0.5).toFixed(1);
      const yMax = (Math.ceil(maxVal * 10) / 10 + 0.5).toFixed(1);

      const option = {
        grid: {
          left: "45",
          right: "45", // Increased right padding to prevent label truncation
          top: "30",
          bottom: "40",
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} <br/> 体温: <b>{c}°C</b>",
        },
        xAxis: {
          type: "category",
          data: times,
          axisLine: { lineStyle: { color: "#eee" } },
          axisLabel: {
            color: "#999",
            fontSize: 10,
            formatter: (val) => {
              // 如果是日期格式 '2023-01-01' 或 '01-01'，只保留月日
              if (val.includes("-")) return val.slice(5);
              return val;
            },
          },
          axisTick: { show: false },
        },
        yAxis: {
          type: "value",
          min: yMin,
          max: yMax,
          splitLine: { lineStyle: { color: "#f5f5f5" } },
          axisLabel: {
            color: "#999",
            formatter: "{value}°C",
          },
        },
        series: [
          {
            data: values,
            type: "line",
            smooth: true,
            // symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: "#ef4444",
              borderColor: "#fff",
              borderWidth: 2,
            },
            lineStyle: {
              color: "#ef4444",
              width: 3,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(239, 68, 68, 0.2)" },
                { offset: 1, color: "rgba(239, 68, 68, 0.01)" },
              ]),
            },
            markLine: {
              silent: true,
              symbol: "none",
              lineStyle: { type: "dashed", color: "#f59e0b" },
              label: { position: "end", formatter: "{c}°C" },
              data: [{ yAxis: this.feverThreshold }],
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
.temperature-chart {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
}

.chart-container {
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
}

.stats-panel {
  display: flex;
  justify-content: space-around;
  background: #f7f8fa;
  border-radius: 12px;
  padding: 16px;
}

.stat-item {
  text-align: center;
}

.label {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.value {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.value.high {
  color: #ef4444;
}
.value.low {
  color: #3b82f6;
}

.unit {
  font-size: 12px;
  color: #999;
  margin-left: 2px;
  font-weight: normal;
}
</style>
