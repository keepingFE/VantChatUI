ChatVant - Mobile Chat UI Component Library
Note: This project is designed to replicate the Alibaba ChatUI experience using Vue 3, Vant 4, and pure JavaScript in a Monorepo structure.

ChatVant 是一个基于 Vue 3 和 Vant 4 的移动端对话组件库解决方案。它旨在在不使用 TypeScript 的前提下，提供企业级、高度可定制的聊天界面，完美复刻 ChatUI 的视觉细节与交互体验。

🛠 1. 项目概述 (Project Overview)
核心目标: 提供开箱即用的移动端聊天界面，支持文本、图片、系统消息等多种类型。

技术栈:

Framework: Vue 3 (Script Setup)

Build Tool: Vite

UI Base: Vant 4 (Deep Customization)

Styling: SCSS (Dart Sass)

Language: JavaScript (No TypeScript)

架构设计: Monorepo 风格

packages/: 核心组件库源码 (Headless 思想)

examples/: 演示项目 (包含 ChatUI 主题样式)

📂 2. 目录结构 (Directory Structure)
text
ChatVant/
├── packages/                   # [核心组件库] - 业务无关，通用逻辑
│   └── src/
│       ├── components/
│       │   ├── Chat/           # 聊天主容器 (布局 & 滚动管理)
│       │   │   ├── index.vue
│       │   │   └── style.scss
│       │   ├── Message/        # 消息气泡 (工厂模式)
│       │   │   ├── index.vue
│       │   │   └── style.scss
│       │   └── Composer/       # 底部输入区 (输入框 & 工具栏)
│       │       ├── index.vue
│       │       └── style.scss
│       ├── hooks/
│       │   └── useAutoScroll.js # 核心 Hook: 自动滚动逻辑
│       └── index.js            # 组件库统一导出入口
│
├── examples/                   # [演示项目] - 业务模拟，样式定制
│   ├── src/
│   │   ├── styles/             # [重点] ChatUI 高仿主题样式
│   │   │   └── chatui-theme.scss
│   │   ├── App.vue             # 演示入口 (Mock数据交互)
│   │   └── main.js
│   ├── vite.config.js
│   └── index.html
│
├── package.json
└── README.md
🎨 3. 核心特性与规范 (Features & Specs)
A. 聊天容器 (Chat Container)
布局: Flex Column 布局，中间区域 flex: 1 并支持滚动。

安全区域: 自动适配 iPhone 底部安全区 (safe-area-inset-bottom)。

自动滚动: 监听消息列表变化，平滑滚动到底部。

B. 消息气泡 (Message Bubble)
类型支持: text (文本), image (图片), system (系统通知).

视觉还原:

对方: 白底黑字，左上角尖角 (2px)，其余圆角 12px。

