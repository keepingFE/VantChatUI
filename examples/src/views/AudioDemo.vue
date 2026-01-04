<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Audio 音频消息" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 代码演示 -->
      <div class="demo-section">
        <div class="section-title">代码演示</div>
      </div>

      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <AudioMessage
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          :duration="180"
        />
      </div>

      <!-- 不同时长 -->
      <div class="demo-section">
        <div class="section-title">不同时长</div>
        <Flex direction="column" gap="12px">
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            :duration="10"
          />
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            :duration="30"
          />
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            :duration="60"
          />
        </Flex>
      </div>

      <!-- 自定义主题色 -->
      <div class="demo-section">
        <div class="section-title">自定义主题色</div>
        <Flex direction="column" gap="12px">
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            :duration="20"
            theme-color="#ff6b6b"
          />
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            :duration="20"
            theme-color="#51cf66"
          />
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            :duration="20"
            theme-color="#ff922b"
          />
        </Flex>
      </div>

      <!-- 自定义宽度 -->
      <div class="demo-section">
        <div class="section-title">自定义宽度</div>
        <div style="max-width: 300px; margin: 0 auto;">
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            :duration="20"
            max-width="100%"
          />
        </div>
      </div>

      <!-- 自动播放 -->
      <div class="demo-section">
        <div class="section-title">自动播放</div>
        <AudioMessage
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          :duration="20"
          :autoplay="true"
          :muted="true"
        />
      </div>

      <!-- 循环播放 -->
      <div class="demo-section">
        <div class="section-title">循环播放</div>
        <AudioMessage
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          :duration="20"
          :loop="true"
        />
      </div>

      <!-- 禁止点击 -->
      <div class="demo-section">
        <div class="section-title">禁止点击</div>
        <AudioMessage
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          :duration="20"
          :clickable="false"
        />
      </div>

      <!-- 加载失败 -->
      <div class="demo-section">
        <div class="section-title">加载失败</div>
        <AudioMessage
          src="https://invalid-audio-url.mp3"
          :duration="20"
        />
      </div>

      <!-- 事件监听 -->
      <div class="demo-section">
        <div class="section-title">事件监听</div>
        <AudioMessage
          ref="audioRef"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          :duration="180"
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
        <AudioMessage
          ref="apiAudioRef"
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          :duration="180"
        />
        <Flex gap="8px" style="margin-top: 12px; flex-wrap: wrap;">
          <Button text="播放" type="primary" size="sm" @click="handleApiPlay" />
          <Button text="暂停" type="default" size="sm" @click="handleApiPause" />
          <Button text="切换" type="default" size="sm" @click="handleApiToggle" />
        </Flex>
      </div>

      <!-- 实际应用 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 语音消息</div>
        <div class="message-bubble">
          <AudioMessage
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            :duration="15"
            theme-color="#1989fa"
          />
        </div>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 聊天对话</div>
        <Flex direction="column" gap="16px">
          <div class="message-bubble message-bubble--sent">
            <div class="message-text">你好，在吗？</div>
          </div>

          <div class="message-bubble">
            <AudioMessage
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
              :duration="10"
              theme-color="#1989fa"
            />
          </div>

          <div class="message-bubble message-bubble--sent">
            <div class="message-text">好的，我听了</div>
          </div>

          <div class="message-bubble">
            <AudioMessage
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
              :duration="20"
              theme-color="#1989fa"
            />
          </div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 多条语音</div>
        <Flex direction="column" gap="12px">
          <AudioMessage
            v-for="(n, index) in 3"
            :key="index"
            :src="`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`"
            :duration="10 + n * 5"
            theme-color="#1989fa"
          />
        </Flex>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, AudioMessage, Flex, Button } from "../../../packages/src/index.js";

const router = useRouter();
const chatRef = ref(null);
const audioRef = ref(null);
const apiAudioRef = ref(null);
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
  addLog("点击音频");
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

const handleTimeUpdate = (currentTime) => {
  const seconds = Math.floor(currentTime);
  if (seconds % 10 === 0) {
    addLog(`播放进度: ${seconds}s`);
  }
};

const handleError = () => {
  addLog("音频加载失败");
};

const handleApiPlay = () => {
  apiAudioRef.value?.play();
};

const handleApiPause = () => {
  apiAudioRef.value?.pause();
};

const handleApiToggle = () => {
  apiAudioRef.value?.togglePlay();
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

  &--sent {
    background: #95ec69;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 4px;
  }
}

.message-text {
  font-size: 14px;
  color: #323233;
  line-height: 1.6;
}
</style>
