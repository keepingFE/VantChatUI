<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Video 视频消息" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 代码演示 -->
      <div class="demo-section">
        <div class="section-title">代码演示</div>
      </div>

      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          width="100%"
          height="200"
        />
      </div>

      <!-- 带缩略图 -->
      <div class="demo-section">
        <div class="section-title">带缩略图</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/bunny/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/bunny/poster.png"
          width="100%"
          height="200"
        />
      </div>

      <!-- 不同尺寸 -->
      <div class="demo-section">
        <div class="section-title">不同尺寸</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <VideoMessage
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            width="100%"
            height="150"
          />
          <VideoMessage
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            width="100%"
            height="200"
          />
        </div>
      </div>

      <!-- 图片适配 -->
      <div class="demo-section">
        <div class="section-title">图片适配 - cover</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          fit="cover"
          width="100%"
          height="200"
        />
      </div>

      <div class="demo-section">
        <div class="section-title">图片适配 - contain</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          fit="contain"
          width="100%"
          height="200"
        />
      </div>

      <div class="demo-section">
        <div class="section-title">图片适配 - fill</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          fit="fill"
          width="100%"
          height="200"
        />
      </div>

      <!-- 圆角 -->
      <div class="demo-section">
        <div class="section-title">圆角</div>
        <Flex gap="12px" wrap="wrap">
          <VideoMessage
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            width="200"
            height="150"
            :radius="8"
          />
          <VideoMessage
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            width="200"
            height="150"
            round
          />
        </Flex>
      </div>

      <!-- 自动播放 -->
      <div class="demo-section">
        <div class="section-title">自动播放</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/bunny/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/bunny/poster.png"
          width="100%"
          height="200"
          :autoplay="true"
          :muted="true"
        />
      </div>

      <!-- 循环播放 -->
      <div class="demo-section">
        <div class="section-title">循环播放</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          width="100%"
          height="200"
          :loop="true"
        />
      </div>

      <!-- 禁止点击 -->
      <div class="demo-section">
        <div class="section-title">禁止点击</div>
        <VideoMessage
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          width="100%"
          height="200"
          :clickable="false"
        />
      </div>

      <!-- 加载失败 -->
      <div class="demo-section">
        <div class="section-title">加载失败</div>
        <VideoMessage
          src="https://invalid-video-url.mp4"
          width="100%"
          height="200"
        />
      </div>

      <!-- 事件监听 -->
      <div class="demo-section">
        <div class="section-title">事件监听</div>
        <VideoMessage
          ref="videoRef"
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          width="100%"
          height="200"
          @click="handleClick"
          @play="handlePlay"
          @pause="handlePause"
          @ended="handleEnded"
          @timeupdate="handleTimeUpdate"
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

      <!-- API 调用 -->
      <div class="demo-section">
        <div class="section-title">API 调用</div>
        <VideoMessage
          ref="apiVideoRef"
          src="https://media.w3.org/2010/05/sintel/trailer.mp4"
          thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
          width="100%"
          height="200"
        />
        <Flex gap="8px" style="margin-top: 12px; flex-wrap: wrap;">
          <Button text="播放" type="primary" size="sm" @click="handleApiPlay" />
          <Button text="暂停" type="default" size="sm" @click="handleApiPause" />
          <Button text="跳转30s" type="default" size="sm" @click="handleApiSeek" />
        </Flex>
      </div>

      <!-- 实际应用 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 视频消息</div>
        <div class="message-bubble">
          <div class="message-text">看看这个视频，太精彩了！</div>
          <VideoMessage
            src="https://media.w3.org/2010/05/sintel/trailer.mp4"
            thumbnail="https://media.w3.org/2010/05/sintel/poster.png"
            width="100%"
            height="200"
            round
          />
        </div>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 短视频卡片</div>
        <div class="video-card">
          <VideoMessage
            src="https://media.w3.org/2010/05/bunny/trailer.mp4"
            thumbnail="https://media.w3.org/2010/05/bunny/poster.png"
            width="100%"
            height="220"
            :radius="8"
          />
          <div class="video-info">
            <div class="video-title">精彩短视频</div>
            <div style="font-size: 12px; color: #969799; margin-top: 4px;">
              这是一段精彩的短视频内容，欢迎观看
            </div>
            <Flex gap="16px" style="margin-top: 8px;">
              <Flex gap="4px" align="center">
                <van-icon name="good-job-o" size="14" />
                <span style="font-size: 12px; color: #969799;">1.2k</span>
              </Flex>
              <Flex gap="4px" align="center">
                <van-icon name="chat-o" size="14" />
                <span style="font-size: 12px; color: #969799;">89</span>
              </Flex>
              <Flex gap="4px" align="center">
                <van-icon name="share-o" size="14" />
                <span style="font-size: 12px; color: #969799;">分享</span>
              </Flex>
            </Flex>
          </div>
        </div>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, VideoMessage, Flex, Button } from "../../../packages/src/index.js";

const router = useRouter();
const chatRef = ref(null);
const videoRef = ref(null);
const apiVideoRef = ref(null);
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

const handleClick = () => {
  addLog("点击视频");
};

const handlePlay = () => {
  addLog("开始播放");
};

const handlePause = () => {
  addLog("暂停播放");
};

const handleEnded = () => {
  addLog("播放结束");
};

const handleTimeUpdate = (event) => {
  const currentTime = Math.floor(event.target.currentTime);
  if (currentTime % 10 === 0) {
    addLog(`播放进度: ${currentTime}s`);
  }
};

const handleError = () => {
  addLog("视频加载失败");
};

const handleApiPlay = () => {
  apiVideoRef.value?.play();
};

const handleApiPause = () => {
  apiVideoRef.value?.pause();
};

const handleApiSeek = () => {
  apiVideoRef.value?.seek(30);
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

.video-card {
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.video-info {
  margin-top: 12px;
}

.video-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}
</style>
