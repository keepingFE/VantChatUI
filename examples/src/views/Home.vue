<template>
  <div class="home-page">
    <van-nav-bar title="ChatVant 组件示例" fixed />

    <div class="content">
      <van-cell-group inset>
        <van-cell v-for="demo in demos" :key="demo.path" :title="demo.title" :label="demo.description" is-link
          @click="goToDemo(demo.path)" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const demos = [
  {
    path: "/full",
    title: "完整示例",
    description: "包含所有功能的完整聊天示例",
  },
  {
    path: "/basic",
    title: "基础聊天",
    description: "基本的聊天功能，包含文本消息",
  },
  {
    path: "/typing",
    title: "打字效果",
    description: "打字机效果、思考中状态、输入中气泡",
  },
  {
    path: "/file",
    title: "文件上传",
    description: "支持图片和文档上传功能",
  },
  {
    path: "/emoji",
    title: "表情选择",
    description: "Emoji 表情选择器",
  },
  {
    path: "/system-message",
    title: "系统消息",
    description: "系统提示消息组件",
  },
  {
    path: "/message-status",
    title: "消息状态",
    description: "消息发送状态指示器",
  },
  {
    path: "/file-card",
    title: "文件卡片",
    description: "文件展示卡片组件",
  },
  {
    path: "/card",
    title: "卡片",
    description: "通用卡片组件",
  },
  {
    path: "/search",
    title: "Search 搜索框",
    description: "搜索输入框组件",
  },
  {
    path: "/button",
    title: "Button 按钮",
    description: "按钮组件，支持多种类型、尺寸和状态",
  },
  {
    path: "/flex",
    title: "Flex 布局",
    description: "弹性布局组件，快速实现各种布局效果",
  },
  {
    path: "/image",
    title: "Image 图片",
    description: "图片展示组件，支持多种适配方式和懒加载",
  },
  {
    path: "/checkbox",
    title: "Checkbox 复选框",
    description: "复选框组件，支持单选和多选",
  },
  {
    path: "/input",
    title: "Input 输入框",
    description: "输入框组件，支持多种输入类型和验证",
  },
  {
    path: "/rich-editor",
    title: "RichEditor 富文本编辑器",
    description: "基于 Tiptap 的富文本编辑器，支持格式化、链接、图片等",
  },
  {
    path: "/chunk-uploader",
    title: "ChunkUploader 大文件上传",
    description: "支持分片上传、断点续传、暂停恢复的大文件上传组件",
  },
  {
    path: "/loading",
    title: "Loading 加载动画",
    description: "基于 van-popup 的加载动画弹框，支持自定义文字和样式",
  },
  {
    path: "/waterfall",
    title: "Waterfall 瀑布流",
    description: "高性能瀑布流图片展示组件，支持自定义列数和间距",
  },
  {
    path: "/sleep-chart",
    title: "SleepChart 睡眠数据图表",
    description: "睡眠数据展示组件，支持拖动切换不同睡眠区间",
  },
  {
    path: "/sleep-ring-chart",
    title: "SleepRingChart 睡眠环形图",
    description: "基于 ECharts 的睡眠环形图，展示睡眠比例和时长",
  },
  {
    path: "/heart-rate-chart",
    title: "HeartRateChart 心率数据图表",
    description: "心率数据展示组件，支持拖动查看不同时间点的心率",
  },
  {
    path: "/steps-chart",
    title: "StepsChart 步数图表",
    description: "步数数据展示组件，支持柱状图和折线图两种模式",
  },
  {
    path: "/blood-oxygen-chart",
    title: "BloodOxygenChart 血氧趋势图",
    description: "血氧饱和度趋势展示组件，支持安全区域和异常值标记",
  },
  {
    path: "/activity-ring-chart",
    title: "ActivityRingChart 运动活动三环",
    description: "类似 Apple Watch 的活动三环显示，展示移动、锻炼和站立数据",
  },
  {
    path: "/weekly-stat-card",
    title: "WeeklyStatCard 健康周报统计",
    description: "健康周报统计卡片，展示一周健康数据汇总、趋势和成就",
  },
  {
    path: "/body-weight-chart",
    title: "BodyWeightChart 体重趋势图",
    description: "体重和BMI趋势图，支持目标设定和健康范围提示",
  },
  {
    path: "/blood-pressure-chart",
    title: "BloodPressureChart 血压图表",
    description: "血压趋势图，同时显示收缩压和舒张压，含健康范围标识",
  },
  {
    path: "/water-intake-chart",
    title: "WaterIntakeChart 水分摄入追踪",
    description: "每日饮水量追踪，包含进度环、柱状图和饮水时间线",
  },
  {
    path: "/calorie-balance-chart",
    title: "CalorieBalanceChart 卡路里平衡图",
    description: "卡路里摄入vs消耗对比图，帮助管理体重和能量平衡",
  },
  {
    path: "/nutrition-pie-chart",
    title: "NutritionPieChart 营养摄入饼图",
    description: "营养素摄入比例可视化，支持饼图和环形图展示",
  },
];

const goToDemo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  height: 100vh;
  background-color: #f7f8fa;
  overflow-y: auto;
  overflow-x: hidden;
}

.content {
  padding-top: 46px;
  padding: 62px 16px 16px;
}
</style>
