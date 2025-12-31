# File 组件

文件展示组件，用于在聊天界面中显示文件信息。

## 基本用法

```vue
<template>
  <File
    name="document.pdf"
    size="2.5 MB"
    url="/files/document.pdf"
    :downloadable="true"
    @click="handleFileClick"
    @download="handleFileDownload"
  />
</template>

<script setup>
import { File } from 'chatui-vue'

const handleFileClick = () => {
  console.log('文件被点击')
}

const handleFileDownload = () => {
  console.log('文件开始下载')
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| name | 文件名 | string | - | 是 |
| size | 文件大小（如 "2.5 MB"） | string | '' | 否 |
| url | 文件 URL | string | '' | 否 |
| downloadable | 是否显示下载按钮 | boolean | false | 否 |
| extension | 文件扩展名（可选，不提供则从文件名提取） | string | '' | 否 |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击文件时触发 | - |
| download | 点击下载按钮时触发 | - |

## 支持的文件类型

组件会根据文件扩展名自动显示不同的颜色：

- PDF: 红色 (#ff4d4f)
- Word (doc/docx): 蓝色 (#1890ff)
- Excel (xls/xlsx): 绿色 (#52c41a)
- 压缩文件 (zip/rar/7z): 橙色 (#ff9800)
- PowerPoint (ppt/pptx): 浅红色 (#ff6b6b)
- 文本文件 (txt): 灰色 (#969799)
- 其他: 橙色 (#ff9800)

## 在 Message 中使用

File 组件主要用于 Message 组件中显示文件类型的消息：

```vue
<Message
  :msg="{
    _id: '1',
    type: 'file',
    position: 'right',
    user: { avatar: '...', name: '用户' },
    file: {
      name: 'document.pdf',
      size: '2.5 MB',
      url: '/files/document.pdf',
      downloadable: true
    }
  }"
/>
```
