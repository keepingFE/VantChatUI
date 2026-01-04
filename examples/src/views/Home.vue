<template>
  <div class="home-page">
    <van-nav-bar title="ChatVant 组件示例" fixed />

    <div class="content">
      <div v-for="demo in demos" :key="demo.path" class="demo-item">
        <van-cell :title="demo.title" :label="demo.description" is-link center @click="goToDemo(demo.path)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const demos = [
  {
    path: "/navbar",
    title: "🆕 Navbar 导航栏",
    description: "聊天界面顶部导航栏，支持返回、标题、操作按钮",
  },
  {
    path: "/modal",
    title: "🆕 Modal 模态对话框",
    description: "模态对话框，确认、提示、自定义内容",
  },
  {
    path: "/popup",
    title: "🆕 Popup 弹出层",
    description: "弹出层组件，支持上下左右中五个方向弹出",
  },
  {
    path: "/toast",
    title: "🆕 Toast 轻提示",
    description: "轻量级提示组件，成功、失败、警告、加载状态",
  },
  {
    path: "/time",
    title: "🆕 Time 时间显示",
    description: "智能时间格式化，相对时间、自动更新",
  },
  {
    path: "/empty",
    title: "🆕 Empty 空状态",
    description: "空状态占位组件，无数据、无消息提示",
  },
  {
    path: "/recorder",
    title: "🆕 Recorder 语音录制",
    description: "语音录制组件，按住录音、松开发送",
  },
  {
    path: "/emoji-picker",
    title: "🆕 EmojiPicker 表情选择器",
    description: "表情选择器，分类展示、最近使用",
  },
  {
    path: "/carousel",
    title: "🆕 Carousel 轮播卡片",
    description: "轮播卡片组件，支持滑动、自动播放、自定义内容",
  },
  {
    path: "/list",
    title: "🆕 List 列表消息",
    description: "列表消息组件，支持头像、徽章、自定义内容",
  },
  {
    path: "/action-sheet",
    title: "🆕 ActionSheet 动作面板",
    description: "动作面板组件，支持图标、禁用、加载状态",
  },
  {
    path: "/badge",
    title: "🆕 Badge 徽章",
    description: "徽章组件，支持数字、小红点、自定义颜色和位置",
  },
  {
    path: "/infinite-scroll",
    title: "🆕 InfiniteScroll 无限滚动",
    description: "无限滚动组件，支持上拉加载、错误重试",
  },
  {
    path: "/divider",
    title: "🆕 Divider 分割线",
    description: "分割线组件，支持文字、虚线、垂直分割",
  },
  {
    path: "/scroll-view",
    title: "🆕 ScrollView 滚动视图",
    description: "滚动视图容器，支持下拉刷新、上拉加载",
  },
  {
    path: "/toolbar",
    title: "🆕 Toolbar 工具栏",
    description: "工具栏组件，支持顶部和底部固定",
  },
  {
    path: "/rich-text",
    title: "🆕 RichText 富文本",
    description: "富文本消息组件，安全的 HTML 内容渲染",
  },
  {
    path: "/bubble",
    title: "🆕 Bubble 气泡",
    description: "独立的气泡组件，灵活的消息容器",
  },
  {
    path: "/skeleton",
    title: "🆕 Skeleton 骨架屏",
    description: "加载占位组件，提升用户体验",
  },
  {
    path: "/tag",
    title: "🆕 Tag 标签",
    description: "标签组件，用于标记和分类",
  },
  {
    path: "/progress",
    title: "🆕 Progress 进度条",
    description: "进度条组件，展示操作进度",
  },
  {
    path: "/stepper",
    title: "🆕 Stepper 步进器",
    description: "步进器组件，用于数值调整",
  },
  {
    path: "/switch",
    title: "🆕 Switch 开关",
    description: "开关组件，用于切换状态",
  },
  {
    path: "/ai-chat",
    title: "✨ AI 综合演示 ✨",
    description: "集成 Markdown、流式输出、快捷回复的完整 AI 聊天示例",
  },
  {
    path: "/swimming-chart",
    title: "SwimmingChart 游泳数据",
    description: "游泳数据图表，泳姿分布、SWOLF、配速趋势",
  },
  {
    path: "/cycling-chart",
    title: "CyclingChart 骑行数据",
    description: "骑行数据图表，速度、踏频、功率、爬升分析",
  },
  {
    path: "/workout-calendar",
    title: "WorkoutCalendar 运动日历",
    description: "运动日历组件，月历视图、运动类型标记、月度统计",
  },
  {
    path: "/sleep-score-card",
    title: "SleepScoreCard 睡眠评分",
    description: "睡眠评分卡片，综合评分、因素分析、改善建议",
  },
  {
    path: "/respiratory-rate-chart",
    title: "RespiratoryRateChart 呼吸频率",
    description: "呼吸频率趋势图，实时监测、正常范围标记",
  },
  {
    path: "/posture-analysis",
    title: "PostureAnalysis 体态分析",
    description: "体态分析图，可视化示意、各部位评分、改善建议",
  },
  {
    path: "/rehab-progress",
    title: "RehabProgress 康复进度",
    description: "康复训练进度，训练项目、里程碑、疼痛追踪",
  },
  {
    path: "/leaderboard-card",
    title: "LeaderboardCard 运动排行榜",
    description: "运动排行榜，前三名领奖台、个人排名、趋势显示",
  },
  {
    path: "/goal-progress-card",
    title: "GoalProgressCard 目标进度",
    description: "目标达成进度卡片，进度条、里程碑、激励信息",
  },
  {
    path: "/sedentary-reminder",
    title: "SedentaryReminder 久坐提醒",
    description: "久坐提醒组件，计时器、活动建议、每日统计",
  },
  {
    path: "/audio-waveform",
    title: "AudioWaveform 录音波形图",
    description: "录音时展示的动态波形图动画，支持计时器和音量指示",
  },
  {
    path: "/floating-button",
    title: "FloatingButton 悬浮按钮",
    description: "可在页面可视区范围内任意拖动的悬浮按钮",
  },
  {
    path: "/back-to-top",
    title: "BackToTop 返回顶部",
    description: "滚动页面后自动显示返回顶部按钮，平滑滚动到顶部",
  },
  {
    path: "/strength-training-chart",
    title: "StrengthTrainingChart 力量训练",
    description: "力量训练记录，组数、重量、次数追踪，训练量统计",
  },
  {
    path: "/workout-zone-chart",
    title: "WorkoutZoneChart 运动强度区间",
    description: "心率区间分布图，热身、燃脂、有氧、无氧、极限区分析",
  },
  {
    path: "/achievement-badge",
    title: "AchievementBadge 成就徽章",
    description: "运动成就徽章，支持不同稀有度、等级、解锁动画",
  },
  {
    path: "/challenge-card",
    title: "ChallengeCard 挑战卡片",
    description: "运动挑战活动卡片，进度追踪、奖励展示、社交互动",
  },
  {
    path: "/video-player",
    title: "VideoPlayer 视频播放器",
    description: "功能完整的视频播放器，支持播放控制、进度条、音量调节、全屏",
  },
  {
    path: "/audio-player",
    title: "AudioPlayer 音频播放器",
    description: "移动端音频播放组件，支持响应式适配、播放控制、进度条、音量调节",
  },
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
  {
    path: "/blood-sugar-chart",
    title: "BloodSugarChart 血糖趋势图",
    description: "血糖监测图表，区分餐前餐后，支持健康范围分析",
  },
  {
    path: "/mood-tracker",
    title: "MoodTracker 心情追踪",
    description: "心情日历组件，支持记录和统计心情分布",
  },
  {
    path: "/medication-reminder",
    title: "MedicationReminder 用药提醒",
    description: "今日用药计划列表，支持打卡和状态管理",
  },
  {
    path: "/menstrual-cycle-chart",
    title: "MenstrualCycleChart 经期日历",
    description: "女性健康周期追踪，包含排卵期和易孕期预测",
  },
  {
    path: "/temperature-chart",
    title: "TemperatureChart 体温趋势图",
    description: "基础体温及发热记录图表，支持自动坐标轴缩放",
  },
  {
    path: "/exercise-detail-card",
    title: "ExerciseDetailCard 运动详情",
    description: "单次运动记录卡片，展示心率区间和核心数据",
  },
  {
    path: "/health-score-card",
    title: "HealthScoreCard 健康评分",
    description: "综合健康评分卡片，展示总分及各以维度得分",
  },
  {
    path: "/stress-level-chart",
    title: "StressLevelChart 压力水平",
    description: "全天压力变化柱状图，支持自动颜色分级",
  },
  {
    path: "/hrv-chart",
    title: "HRVChart 心率变异性",
    description: "HRV 趋势图表，监测身心恢复状态",
  },
  {
    path: "/breathing-guide",
    title: "BreathingGuide 呼吸训练",
    description: "4-7-8 动态呼吸引导，缓解焦虑",
  },
  {
    path: "/body-fat-scale",
    title: "BodyFatScale 体脂称",
    description: "体脂率仪表盘，展示身体成分分析",
  },
  {
    path: "/running-dashboard",
    title: "RunningDashboard 运动仪表盘",
    description: "运动实时数据展示，包含配速、心率区间等",
  },
  {
    path: "/fasting-timer",
    title: "FastingTimer 断食计时",
    description: "16:8 轻断食倒计时圆环",
  },
  {
    path: "/habit-tracker",
    title: "HabitTracker 习惯打卡",
    description: "热力图打卡墙，记录生活习惯",
  },
  {
    path: "/food-log-list",
    title: "FoodLogList 饮食记录",
    description: "一日三餐食物流水线",
  },
  {
    path: "/body-measurements",
    title: "BodyMeasurements 身体围度",
    description: "记录腰围、臀围，展示变化趋势",
  },
  {
    path: "/workout-pace-chart",
    title: "WorkoutPaceChart 运动配速",
    description: "可视化分析配速与海拔高度",
  },
  {
    path: "/sport-route-view",
    title: "SportRouteView 轨迹回放",
    description: "地图轨迹回放组件",
  },
  {
    path: "/ecg-chart",
    title: "ECGChart 心电图",
    description: "模拟单导联实时 ECG 波形",
  },
  {
    path: "/markdown-renderer",
    title: "MarkdownRenderer 渲染器",
    description: "AI 聊天 Markdown 渲染，支持代码高亮与流式输出",
  },
  {
    path: "/message-actions",
    title: "MessageActions 消息操作栏",
    description: "消息底部操作栏，支持复制、重试、评价",
  },
  {
    path: "/quick-replies",
    title: "QuickReplies 快捷回复",
    description: "横向滚动的快捷建议气泡，常用于 AI 引导",
  },
  {
    path: "/error-message",
    title: "ErrorMessage 错误提示",
    description: "AI 生成失败时的错误提示，支持重试操作",
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

.home-page::-webkit-scrollbar {
  width: 6px;
}

.home-page::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
  border-radius: 3px;
}

.home-page::-webkit-scrollbar-track {
  background-color: transparent;
}

.content {
  padding-top: 56px;
  /* NavBar height + 10px spacing */
  padding-bottom: 20px;
}

.demo-item {
  margin-bottom: 10px;
}
</style>
