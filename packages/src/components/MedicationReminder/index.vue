<template>
  <div class="medication-reminder">
    <div class="reminder-header" v-if="title">
      <div class="reminder-title">{{ title }}</div>
      <div class="reminder-progress" v-if="showProgress">
        {{ takenCount }}/{{ totalCount }}
      </div>
    </div>

    <div class="medication-list">
      <div
        v-for="item in medications"
        :key="item.id"
        class="medication-item"
        :class="{
          'is-taken': item.status === 'taken',
          'is-missed': item.status === 'missed',
        }"
        @click="toggleStatus(item)"
      >
        <div class="time-column">
          <div class="time">{{ item.time }}</div>
          <div class="period">{{ getPeriod(item.time) }}</div>
        </div>

        <div class="info-column">
          <div class="name">{{ item.name }}</div>
          <div class="dose">{{ item.dose }} · {{ item.instruction }}</div>
        </div>

        <div class="action-column">
          <div
            class="check-circle"
            :class="{ checked: item.status === 'taken' }"
          >
            <svg
              v-if="item.status === 'taken'"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                fill="#fff"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="medications.length === 0">暂无用药计划</div>
  </div>
</template>

<script>
export default {
  name: "MedicationReminder",
  props: {
    title: {
      type: String,
      default: "今日用药",
    },
    /**
     * 药品列表
     * @type {Array<{id: string, name: string, time: string, dose: string, instruction: string, status: 'pending'|'taken'|'missed'}>}
     */
    medications: {
      type: Array,
      default: () => [],
    },
    showProgress: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:medications", "toggle"],
  computed: {
    totalCount() {
      return this.medications.length;
    },
    takenCount() {
      return this.medications.filter((m) => m.status === "taken").length;
    },
  },
  methods: {
    getPeriod(time) {
      const hour = parseInt(time.split(":")[0]);
      if (hour < 11) return "早上";
      if (hour < 14) return "中午";
      if (hour < 19) return "下午";
      return "晚上";
    },
    toggleStatus(item) {
      const newStatus = item.status === "taken" ? "pending" : "taken";
      // 触发事件，让父组件处理状态更新，或者直接修改（如果父组件传递的是响应式对象）
      // 这里我们推荐 emit 事件，保持单向数据流更为规范，但也支持修改副本
      this.$emit("toggle", { ...item, status: newStatus });
    },
  },
};
</script>

<style scoped>
.medication-reminder {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.reminder-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.reminder-progress {
  font-size: 14px;
  color: #999;
  font-feature-settings: "tnum";
}

.medication-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.medication-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.medication-item:active {
  transform: scale(0.98);
}

/* 已服用状态 */
.medication-item.is-taken {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.medication-item.is-taken .name {
  color: #86efac;
  text-decoration: line-through;
}

.medication-item.is-taken .dose,
.medication-item.is-taken .time,
.medication-item.is-taken .period {
  color: #bbf7d0;
}

/* 漏服状态（可选） */
.medication-item.is-missed {
  background: #fef2f2;
  border-color: #fee2e2;
}

.time-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 12px;
  border-right: 1px solid #e2e8f0;
  min-width: 50px;
}

.time {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.period {
  font-size: 12px;
  color: #94a3b8;
}

.info-column {
  flex: 1;
  padding-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.dose {
  font-size: 12px;
  color: #64748b;
}

.action-column {
  padding-left: 12px;
}

.check-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: #fff;
}

.check-circle.checked {
  background: #22c55e;
  border-color: #22c55e;
}

.empty-state {
  text-align: center;
  padding: 24px 0;
  color: #94a3b8;
  font-size: 14px;
}
</style>
