# 更新日志

## [新功能] 添加思考中组件 (Thinking) - 2024

### 功能说明
添加"思考中"组件，用于显示 AI 正在思考的状态，提供更真实的对话体验。

### 实现内容

#### 1. Thinking 组件特性
- ✅ 显示"思考中..."文本
- ✅ 动态省略号动画（三个点依次闪烁）
- ✅ 支持自定义头像
- ✅ 支持自定义思考文本
- ✅ 可选的计时器功能（显示已思考时间）
- ✅ 白色气泡背景，左上角尖角设计
- ✅ 淡入动画效果

#### 2. 组件 Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| avatar | 头像 URL | String | '' |
| text | 思考文本 | String | '思考中' |
| showTimer | 是否显示计时器 | Boolean | false |

#### 3. 使用方法

**基本使用：**
```vue
<template>
  <Chat>
    <template #default>
      <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
      <!-- 思考中组件 -->
      <Thinking v-if="isThinking" :avatar="botAvatar" text="思考中" />
    </template>
  </Chat>
</template>

<script setup>
import { ref } from 'vue'
import { Thinking } from '../../packages/src/index.js'

const isThinking = ref(false)

const handleSend = (text) => {
  // 显示思考中
  isThinking.value = true

  // 模拟思考
  setTimeout(() => {
    isThinking.value = false
    // 添加回复消息
  }, 2000)
}
</script>
```

**带计时器使用：**
```vue
<Thinking
  :avatar="'https://img.yzcdn.cn/vant/cat.jpeg'"
  text="正在分析"
  :show-timer="true"
/>
```

#### 4. 动画效果

**省略号动画：**
```scss
@keyframes dot-blink {
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```
- 三个点依次闪烁
- 动画周期 1.4 秒
- 每个点延迟 0.2 秒

**淡入动画：**
```scss
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 5. 完整交互流程

1. 用户发送消息
2. 显示"思考中..."组件（带动态省略号）
3. 1-2 秒后隐藏思考中
4. 显示打字气泡（三个跳动圆点）
5. 0.5-1 秒后隐藏打字气泡
6. 显示回复消息（打字机效果）

#### 6. 样式特性
- 白色气泡背景
- 左上角 2px 尖角，其余 12px 圆角
- 最大宽度 70%
- 阴影效果：`0 1px 2px rgba(0, 0, 0, 0.1)`
- 内边距：10px 14px
- 思考文本：
  - 字体大小：14px
  - 颜色：#323233
  - 带动态省略号动画
- 计时器样式：
  - 字体大小：12px
  - 颜色：#969799（灰色）
  - 上方分割线：1px solid #ebedf0
  - 显示格式：`已思考 X秒` 或 `已思考 X分Y秒`

#### 7. 计时器功能
- 自动计时，每秒更新
- 显示格式：
  - 小于 60 秒：`X秒`
  - 大于 60 秒：`X分Y秒`
- 组件卸载时自动清理定时器

---

## [新功能] 添加表情包选择器 (Emoji Picker) - 2024

### 功能说明
添加表情包弹框和选择功能，用户可以点击笑脸图标选择表情，表情会自动插入到输入框中。

### 实现内容

#### 1. EmojiPicker 组件
- 底部弹出式表情选择器
- 8 列网格布局，自适应高度
- 包含 120+ 常用表情符号
- 分类包括：笑脸、情绪、手势、爱心、庆祝等
- 点击表情自动关闭弹窗
- 支持滚动浏览所有表情

#### 2. Composer 组件增强
- 点击笑脸图标打开表情选择器
- 选择表情后自动插入到输入框光标位置
- 新增 `@emoji` 事件，传递选中的表情

#### 3. 表情分类

**笑脸类：**
😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩

**情绪类：**
😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 🥱 😴 😌

**手势类：**
👍 👎 👌 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ ✋ 🤚

**爱心类：**
❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓

**其他常用：**
🎉 🎊 🎈 🎁 🏆 🥇 🥈 🥉 ⚽ 🏀 🏈 ⚾

#### 4. 使用方法

**基本使用：**
```vue
<template>
  <Composer @send="handleSend" @emoji="handleEmoji" />
