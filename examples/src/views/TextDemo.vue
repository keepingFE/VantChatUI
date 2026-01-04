<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Text 文本消息" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 代码演示 -->
      <div class="demo-section">
        <div class="section-title">代码演示</div>
      </div>

      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <TextMessage text="这是一段普通的文本消息" />
      </div>

      <!-- 多行文本 -->
      <div class="demo-section">
        <div class="section-title">多行文本</div>
        <TextMessage
          text="这是第一行文本
这是第二行文本
这是第三行文本"
        />
      </div>

      <!-- 链接识别 -->
      <div class="demo-section">
        <div class="section-title">链接识别</div>
        <Flex direction="column" gap="12px">
          <TextMessage
            text="访问我们的网站 https://example.com 了解更多信息"
          />
          <TextMessage
            text="推荐文章：https://example.com/article/123"
          />
          <TextMessage
            text="多个链接：https://example.com 和 https://docs.example.com"
          />
        </Flex>
      </div>

      <!-- @提及 -->
      <div class="demo-section">
        <div class="section-title">@提及</div>
        <Flex direction="column" gap="12px">
          <TextMessage
            text="你好 @张三，请查看一下这个文档"
          />
          <TextMessage
            text="@李四 @王五 你们两个明天开会"
          />
          <TextMessage
            text="@张三_123 这里有你的消息"
          />
        </Flex>
      </div>

      <!-- 话题标签 -->
      <div class="demo-section">
        <div class="section-title">话题标签</div>
        <Flex direction="column" gap="12px">
          <TextMessage
            text="今天天气真好 #晴天#"
          />
          <TextMessage
            text="分享美食 #美食推荐# #今日午餐#"
          />
          <TextMessage
            text="打卡健身 #健身打卡# #自律生活#"
          />
        </Flex>
      </div>

      <!-- 混合使用 -->
      <div class="demo-section">
        <div class="section-title">混合使用</div>
        <TextMessage
          text="@张三 看看这篇文章 https://example.com/article，很有意思 #阅读分享#"
        />
      </div>

      <!-- 关闭识别 -->
      <div class="demo-section">
        <div class="section-title">关闭链接识别</div>
        <TextMessage
          text="访问 https://example.com 了解更多信息"
          :detect-links="false"
        />
      </div>

      <div class="demo-section">
        <div class="section-title">关闭@提及识别</div>
        <TextMessage
          text="你好 @张三，请查看一下"
          :detect-mentions="false"
        />
      </div>

      <div class="demo-section">
        <div class="section-title">关闭话题标签识别</div>
        <TextMessage
          text="今天天气真好 #晴天#"
          :detect-hashtags="false"
        />
      </div>

      <!-- 自定义链接行为 -->
      <div class="demo-section">
        <div class="section-title">自定义链接行为</div>
        <TextMessage
          text="访问 https://example.com 了解更多信息"
          link-target="_self"
          @link-click="handleLinkClick"
        />
        <div style="margin-top: 8px; padding: 8px; background: #f7f8fa; border-radius: 4px; font-size: 12px; color: #666;">
          点击链接将触发事件
        </div>
      </div>

      <!-- 事件监听 -->
      <div class="demo-section">
        <div class="section-title">事件监听</div>
        <TextMessage
          text="@张三 看看这篇文章 https://example.com/article #阅读分享#"
          @link-click="handleLinkClick"
          @mention-click="handleMentionClick"
          @hashtag-click="handleHashtagClick"
        />
        <div style="margin-top: 12px; padding: 12px; background: #f7f8fa; border-radius: 8px;">
          <div style="font-size: 12px; color: #666;">
            <div v-for="(log, index) in eventLogs" :key="index" style="margin-bottom: 4px;">
              {{ log }}
            </div>
          </div>
        </div>
      </div>

      <!-- 行数限制 -->
      <div class="demo-section">
        <div class="section-title">行数限制（2行）</div>
        <TextMessage
          text="这是一段很长的文本，它会被限制在2行内显示，超出的内容会被省略。这是一段很长的文本，它会被限制在2行内显示，超出的内容会被省略。"
          :max-lines="2"
        />
      </div>

      <div class="demo-section">
        <div class="section-title">行数限制（3行）</div>
        <TextMessage
          text="这是一段很长的文本，它会被限制在3行内显示，超出的内容会被省略。这是一段很长的文本，它会被限制在3行内显示，超出的内容会被省略。这是一段很长的文本，它会被限制在3行内显示，超出的内容会被省略。"
          :max-lines="3"
        />
      </div>

      <!-- 自定义样式 -->
      <div class="demo-section">
        <div class="section-title">自定义样式</div>
        <Flex direction="column" gap="12px">
          <TextMessage
            text="这是自定义颜色的文本"
            color="#1989fa"
          />
          <TextMessage
            text="这是自定义字体大小的文本"
            font-size="18px"
          />
          <TextMessage
            text="这是自定义行高的文本"
            line-height="2"
          />
        </Flex>
      </div>

      <!-- 实际应用 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 聊天消息</div>
        <Flex direction="column" gap="16px">
          <div class="message-bubble">
            <TextMessage
              text="你好，在吗？"
            />
          </div>

          <div class="message-bubble message-bubble--sent">
            <TextMessage
              text="在的，有什么事吗？"
            />
          </div>

          <div class="message-bubble">
            <TextMessage
              text="给你推荐一篇文章 https://example.com/article/123，内容很有意思 #阅读推荐#"
            />
          </div>

          <div class="message-bubble message-bubble--sent">
            <TextMessage
              text="好的，我看看"
            />
          </div>

          <div class="message-bubble">
            <TextMessage
              text="@张三 @李四 明天下午3点开会，请大家准时参加 #会议通知#"
            />
          </div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 公告消息</div>
        <div class="notice-card">
          <div class="notice-title">系统公告</div>
          <TextMessage
            text="欢迎使用我们的应用！访问 https://example.com 了解更多功能。如有问题请联系 @客服 #新手指南#"
            color="#666"
          />
        </div>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 社交消息</div>
        <Flex direction="column" gap="16px">
          <div class="message-bubble">
            <TextMessage
              text="今天参加了一个很棒的聚会 #聚会#"
            />
            <div style="margin-top: 8px;">
              <Gallery
                :images="[
                  'https://picsum.photos/400/400?random=1',
                  'https://picsum.photos/400/400?random=2',
                ]"
                max-count="2"
              />
            </div>
          </div>

          <div class="message-bubble message-bubble--sent">
            <TextMessage
              text="看起来很不错！@张三 一起参加下次聚会吧 #友谊#"
            />
          </div>
        </Flex>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, TextMessage, Flex, Gallery } from "../../../packages/src/index.js";

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

const handleLinkClick = (segment) => {
  addLog(`点击链接: ${segment.url}`);
};

const handleMentionClick = (segment) => {
  addLog(`点击@提及: @${segment.content}`);
};

const handleHashtagClick = (segment) => {
  addLog(`点击话题: #${segment.content}#`);
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

.notice-card {
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notice-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}
</style>
