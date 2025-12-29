<template>
  <div class="demo-page">
    <van-nav-bar
      title="Markdown 渲染"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="demo-section">
      <div class="section-title">基础 Markdown</div>
      <div class="preview-box">
        <MarkdownRenderer :content="basicContent" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">代码高亮</div>
      <div class="preview-box">
        <MarkdownRenderer :content="codeContent" />
      </div>
    </div>

    <div class="demo-section">
      <div class="section-title">流式输出模拟</div>
      <div class="preview-box">
        <MarkdownRenderer
          :content="streamingContent"
          :streaming="isStreaming"
        />
        <div style="margin-top: 10px; text-align: center">
          <van-button
            size="small"
            type="primary"
            @click="startStreaming"
            :disabled="isStreaming"
          >
            开始生成
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { MarkdownRenderer } from "../../../packages/src/index.js"; // Adjust path if needed
// In real usage it would be import { MarkdownRenderer } from 'chatvant';

const router = useRouter();

const onClickLeft = () => {
  router.back();
};

const basicContent = `
# 标题 H1
## 标题 H2
### 标题 H3

这是一段**加粗**文字，这是*斜体*文字，这是~~删除线~~。

- 无序列表项 1
- 无序列表项 2
  - 子列表项 A
  - 子列表项 B

1. 有序列表 1
2. 有序列表 2

> 这是一段引用文本
> 可以多行

[这是一个链接](https://github.com)
`;

const codeContent = `
这是一个 JavaScript 代码块：

\`\`\`javascript
function hello() {
  console.log("Hello, ChatVant!");
  const a = 1;
  const b = 2;
  return a + b;
}
\`\`\`

这是一个 CSS 代码块：

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
}
\`\`\`
`;

const fullText = `
这里正在模拟 **AI 流式输出** 的效果。

它可以实时渲染 Markdown 内容，包括：
1. 逐步显示的文字
2. 动态生成的列表
3. 甚至代码块

\`\`\`python
import time

def simulate_streaming():
    print("Start streaming...")
    time.sleep(1)
    print("Done!")
\`\`\`

希望你喜欢这个组件！
`;

const streamingContent = ref("");
const isStreaming = ref(false);

const startStreaming = () => {
  if (isStreaming.value) return;

  isStreaming.value = true;
  streamingContent.value = "";
  let index = 0;

  const timer = setInterval(() => {
    if (index < fullText.length) {
      streamingContent.value += fullText[index];
      index++;
    } else {
      clearInterval(timer);
      isStreaming.value = false;
    }
  }, 50);
};
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  height: 100vh;
  background-color: #f7f8fa;
  overflow-y: auto;
}

.demo-page::-webkit-scrollbar {
  width: 6px;
}

.demo-page::-webkit-scrollbar-thumb {
  background-color: #dbdbdb;
  border-radius: 3px;
}

.demo-page::-webkit-scrollbar-track {
  background-color: transparent;
}

.demo-section {
  padding: 16px;
}

.section-title {
  font-size: 14px;
  color: #969799;
  margin-bottom: 8px;
  padding-left: 16px;
}

.preview-box {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
</style>
