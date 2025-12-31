# VantChatUI

ChatVant is a lightweight, mobile-first chat UI component library built with **Vue 3** and **Vant 4**. It provides a set of flexible components to help you build chat interfaces quickly, especially suitable for AI chat applications.

ChatVant 是一个基于 **Vue 3** 和 **Vant 4** 构建的轻量级、移动优先的聊天 UI 组件库。它提供了一套灵活的组件，帮助你快速构建聊天界面，特别适合 AI 聊天应用。

## Features | 特性

- 🚀 **Vue 3 & Vant 4**: Built on modern tech stack | 基于现代技术栈构建
- 📱 **Mobile First**: Designed for mobile web applications | 专为移动端 Web 应用设计
- 💬 **Rich Components**: Includes Chat container, Message bubbles, Composer input, Typing indicators, and more | 丰富的组件：包含聊天容器、消息气泡、输入框、打字指示器等
- 🤖 **AI Ready**: Built-in `Thinking` and `Typing` components, perfect for LLM chat interfaces | AI 就绪：内置思考和打字组件，完美适配 LLM 聊天界面
- 🎨 **Customizable**: Flexible slots and props for deep customization | 可定制：灵活的插槽和属性支持深度定制
- 📜 **Auto Scroll**: Built-in hooks for smooth auto-scrolling behavior | 自动滚动：内置平滑自动滚动行为的 Hooks

## Components | 组件

### Chat Components | 聊天组件

- **Chat**: Main container component for chat interface, manages message list and input area layout  
  聊天界面的主容器组件，管理消息列表和输入区域布局
- **Message**: Message bubble component, supports text, images and other message types with left/right positioning  
  消息气泡组件，支持文本、图片等多种消息类型，可设置左右位置
- **Composer**: Message input component with support for text input and file uploads  
  消息输入组件，支持文本输入和文件上传
- **SystemMessage**: System message component for displaying system notifications (e.g., "User joined")  
  系统消息组件，用于显示系统提示信息（如"用户已加入"）
- **MessageStatus**: Message status component showing delivery states (sending, delivered, read, etc.)  
  消息状态组件，显示消息的发送状态（发送中、已送达、已读等）
- **MessageActions**: Message action buttons component for operations like copy, delete, etc.  
  消息操作按钮组件，用于复制、删除等操作
- **QuickReplies**: Quick reply buttons component for fast response options  
  快捷回复按钮组件，用于快速回复选项
- **Avatar**: User avatar component for displaying profile pictures  
  用户头像组件，用于显示用户头像
- **EmojiPicker**: Emoji picker component for selecting emojis  
  表情选择器组件，用于选择表情符号
- **FeedbackButton**: Feedback button component for message rating  
  反馈按钮组件，用于消息评分
- **RegenerateButton**: Regenerate button component for AI response regeneration  
  重新生成按钮组件，用于 AI 回复重新生成

### Status Indicators | 状态指示器

- **Typing**: Typing indicator showing animated effect when someone is typing  
  打字中指示器，显示对方正在输入的动画效果
- **Thinking**: Thinking indicator for AI processing states  
  思考中指示器，适用于 AI 处理状态的显示
- **Loading**: Loading indicator component for async operations  
  加载指示器组件，用于异步操作的加载状态

### Input & Editor Components | 输入与编辑组件

- **RichEditor**: Rich text editor component with advanced text editing features  
  富文本编辑器组件，支持更丰富的文本编辑功能
- **Input**: Input component providing basic text input functionality  
  输入框组件，提供基础的文本输入功能
- **Search**: Search box component with search input and functionality  
  搜索框组件，提供搜索输入和搜索功能

### Basic UI Components | 基础 UI 组件

- **Button**: Button component with various styles and states  
  按钮组件，提供各种样式和状态的按钮
- **ButtonGroup**: Button group component for combining multiple buttons  
  按钮组组件，用于组合多个按钮
- **Card**: Card component as a container for content display  
  卡片组件，用于内容展示的容器
- **FileCard**: File card component displaying file information (name, size, type, etc.)  
  文件卡片组件，用于显示文件信息（文件名、大小、类型等）
- **Image**: Image component with preview and loading state support  
  图片组件，支持预览、加载状态等功能
- **Checkbox**: Checkbox component for single option selection  
  复选框组件，用于单个选项的选择
- **CheckboxGroup**: Checkbox group component for managing multiple checkboxes  
  复选框组组件，用于管理多个复选框
- **File**: File component for file display and operations  
  文件组件，用于文件展示和操作
- **ErrorMessage**: Error message component for displaying error information  
  错误消息组件，用于显示错误信息
- **BackToTop**: Back to top button component for quick page scrolling  
  返回顶部按钮组件，用于快速滚动到页面顶部
