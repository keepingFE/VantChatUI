<!-- File: examples/src/views/RichEditorDemo.vue -->
<template>
  <div class="demo-page">
    <van-nav-bar title="RichEditor 富文本编辑器" left-arrow @click-left="$router.back()" />

    <div class="demo-content">
      <van-cell-group title="基础用法">
        <div class="demo-block">
          <RichEditor v-model="content1" placeholder="请输入内容..." />
        </div>
      </van-cell-group>

      <van-cell-group title="自定义工具栏">
        <div class="demo-block">
          <RichEditor v-model="content2" :toolbar="['bold', 'italic', 'underline', '|', 'link', 'image']"
            placeholder="简化工具栏..." />
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
          <RichEditor v-model="content4" min-height="200px" max-height="300px" placeholder="自定义高度..." />
        </div>
      </van-cell-group>

      <van-cell-group title="支持文件上传">
        <div class="demo-block">
          <RichEditor v-model="content5" :upload-image="handleUploadImage" :upload-video="handleUploadVideo"
            :upload-file="handleUploadFile" placeholder="支持上传图片、视频和文件（文档、压缩包等）..." />
        </div>
      </van-cell-group>

      <van-cell-group title="文件大小限制">
        <div class="demo-block">
          <RichEditor v-model="content6" :upload-image="handleUploadImage" :upload-video="handleUploadVideo"
            :upload-file="handleUploadFile" :max-image-size="2 * 1024 * 1024" :max-video-size="50 * 1024 * 1024"
            :max-file-size="10 * 1024 * 1024" placeholder="图片限制2MB，视频限制50MB，文件限制10MB..." />
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
const content5 = ref("");
const content6 = ref("");

// 模拟图片上传（支持进度和取消）
const handleUploadImage = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const { signal, onProgress } = options;

    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // 实际项目中这里应该调用真实的上传接口
        const url = URL.createObjectURL(file);
        resolve(url);
      }
    }, 200);

    // 支持取消上传
    if (signal) {
      signal.addEventListener('abort', () => {
        clearInterval(interval);
        reject(new DOMException('Upload cancelled', 'AbortError'));
      });
    }
  });
};

// 模拟视频上传（支持进度和取消）
const handleUploadVideo = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const { signal, onProgress } = options;

    // 模拟上传进度（视频上传较慢）
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // 实际项目中这里应该调用真实的上传接口
        const url = URL.createObjectURL(file);
        resolve(url);
      }
    }, 300);

    // 支持取消上传
    if (signal) {
      signal.addEventListener('abort', () => {
        clearInterval(interval);
        reject(new DOMException('Upload cancelled', 'AbortError'));
      });
    }
  });
};

// 模拟文件上传（支持进度和取消）
const handleUploadFile = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const { signal, onProgress } = options;

    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // 实际项目中这里应该调用真实的上传接口
        // 返回文件的下载链接
        const url = URL.createObjectURL(file);
        resolve(url);
      }
    }, 200);

    // 支持取消上传
    if (signal) {
      signal.addEventListener('abort', () => {
        clearInterval(interval);
        reject(new DOMException('Upload cancelled', 'AbortError'));
      });
    }
  });
};
</script>

<style scoped lang="scss">
.demo-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  overflow: hidden;
}

.demo-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
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
