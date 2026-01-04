<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Form 表单消息" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 代码演示 -->
      <div class="demo-section">
        <div class="section-title">代码演示</div>
      </div>

      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <FormMessage
          title="用户信息表单"
          :fields="[
            {
              name: 'username',
              type: 'text',
              label: '用户名',
              placeholder: '请输入用户名',
              required: true,
            },
            {
              name: 'email',
              type: 'text',
              label: '邮箱',
              placeholder: '请输入邮箱',
              required: true,
              rules: [
                {
                  required: true,
                  message: '邮箱不能为空',
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: '请输入正确的邮箱格式',
                },
              ],
            },
          ]"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>

      <!-- 多种输入类型 -->
      <div class="demo-section">
        <div class="section-title">多种输入类型</div>
        <FormMessage
          title="完整表单"
          description="请填写以下信息"
          :fields="[
            {
              name: 'name',
              type: 'text',
              label: '姓名',
              placeholder: '请输入姓名',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
              label: '手机号',
              placeholder: '请输入手机号',
              required: true,
            },
            {
              name: 'gender',
              type: 'select',
              label: '性别',
              placeholder: '请选择性别',
              required: true,
              options: [
                { label: '男', value: 'male' },
                { label: '女', value: 'female' },
                { label: '其他', value: 'other' },
              ],
            },
            {
              name: 'birthday',
              type: 'date',
              label: '出生日期',
              placeholder: '请选择出生日期',
              required: true,
            },
            {
              name: 'bio',
              type: 'textarea',
              label: '个人简介',
              placeholder: '请输入个人简介',
              rows: 4,
            },
          ]"
          @submit="handleSubmit"
        />
      </div>

      <!-- 单选框组 -->
      <div class="demo-section">
        <div class="section-title">单选框组</div>
        <FormMessage
          title="选择问题"
          :fields="[
            {
              name: 'favorite',
              type: 'radio',
              label: '您最喜欢的颜色？',
              required: true,
              options: [
                { label: '红色', value: 'red' },
                { label: '蓝色', value: 'blue' },
                { label: '绿色', value: 'green' },
                { label: '其他', value: 'other' },
              ],
            },
          ]"
          @submit="handleSubmit"
        />
      </div>

      <!-- 复选框组 -->
      <div class="demo-section">
        <div class="section-title">复选框组</div>
        <FormMessage
          title="多选问题"
          :fields="[
            {
              name: 'hobbies',
              type: 'checkbox',
              label: '您的兴趣爱好？（多选）',
              required: true,
              options: [
                { label: '阅读', value: 'reading' },
                { label: '运动', value: 'sports' },
                { label: '音乐', value: 'music' },
                { label: '旅行', value: 'travel' },
              ],
            },
          ]"
          @submit="handleSubmit"
        />
      </div>

      <!-- 日期时间选择 -->
      <div class="demo-section">
        <div class="section-title">日期时间选择</div>
        <FormMessage
          title="时间选择"
          :fields="[
            {
              name: 'date',
              type: 'date',
              label: '预约日期',
              placeholder: '请选择日期',
              required: true,
            },
            {
              name: 'datetime',
              type: 'datetime',
              label: '预约时间',
              placeholder: '请选择日期和时间',
              required: true,
            },
          ]"
          @submit="handleSubmit"
        />
      </div>

      <!-- 带标题图标 -->
      <div class="demo-section">
        <div class="section-title">带标题图标</div>
        <FormMessage
          title="用户注册"
          title-icon="user-circle-o"
          :fields="[
            {
              name: 'username',
              type: 'text',
              label: '用户名',
              placeholder: '请输入用户名',
              required: true,
            },
            {
              name: 'password',
              type: 'text',
              label: '密码',
              placeholder: '请输入密码',
              inputType: 'password',
              required: true,
            },
          ]"
          @submit="handleSubmit"
        />
      </div>

      <!-- 自定义主题色 -->
      <div class="demo-section">
        <div class="section-title">自定义主题色</div>
        <FormMessage
          title="自定义样式"
          :fields="[
            {
              name: 'feedback',
              type: 'textarea',
              label: '您的反馈',
              placeholder: '请输入您的反馈',
              rows: 4,
              required: true,
            },
          ]"
          theme-color="#ff6b6b"
          @submit="handleSubmit"
        />
      </div>

      <!-- 禁用状态 -->
      <div class="demo-section">
        <div class="section-title">禁用状态</div>
        <FormMessage
          title="只读表单"
          :fields="[
            {
              name: 'username',
              type: 'text',
              label: '用户名',
              placeholder: '张三',
              readonly: true,
            },
            {
              name: 'email',
              type: 'text',
              label: '邮箱',
              placeholder: 'zhangsan@example.com',
              disabled: true,
            },
          ]"
          :disabled="false"
          @submit="handleSubmit"
        />
      </div>

      <!-- 事件监听 -->
      <div class="demo-section">
        <div class="section-title">事件监听</div>
        <FormMessage
          title="表单事件"
          :fields="[
            {
              name: 'name',
              type: 'text',
              label: '姓名',
              placeholder: '请输入姓名',
              required: true,
            },
          ]"
          @field-change="handleFieldChange"
          @validate="handleValidate"
          @submit="handleSubmit"
          @cancel="handleCancel"
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
        <div class="section-title">实际应用 - 聊天中的表单</div>
        <Flex direction="column" gap="16px">
          <div class="message-bubble">
            <div class="message-text">请填写以下信息</div>
          </div>

          <FormMessage
            title="预约表单"
            description="请选择您想预约的时间和项目"
            :fields="[
              {
                name: 'service',
                type: 'radio',
                label: '选择服务',
                required: true,
                options: [
                  { label: '普通咨询', value: 'consult' },
                  { label: '深度服务', value: 'deep' },
                ],
              },
              {
                name: 'date',
                type: 'date',
                label: '预约日期',
                placeholder: '请选择日期',
                required: true,
              },
              {
                name: 'phone',
                type: 'text',
                label: '联系电话',
                placeholder: '请输入手机号',
                required: true,
              },
            ]"
            max-width="320px"
            @submit="handleSubmit"
          />
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 反馈收集</div>
        <div class="message-bubble">
          <div class="message-text">感谢您的使用，请提供宝贵的反馈</div>
        </div>

        <FormMessage
          title="反馈表单"
          title-icon="comment-o"
          :fields="[
            {
              name: 'rating',
              type: 'radio',
              label: '您对服务的满意度',
              required: true,
              options: [
                { label: '非常满意', value: 5 },
                { label: '满意', value: 4 },
                { label: '一般', value: 3 },
                { label: '不满意', value: 2 },
                { label: '非常不满意', value: 1 },
              ],
            },
            {
              name: 'improvements',
              type: 'checkbox',
              label: '您认为我们需要改进的地方？（多选）',
              required: true,
              options: [
                { label: '功能完善', value: 'feature' },
                { label: '性能优化', value: 'performance' },
                { label: '用户体验', value: 'ux' },
                { label: '客服服务', value: 'service' },
              ],
            },
            {
              name: 'feedback',
              type: 'textarea',
              label: '其他建议',
              placeholder: '请输入您的建议',
              rows: 4,
            },
          ]"
          max-width="320px"
          theme-color="#51cf66"
          @submit="handleSubmit"
        />
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, FormMessage, Flex } from "../../../packages/src/index.js";

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

const handleFieldChange = ({ name, value }) => {
  addLog(`字段变化: ${name} = ${value}`);
};

const handleValidate = ({ valid, data }) => {
  addLog(`表单验证: ${valid ? '通过' : '失败'}`);
  console.log('表单数据:', data);
};

const handleSubmit = (data) => {
  addLog('表单提交成功');
  console.log('提交的数据:', data);
  alert('表单提交成功！\n' + JSON.stringify(data, null, 2));
};

const handleCancel = () => {
  addLog('取消提交');
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
  max-width: fit-content;
}

.message-text {
  font-size: 14px;
  color: #323233;
  line-height: 1.6;
}
</style>
