<!-- File: examples/src/views/RichEditorDemo.vue -->
<template>
  <div class="demo-page">
    <van-nav-bar
      title="RichEditor 富文本编辑器"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="demo-content">
      <van-cell-group title="基础用法">
        <div class="demo-block">
          <RichEditor v-model="content1" placeholder="请输入内容..." />
        </div>
      </van-cell-group>

      <van-cell-group title="自定义工具栏">
        <div class="demo-block">
          <RichEditor
            v-model="content2"
            :toolbar="['bold', 'italic', 'underline', '|', 'link', 'image']"
            placeholder="简化工具栏..."
          />
        </div>
      </van-cell-group>

      <van-cell-group title="只读模式">
        <div class="demo-block">
          <RichEditor v-model="content3" readonly />
        </div>
      </van-cell-group>

      <van-cell-group title="禁用状态">
        <div class="demo-block">
          <RichEditor v-model="content3" disabled />
        </div>
      </van-cell-group>

      <van-cell-group title="自定义高度">
        <div class="demo-block">
          <RichEditor
            v-model="content4"
            min-height="200px"
            max-height="300px"
            placeholder="自定义高度..."
          />
        </div>
      </van-cell-group>

      <van-cell-group title="输出内容 (HTML)">
        <div class="demo-block output-block">
          <pre>{{ content1 }}</pre>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RichEditor } from "../../../packages/src/index.js";

const content1 = ref("<p>Hello <strong>World</strong>!</p>");
const content2 = ref("");
const content3 = ref(
  '<p>这是<strong>只读</strong>内容，包含<a href="#">链接</a>和<em>斜体</em>文字。</p>'
);
const content4 = ref("");
</script>

<style scoped lang="scss">
.demo-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.demo-content {
  padding: 12px;
}

.demo-block {
  padding: 12px;
  background: #fff;
}

.output-block {
  pre {
    margin: 0;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