我方: 阿里蓝 (#2b6de5) 底白字，右上角尖角 (2px)。

C. 输入区域 (Composer)
交互: 仿微信/ChatUI 布局。

组件: 使用 van-field 实现高度自适应 (autosize)。

细节: 输入框无边框，背景为圆角灰色 (#f2f4f5)。

🤖 4. AI 开发提示词 (AI Prompt)
复制以下内容发送给 AI (Claude 3.5 / ChatGPT-4)，一键生成项目代码：

text
# Role
你是一位拥有 10 年经验的前端架构师，精通 Vue 3 (Script Setup) 和移动端交互设计。
我正在构建一个名为 `ChatVant` 的移动端对话组件库，目标是复刻阿里巴巴 "ChatUI" 的核心体验。

# Context
这是一个 Monorepo 风格的项目，分为 `packages` (核心库) 和 `examples` (演示应用)。
- **技术栈**: Vue 3, Vite, Vant 4, SCSS.
- **语言**: 纯 JavaScript (严禁 TypeScript)。
- **风格**: 代码必须干净、模块化，符合开源项目标准。

# Task
请按照以下详细规范，生成核心文件的完整代码。

## 1. 目录结构
packages/
  src/
    components/
      Chat/         # 布局容器 (Layout)
      Message/      # 消息气泡 (Bubble)
      Composer/     # 输入区域 (Input)
    hooks/
      useAutoScroll.js
    index.js        # 统一导出 (见下方导出规范)
examples/
  src/
    styles/         # 主题变量与全局样式
    App.vue         # 交互演示

## 2. 核心组件规范

### A. 组件导出入口: `packages/src/index.js`
- **功能**: 统一导出所有组件和 Hooks。
- **规范**:
  ```javascript
  export { default as Chat } from './components/Chat/index.vue'
  export { default as Message } from './components/Message/index.vue'
  export { default as Composer } from './components/Composer/index.vue'
  export { useAutoScroll } from './hooks/useAutoScroll.js'
  ```

### B. 核心 Hook: `packages/src/hooks/useAutoScroll.js`
- **功能**: 监听数据变化，自动平滑滚动到底部。
- **参数**:
  - `scrollRef` (Ref): DOM 元素引用
  - `dataList` (Ref): 消息数组的响应式引用
- **返回值**:
  ```javascript
  {
    scrollToBottom: () => void  // 手动触发滚动到底部的方法
  }
  ```
- **实现细节**:
  - 使用 `watch` 监听 `dataList` 变化
  - 必须使用 `nextTick` 确保 DOM 更新后再滚动
  - 滚动行为使用 `behavior: 'smooth'` 实现平滑滚动
  - 滚动到容器的 `scrollHeight` 位置

### C. 聊天容器: `packages/src/components/Chat/index.vue`
- **Props**: 无 (通过 Slot 传递内容)。
- **Layout**:
  - 外层容器: `height: 100vh`, `background: #f7f8fa`, Flex 纵向布局 (`flex-direction: column`).
  - 消息列表区域: `flex: 1`, `overflow-y: auto`, `padding: 16px`, 使用 ref 引用以便自动滚动。
  - 底部输入区: 固定在底部，`background: #fff`, 处理 iOS 安全区域: `padding-bottom: env(safe-area-inset-bottom);`。
- **Slots**: `navbar` (顶部导航栏), `default` (消息列表), `composer` (底部输入区)。
- **滚动管理**:
  - 使用 `useAutoScroll` Hook 监听消息列表变化，自动滚动到底部
  - 滚动容器需要添加 `ref="scrollRef"` 以便 Hook 访问

### D. 消息气泡: `packages/src/components/Message/index.vue`
- **Props**: `msg` (Object)，数据结构如下：
  ```javascript
  {
    _id: '唯一ID',
    type: 'text' | 'image' | 'system',  // 消息类型
    content: '消息内容或图片URL',
    position: 'left' | 'right',  // left=对方, right=我方 (仅 text/image 类型需要)
    user: {  // 可选，用于显示头像和昵称 (仅 text/image 类型需要)
      avatar: '头像URL',
      name: '用户名'
    }
  }
  ```
- **UI 逻辑**:
  - **System**:
    - 居中灰色小字 (font-size: 12px, color: #999)
    - 无气泡，不需要 position 和 user 字段
    - 上下边距: margin: 8px 0
  - **Text**:
    - 根据 `position` 决定布局方向 (left=左对齐显示头像在左, right=右对齐头像在右)
    - 头像尺寸: 40px × 40px，圆形 (border-radius: 50%)
    - 头像与气泡间距: 8px
    - 气泡内边距: 10px 12px
    - 气泡最大宽度: 70% (防止过长)
    - 文字大小: 15px，行高: 1.5
    - 长文本自动换行: word-wrap: break-word
  - **Image**:
    - 使用 `<van-image fit="cover">`
    - 图片尺寸: 最大宽度 200px，最大高度 200px
    - 图片圆角: 8px
    - 点击触发 Vant 的 `showImagePreview` (需从 'vant' 导入)
    - 加载失败显示占位图
- **气泡样式**:
  - 对方 (position='left'):
    - 背景: #ffffff
    - 文字: #000000
    - 圆角: 左上角 2px，其余 12px (border-radius: 2px 12px 12px 12px)
    - 阴影: box-shadow: 0 1px 2px rgba(0,0,0,0.1)
  - 我方 (position='right'):
    - 背景: #2b6de5 (阿里蓝)
    - 文字: #ffffff
    - 圆角: 右上角 2px，其余 12px (border-radius: 12px 2px 12px 12px)
- **间距规范**:
  - 消息之间的垂直间距: 12px
  - 同一方连续消息可以减少间距至 4px (可选优化)

### E. 输入区: `packages/src/components/Composer/index.vue`
- **Props**: `modelValue` (String, 输入框内容，支持 v-model)。
- **Events**:
  - `@send` (发送消息事件，参数为输入的文本内容)
  - `@update:modelValue` (输入内容变化事件，用于 v-model)
- **UI 结构**:
  - 整体容器:
    - 背景: #ffffff
    - 内边距: 8px 12px
    - 上边框: 1px solid #ebedf0
  - 左侧: 语音图标 (`van-icon name="volume-o"`, size="24", color="#969799")
  - 中间: **外层容器**
    - 背景: #f2f4f5 (灰色圆角背景)
    - 圆角: 20px
    - 内边距: 8px 12px
    - flex: 1 (占据剩余空间)
    - 内嵌 `<van-field>`:
      - 设置 `type="textarea"`, `rows="1"`, `autosize`
      - 最大行数: `max-rows="4"` (防止过高)
      - 字体大小: 15px
      - **关键样式**: 通过 CSS 去除 van-field 的默认 padding、border、background，使其完全融入外层容器
  - 右侧:
    - 表情图标 (`van-icon name="smile-o"`, size="24", color="#969799")
    - 条件渲染:
      - 有输入内容时: 显示发送按钮 (蓝色文字 "发送", color: #2b6de5, font-size: 15px, font-weight: 500)
      - 无输入内容时: 显示加号图标 (`van-icon name="plus"`, size="24", color="#969799")
  - 图标间距: 左右图标与输入框间距 8px
- **样式层级说明**: 圆角灰色背景应用在外层容器上，van-field 本身应该是透明无边框的。
- **交互逻辑**:
  - 点击发送按钮时，触发 `@send` 事件并清空输入框
  - 输入框为空时，发送按钮不可见
  - 支持键盘 Enter 键发送 (Shift+Enter 换行)
  - 发送后自动聚焦输入框

## 3. 样式系统

### A. 主题样式文件: `examples/src/styles/chatui-theme.scss`
定义以下完整的 SCSS 变量：
```scss
// ========== 颜色系统 ==========
// 主题色
$primary-color: #2b6de5;        // 阿里蓝 (我方气泡背景)
$text-on-primary: #ffffff;      // 我方气泡文字颜色

// 对方气泡
$bubble-left-bg: #ffffff;       // 对方气泡背景 (白色)
$bubble-left-text: #000000;     // 对方气泡文字颜色 (黑色)

// 系统消息
$system-text-color: #999999;    // 系统消息文字颜色 (灰色)

// 背景色
$chat-bg: #f7f8fa;              // 聊天容器背景色
$composer-container-bg: #ffffff; // 输入区容器背景

// 输入框
$composer-bg: #f2f4f5;          // 输入框背景色
$composer-border-color: #ebedf0; // 输入区上边框颜色

// 图标颜色
$icon-color: #969799;           // 图标默认颜色

// ========== 尺寸系统 ==========
// 圆角
$bubble-radius: 12px;           // 气泡常规圆角
$bubble-sharp-radius: 2px;      // 气泡尖角圆角
$composer-border-radius: 20px;  // 输入框圆角
$avatar-radius: 50%;            // 头像圆角 (圆形)
$image-radius: 8px;             // 图片消息圆角

// 尺寸
$avatar-size: 40px;             // 头像尺寸
$icon-size: 24px;               // 图标尺寸
$image-max-width: 200px;        // 图片消息最大宽度
$image-max-height: 200px;       // 图片消息最大高度
$bubble-max-width: 70%;         // 气泡最大宽度

// 间距
$message-gap: 12px;             // 消息之间的间距
$avatar-gap: 8px;               // 头像与气泡的间距
$icon-gap: 8px;                 // 图标间距
$container-padding: 16px;       // 容器内边距
$bubble-padding-v: 10px;        // 气泡垂直内边距
$bubble-padding-h: 12px;        // 气泡水平内边距
$composer-padding: 8px 12px;    // 输入区内边距

// 字体
$font-size-base: 15px;          // 基础字体大小
$font-size-small: 12px;         // 小字体 (系统消息)
$line-height-base: 1.5;         // 基础行高

// 阴影
$bubble-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); // 气泡阴影
```

### B. 组件样式组织
- **组件内样式** (`packages/src/components/*/style.scss`):
  - 使用 `<style scoped lang="scss">`
  - 只包含组件结构样式，不包含主题颜色
  - 通过 CSS 变量或 props 接收主题色
- **主题样式** (`examples/src/styles/chatui-theme.scss`):
  - 在 `examples/src/main.js` 中全局引入
  - 定义所有颜色、尺寸变量
  - 可以被组件通过 `@import` 引用

### C. 全局样式重置 (可选)
在 `examples/src/styles/reset.scss` 中添加：
```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 4. 交互演示 (examples/src/App.vue)

### A. 数据初始化
```javascript
const messages = ref([
  {
    _id: '1',
    type: 'system',
    content: '欢迎使用 ChatVant'
    // system 类型不需要 position 和 user
  },
  {
    _id: '2',
    type: 'text',
    content: '你好！我是智能助手，有什么可以帮你的吗？',
    position: 'left',
    user: {
      avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',  // 使用 Vant 示例图片
      name: 'AI助手'
    }
  }
])

// 用户信息
const currentUser = {
  avatar: 'https://img.yzcdn.cn/vant/logo.png',
  name: '我'
}
```

### B. 发送消息逻辑
```javascript
const handleSend = (text) => {
  // 1. 添加用户消息
  const userMsg = {
    _id: `${Date.now()}_${Math.random()}`,
    type: 'text',
    content: text,
    position: 'right',
    user: currentUser
  }
  messages.value.push(userMsg)

  // 2. 模拟机器人回复
  setTimeout(() => {
    const botMsg = {
      _id: `${Date.now()}_${Math.random()}`,
      type: Math.random() > 0.7 ? 'image' : 'text',  // 30% 概率回复图片
      content: Math.random() > 0.7
        ? 'https://img.yzcdn.cn/vant/cat.jpeg'  // 图片消息
        : `收到你的消息: "${text}"`,  // 文本消息
      position: 'left',
      user: {
        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        name: 'AI助手'
      }
    }
    messages.value.push(botMsg)
  }, 1000)
}
```

### C. 组件使用示例
```vue
<template>
  <Chat>
    <template #navbar>
      <van-nav-bar title="ChatVant Demo" fixed />
    </template>

    <template #default>
      <Message
        v-for="msg in messages"
        :key="msg._id"
        :msg="msg"
      />
    </template>

    <template #composer>
      <Composer @send="handleSend" />
    </template>
  </Chat>
</template>
```

### D. main.js 配置
```javascript
import { createApp } from 'vue'
import App from './App.vue'

// 引入 Vant 样式
import 'vant/lib/index.css'

// 引入主题样式
import './styles/chatui-theme.scss'

// 可选: 引入全局样式重置
// import './styles/reset.scss'

createApp(App).mount('#app')
```

# Output Requirements

## 代码质量要求
1. **代码完整性**:
   - 不要省略任何 CSS 细节，我要复制即用的代码
   - 每个组件必须包含完整的 template、script、style 三部分
   - 所有交互逻辑必须完整实现

2. **文件标注**:
   - 每个代码块前必须标注 `// File: path/to/file`
   - 例如: `// File: packages/src/components/Chat/index.vue`

3. **注释规范**:
   - 关键逻辑必须加中文注释
   - 复杂的 CSS 样式需要注释说明
   - Props、Events、Slots 需要注释说明用途

4. **导入规范**:
   - Vant 组件使用自动导入 (通过 unplugin-vue-components)，无需手动 import
   - Vant API 需要手动导入: `import { showImagePreview } from 'vant'`
   - Vue API 需要从 'vue' 导入: `import { ref, watch, nextTick } from 'vue'`
   - 组件间导入使用相对路径

5. **数据结构**:
   - 严格按照第 2.D 节定义的消息对象结构生成代码
   - 不要添加未定义的字段
   - 确保类型一致性

6. **样式规范**:
   - 组件样式使用 `<style scoped lang="scss">`
   - 使用第 3.A 节定义的 SCSS 变量
   - 确保移动端适配 (使用 px 单位，Vant 会自动转换)
   - 遵循 BEM 命名规范 (可选)
   - 添加必要的浏览器兼容性前缀

7. **代码风格**:
   - 使用 Vue 3 Composition API (`<script setup>`)
   - 使用 ES6+ 语法 (箭头函数、解构、模板字符串等)
   - 变量命名使用驼峰命名法
   - 常量使用大写下划线命名
   - 保持代码缩进一致 (2 空格)

## 功能完整性要求
8. **边界情况处理**:
   - 空消息列表的处理
   - 图片加载失败的处理
   - 长文本的换行处理
   - 输入框为空时禁止发送

9. **交互细节**:
   - 发送后自动滚动到底部
   - 发送后清空输入框并聚焦
   - 支持 Enter 键发送 (Shift+Enter 换行)
   - 图片点击预览功能

10. **性能优化**:
    - 使用 v-for 时必须添加 :key
    - 避免不必要的响应式数据
    - 图片使用懒加载 (可选)

## 生成顺序
请按以下顺序生成代码：
1. `packages/src/hooks/useAutoScroll.js`
2. `packages/src/components/Chat/index.vue`
3. `packages/src/components/Message/index.vue`
4. `packages/src/components/Composer/index.vue`
5. `packages/src/index.js`
6. `examples/src/styles/chatui-theme.scss`
7. `examples/src/App.vue`
8. `examples/src/main.js`

请开始生成。
🚀 5. 快速开始 (Quick Start)
**步骤 1: 初始化项目**
```bash
npm create vue@latest  # 创建基础 Vue 项目
```

**步骤 2: 安装依赖**
```bash
npm install vant
npm install sass unplugin-vue-components unplugin-auto-import -D
```

**步骤 3: 配置 Vite**
在 `vite.config.js` 中配置 unplugin-vue-components 实现 Vant 组件自动按需引入：
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()]
    })
  ]
})
```

**步骤 4: 生成代码**
将第 4 节的 AI Prompt 发送给 AI (Claude 4.5 / ChatGPT-5)，将生成的代码填入对应文件。

**步骤 5: 启动演示**
```bash
npm run dev
```

---

**License**: MIT
**Author**: ChatVant Team