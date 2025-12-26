<template>
  <div class="food-log-list">
    <div class="date-header">
      <div class="day">{{ day }}</div>
      <div class="date">{{ date }}</div>
      <div class="total-cal">摄入 {{ totalCalories }} kcal</div>
    </div>

    <div class="meal-group" v-for="(meal, index) in log" :key="index">
      <div class="timeline-wrapper">
        <div class="time">{{ meal.time }}</div>
        <div class="line"></div>
        <div class="dot" :class="meal.type"></div>
      </div>

      <div class="meal-card">
        <div class="meal-header">
          <span class="meal-type">{{ getMealName(meal.type) }}</span>
          <span class="meal-cal">{{ meal.calories }} kcal</span>
        </div>
        <div class="foods">
          <div class="food-item" v-for="(food, idx) in meal.foods" :key="idx">
            <van-image
              :src="food.image"
              class="food-img"
              radius="6"
              width="40"
              height="40"
              fit="cover"
            />
            <div class="food-info">
              <div class="food-name">{{ food.name }}</div>
              <div class="food-amount">{{ food.amount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FoodLogList",
  props: {
    date: { type: String, default: "10月24日" },
    day: { type: String, default: "今天" },
    log: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    totalCalories() {
      return this.log.reduce((acc, meal) => acc + meal.calories, 0);
    },
  },
  methods: {
    getMealName(type) {
      const map = {
        breakfast: "早餐",
        lunch: "午餐",
        dinner: "晚餐",
        snack: "加餐",
      };
      return map[type] || "用餐";
    },
  },
};
</script>

<style scoped>
.food-log-list {
  background: #ffffff; /* Explicit white for main bg not forced, but list looks better */
}

.date-header {
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.date-header .day {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.date-header .date {
  font-size: 12px;
  color: #999;
}

.date-header .total-cal {
  margin-left: auto;
  font-size: 14px;
  color: #3b82f6;
  font-weight: 500;
}

.meal-group {
  display: flex;
  padding: 20px 16px 0;
}

.timeline-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48px;
  margin-right: 12px;
}

.timeline-wrapper .time {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.timeline-wrapper .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ddd;
  z-index: 1;
}

.timeline-wrapper .dot.breakfast {
  background: #f59e0b;
}
.timeline-wrapper .dot.lunch {
  background: #ef4444;
}
.timeline-wrapper .dot.dinner {
  background: #3b82f6;
}
.timeline-wrapper .dot.snack {
  background: #22c55e;
}

.timeline-wrapper .line {
  flex: 1;
  width: 1px;
  background: #f0f0f0;
  margin-top: -5px;
  margin-bottom: -20px;
  min-height: 40px;
}

/* Last child line clean up if needed, but css pseudo selection might be tricky across components */
.meal-group:last-child .line {
  display: none;
}

.meal-card {
  flex: 1;
  background: #fdfdfd;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.meal-type {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.meal-cal {
  font-size: 12px;
  color: #999;
}

.foods {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.food-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: 14px;
  color: #333;
}

.food-amount {
  font-size: 12px;
  color: #999;
}
</style>
