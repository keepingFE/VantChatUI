<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Input 输入框" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <Input v-model="value1" label="文本" placeholder="请输入文本" />
      </div>

      <!-- 输入框类型 -->
      <div class="demo-section">
        <div class="section-title">输入框类型</div>
        <Input
          v-model="value2"
          type="text"
          label="文本"
          placeholder="请输入..."
        />
        <Input
          v-model="value3"
          type="number"
          label="数字"
          placeholder="请输入数字"
        />
        <Input
          v-model="value4"
          type="tel"
          label="电话"
          placeholder="请输入电话"
        />
        <Input
          v-model="value5"
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
      </div>

      <!-- 禁用和只读 -->
      <div class="demo-section">
        <div class="section-title">禁用和只读</div>
        <Input v-model="value6" label="禁用" disabled />
        <Input v-model="value7" label="只读" readonly />
      </div>

      <!-- 显示图标 -->
      <div class="demo-section">
        <div class="section-title">显示图标</div>
        <Input
          v-model="value8"
          label="左侧图标"
          left-icon="contact"
          placeholder="请输入..."
        />
        <Input
          v-model="value9"
          label="右侧图标"
          right-icon="search"
          placeholder="搜索..."
        />
      </div>

      <!-- 可清空 -->
      <div class="demo-section">
        <div class="section-title">可清空</div>
        <Input
          v-model="value10"
          label="输入框"
          clearable
          placeholder="请输入..."
        />
      </div>

      <!-- 必填标记 -->
      <div class="demo-section">
        <div class="section-title">必填标记</div>
        <Input
          v-model="value11"
          label="用户名"
          required
          placeholder="请输入用户名"
        />
      </div>

      <!-- 字数统计 -->
      <div class="demo-section">
        <div class="section-title">字数统计</div>
        <Input
          v-model="value12"
          label="留言"
          :maxLength="50"
          show-word-limit
          placeholder="最多输入50字"
        />
      </div>

      <!-- 文本域 -->
      <div class="demo-section">
        <div class="section-title">文本域</div>
        <Input
          v-model="value13"
          type="textarea"
          label="留言"
          :rows="3"
          placeholder="请输入留言"
        />
      </div>

      <!-- 自适应高度文本域 -->
      <div class="demo-section">
        <div class="section-title">自适应高度文本域</div>
        <Input
          v-model="value14"
          type="textarea"
          label="留言"
          :minRows="2"
          :maxRows="5"
          placeholder="自动调整高度（2-5行）"
        />
      </div>

      <!-- 错误提示 -->
      <div class="demo-section">
        <div class="section-title">错误提示</div>
        <Input
          v-model="value15"
          label="用户名"
          error
          error-message="用户名格式不正确"
          placeholder="请输入用户名"
        />
      </div>

      <!-- 内容对齐 -->
      <div class="demo-section">
        <div class="section-title">内容对齐</div>
        <Input
          v-model="value16"
          label="左对齐"
          input-align="left"
          placeholder="左对齐"
        />
        <Input
          v-model="value17"
          label="居中"
          input-align="center"
          placeholder="居中"
        />
        <Input
          v-model="value18"
          label="右对齐"
          input-align="right"
          placeholder="右对齐"
        />
      </div>

      <!-- 实际应用 - 登录表单 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 登录表单</div>
        <div class="login-form">
          <Input
            v-model="loginForm.username"
            label="用户名"
            left-icon="manager"
            clearable
            required
            placeholder="请输入用户名"
          />
          <Input
            v-model="loginForm.password"
            label="密码"
            type="password"
            left-icon="lock"
            clearable
            required
            placeholder="请输入密码"
          />
          <Button
            text="登录"
            type="primary"
            block
            style="margin-top: 16px"
            @click="handleLogin"
          />
        </div>
      </div>

      <!-- 实际应用 - 反馈表单 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 反馈表单</div>
        <div class="feedback-form">
          <Input
            v-model="feedbackForm.name"
            label="姓名"
            required
            placeholder="请输入姓名"
          />
          <Input
            v-model="feedbackForm.phone"
            label="联系电话"
            type="tel"
            required
            placeholder="请输入联系电话"
          />
          <Input
            v-model="feedbackForm.content"
            type="textarea"
            label="反馈内容"
            :minRows="3"
            :maxLength="200"
            show-word-limit
            required
            placeholder="请输入反馈内容"
          />
          <Button
            text="提交反馈"
            type="primary"
            block
            style="margin-top: 16px"
            @click="handleFeedback"
          />
        </div>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, Input, Button } from "../../../packages/src/index.js";
import { showToast } from "vant";

const router = useRouter();
const chatRef = ref(null);

// 基础用法
const value1 = ref("");
const value2 = ref("");
const value3 = ref("");
const value4 = ref("");
const value5 = ref("");
const value6 = ref("输入框已禁用");
const value7 = ref("输入框只读");
const value8 = ref("");
const value9 = ref("");
const value10 = ref("可清空内容");
const value11 = ref("");
const value12 = ref("");
const value13 = ref("");
const value14 = ref("");
const value15 = ref("invalid_name");
const value16 = ref("左对齐");
const value17 = ref("居中");
const value18 = ref("右对齐");

// 登录表单
const loginForm = ref({
  username: "",
  password: "",
});

// 反馈表单
const feedbackForm = ref({
  name: "",
  phone: "",
  content: "",
});

const handleLogin = () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    showToast("请填写完整信息");
    return;
  }
  showToast("登录成功");
};

const handleFeedback = () => {
  if (
    !feedbackForm.value.name ||
    !feedbackForm.value.phone ||
    !feedbackForm.value.content
  ) {
    showToast("请填写完整信息");
    return;
  }
  showToast("提交成功");
};

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.demo-section {
  padding: 0;
  background: #ffffff;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  color: #646566;
  padding: 16px 16px 8px 16px;
  font-weight: 400;
}

// 输入框样式
:deep(.van-field) {
  &:not(:last-child) {
    border-bottom: 1px solid #f7f8fa;
  }
}

.login-form,
.feedback-form {
  padding: 0 0 16px 0;
}
</style>