- **FloatingButton**: Floating action button component  
  浮动操作按钮组件
- **Waterfall**: Waterfall layout component for image galleries  
  瀑布流布局组件，用于图片画廊展示
- **MarkdownRenderer**: Markdown content renderer component  
  Markdown 内容渲染器组件
- **ChunkUploader**: Chunk file uploader component for large files  
  分片文件上传组件，用于大文件上传

### Layout Components | 布局组件

- **Flex**: Flexible layout container component based on Flexbox  
  弹性布局容器组件，基于 Flexbox 布局
- **FlexItem**: Flexible layout item component used as child of Flex  
  弹性布局项组件，作为 Flex 的子项使用

### Health & Fitness Components | 健康与健身组件

#### Activity & Exercise | 活动与运动

- **ActivityRingChart**: Activity ring chart component showing daily activity goals  
  活动圆环图组件，显示每日活动目标完成情况
- **StepsChart**: Steps chart component for tracking daily steps  
  步数图表组件，用于追踪每日步数
- **RunningDashboard**: Running dashboard component with comprehensive running metrics  
  跑步仪表盘组件，显示全面的跑步数据
- **CyclingChart**: Cycling chart component for cycling activity tracking  
  骑行图表组件，用于骑行活动追踪
- **SwimmingChart**: Swimming chart component for swimming workout data  
  游泳图表组件，用于游泳训练数据展示
- **StrengthTrainingChart**: Strength training chart component for weight training records  
  力量训练图表组件，用于重量训练记录
- **WorkoutCalendar**: Workout calendar component for exercise schedule planning  
  运动日历组件，用于运动计划安排
- **WorkoutPaceChart**: Workout pace chart component showing pace variations  
  运动配速图表组件，显示配速变化
- **WorkoutZoneChart**: Workout zone chart component for heart rate zones  
  运动区间图表组件，用于心率区间展示
- **ExerciseDetailCard**: Exercise detail card component showing workout summary  
  运动详情卡片组件，显示运动摘要信息
- **SportRouteView**: Sport route view component for GPS route visualization  
  运动路线视图组件，用于 GPS 路线可视化
- **CalorieBalanceChart**: Calorie balance chart component for intake vs burn tracking  
  卡路里平衡图表组件，用于摄入与消耗追踪

#### Vital Signs | 生命体征

- **HeartRateChart**: Heart rate chart component for heart rate monitoring  
  心率图表组件，用于心率监测
- **HRVChart**: HRV (Heart Rate Variability) chart component  
  心率变异性图表组件
- **BloodPressureChart**: Blood pressure chart component for BP tracking  
  血压图表组件，用于血压追踪
- **BloodOxygenChart**: Blood oxygen chart component for SpO2 monitoring  
  血氧图表组件，用于血氧饱和度监测
- **BloodSugarChart**: Blood sugar chart component for glucose level tracking  
  血糖图表组件，用于血糖水平追踪
- **TemperatureChart**: Temperature chart component for body temperature monitoring  
  体温图表组件，用于体温监测
- **RespiratoryRateChart**: Respiratory rate chart component for breathing rate tracking  
  呼吸率图表组件，用于呼吸频率追踪
- **ECGChart**: ECG (Electrocardiogram) chart component for heart rhythm display  
  心电图组件，用于心律显示

#### Body Metrics | 身体指标

- **BodyWeightChart**: Body weight chart component for weight tracking  
  体重图表组件，用于体重追踪
- **BodyFatScale**: Body fat scale component showing body composition  
  体脂秤组件，显示身体成分数据
- **BodyMeasurements**: Body measurements component for tracking body dimensions  
  身体测量组件，用于追踪身体尺寸

#### Sleep & Recovery | 睡眠与恢复

- **SleepChart**: Sleep chart component for sleep pattern analysis  
  睡眠图表组件，用于睡眠模式分析
- **SleepRingChart**: Sleep ring chart component showing sleep quality  
  睡眠圆环图组件，显示睡眠质量
- **SleepScoreCard**: Sleep score card component with sleep quality rating  
  睡眠评分卡片组件，显示睡眠质量评分

#### Nutrition & Hydration | 营养与水分

- **NutritionPieChart**: Nutrition pie chart component for macronutrient breakdown  
  营养饼图组件，用于宏量营养素分解
- **WaterIntakeChart**: Water intake chart component for hydration tracking  
  饮水量图表组件，用于水分摄入追踪
- **FoodLogList**: Food log list component for meal tracking  
  食物日志列表组件，用于饮食记录

#### Mental Health & Wellness | 心理健康与健康管理

- **MoodTracker**: Mood tracker component for emotional state logging  
  情绪追踪器组件，用于情绪状态记录
