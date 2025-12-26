<template>
  <div class="demo-page">
    <van-nav-bar
      title="MedicationReminder 用药提醒"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-section">
      <div class="section-title">今日用药</div>
      <MedicationReminder :medications="medications" @toggle="handleToggle" />
    </div>

    <div class="demo-section">
      <div class="section-title">极简模式（隐藏头部）</div>
      <MedicationReminder
        :medications="simpleList"
        title=""
        :show-progress="false"
        @toggle="handleSimpleToggle"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { MedicationReminder } from "chatvant";
import { showToast } from "vant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

// 模拟数据
const medications = ref([
  {
    id: 1,
    name: "阿司匹林",
    time: "08:00",
    dose: "100mg",
    instruction: "餐后服用",
    status: "taken",
  },
  {
    id: 2,
    name: "维生素C",
    time: "08:00",
    dose: "1片",
    instruction: "随餐服用",
    status: "pending",
  },
  {
    id: 3,
    name: "钙片",
    time: "12:00",
    dose: "1片",
    instruction: "餐后嚼服",
    status: "pending",
  },
  {
    id: 4,
    name: "阿托伐他汀",
    time: "20:00",
    dose: "10mg",
    instruction: "睡前服用",
    status: "pending",
  },
]);

const handleToggle = (item) => {
  // 找到并更新状态
  const target = medications.value.find((m) => m.id === item.id);
  if (target) {
    target.status = item.status;
    showToast(item.status === "taken" ? "已标记为服用" : "已取消服用");
  }
};

const simpleList = ref([
  {
    id: 101,
    name: "布洛芬",
    time: "09:00",
    dose: "1粒",
    instruction: "疼痛时服用",
    status: "pending",
  },
]);

const handleSimpleToggle = (item) => {
  const target = simpleList.value.find((m) => m.id === item.id);
  if (target) {
    target.status = item.status;
  }
};
</script>

<style scoped>
.demo-page {
  height: 100vh;
  overflow-y: auto;
  background: #f7f8fa;
  padding-bottom: 20px;
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
</style>