</template>

<script setup>
const handleEmoji = (emoji) => {
  console.log('选择的表情:', emoji)
}
</script>
```

**独立使用 EmojiPicker：**
```vue
<template>
  <EmojiPicker v-model:show="showPicker" @select="handleSelect" />
</template>

<script setup>
import { ref } from 'vue'
import { EmojiPicker } from '../../packages/src/index.js'

const showPicker = ref(false)

const handleSelect = (emoji) => {
  console.log('选中:', emoji)
}
</script>
```

#### 5. Props & Events

**EmojiPicker Props：**

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| show | 是否显示弹窗 | Boolean | false |

**EmojiPicker Events：**

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:show | 显示状态变化 | show: boolean |
| select | 选择表情 | emoji: string |

**Composer 新增 Events：**

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| emoji | 选择表情 | emoji: string |

#### 6. 样式特性
- 弹窗高度：屏幕高度的 40%
- 圆角弹窗设计
- 8 列网格布局
- 表情大小：24px（优化后）
- 表情背景：透明（无白色背景）
- 点击时放大 1.3 倍
- 禁用水平滚动（`overflow-x: hidden`）
- 仅支持垂直滚动
- 平滑滚动效果
- 自定义滚动条样式（4px 宽度）
- 间距优化：10px gap
- 左右边距相等：16px（已修复）
- 完整的 box-sizing 控制，确保布局精确

#### 7. 交互体验
- ✅ 点击笑脸图标打开表情选择器
- ✅ 点击表情自动插入到输入框
- ✅ 点击表情后自动关闭弹窗
- ✅ 表情会追加到当前输入内容后面
- ✅ 支持连续选择多个表情
- ✅ 点击表情时有 1.3 倍缩放动画反馈
- ✅ 点击时显示半透明背景高亮
- ✅ 无水平滚动，仅垂直滚动
- ✅ 表情无白色背景，更简洁

---

## [新功能] 添加打字机效果 + 光标动画 (Typewriter Effect) - 2024

### 功能说明
为 Message 组件添加打字机效果，让文本消息一个字一个字地逐渐显示，并在打字过程中显示闪烁的光标动画，提升用户体验和真实感。

### 实现内容

#### 1. Message 组件增强
- ✅ 支持 `typing` 属性启用打字机效果
- ✅ 支持 `typingSpeed` 属性自定义打字速度（默认 50ms/字符）
- ✅ 打字过程中显示闪烁光标动画
- ✅ 打字完成后自动隐藏光标
- ✅ 自动管理打字动画的生命周期
- ✅ 组件卸载时自动清理定时器

#### 2. useTypewriter Hook
创建了独立的打字机 Hook，可复用于其他场景：

```javascript
import { useTypewriter } from '../../packages/src/hooks/useTypewriter.js'

const { displayText, isTyping, startTyping, stopTyping, showAll } = useTypewriter()

// 开始打字
startTyping('Hello World')

// 停止打字
stopTyping()

// 立即显示全部
showAll('Hello World')
```

#### 3. Typing 组件（打字气泡）
- 三个跳动的圆点动画
- 用于显示对方正在输入的状态
- 支持自定义头像
- 白色气泡背景，左上角尖角设计

#### 4. 使用方法

**方式一：在消息对象中启用打字机效果**

```javascript
const botMsg = {
  _id: '123',
  type: 'text',
  content: '这是一条会逐字显示的消息',
  position: 'left',
  typing: true,        // 启用打字机效果
  typingSpeed: 50,     // 可选，打字速度（毫秒/字符）
  user: {
    avatar: 'avatar.jpg',
    name: 'AI助手'
  }
}
messages.value.push(botMsg)
```

**方式二：配合 Typing 组件显示打字气泡**

```vue
<template>
  <Chat>
    <template #default>
      <Message v-for="msg in messages" :key="msg._id" :msg="msg" />
      <!-- 打字气泡 -->
      <Typing v-if="isTyping" :avatar="botAvatar" />
    </template>
  </Chat>
</template>

<script setup>
const isTyping = ref(false)

