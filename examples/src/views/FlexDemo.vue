<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Flex 布局" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <Flex gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <!-- 主轴方向 -->
      <div class="demo-section">
        <div class="section-title">主轴方向 - 水平</div>
        <Flex direction="row" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">主轴方向 - 垂直</div>
        <Flex direction="column" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <!-- 主轴对齐 -->
      <div class="demo-section">
        <div class="section-title">主轴对齐 - 起始对齐</div>
        <Flex justify="start" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">主轴对齐 - 居中对齐</div>
        <Flex justify="center" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">主轴对齐 - 末尾对齐</div>
        <Flex justify="end" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">主轴对齐 - 两端对齐</div>
        <Flex justify="space-between" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">主轴对齐 - 环绕对齐</div>
        <Flex justify="space-around" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">主轴对齐 - 均匀对齐</div>
        <Flex justify="space-evenly" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <!-- 交叉轴对齐 -->
      <div class="demo-section">
        <div class="section-title">交叉轴对齐 - 起始对齐</div>
        <Flex align="start" gap="8px" class="demo-box demo-box-tall">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">交叉轴对齐 - 居中对齐</div>
        <Flex align="center" gap="8px" class="demo-box demo-box-tall">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">交叉轴对齐 - 末尾对齐</div>
        <Flex align="end" gap="8px" class="demo-box demo-box-tall">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <!-- 换行 -->
      <div class="demo-section">
        <div class="section-title">换行 - 不换行</div>
        <Flex wrap="nowrap" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
          <div class="demo-item">4</div>
          <div class="demo-item">5</div>
          <div class="demo-item">6</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">换行 - 自动换行</div>
        <Flex wrap="wrap" gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
          <div class="demo-item">4</div>
          <div class="demo-item">5</div>
          <div class="demo-item">6</div>
        </Flex>
      </div>

      <!-- 间距 -->
      <div class="demo-section">
        <div class="section-title">间距 - 8px</div>
        <Flex gap="8px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">间距 - 16px</div>
        <Flex gap="16px" class="demo-box">
          <div class="demo-item">1</div>
          <div class="demo-item">2</div>
          <div class="demo-item">3</div>
        </Flex>
      </div>

      <!-- FlexItem 使用 -->
      <div class="demo-section">
        <div class="section-title">FlexItem - flex 比例</div>
        <Flex gap="8px" class="demo-box">
          <FlexItem flex="1">
            <div class="demo-item">flex: 1</div>
          </FlexItem>
          <FlexItem flex="2">
            <div class="demo-item">flex: 2</div>
          </FlexItem>
          <FlexItem flex="1">
            <div class="demo-item">flex: 1</div>
          </FlexItem>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">FlexItem - 固定宽度 + 自适应</div>
        <Flex gap="8px" class="demo-box">
          <FlexItem basis="100px">
            <div class="demo-item">100px</div>
          </FlexItem>
          <FlexItem flex="1">
            <div class="demo-item">自适应</div>
          </FlexItem>
          <FlexItem basis="80px">
            <div class="demo-item">80px</div>
          </FlexItem>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">FlexItem - 单独对齐</div>
        <Flex gap="8px" class="demo-box demo-box-tall">
          <FlexItem align-self="start">
            <div class="demo-item">start</div>
          </FlexItem>
          <FlexItem align-self="center">
            <div class="demo-item">center</div>
          </FlexItem>
          <FlexItem align-self="end">
            <div class="demo-item">end</div>
          </FlexItem>
        </Flex>
      </div>

      <!-- 实际应用场景 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 对话选择按钮</div>
        <Flex wrap="wrap" gap="8px" class="demo-box">
          <Button
            text="1/2"
            type="default"
            size="sm"
            @click="handleSelect('1/2')"
          />
          <Button
            text="1/2"
            type="default"
            size="sm"
            @click="handleSelect('1/2')"
          />
          <Button
            text="1/3"
            type="default"
            size="sm"
            @click="handleSelect('1/3')"
          />
          <Button
            text="1/3"
            type="default"
            size="sm"
            @click="handleSelect('1/3')"
          />
          <Button
            text="1/3"
            type="default"
            size="sm"
            @click="handleSelect('1/3')"
          />
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 操作栏</div>
        <Flex
          justify="space-between"
          align="center"
          class="demo-box action-bar"
        >
          <span class="action-title">标题</span>
          <Flex gap="8px">
            <Button text="取消" type="default" size="sm" />
            <Button text="确认" type="primary" size="sm" />
          </Flex>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 卡片布局</div>
        <Flex gap="12px" wrap="wrap" class="demo-box">
          <FlexItem flex="1" style="min-width: 150px">
            <div class="demo-card">卡片 1</div>
          </FlexItem>
          <FlexItem flex="1" style="min-width: 150px">
            <div class="demo-card">卡片 2</div>
          </FlexItem>
          <FlexItem flex="1" style="min-width: 150px">
            <div class="demo-card">卡片 3</div>
          </FlexItem>
        </Flex>
      </div>

      <!-- 组合示例 -->
      <div class="demo-section">
        <div class="section-title">组合示例 - 聊天消息布局</div>
        <Flex direction="column" gap="12px" class="demo-box">
          <Flex justify="start" gap="8px">
            <div class="avatar">AI</div>
            <div class="message-bubble left">你好！有什么可以帮助你的？</div>
          </Flex>
          <Flex justify="end" gap="8px">
            <div class="message-bubble right">我想了解 Flex 布局</div>
            <div class="avatar">我</div>
          </Flex>
          <Flex justify="start" gap="8px">
            <div class="avatar">AI</div>
            <div class="message-bubble left">Flex 是一个强大的布局工具...</div>
          </Flex>
        </Flex>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, Flex, FlexItem, Button } from "../../../packages/src/index.js";
import { showToast } from "vant";

const router = useRouter();
const chatRef = ref(null);

const handleSelect = (option) => {
  showToast(`选择了: ${option}`);
};

const goBack = () => {
  router.back();
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

.demo-box {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #ebedf0;

  &-tall {
    min-height: 120px;
  }
}

.demo-item {
  padding: 12px 16px;
  background: linear-gradient(135deg, #ffd89b 0%, #ff9a62 100%);
  color: #ffffff;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.demo-card {
  padding: 20px;
  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
  color: #2d3436;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.action-bar {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #ebedf0;

  .action-title {
    font-size: 16px;
    font-weight: 600;
    color: #323233;
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd89b 0%, #ff9a62 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;

  &.left {
    background: #f0f0f0;
    color: #323233;
  }

  &.right {
    background: linear-gradient(135deg, #ffd89b 0%, #ff9a62 100%);
    color: #ffffff;
  }
}
</style>
```
