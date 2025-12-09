<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Button 按钮" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <ButtonGroup>
          <Button
            text="主要按钮"
            type="primary"
            @click="handleClick('主要按钮')"
          />
          <Button
            text="默认按钮"
            type="default"
            @click="handleClick('默认按钮')"
          />
          <Button
            text="文本按钮"
            type="text"
            @click="handleClick('文本按钮')"
          />
        </ButtonGroup>
      </div>

      <!-- 按钮尺寸 -->
      <div class="demo-section">
        <div class="section-title">按钮尺寸</div>
        <ButtonGroup direction="vertical">
          <Button
            text="小号按钮"
            type="primary"
            size="sm"
            @click="handleClick('小号按钮')"
          />
          <Button
            text="默认按钮"
            type="primary"
            size="md"
            @click="handleClick('默认按钮')"
          />
          <Button
            text="大号按钮"
            type="primary"
            size="lg"
            @click="handleClick('大号按钮')"
          />
        </ButtonGroup>
      </div>

      <!-- 颜色变体 -->
      <div class="demo-section">
        <div class="section-title">颜色变体</div>
        <ButtonGroup direction="vertical">
          <Button
            text="橙色主按钮"
            type="primary"
            variant="orange"
            @click="handleClick('橙色主按钮')"
          />
          <Button
            text="成功按钮"
            type="primary"
            variant="success"
            @click="handleClick('成功按钮')"
          />
          <Button
            text="警告按钮"
            type="primary"
            variant="warning"
            @click="handleClick('警告按钮')"
          />
          <Button
            text="危险按钮"
            type="primary"
            variant="danger"
            @click="handleClick('危险按钮')"
          />
        </ButtonGroup>
      </div>

      <!-- 文本按钮变体 -->
      <div class="demo-section">
        <div class="section-title">文本按钮变体</div>
        <ButtonGroup>
          <Button
            text="橙色文本"
            type="text"
            variant="orange"
            @click="handleClick('橙色文本')"
          />
          <Button
            text="成功文本"
            type="text"
            variant="success"
            @click="handleClick('成功文本')"
          />
          <Button
            text="警告文本"
            type="text"
            variant="warning"
            @click="handleClick('警告文本')"
          />
          <Button
            text="危险文本"
            type="text"
            variant="danger"
            @click="handleClick('危险文本')"
          />
        </ButtonGroup>
      </div>

      <!-- 禁用状态 -->
      <div class="demo-section">
        <div class="section-title">禁用状态</div>
        <ButtonGroup>
          <Button text="主要按钮" type="primary" disabled />
          <Button text="默认按钮" type="default" disabled />
          <Button text="文本按钮" type="text" disabled />
        </ButtonGroup>
      </div>

      <!-- 块级按钮 -->
      <div class="demo-section">
        <div class="section-title">块级按钮</div>
        <ButtonGroup direction="vertical">
          <Button
            text="块级主按钮"
            type="primary"
            block
            @click="handleClick('块级主按钮')"
          />
          <Button
            text="块级默认按钮"
            type="default"
            block
            @click="handleClick('块级默认按钮')"
          />
        </ButtonGroup>
      </div>

      <!-- 圆角按钮 -->
      <div class="demo-section">
        <div class="section-title">圆角按钮</div>
        <ButtonGroup>
          <Button
            text="圆角主按钮"
            type="primary"
            round
            @click="handleClick('圆角主按钮')"
          />
          <Button
            text="圆角默认按钮"
            type="default"
            round
            @click="handleClick('圆角默认按钮')"
          />
          <Button
            text="圆角文本按钮"
            type="text"
            round
            @click="handleClick('圆角文本按钮')"
          />
        </ButtonGroup>
      </div>

      <!-- 水平按钮组 -->
      <div class="demo-section">
        <div class="section-title">水平按钮组</div>
        <ButtonGroup gap="12px">
          <Button text="按钮1" type="primary" @click="handleClick('按钮1')" />
          <Button text="按钮2" type="primary" @click="handleClick('按钮2')" />
          <Button text="按钮3" type="primary" @click="handleClick('按钮3')" />
        </ButtonGroup>
      </div>

      <!-- 垂直按钮组 -->
      <div class="demo-section">
        <div class="section-title">垂直按钮组</div>
        <ButtonGroup direction="vertical" gap="12px">
          <Button text="选项 A" type="default" @click="handleClick('选项 A')" />
          <Button text="选项 B" type="default" @click="handleClick('选项 B')" />
          <Button text="选项 C" type="default" @click="handleClick('选项 C')" />
        </ButtonGroup>
      </div>

      <!-- 使用插槽自定义内容 -->
      <div class="demo-section">
        <div class="section-title">自定义内容（插槽）</div>
        <ButtonGroup>
          <Button type="primary" @click="handleClick('图标按钮')">
            <span style="display: flex; align-items: center; gap: 4px">
              ✅ 确认
            </span>
          </Button>
          <Button type="default" @click="handleClick('取消')">
            <span style="display: flex; align-items: center; gap: 4px">
              ❌ 取消
            </span>
          </Button>
        </ButtonGroup>
      </div>

      <!-- 组合示例 -->
      <div class="demo-section">
        <div class="section-title">组合示例</div>
        <div class="combined-example">
          <h3>确认操作</h3>
          <p>您确定要执行此操作吗？</p>
          <ButtonGroup gap="16px">
            <Button
              text="取消"
              type="default"
              size="lg"
              @click="handleClick('取消操作')"
            />
            <Button
              text="确认"
              type="primary"
              size="lg"
              variant="orange"
              @click="handleClick('确认操作')"
            />
          </ButtonGroup>
        </div>
      </div>

      <!-- 点击反馈 -->
      <div class="demo-section">
        <div class="section-title">点击反馈</div>
        <div class="click-feedback">
          最后点击: {{ lastClickedButton || "暂无" }}
        </div>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, Button, ButtonGroup } from "../../../packages/src/index.js";
import { showToast } from "vant";

const router = useRouter();
const chatRef = ref(null);
const lastClickedButton = ref("");

const handleClick = (buttonName) => {
  lastClickedButton.value = buttonName;
  showToast(buttonName);
  console.log("点击了:", buttonName);
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

.combined-example {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;

  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: #323233;
    font-weight: 600;
  }

  p {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #646566;
    line-height: 1.6;
  }
}

.click-feedback {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #323233;
  text-align: center;
  font-weight: 500;
}
</style>
