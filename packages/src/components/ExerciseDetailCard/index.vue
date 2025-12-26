<template>
  <div class="exercise-detail-card">
    <!-- 头部概览 -->
    <div class="card-header">
      <div class="header-left">
        <div class="icon-wrapper" :class="data.type">
          <span class="icon">{{ getIcon(data.type) }}</span>
        </div>
        <div class="title-info">
          <div class="exercise-type">{{ getLabel(data.type) }}</div>
          <div class="exercise-time">{{ data.startTime }}</div>
        </div>
      </div>
      <div class="calories">
        <span class="value">{{ data.calories }}</span>
        <span class="unit">kcal</span>
      </div>
    </div>

    <!-- 核心数据网格 -->
    <div class="data-grid">
      <div class="data-item">
        <div class="label">总时长</div>
        <div class="value">{{ formatDuration(data.duration) }}</div>
      </div>
      <div class="data-item" v-if="data.distance">
        <div class="label">距离</div>
        <div class="value">
          {{ data.distance }}<span class="unit-sm">km</span>
        </div>
      </div>
      <div class="data-item">
        <div class="label">平均心率</div>
        <div class="value">
          {{ data.avgHeartRate }}<span class="unit-sm">bpm</span>
        </div>
      </div>
      <div class="data-item" v-if="data.pace">
        <div class="label">平均配速</div>
        <div class="value">{{ data.pace }}<span class="unit-sm">/km</span></div>
      </div>
    </div>

    <!-- 心率区间分布 -->
    <div class="heart-rate-zones" v-if="data.zones && data.zones.length">
      <div class="zone-title">心率区间</div>
      <div class="zones-list">
        <div v-for="(zone, index) in data.zones" :key="index" class="zone-row">
          <div class="zone-label">{{ zone.name }}</div>
          <div class="zone-bar-wrapper">
            <div
              class="zone-bar"
              :style="{
                width: zone.percent + '%',
                backgroundColor: zone.color,
              }"
            ></div>
          </div>
          <div class="zone-value">{{ zone.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExerciseDetailCard",
  props: {
    /**
     * 运动数据对象
     * @type {{
     *   type: 'running'|'cycling'|'walking'|'swimming'|'yoga'|'other',
     *   startTime: string,
     *   duration: number, // 分钟
     *   calories: number,
     *   distance?: number, // km
     *   avgHeartRate: number,
     *   pace?: string, // e.g. "5'30''"
     *   zones?: Array<{name: string, percent: number, time: string, color: string}>
     * }}
     */
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getIcon(type) {
      const icons = {
        running: "🏃‍♂️",
        cycling: "🚴‍♂️",
        walking: "🚶‍♂️",
        swimming: "🏊‍♂️",
        yoga: "🧘‍♀️",
        other: "🏅",
      };
      return icons[type] || icons.other;
    },
    getLabel(type) {
      const labels = {
        running: "户外跑步",
        cycling: "户外骑行",
        walking: "健走",
        swimming: "游泳",
        yoga: "瑜伽",
        other: "自由训练",
      };
      return labels[type] || "运动";
    },
    formatDuration(minutes) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (h > 0) return `${h}小时${m}分`;
      return `${m}分钟`;
    },
  },
};
</script>

<style scoped>
.exercise-detail-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  font-size: 24px;
}

.icon-wrapper.running {
  background: #fee2e2;
}
.icon-wrapper.cycling {
  background: #e0f2fe;
}
.icon-wrapper.yoga {
  background: #f3e8ff;
}

.title-info {
  display: flex;
  flex-direction: column;
}

.exercise-type {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.exercise-time {
  font-size: 12px;
  color: #9ca3af;
}

.calories {
  text-align: right;
}

.calories .value {
  font-size: 24px;
  font-weight: 700;
  color: #fb923c; /* orange-400 */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.calories .unit {
  font-size: 12px;
  color: #6b7280;
  margin-left: 4px;
}

/* 数据网格 */
.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
}

.data-item {
  display: flex;
  flex-direction: column;
}

.data-item .label {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.data-item .value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.unit-sm {
  font-size: 12px;
  color: #6b7280;
  margin-left: 2px;
  font-weight: normal;
}

/* 心率区间 */
.zone-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.zones-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zone-row {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.zone-label {
  width: 60px;
  color: #6b7280;
}

.zone-bar-wrapper {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  margin: 0 12px;
  overflow: hidden;
}

.zone-bar {
  height: 100%;
  border-radius: 3px;
}

.zone-value {
  width: 50px;
  text-align: right;
  color: #374151;
  font-weight: 500;
}
</style>
