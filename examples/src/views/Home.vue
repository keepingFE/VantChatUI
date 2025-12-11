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
