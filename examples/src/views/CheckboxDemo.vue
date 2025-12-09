<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar
        title="Checkbox 复选框"
        left-arrow
        fixed
        @click-left="goBack"
      />
    </template>

    <template #default>
      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <Checkbox v-model="checked1" label="复选框" @change="handleChange" />
        <div class="demo-result">选中状态: {{ checked1 }}</div>
      </div>

      <!-- 禁用状态 -->
      <div class="demo-section">
        <div class="section-title">禁用状态</div>
        <Checkbox v-model="checked2" label="未选中禁用" disabled />
        <Checkbox v-model="checked3" label="选中禁用" disabled />
      </div>

      <!-- 自定义形状 -->
      <div class="demo-section">
        <div class="section-title">自定义形状</div>
        <Checkbox v-model="checked4" label="圆形复选框" shape="round" />
        <Checkbox v-model="checked5" label="方形复选框" shape="square" />
      </div>

      <!-- 自定义颜色 -->
      <div class="demo-section">
        <div class="section-title">自定义颜色</div>
        <Checkbox v-model="checked6" label="ABC" checked-color="#1989fa" />
        <Checkbox v-model="checked7" label="可选项AB" checked-color="#ff6600" />
        <Checkbox v-model="checked8" label="abc" checked-color="#52c41a" />
      </div>

      <!-- 自定义图标大小 -->
      <div class="demo-section">
        <div class="section-title">自定义图标大小</div>
        <Checkbox v-model="checked10" label="小号16px" icon-size="16px" />
        <Checkbox v-model="checked11" label="默认20px" icon-size="20px" />
        <Checkbox v-model="checked12" label="大号24px" icon-size="24px" />
      </div>

      <!-- 文本位置 -->
      <div class="demo-section">
        <div class="section-title">文本位置</div>
        <Checkbox
          v-model="checked13"
          label="文本在右侧"
          label-position="right"
        />
        <Checkbox
          v-model="checked14"
          label="文本在左侧"
          label-position="left"
        />
      </div>

      <!-- 复选框组 - 基础用法 -->
      <div class="demo-section">
        <div class="section-title">复选框组 - 基础用法</div>
        <CheckboxGroup v-model="result1" @change="handleGroupChange">
          <Checkbox name="apple" label="Apple" />
          <Checkbox name="pear" label="Pear" />
          <Checkbox name="orange" label="Orange" />
        </CheckboxGroup>
        <div class="demo-result">选中: {{ result1.join(", ") || "无" }}</div>
      </div>

      <!-- 复选框组 - 水平排列 -->
      <div class="demo-section">
        <div class="section-title">复选框组 - 水平排列</div>
        <CheckboxGroup v-model="result2" direction="horizontal">
          <Checkbox name="apple" label="Apple" />
          <Checkbox name="pear" label="Pear" />
          <Checkbox name="orange" label="Orange" />
          <Checkbox name="banana" label="Banana" />
        </CheckboxGroup>
        <div class="demo-result">选中: {{ result2.join(", ") || "无" }}</div>
      </div>

      <!-- 复选框组 - 限制最大可选数 -->
      <div class="demo-section">
        <div class="section-title">复选框组 - 限制最大可选数（最多选2个）</div>
        <CheckboxGroup v-model="result3" :max="2">
          <Checkbox name="apple" label="Apple" />
          <Checkbox name="pear" label="Pear" />
          <Checkbox name="orange" label="Orange" />
          <Checkbox name="banana" label="Banana" />
        </CheckboxGroup>
        <div class="demo-result">选中: {{ result3.join(", ") || "无" }}</div>
      </div>

      <!-- 复选框组 - 全选/反选 -->
      <div class="demo-section">
        <div class="section-title">复选框组 - 全选/反选</div>
        <Flex gap="8px" style="margin-bottom: 12px">
          <Button text="全选" type="primary" size="sm" @click="checkAll" />
          <Button text="反选" type="default" size="sm" @click="toggleAll" />
          <Button text="清空" type="default" size="sm" @click="clearAll" />
        </Flex>
        <CheckboxGroup v-model="result4">
          <Checkbox name="apple" label="Apple" />
          <Checkbox name="pear" label="Pear" />
          <Checkbox name="orange" label="Orange" />
          <Checkbox name="banana" label="Banana" />
        </CheckboxGroup>
        <div class="demo-result">选中: {{ result4.join(", ") || "无" }}</div>
      </div>

      <!-- 实际应用 - 兴趣选择 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 兴趣选择</div>
        <div class="interest-card">
          <div class="interest-title">请选择您的兴趣爱好</div>
          <CheckboxGroup v-model="interests" direction="horizontal">
            <Checkbox
              v-for="item in interestOptions"
              :key="item.value"
              :name="item.value"
            >
              <div class="interest-item">
                <div class="interest-icon">{{ item.icon }}</div>
                <div class="interest-label">{{ item.label }}</div>
              </div>
            </Checkbox>
          </CheckboxGroup>
          <div class="demo-result" style="margin-top: 12px">
            已选择: {{ interests.length }} 项
          </div>
        </div>
      </div>

      <!-- 实际应用 - 服务协议 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 服务协议</div>
        <div class="agreement-card">
          <Checkbox v-model="agreeTerms">
            <span>
              我已阅读并同意
              <span style="color: #1989fa">《服务协议》</span>
              和
              <span style="color: #1989fa">《隐私政策》</span>
            </span>
          </Checkbox>
          <Button
            text="提交"
            type="primary"
            block
            :disabled="!agreeTerms"
            style="margin-top: 16px"
            @click="handleSubmit"
          />
        </div>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  Chat,
  Checkbox,
  CheckboxGroup,
  Flex,
  Button,
} from "../../../packages/src/index.js";
import { showToast } from "vant";