- **StressLevelChart**: Stress level chart component for stress monitoring  
  压力水平图表组件，用于压力监测
- **BreathingGuide**: Breathing guide component for meditation and relaxation  
  呼吸引导组件，用于冥想和放松
- **MedicationReminder**: Medication reminder component for medicine schedule  
  用药提醒组件，用于药物时间表管理

#### Health Goals & Challenges | 健康目标与挑战

- **GoalProgressCard**: Goal progress card component showing achievement progress  
  目标进度卡片组件，显示目标完成进度
- **ChallengeCard**: Challenge card component for fitness challenges  
  挑战卡片组件，用于健身挑战
- **AchievementBadge**: Achievement badge component for milestone rewards  
  成就徽章组件，用于里程碑奖励
- **LeaderboardCard**: Leaderboard card component for competition rankings  
  排行榜卡片组件，用于竞赛排名
- **WeeklyStatCard**: Weekly stat card component showing weekly summary  
  周统计卡片组件，显示每周摘要
- **HealthScoreCard**: Health score card component with overall health rating  
  健康评分卡片组件，显示整体健康评分

#### Lifestyle & Habits | 生活方式与习惯

- **HabitTracker**: Habit tracker component for daily habit monitoring  
  习惯追踪器组件，用于每日习惯监测
- **FastingTimer**: Fasting timer component for intermittent fasting tracking  
  禁食计时器组件，用于间歇性禁食追踪
- **SedentaryReminder**: Sedentary reminder component for activity prompts  
  久坐提醒组件，用于活动提示

#### Women's Health | 女性健康

- **MenstrualCycleChart**: Menstrual cycle chart component for period tracking  
  月经周期图表组件，用于经期追踪

#### Rehabilitation | 康复

- **RehabProgress**: Rehabilitation progress component for recovery tracking  
  康复进度组件，用于恢复追踪
- **PostureAnalysis**: Posture analysis component for posture monitoring  
  姿势分析组件，用于姿势监测

### Media Components | 媒体组件

- **VideoPlayer**: Video player component with full playback controls, fullscreen support, and responsive design  
  视频播放器组件，支持完整的播放控制、全屏功能和响应式设计
- **AudioPlayer**: Audio player component with cover art, playback controls, and customizable theme  
  音频播放器组件，支持封面图、播放控制和自定义主题
- **AudioWaveform**: Audio waveform component for audio visualization  
  音频波形组件，用于音频可视化

## Hooks

- **useAutoScroll**: Auto-scroll hook for automatically scrolling message list to bottom  
  自动滚动 Hook，用于消息列表的自动滚动到底部
- **useTypewriter**: Typewriter effect hook for character-by-character text animation  
  打字机效果 Hook，实现文字逐字显示的动画效果

## Getting Started | 快速开始

### Prerequisites | 前置要求

- Node.js >= 16
- Vue >= 3.4
- Vant >= 4.8

### Installation | 安装

#### 方式一：通过 npm 安装（推荐）

```bash
npm install chatvant
# or
yarn add chatvant
# or
pnpm add chatvant
```

**如果需要使用 RichEditor 组件**，还需要安装 TipTap 依赖：

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit
```

#### 方式二：从源码构建

如果你想从源码构建或参与开发：

```bash
git clone https://github.com/your-username/chatvant.git
cd chatvant
npm install
npm run build:lib
```

### Quick Start | 快速开始

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import 'vant/lib/index.css';
import 'chatvant/dist/chatvant.css';

createApp(App).mount('#app');
```

```vue
<!-- App.vue -->
<script setup>
import { Chat, Message, Composer } from 'chatvant';
import { ref } from 'vue';

const messages = ref([
  { id: 1, type: 'text', content: 'Hello!', position: 'left' }
]);

const handleSend = (content) => {
  messages.value.push({
    id: Date.now(),
    type: 'text',
    content,
    position: 'right'
  });
};
</script>

<template>
  <Chat>
    <Message
      v-for="msg in messages"
      :key="msg.id"
      :type="msg.type"
      :content="msg.content"
      :position="msg.position"
    />
    <template #composer>
      <Composer @send="handleSend" />
    </template>
  </Chat>
</template>
```

### Running the Demo | 运行示例

To see the components in action, you can run the example project:

要查看组件的实际效果，可以运行示例项目：

```bash
npm run dev
```

This will start a Vite development server where you can preview the chat UI.

这将启动一个 Vite 开发服务器，你可以在其中预览聊天 UI。

For more examples, check the `examples/` directory or see [USAGE_EXAMPLE.md](./GUIDE.md).

更多示例请查看 `examples/` 目录或查看 [USAGE_EXAMPLE.md](./GUIDE.md)。