const handleSend = (text) => {
  // 1. 显示打字气泡
  isTyping.value = true

  // 2. 模拟回复
  setTimeout(() => {
    isTyping.value = false

    // 3. 添加带打字机效果的消息
    messages.value.push({
      type: 'text',
      content: '回复内容',
      typing: true,
      typingSpeed: 50
    })
  }, 1500)
}
</script>
```

#### 5. 消息对象新增属性

| 属性 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| typing | 是否启用打字机效果 | Boolean | false | 否 |
| typingSpeed | 打字速度（毫秒/字符） | Number | 50 | 否 |

#### 6. 演示效果
- ✅ 发送消息后显示打字气泡（三个跳动圆点）
- ✅ 0.8-1.5 秒后隐藏打字气泡
- ✅ 机器人回复文本消息时，文字逐字显示
- ✅ 图片消息正常显示（不使用打字机效果）
- ✅ 上传文件后也会显示打字气泡和打字机效果

#### 7. 光标动画效果

**CSS 实现：**
```scss
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: currentColor;
  margin-left: 2px;
  animation: cursor-blink 1s infinite;
  vertical-align: text-bottom;
}

@keyframes cursor-blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}
```

**特性：**
- 竖线光标，宽度 2px
- 颜色继承文本颜色（白色气泡显示黑色光标，蓝色气泡显示白色光标）
- 1 秒闪烁一次（0.5 秒显示，0.5 秒隐藏）
- 打字完成后自动消失

#### 8. 技术实现
- 使用 `setInterval` 实现逐字显示
- 使用 `isTypingActive` 控制光标显示/隐藏
- 使用 `watch` 监听消息变化
- 使用 `onUnmounted` 清理定时器，防止内存泄漏
- 支持中英文混合文本
- CSS 动画实现光标闪烁效果

### 参考
- 设计参考：https://chatui.io/components/typing-bubble
- 打字机效果：经典 Typewriter Effect

---

## [新功能] 加号按钮支持文件上传 - 2024

### 功能说明
点击加号按钮可以选择并上传文件，仅支持图片和文档，大小限制 10MB。

### 实现内容

#### 1. Composer 组件
- 添加隐藏的 `<input type="file">` 元素
- 支持多文件选择 (`multiple`)
- **支持的文件类型**：
  - 📷 图片：`image/*` (所有图片格式)
  - 📄 文档：`.pdf, .doc, .docx, .xls, .xlsx`
- **文件大小限制**：最大 10MB
- 新增 `@upload` 事件，传递有效文件数组
- 新增 `@uploadError` 事件，传递错误信息

#### 2. 文件验证逻辑
```javascript
// 文件大小限制：10MB
const MAX_SIZE = 10 * 1024 * 1024

// 过滤超过大小限制的文件
const validFiles = []
const invalidFiles = []

fileArray.forEach(file => {
  if (file.size > MAX_SIZE) {
    invalidFiles.push(file)
  } else {
    validFiles.push(file)
  }
})
```

#### 3. App.vue 演示
- 实现 `handleUpload` 方法处理文件上传
  - 图片文件：使用 `URL.createObjectURL()` 创建本地预览
  - 文档文件：显示文件名和大小（自动转换 KB/MB）
- 实现 `handleUploadError` 方法处理错误
  - 文件超过 10MB 时显示错误提示
- 上传成功后显示 Toast 提示
- 模拟机器人回复确认收到文件

### 使用方法

```vue
<Composer
  @send="handleSend"
  @upload="handleUpload"
  @upload-error="handleUploadError"
/>
```

```javascript
const handleUpload = (files) => {
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      // 处理图片
      const imageUrl = URL.createObjectURL(file)
      // 添加图片消息
    } else {
      // 处理文档
      // 显示文件信息
    }
  })
}

const handleUploadError = (error) => {
  if (error.type === 'size') {
    // 文件大小超过限制
    showToast(`文件大小不能超过 ${error.maxSize / 1024 / 1024}MB`)
  }
}
```

### 限制说明
- ✅ 仅支持图片和文档类型
- ✅ 单个文件最大 10MB
- ✅ 支持多文件同时上传
- ✅ 自动过滤超大文件并提示

---

## [修复] 去掉输入框白色背景 - 2024

### 修复内容
- 为 `.composer-field` 添加 `background: transparent`
- 为 `:deep(.van-field__control)` 添加 `background: transparent !important`
- 为 `:deep(.van-field__body)` 添加 `background: transparent`
- 为 `:deep(.van-cell)` 添加 `background: transparent !important`

现在输入框完全透明，只显示外层的灰色圆角背景 (#f2f4f5)。

---

## [修复] 自动滚动功能优化 - 2024

### 问题描述
聊天窗口内容超过一屏后，不会自动滚动到底部。

### 修复内容

#### 1. `packages/src/components/Chat/index.vue`
**问题**：
- Fixed 定位的导航栏遮挡内容，没有预留空间
- Flex 布局的滚动容器高度计算不正确

**修复**：
```scss
.chat-navbar {
  flex-shrink: 0;
  // 为 fixed 定位的导航栏预留空间
  height: 46px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
  // 确保滚动容器有明确的高度
  min-height: 0;
}
```

#### 2. `packages/src/hooks/useAutoScroll.js`
**问题**：
- 滚动逻辑不够可靠
- 图片等资源加载时，DOM 高度变化导致滚动位置不准确

**修复**：
```javascript
const scrollToBottom = (smooth = true) => {
  nextTick(() => {
    if (scrollRef.value) {
      // 1. 计算正确的滚动距离
      const scrollHeight = scrollRef.value.scrollHeight
      const clientHeight = scrollRef.value.clientHeight
      const maxScrollTop = scrollHeight - clientHeight
      
      // 2. 支持平滑/非平滑滚动
      if (smooth) {
        scrollRef.value.scrollTo({
          top: maxScrollTop,
          behavior: 'smooth'
        })
      } else {
        scrollRef.value.scrollTop = maxScrollTop
      }
      
      // 3. 延迟二次滚动，确保图片等资源加载完成
      setTimeout(() => {
        if (scrollRef.value) {
          const newScrollHeight = scrollRef.value.scrollHeight
          const newClientHeight = scrollRef.value.clientHeight
          const newMaxScrollTop = newScrollHeight - newClientHeight
          scrollRef.value.scrollTop = newMaxScrollTop
        }
      }, 100)
    }
  })
}
```

#### 3. `examples/src/App.vue`
**问题**：
- 初始加载时没有主动触发滚动
- 没有保存 autoScrollInstance 实例

**修复**：
```javascript
// 自动滚动实例
let autoScrollInstance = null

// 使用自动滚动 Hook
onMounted(() => {
  if (chatRef.value && chatRef.value.scrollRef) {
    autoScrollInstance = useAutoScroll(chatRef.value.scrollRef, messages)
    // 初始加载时滚动到底部
    setTimeout(() => {
      autoScrollInstance.scrollToBottom(false)
    }, 100)
  }
})
```

### 修复效果

✅ **页面加载时**：自动滚动到最后一条消息  
✅ **发送消息后**：自动滚动到底部  
✅ **机器人回复后**：自动滚动到底部  
✅ **图片消息**：等待图片加载完成后正确滚动  
✅ **滚动动画**：平滑自然的滚动效果  

### 技术要点

1. **Flex 布局高度计算**
   - 使用 `min-height: 0` 确保 flex 子元素正确计算高度
   - 为 fixed 定位元素预留空间

2. **滚动时机控制**
   - 使用 `nextTick` 确保 DOM 更新完成
   - 使用 `setTimeout` 延迟处理资源加载

3. **滚动距离计算**
   - `maxScrollTop = scrollHeight - clientHeight`
   - 直接设置 `scrollTop` 更可靠

4. **响应式监听**
   - 使用 `watch` 深度监听消息列表变化
   - 自动触发滚动到底部

### 测试建议

1. 添加 10+ 条初始消息，测试页面加载时的滚动
2. 连续发送多条消息，测试自动滚动
3. 发送图片消息，测试图片加载后的滚动
4. 在不同设备和浏览器上测试兼容性

### 相关文件

- `packages/src/components/Chat/index.vue`
- `packages/src/hooks/useAutoScroll.js`
- `examples/src/App.vue`
- `TEST_SCROLL.md` (测试说明文档)

