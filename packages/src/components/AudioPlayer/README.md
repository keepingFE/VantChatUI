# AudioPlayer 音频播放器

移动端音频播放组件，支持响应式适配。

## 功能特性

- ✅ 播放/暂停控制
- ✅ 进度条拖拽
- ✅ 音量控制
- ✅ 播放速度调节
- ✅ 封面图显示
- ✅ 标题和艺术家信息
- ✅ 响应式适配（移动端/桌面端）
- ✅ 自定义主题色
- ✅ 加载状态和错误处理
- ✅ 完整的事件监听
- ✅ API 方法调用

## 基础用法

```vue
<template>
  <AudioPlayer
    src="https://example.com/audio.mp3"
    title="音频标题"
    artist="艺术家"
  />
</template>

<script setup>
import { AudioPlayer } from 'vant-chat-ui';
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| src | 音频地址（必填） | string | - |
| title | 标题 | string | '' |
| artist | 艺术家/作者 | string | '' |
| cover | 封面图 | string | '' |
| showCover | 是否显示封面 | boolean | true |
| showInfo | 是否显示信息 | boolean | true |
| width | 宽度 | string/number | '100%' |
| height | 高度 | string/number | 'auto' |
| autoplay | 是否自动播放 | boolean | false |
| loop | 是否循环播放 | boolean | false |
| muted | 是否静音 | boolean | false |
| preload | 预加载策略 | string | 'metadata' |
| showVolumeControl | 是否显示音量控制 | boolean | true |
| showVolumeSlider | 是否显示音量滑块 | boolean | true |
| showPlaybackRate | 是否显示播放速度控制 | boolean | false |
| playbackRates | 可选的播放速度 | array | [0.5, 0.75, 1, 1.25, 1.5, 2] |
| themeColor | 主题色 | string | '#1989fa' |
| responsive | 是否响应式适配 | boolean | true |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| loadstart | 开始加载 | event |
| loadedmetadata | 元数据加载完成 | event |
| canplay | 可以播放 | event |
| play | 播放开始 | event |
| pause | 播放暂停 | event |
| ended | 播放结束 | event |
| timeupdate | 播放进度更新 | event |
| volumechange | 音量改变 | event |
| error | 加载错误 | event |
| ratechange | 播放速度改变 | rate |

## Methods

通过 ref 可以调用组件实例的方法：

| 方法名 | 说明 | 参数 |
|--------|------|------|
| play | 播放音频 | - |
| pause | 暂停音频 | - |
| seek | 跳转到指定时间 | time (秒) |
| setVolume | 设置音量 | volume (0-1) |
| setPlaybackRate | 设置播放速度 | rate |

## 示例

### 带封面图

```vue
<AudioPlayer
  src="https://example.com/audio.mp3"
  title="美妙的旋律"
  artist="艺术家"
  cover="https://example.com/cover.jpg"
  theme-color="#ff6b6b"
/>
```

### 紧凑模式（无封面）

```vue
<AudioPlayer
  src="https://example.com/podcast.mp3"
  title="播客节目"
  artist="主播名称"
  :show-cover="false"
  theme-color="#51cf66"
/>
```

### 带播放速度控制

```vue
<AudioPlayer
  src="https://example.com/audiobook.mp3"
  title="有声书章节"
  artist="朗读者"
  :show-cover="false"
  :show-playback-rate="true"
/>
```

### 事件监听

```vue
<template>
  <AudioPlayer
    src="https://example.com/audio.mp3"
    @play="handlePlay"
    @pause="handlePause"
    @ended="handleEnded"
  />
</template>

<script setup>
const handlePlay = () => {
  console.log('播放开始');
};

const handlePause = () => {
  console.log('播放暂停');
};

const handleEnded = () => {
  console.log('播放结束');
};
</script>
```

### API 调用

```vue
<template>
  <AudioPlayer ref="audioPlayerRef" src="https://example.com/audio.mp3" />
  <button @click="handlePlay">播放</button>
  <button @click="handlePause">暂停</button>
  <button @click="handleSeek">跳转到 30s</button>
</template>

<script setup>
import { ref } from 'vue';

const audioPlayerRef = ref(null);

const handlePlay = () => {
  audioPlayerRef.value?.play();
};

const handlePause = () => {
  audioPlayerRef.value?.pause();
};

const handleSeek = () => {
  audioPlayerRef.value?.seek(30);
};
</script>
```

## 响应式适配

组件会自动检测屏幕尺寸并调整布局：

- **桌面端（>768px）**：完整显示所有控制项
- **移动端（≤768px）**：优化布局，调整字体和间距
- **小屏幕（≤480px）**：进一步压缩，隐藏部分控制项

## 样式定制

可以通过 `themeColor` 属性自定义主题色：

```vue
<AudioPlayer
  src="https://example.com/audio.mp3"
  theme-color="#ff6b6b"
/>
```

## 注意事项

1. 音频文件需要支持跨域访问（CORS）
2. 自动播放可能受浏览器策略限制
3. 移动端建议使用 `preload="metadata"` 以节省流量
4. 播放速度控制需要浏览器支持 `playbackRate` API
