<template>
  <div class="demo-page">
    <van-nav-bar
      title="FoodLogList 饮食记录"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />

    <div class="demo-content">
      <FoodLogList date="12月26日" day="今天" :log="foodLog" />
      <div class="spacing"></div>
      <FoodLogList date="12月25日" day="昨天" :log="yesterdayLog" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { FoodLogList } from "chatvant";

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const foodLog = ref([
  {
    type: "breakfast",
    time: "08:00",
    calories: 420,
    foods: [
      {
        name: "全麦面包",
        amount: "2片",
        image: "https://img.yzcdn.cn/vant/apple-1.jpg",
      },
      {
        name: "煮鸡蛋",
        amount: "1个",
        image: "https://img.yzcdn.cn/vant/cat.jpeg",
      },
      {
        name: "牛奶",
        amount: "200ml",
        image: "https://img.yzcdn.cn/vant/sand.jpg",
      },
    ],
  },
  {
    type: "lunch",
    time: "12:30",
    calories: 760,
    foods: [
      {
        name: "鸡胸肉沙拉",
        amount: "1份",
        image: "https://img.yzcdn.cn/vant/leaf.jpg",
      },
      {
        name: "糙米饭",
        amount: "150g",
        image: "https://img.yzcdn.cn/vant/tree.jpg",
      },
    ],
  },
  {
    type: "snack",
    time: "15:30",
    calories: 120,
    foods: [
      {
        name: "坚果混合",
        amount: "20g",
        image: "https://img.yzcdn.cn/vant/apple-2.jpg",
      },
    ],
  },
]);

const yesterdayLog = ref([
  {
    type: "dinner",
    time: "19:00",
    calories: 550,
    foods: [
      {
        name: "番茄意面",
        amount: "1份",
        image: "https://img.yzcdn.cn/vant/apple-1.jpg",
      },
    ],
  },
]);
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

.demo-content {
  background: #f7f8fa;
}

.spacing {
  height: 16px;
}
</style>
