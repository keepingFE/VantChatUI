<template>
  <div class="demo-page">
    <van-nav-bar
      title="MoodTracker 心情追踪"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">我的心情日历</div>
      <MoodTracker :mood-data="moodData" @click-date="handleDateClick" />
    </div>

    <!-- 记录心情弹窗 -->
    <van-popup
      v-model:show="showPicker"
      position="bottom"
      round
      :style="{ height: '40%' }"
    >
      <div class="mood-picker">
        <div class="picker-header">
          <div class="picker-title">记录心情</div>
          <div class="picker-date">{{ selectedDate }}</div>
        </div>

        <div class="mood-options">
          <div
            v-for="(config, key) in moodConfig"
            :key="key"
            class="mood-option"
            :class="{ active: selectedMood === key }"
            @click="selectMood(key)"
          >
            <div class="mood-icon">{{ config.icon }}</div>
            <div class="mood-label">{{ config.label }}</div>
          </div>
        </div>

        <div class="picker-actions">
          <van-button
            block
            type="primary"
            round
            @click="saveMood"
            :disabled="!selectedMood"
          >
            确认记录
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { MoodTracker } from "chatvant";
import { showToast } from "vant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

// 模拟数据
const generateMoodData = () => {
  const data = [];
  const moods = ["happy", "neutral", "sad", "angry", "anxious"];
  const now = new Date();
  const year = now.getFullYear(); // 当前年份

  // 生成过去3个月的数据
  for (let m = 0; m < 3; m++) {
    const month = now.getMonth() - m; // 这里的 month 是 0-11
    // 处理跨年情况
    const realYear = month < 0 ? year - 1 : year;
    const realMonth = month < 0 ? month + 12 : month;

    const daysInMonth = new Date(realYear, realMonth + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      // 随机跳过一些日子，模拟真实情况
      if (Math.random() > 0.8) continue;

      // 不要生成未来的数据
      const currentDay = new Date(realYear, realMonth, d);
      if (currentDay > now) continue;

      const dateStr = `${realYear}-${String(realMonth + 1).padStart(
        2,
        "0"
      )}-${String(d).padStart(2, "0")}`;
      const randomMood = moods[Math.floor(Math.random() * moods.length)];

      data.push({
        date: dateStr,
        mood: randomMood,
      });
    }
  }
  return data;
};

const moodData = ref(generateMoodData());

const moodConfig = {
  happy: { icon: "😄", color: "#4ade80", label: "开心" },
  neutral: { icon: "😐", color: "#60a5fa", label: "平静" },
  sad: { icon: "😔", color: "#94a3b8", label: "低落" },
  angry: { icon: "😡", color: "#f87171", label: "生气" },
  anxious: { icon: "😰", color: "#fbbf24", label: "焦虑" },
};

const showPicker = ref(false);
const selectedDate = ref("");
const selectedMood = ref("");

const handleDateClick = ({ date, moodItem }) => {
  // 检查是否是未来的日期
  if (new Date(date) > new Date()) {
    showToast("不能记录未来的心情哦");
    return;
  }

  selectedDate.value = date;
  selectedMood.value = moodItem ? moodItem.mood : "";
  showPicker.value = true;
};

const selectMood = (mood) => {
  selectedMood.value = mood;
};

const saveMood = () => {
  // 移除旧记录（如果有）
  const index = moodData.value.findIndex(
    (item) => item.date === selectedDate.value
  );
  if (index > -1) {
    moodData.value.splice(index, 1);
  }

  // 添加新记录
  moodData.value.push({
    date: selectedDate.value,
    mood: selectedMood.value,
  });

  showPicker.value = false;
  showToast("记录成功");
};
</script>

<style scoped>
.demo-page {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
}

.demo-page::-webkit-scrollbar {
  width: 6px;
}

.demo-page::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
  border-radius: 3px;
}

.demo-section {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  margin-left: 4px;
}

/* Picker 样式 */
.mood-picker {
  padding: 24px 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.picker-header {
  text-align: center;
  margin-bottom: 24px;
}

.picker-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.picker-date {
  font-size: 14px;
  color: #999;
}

.mood-options {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: auto;
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 2px solid transparent;
  transition: all 0.2s;
  width: 64px;
  cursor: pointer;
}

.mood-option.active {
  background: #eff6ff;
  border-color: #3b82f6;
  transform: translateY(-4px);
}

.mood-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.mood-label {
  font-size: 12px;
  color: #64748b;
}

.mood-option.active .mood-label {
  color: #3b82f6;
  font-weight: 500;
}
</style>