const router = useRouter();
const chatRef = ref(null);

// 基础用法
const checked1 = ref(false);

// 禁用状态
const checked2 = ref(false);
const checked3 = ref(true);

// 自定义形状
const checked4 = ref(true);
const checked5 = ref(true);

// 自定义颜色
const checked6 = ref(true);
const checked7 = ref(true);
const checked8 = ref(true);
const checked9 = ref(true);

// 自定义图标大小
const checked10 = ref(true);
const checked11 = ref(true);
const checked12 = ref(true);

// 文本位置
const checked13 = ref(true);
const checked14 = ref(true);

// 复选框组
const result1 = ref(["apple"]);
const result2 = ref(["apple", "pear"]);
const result3 = ref(["apple"]);
const result4 = ref(["apple"]);

// 全选/反选相关
const allOptions = ["apple", "pear", "orange", "banana"];

const checkAll = () => {
  result4.value = [...allOptions];
};

const toggleAll = () => {
  result4.value = allOptions.filter((item) => !result4.value.includes(item));
};

const clearAll = () => {
  result4.value = [];
};

// 兴趣选择
const interests = ref(["sports", "music"]);
const interestOptions = [
  { value: "sports", label: "运动", icon: "⚽" },
  { value: "music", label: "音乐", icon: "🎵" },
  { value: "reading", label: "阅读", icon: "📚" },
  { value: "travel", label: "旅行", icon: "✈️" },
  { value: "food", label: "美食", icon: "🍔" },
  { value: "movie", label: "电影", icon: "🎬" },
];

// 服务协议
const agreeTerms = ref(false);

const handleChange = (value) => {
  console.log("change:", value);
};

const handleGroupChange = (value) => {
  console.log("group change:", value);
};

const handleSubmit = () => {
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

  &:first-child {
    margin-top: 0;
  }
}

.section-title {
  font-size: 14px;
  color: #646566;
  padding: 16px 16px 8px 16px;
  font-weight: 400;
}

.demo-result {
  margin: 12px 16px;
  padding: 12px;
  background: #f7f8fa;
  border-radius: 4px;
  font-size: 14px;
  color: #323233;
}

// 为复选框添加间距
:deep(.van-checkbox) {
  padding: 12px 16px;

  &:not(:last-child) {
    border-bottom: 1px solid #f7f8fa;
  }
}

// 复选框组样式
:deep(.van-checkbox-group) {
  background: #ffffff;
}

:deep(.van-checkbox-group--horizontal) {
  padding: 12px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .van-checkbox {
    padding: 0;
    border-bottom: none;
  }
}

.interest-card {
  background: #ffffff;
  padding: 16px;
}

.interest-title {
  font-size: 16px;
  font-weight: 500;
  color: #323233;
  margin-bottom: 16px;
}

.interest-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
}

.interest-icon {
  font-size: 24px;
}

.interest-label {
  font-size: 12px;
  color: #646566;
}

.agreement-card {
  background: #ffffff;
  padding: 16px;
}
</style>
```