## Project Structure | 项目结构

```
chatvant/
├── examples/          # Demo application using the library | 使用组件库的示例应用
├── packages/          # Library source code | 组件库源代码
│   └── src/
│       ├── components/  # UI Components (Chat, Message, etc.) | UI 组件
│       └── hooks/       # Composable hooks (useAutoScroll, etc.) | 可组合的 Hooks
├── package.json       # Project configuration | 项目配置
└── README.md          # Project documentation | 项目文档
```

## Publishing | 发布到 npm

### 发布前准备

1. **更新版本号**

```bash
cd packages

# 补丁版本（bug 修复）：1.0.0 -> 1.0.1
npm version patch

# 次版本（新功能）：1.0.0 -> 1.1.0
npm version minor

# 主版本（破坏性更新）：1.0.0 -> 2.0.0
npm version major
```

2. **更新仓库地址**

编辑 `packages/package.json`，将仓库地址更新为实际地址：
```json
"repository": {
  "type": "git",
  "url": "https://github.com/your-actual-username/chatvant.git",
  "directory": "packages"
}
```

3. **构建组件库**

```bash
cd packages
npm run build
```

4. **发布前检查**

```bash
npm run check
```

### 发布到 npm

```bash
# 登录 npm（首次发布需要）
npm login

# 发布
npm publish

# 如果是作用域包（如 @your-org/chatvant）
npm publish --access public
```

### 本地测试

在发布前，建议先在本地测试：

```bash
cd packages
npm pack
# 生成 chatvant-1.0.0.tgz

# 在测试项目中安装
cd /path/to/test-project
npm install /path/to/chatvant-1.0.0.tgz
```

更多详细信息请查看 [PUBLISH.md](./PUBLISH.md)。

## Usage After Publishing | 发布后的使用方式

### 安装

```bash
# 基础安装
npm install chatvant

# 如果需要使用 RichEditor 组件
npm install @tiptap/vue-3 @tiptap/starter-kit
```

### 导入和使用

```javascript
// main.js - 全局引入样式
import { createApp } from 'vue';
import App from './App.vue';
import 'vant/lib/index.css';
import 'chatvant/style.css';  // 或 'chatvant/dist/chatvant.css'

createApp(App).mount('#app');
```

```vue
<!-- 在组件中使用 -->
<script setup>
import { Chat, Message, Composer, Typing, Thinking } from 'chatvant';
import { ref } from 'vue';

const messages = ref([
  { id: 1, type: 'text', content: 'Hello!', position: 'left' },
  { id: 2, type: 'text', content: 'Hi there!', position: 'right' }
]);

const isTyping = ref(false);

const handleSend = (content) => {
  messages.value.push({
    id: Date.now(),
    type: 'text',
    content,
    position: 'right'
  });
  
  // 模拟 AI 回复
  isTyping.value = true;
  setTimeout(() => {
    isTyping.value = false;
    messages.value.push({
      id: Date.now(),
      type: 'text',
      content: 'This is an AI response',
      position: 'left'
    });
  }, 2000);
};
</script>

<template>
  <Chat>
    <Message
      v-for="msg in messages"
      :key="msg.id"
      :type="msg.type"
      :content="msg.content"
      :position="msg.position"
    />
    <Typing v-if="isTyping" />
    <template #composer>
      <Composer @send="handleSend" />
    </template>
  </Chat>
</template>
```

### 按需导入

```javascript
// 只导入需要的组件
import { Chat, Message } from 'chatvant';

// 导入 Hooks
import { useAutoScroll, useTypewriter } from 'chatvant';
```

### 使用 RichEditor

如果需要使用富文本编辑器组件，需要先安装依赖：

```bash
npm install @tiptap/vue-3 @tiptap/starter-kit
```

然后在组件中使用：

```vue
<script setup>
import { RichEditor } from 'chatvant';
import { ref } from 'vue';

const content = ref('');

const handleUploadImage = async (file) => {
  // 自定义图片上传逻辑
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  return data.url;
};
</script>

<template>
  <RichEditor
    v-model="content"
    placeholder="请输入内容..."
    :upload-image="handleUploadImage"
  />
</template>
```

## Contributing | 贡献

Contributions are welcome! Please feel free to submit a Pull Request.

欢迎贡献！请随时提交 Pull Request。

1. Fork the Project | 复刻项目
2. Create your Feature Branch | 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes | 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch | 推送到分支 (`git push origin feature/AmazingFeature`)
5. Open a Pull Request | 开启 Pull Request

## License | 许可证

Distributed under the MIT License. See `package.json` for more information.

采用 MIT 许可证分发。更多信息请查看 `package.json`。
