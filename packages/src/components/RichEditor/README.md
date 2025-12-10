# RichEditor 组件

富文本编辑器组件，基于 TipTap 构建。

## 文件结构

```
RichEditor/
├── index.vue           # 主组件（150行）
├── constants.js        # 图标和配置常量（80行）
├── extensions.js       # TipTap 扩展配置（100行）
├── useCommands.js      # 命令和弹窗逻辑（150行）
├── useUpload.js        # 上传处理逻辑（70行）
├── styles.scss         # 样式文件（350行）
└── README.md           # 说明文档
```

## 优化说明

### 重构前
- 单文件 1200+ 行代码
- 所有逻辑混在一起
- 难以维护和测试

### 重构后
- 模块化拆分为 6 个文件
- 每个文件职责单一
- 易于维护和扩展

## 模块说明

### constants.js
- 工具栏图标 SVG
- 工具栏标题文本
- 默认工具栏配置

### extensions.js
- TipTap 扩展配置
- 自定义视频节点（iframe 和 native）
- 扩展工厂函数

### useCommands.js
- 工具栏命令执行
- 弹窗状态管理
- 链接、图片、视频、表格插入逻辑

### useUpload.js
- 图片上传处理
- 视频上传处理
- 文件选择处理

### styles.scss
- 编辑器样式
- 工具栏样式
- 响应式布局

### index.vue
- 组件模板
- Props 定义
- 组合各个模块

## 使用示例

```vue
<template>
  <RichEditor
    v-model="content"
    placeholder="请输入内容..."
    :upload-image="handleUploadImage"
    :upload-video="handleUploadVideo"
  />
</template>

<script setup>
import { ref } from 'vue';
import RichEditor from '@/components/RichEditor';

const content = ref('');

const handleUploadImage = async (file) => {
  // 上传图片到服务器
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  const data = await res.json();
  return data.url;
};

const handleUploadVideo = async (file) => {
  // 上传视频到服务器
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload-video', { method: 'POST', body: formData });
  const data = await res.json();
  return data.url;
};
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 编辑器内容 | String | '' |
| placeholder | 占位符 | String | '请输入内容...' |
| readonly | 只读模式 | Boolean | false |
| disabled | 禁用状态 | Boolean | false |
| minHeight | 最小高度 | String | '120px' |
| maxHeight | 最大高度 | String | '400px' |
| showToolbar | 显示工具栏 | Boolean | true |
| autofocus | 自动聚焦 | Boolean | false |
| uploadImage | 图片上传函数 | Function | null |
| uploadVideo | 视频上传函数 | Function | null |
| toolbar | 工具栏配置 | Array | DEFAULT_TOOLBAR |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 内容变化 | (html: string) |
| focus | 获得焦点 | (event: FocusEvent) |
| blur | 失去焦点 | (event: FocusEvent) |
| ready | 编辑器就绪 | (editor: Editor) |

## 自定义工具栏

```vue
<RichEditor
  :toolbar="['bold', 'italic', '|', 'link', 'image']"
/>
```

可用工具：
- `bold` - 粗体
- `italic` - 斜体
- `underline` - 下划线
- `strike` - 删除线
- `heading` - 标题
- `bulletList` - 无序列表
- `orderedList` - 有序列表
- `link` - 链接
- `image` - 图片
- `video` - 视频
- `table` - 表格
- `alignLeft` - 左对齐
- `alignCenter` - 居中
- `alignRight` - 右对齐
- `undo` - 撤销
- `redo` - 重做
- `|` - 分隔符
