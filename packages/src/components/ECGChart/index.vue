<template>
  <div class="ecg-chart">
    <div class="info-bar">
      <div class="bpm-box">
        <span class="bpm-val">{{ currentBPM }}</span>
        <span class="bpm-unit">BPM</span>
        <van-icon name="like" color="#ef4444" class="beat-icon" />
      </div>
      <div class="status">{{ status }}</div>
    </div>

    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer]);

export default {
  name: "ECGChart",
  props: {
    bpm: { type: Number, default: 72 },
  },
  data() {
    return {
      chart: null,
      timer: null,
      data: [],
      currentBPM: this.bpm,
      xPos: 0,
    };
  },
  computed: {
    status() {
      if (this.currentBPM < 60) return "窦性心动过缓";
      if (this.currentBPM > 100) return "窦性心动过速";
      return "窦性心律";
    },
  },
  mounted() {
    this.initData();
    this.initChart();
    this.startSimulation();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) this.chart.dispose();
  },
  methods: {
    initData() {
      // Fill initial buffer with 0
      for (let i = 0; i < 200; i++) {
        this.data.push(0);
      }
    },
    initChart() {
      if (!this.$refs.chartContainer) return;
      this.chart = echarts.init(this.$refs.chartContainer);

      const option = {
        grid: {
          left: 0,
          right: 0,
          top: 10,
          bottom: 10,
        },
        xAxis: {
          type: "category",
          show: false,
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          show: false,
          min: -2,
          max: 3,
        },
        series: [
          {
            type: "line",
            data: this.data,
            showSymbol: false,
            lineStyle: {
              color: "#ef4444",
              width: 2,
            },
            animation: false,
          },
        ],
      };
      this.chart.setOption(option);
    },
    // Simulate ECG Waveform (P-QRS-T)
    nextValue() {
      // A simple approximation cycle of ~1 sec (60 BPM) or adjusted by BPM
      // We run at 50Hz (20ms interval) -> 50 points per sec
      // 60 BPM -> 1 beat per sec -> 50 points cycle
      // 72 BPM -> 0.83 sec -> ~42 points cycle

      this.xPos++;
      const cycleLen = Math.floor(3000 / this.currentBPM); // ~40-50 ticks
      const phase = this.xPos % cycleLen;

      // P wave
      if (phase >= 5 && phase < 10)
        return 0.2 * Math.sin(((phase - 5) * Math.PI) / 5);

      // QRS complex
      if (phase >= 12 && phase < 13) return -0.2; // Q
      if (phase >= 13 && phase < 15) return 1.5; // R
      if (phase >= 15 && phase < 16) return -0.5; // S

      // T wave
      if (phase >= 25 && phase < 32)
        return 0.3 * Math.sin(((phase - 25) * Math.PI) / 7);

      // Random noise
      return (Math.random() - 0.5) * 0.05;
    },
    startSimulation() {
      this.timer = setInterval(() => {
        const val = this.nextValue();
        this.data.shift();
        this.data.push(val);

        // Randomly drift BPM slightly
        if (this.xPos % 100 === 0) {
          this.currentBPM = this.bpm + Math.floor(Math.random() * 6 - 3);
        }

        if (this.chart) {
          this.chart.setOption({
            series: [
              {
                data: this.data,
              },
            ],
          });
        }
      }, 30); // ~33Hz refresh -> smooth enough
    },
    handleResize() {
      this.chart?.resize();
    },
  },
};
</script>

<style scoped>
.ecg-chart {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bpm-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.bpm-val {
  font-size: 32px;
  font-weight: 700;
  color: #ef4444;
  font-family: monospace;
}

.bpm-unit {
  font-size: 12px;
  color: #999;
}

.beat-icon {
  animation: beat 1s infinite;
  margin-left: 4px;
}

.status {
  font-size: 12px;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.chart-container {
  width: 100%;
  height: 120px;
  /* Red grid background for medical look */
  background-image: linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #fff0f0; /* Very light red tint */
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.1);
}

@keyframes beat {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
