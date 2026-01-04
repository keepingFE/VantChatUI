<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Gallery 图片画廊" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 代码演示 -->
      <div class="demo-section">
        <div class="section-title">代码演示</div>
      </div>

      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <Gallery
          :images="[
            'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
            'https://picsum.photos/400/400?random=1',
          ]"
        />
      </div>

      <!-- 单张图片 -->
      <div class="demo-section">
        <div class="section-title">单张图片</div>
        <Gallery
          :images="['https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg']"
        />
      </div>

      <!-- 图片数量限制 -->
      <div class="demo-section">
        <div class="section-title">图片数量限制（最多显示3张）</div>
        <Gallery
          :images="[
            'https://picsum.photos/400/400?random=1',
            'https://picsum.photos/400/400?random=2',
            'https://picsum.photos/400/400?random=3',
            'https://picsum.photos/400/400?random=4',
            'https://picsum.photos/400/400?random=5',
            'https://picsum.photos/400/400?random=6',
          ]"
          :max-count="3"
        />
      </div>

      <!-- 自定义列数 -->
      <div class="demo-section">
        <div class="section-title">自定义列数（2列）</div>
        <Gallery
          :images="[
            'https://picsum.photos/400/400?random=1',
            'https://picsum.photos/400/400?random=2',
            'https://picsum.photos/400/400?random=3',
            'https://picsum.photos/400/400?random=4',
          ]"
          :columns="2"
        />
      </div>

      <div class="demo-section">
        <div class="section-title">响应式列数</div>
        <Gallery
          :images="[
            'https://picsum.photos/400/400?random=1',
            'https://picsum.photos/400/400?random=2',
            'https://picsum.photos/400/400?random=3',
            'https://picsum.photos/400/400?random=4',
            'https://picsum.photos/400/400?random=5',
          ]"
          :columns="{ xs: 2, sm: 3, md: 4, lg: 5 }"
        />
      </div>

      <!-- 自定义间距 -->
      <div class="demo-section">
        <div class="section-title">自定义间距（16px）</div>
        <Gallery
          :images="[
            'https://picsum.photos/400/400?random=1',
            'https://picsum.photos/400/400?random=2',
            'https://picsum.photos/400/400?random=3',
          ]"
          :gap="16"
        />
      </div>

      <!-- 图片适配 -->
      <div class="demo-section">
        <div class="section-title">图片适配 - cover</div>
        <Gallery
          :images="[
            'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
            'https://picsum.photos/400/400?random=1',
          ]"
          fit="cover"
          height="150"
        />
      </div>

      <div class="demo-section">
        <div class="section-title">图片适配 - contain</div>
        <Gallery
          :images="[
            'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
            'https://picsum.photos/400/400?random=1',
          ]"
          fit="contain"
          height="150"
        />
      </div>

      <!-- 圆角 -->
      <div class="demo-section">
        <div class="section-title">圆角</div>
        <Gallery
          :images="[
            'https://picsum.photos/400/400?random=1',
            'https://picsum.photos/400/400?random=2',
            'https://picsum.photos/400/400?random=3',
          ]"
          :radius="8"
        />
      </div>

      <!-- 禁止点击预览 -->
      <div class="demo-section">
        <div class="section-title">禁止点击预览</div>
        <Gallery
          :images="[
            'https://picsum.photos/400/400?random=1',
            'https://picsum.photos/400/400?random=2',
            'https://picsum.photos/400/400?random=3',
          ]"
          :clickable="false"
        />
      </div>

      <!-- 使用对象数组 -->
      <div class="demo-section">
        <div class="section-title">使用对象数组</div>
        <Gallery
          :images="[
            { url: 'https://picsum.photos/400/400?random=1', alt: '图片1' },
            { url: 'https://picsum.photos/400/400?random=2', alt: '图片2' },
            { url: 'https://picsum.photos/400/400?random=3', alt: '图片3' },
          ]"
        />
      </div>

      <!-- 事件监听 -->
      <div class="demo-section">
        <div class="section-title">事件监听</div>
        <Gallery
          :images="[
            'https://picsum.photos/400/400?random=1',
            'https://picsum.photos/400/400?random=2',
            'https://picsum.photos/400/400?random=3',
          ]"
          @click="handleClick"
          @preview-change="handlePreviewChange"
          @error="handleError"
        />
        <div style="margin-top: 12px; padding: 12px; background: #f7f8fa; border-radius: 8px;">
          <div style="font-size: 12px; color: #666;">
            <div v-for="(log, index) in eventLogs" :key="index" style="margin-bottom: 4px;">
              {{ log }}
            </div>
          </div>
        </div>
      </div>

      <!-- 实际应用 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 聊天图片消息</div>
        <div class="message-bubble">
          <div class="message-text">这是我旅行的照片</div>
          <Gallery
            :images="[
              'https://picsum.photos/800/600?random=1',
              'https://picsum.photos/800/600?random=2',
              'https://picsum.photos/800/600?random=3',
            ]"
            max-count="9"
            :gap="4"
          />
        </div>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 商品展示</div>
        <div class="product-card">
          <Gallery
            :images="[
              'https://picsum.photos/600/600?random=1',
              'https://picsum.photos/600/600?random=2',
              'https://picsum.photos/600/600?random=3',
              'https://picsum.photos/600/600?random=4',
            ]"
            max-count="4"
            height="200"
            :gap="8"
          />
          <div class="product-info">
            <div class="product-title">精选商品</div>
            <div style="font-size: 14px; color: #969799;">
              商品描述信息，支持多行文本展示
            </div>
            <div style="margin-top: 8px; color: #ee0a24; font-weight: 600;">
              ¥199.00
            </div>
          </div>
        </div>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, Gallery } from "../../../packages/src/index.js";

const router = useRouter();
const chatRef = ref(null);
const eventLogs = ref([]);

const goBack = () => {
  router.back();
};

const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  eventLogs.value.unshift(`[${timestamp}] ${message}`);
  if (eventLogs.value.length > 5) {
    eventLogs.value.pop();
  }
};

const handleClick = ({ index, image }) => {
  addLog(`点击图片 ${index + 1}`);
};

const handlePreviewChange = ({ index, image }) => {
  addLog(`预览切换到图片 ${index + 1}`);
};

const handleError = ({ index, image }) => {
  addLog(`图片 ${index + 1} 加载失败`);
};
</script>

<style scoped lang="scss">
.demo-section {
  padding: 16px;
  background: #f7f8fa;
  margin-bottom: 8px;
}

.section-title {
  font-size: 14px;
  color: #969799;
  margin-bottom: 12px;
}

.message-bubble {
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.message-text {
  font-size: 14px;
  color: #323233;
  line-height: 1.6;
  margin-bottom: 12px;
}

.product-card {
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-info {
  margin-top: 12px;
}

.product-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}
</style>
