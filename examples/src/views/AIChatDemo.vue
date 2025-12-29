<template>
  <div class="ai-chat-demo">
    <van-nav-bar
      title="AI 助手 (综合演示)"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />

    <Chat ref="chatRef">
      <div v-for="msg in messages" :key="msg.id" class="message-wrapper">
        <!-- 用户消息 -->
        <Message
          v-if="msg.role === 'user'"
          :msg="{
            type: 'text',
            content: msg.content,
            position: 'right',
            user: {
              name: 'User',
              avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
            },
          }"
        />

        <!-- AI 消息 -->
        <Message
          v-else-if="msg.role === 'ai'"
          :msg="{
            type: 'text',
            position: 'left',
            typing: msg.isTyping,
            content: msg.content,
            user: {
              name: 'AI Assistant',
              avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
            },
          }"
        >
          <template #default>
            <!-- 错误状态 -->
            <ErrorMessage
              v-if="msg.error"
              :message="msg.error"
              @retry="() => retryMessage(msg)"
            />

            <!-- 正常内容 -->
            <div v-else>
              <MarkdownRenderer
                :content="msg.content || (msg.isTyping ? '' : '...')"
                :streaming="msg.isStreaming"
              />
              <!-- 消息操作栏 (仅当非流式传输、无错误且有内容时显示) -->
              <MessageActions
                v-if="!msg.isStreaming && msg.content"
                :content="msg.content"
                :actions="['copy', 'regenerate', 'like', 'dislike']"
                @regenerate="() => retryMessage(msg)"
              />
            </div>
          </template>
        </Message>
      </div>

      <!-- 底部快捷回复 -->
      <template #footer>
        <QuickReplies
          v-if="!isGlobalTyping"
          :items="currentQuickReplies"
          sticky
          @select="handleQuickReply"
        />
      </template>

      <!-- 输入框 -->
      <template #composer>
        <Composer
          @send="handleSend"
          :disabled="isGlobalTyping"
          placeholder="输入消息..."
        />
      </template>
    </Chat>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  Chat,
  Message,
  Composer,
  MarkdownRenderer,
  MessageActions,
  QuickReplies,
  ErrorMessage,
  useAutoScroll,
} from "../../../packages/src/index.js"; // Adjust path

const router = useRouter();
const chatRef = ref(null);
const isGlobalTyping = ref(false); // 用于控制底部输入框状态

// 消息列表
const messages = ref([
  {
    id: 1,
    role: "ai",
    content:
      "你好！我是你的 AI 助手。我可以帮你写代码、解答问题或进行创意写作。\n\n试着问我：\n- 写一个 Vue3 组件\n- 解释量子力学\n- 模拟一个错误",
    isStreaming: false,
  },
]);

// 快捷回复
const currentQuickReplies = ref([
  "写一个 Vue3 组件",
  "解释量子力学",
  "生成 Markdown 表格",
  "模拟一个错误",
]);

// 自动滚动 Hook
const { scrollToBottom } = useAutoScroll(chatRef);

const onClickLeft = () => {
  router.back();
};

const handleQuickReply = (text) => {
  handleSend(text);
};

const handleSend = (text) => {
  if (!text.trim()) return;

  // 1. 添加用户消息
  messages.value.push({
    id: Date.now(),
    role: "user",
    content: text,
  });
  scrollToBottom();

  // 2. 模拟 AI 回复
  simulateAIResponse(text);
};

// 模拟 AI 回复逻辑
const simulateAIResponse = async (userText) => {
  isGlobalTyping.value = true;

  // 创建一个空的 AI 消息占位
  const aiMsgId = Date.now() + 1;
  const aiMsg = ref({
    id: aiMsgId,
    role: "ai",
    content: "",
    isTyping: true, // 显示思考中气泡 (ChatVant 内置) 或 仅作为状态标记
    isStreaming: false,
    error: null,
  });
  messages.value.push(aiMsg.value);
  scrollToBottom();

  // 模拟网络延迟 (思考时间)
  await new Promise((r) => setTimeout(r, 1000));

  // 思考结束，开始流式输出
  aiMsg.value.isTyping = false;
  aiMsg.value.isStreaming = true;

  // 特殊指令：模拟错误
  if (userText.includes("错误")) {
    aiMsg.value.isStreaming = false;
    aiMsg.value.error = "模拟的网络请求失败，无法生成内容。";
    isGlobalTyping.value = false;
    return;
  }

  // 准备要输出的内容 (包含 Markdown)
  let fullText = "";
  if (userText.includes("Vue") || userText.includes("代码")) {
    fullText = `好的，这是一个简单的 **Vue 3 计数器组件**：

\`\`\`vue
<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
<\/script>
\`\`\`

你可以直接复制上面的代码使用。`;
  } else if (userText.includes("表格")) {
    fullText =
      "好的，这是一个 **Markdown 表格** 示例：\n\n" +
      "| 姓名 | 年龄 | 职业 |\n" +
      "| :--- | :---: | ---: |\n" +
      "| 张三 | 25 | 工程师 |\n" +
      "| 李四 | 30 | 设计师 |\n" +
      "| 王五 | 28 | 产品经理 |\n\n" +
      "表格支持对齐方式：\n" +
      "- 左对齐\n" +
      "- 居中对齐\n" +
      "- 右对齐";
  } else {
    fullText = `你所说的 "**${userText}**" 是一个非常有趣的话题。

这里有几点分析：
1. **多维度视角**：我们需要从不同角度看待问题。
2. **深度思考**：透过现象看本质。

> "知识就是力量。" —— 培根

希望这对你有帮助！`;
  }

  // 模拟流式打字
  let index = 0;
  const timer = setInterval(() => {
    if (index < fullText.length) {
      aiMsg.value.content += fullText[index];
      index++;
      scrollToBottom(); // 保持滚动到底部
    } else {
      clearInterval(timer);
      aiMsg.value.isStreaming = false;
      isGlobalTyping.value = false;
      // 更新快捷回复
      currentQuickReplies.value = ["继续", "详细展开", "换个话题"];
    }
  }, 30); // 打字速度
};

const retryMessage = (msg) => {
  // 简单模拟重试：删除该消息，重新触发一次模拟回复（这里简化处理，直接原地变为加载中）
  msg.error = null;
  msg.content = "";
  msg.isStreaming = true;

  // 重新开始流式输出模拟
  setTimeout(() => {
    // ... 具体重试逻辑可以复用 simulateAIResponse，这里仅做 UI 演示
    msg.content = "这是重试生成的内容...";
    msg.isStreaming = false;
  }, 1000);
};
</script>

<style scoped lang="scss">
.ai-chat-demo {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
}

.message-wrapper {
  margin-bottom: 16px;
}
</style>
