<template>
  <div class="body-fat-scale">
    <div class="scale-header">
      <h3 class="title">体脂率</h3>
      <span class="update-time" v-if="updateTime">{{ updateTime }}</span>
    </div>

    <div ref="chartContainer" class="chart-container"></div>

    <div class="metrics-grid">
      <div class="metric-item" v-for="(item, index) in metrics" :key="index">
        <div class="metric-icon" :style="{ background: item.color }">
          <van-icon :name="item.icon" color="#fff" />
        </div>
        <div class="metric-info">
          <div class="metric-name">{{ item.name }}</div>
          <div class="metric-val-group">
            <span class="metric-value">{{ item.value }}</span>
            <span class="metric-unit">{{ item.unit }}</span>
          </div>
        </div>
        <div class="metric-status" :style="{ color: item.statusColor }">
          {{ item.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GaugeChart, CanvasRenderer]);

export default {
  name: "BodyFatScale",
  props: {
    bodyFat: {
      type: Number,
      default: 0,
    },
    updateTime: {
      type: String,
      default: "",
    },
    metrics: {
      type: Array,
      default: () => [],
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
    if (this.chart) {
      this.chart.dispose();
    }
  },
  watch: {
    bodyFat() {
      this.updateChart();
    },
  },
  methods: {
    initChart() {
      if (!this.$refs.chartContainer) return;
      this.chart = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart) return;

      const value = this.bodyFat;

      const option = {
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 40,
            splitNumber: 4,
            itemStyle: {
              color: "#58D9F9",
              shadowColor: "rgba(0,138,255,0.45)",
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            progress: {
              show: true,
              roundCap: true,
              width: 14,
              itemStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 0,
                  colorStops: [
                    { offset: 0, color: "#3b82f6" },
                    { offset: 0.5, color: "#22c55e" },
                    { offset: 1, color: "#ef4444" },
                  ],
                },
              },
            },
            pointer: {
              icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
              length: "12%",
              width: 20,
              offsetCenter: [0, "-60%"],
              itemStyle: {
                color: "auto",
              },
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 14,
                color: [[1, "#E6EBF8"]],
              },
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            title: {
              show: false,
            },
            detail: {
              backgroundColor: "#fff",
              width: "40%",
              lineHeight: 40,
              height: 40,
              borderRadius: 8,
              offsetCenter: [0, "20%"],
              valueAnimation: true,
              formatter: function (value) {
                return "{value|" + value.toFixed(1) + "}{unit|%}";
              },
              rich: {
                value: {
                  fontSize: 40,
                  fontWeight: "bolder",
                  color: "#333",
                },
                unit: {
                  fontSize: 16,
                  color: "#999",
                  padding: [0, 0, 10, 4],
                },
              },
            },
            data: [{ value: value }],
          },
          // 刻度标签
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 40,
            itemStyle: { color: "transparent" },
            pointer: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            detail: {
              show: true,
              offsetCenter: [0, "55%"],
              formatter: (val) => {
                if (val < 10) return "偏瘦";
                if (val < 20) return "标准";
                if (val < 25) return "偏胖";
                return "肥胖";
              },
              fontSize: 16,
              color: "#666",
            },
            data: [{ value: value }],
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
.body-fat-scale {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.scale-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
}

.title {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.update-time {
  font-size: 12px;
  color: #999;
}

.chart-container {
  width: 100%;
  height: 220px;
  margin-top: -10px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 5px;
}

.metric-item {
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 16px;
}

.metric-info {
  flex: 1;
}

.metric-name {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 2px;
}

.metric-val-group {
  display: flex;
  align-items: baseline;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.metric-unit {
  font-size: 10px;
  color: #94a3b8;
  margin-left: 2px;
}

.metric-status {
  font-size: 10px;
  margin-left: 4px;
  font-weight: 500;
}
</style>
