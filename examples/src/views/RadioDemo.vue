<template>
    <div class="demo-container">
        <van-nav-bar title="Radio 单选框" left-arrow fixed @click-left="goBack" />

        <div class="demo-content">
            <!-- 基础用法 -->
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <RadioGroup v-model="radio1" @change="handleChange">
                    <Radio name="1" label="单选框 1" />
                    <Radio name="2" label="单选框 2" />
                </RadioGroup>
            </div>

            <!-- 水平排列 -->
            <div class="demo-section">
                <div class="section-title">水平排列</div>
                <RadioGroup v-model="radio2" direction="horizontal">
                    <Radio name="1" label="选项 1" />
                    <Radio name="2" label="选项 2" />
                    <Radio name="3" label="选项 3" />
                </RadioGroup>
            </div>

            <!-- 禁用状态 -->
            <div class="demo-section">
                <div class="section-title">禁用状态</div>
                <RadioGroup v-model="radio3">
                    <Radio name="1" label="单选框 1" />
                    <Radio name="2" label="单选框 2（禁用）" disabled />
                    <Radio name="3" label="单选框 3" />
                </RadioGroup>
            </div>

            <!-- 禁用文本点击 -->
            <div class="demo-section">
                <div class="section-title">禁用文本点击</div>
                <RadioGroup v-model="radio4">
                    <Radio name="1" label="单选框 1" label-disabled />
                    <Radio name="2" label="单选框 2" label-disabled />
                </RadioGroup>
                <div class="tip">只能点击图标进行选择</div>
            </div>

            <!-- 自定义形状 -->
            <div class="demo-section">
                <div class="section-title">自定义形状</div>
                <RadioGroup v-model="radio5">
                    <Radio name="1" label="方形单选框 1" shape="square" />
                    <Radio name="2" label="方形单选框 2" shape="square" />
                </RadioGroup>
            </div>

            <!-- 自定义颜色 -->
            <div class="demo-section">
                <div class="section-title">自定义颜色</div>
                <RadioGroup v-model="radio6" checked-color="#07c160">
                    <Radio name="1" label="绿色主题" />
                    <Radio name="2" label="单选框 2" />
                </RadioGroup>
                <div style="margin-top: 16px;">
                    <RadioGroup v-model="radio7" checked-color="#ff6600">
                        <Radio name="1" label="橙色主题" />
                        <Radio name="2" label="单选框 2" />
                    </RadioGroup>
                </div>
            </div>

            <!-- 自定义大小 -->
            <div class="demo-section">
                <div class="section-title">自定义大小</div>
                <RadioGroup v-model="radio8" icon-size="24px">
                    <Radio name="1" label="大号单选框" />
                    <Radio name="2" label="单选框 2" />
                </RadioGroup>
            </div>

            <!-- 左侧文本 -->
            <div class="demo-section">
                <div class="section-title">左侧文本</div>
                <RadioGroup v-model="radio9">
                    <Radio name="1" label="单选框 1" label-position="left" />
                    <Radio name="2" label="单选框 2" label-position="left" />
                </RadioGroup>
            </div>

            <!-- 搭配单元格使用 -->
            <div class="demo-section">
                <div class="section-title">搭配单元格使用</div>
                <RadioGroup v-model="radio10">
                    <van-cell-group inset>
                        <van-cell clickable @click="radio10 = '1'">
                            <template #title>
                                <span>单元格选项 1</span>
                            </template>
                            <template #right-icon>
                                <Radio name="1" />
                            </template>
                        </van-cell>
                        <van-cell clickable @click="radio10 = '2'">
                            <template #title>
                                <span>单元格选项 2</span>
                            </template>
                            <template #right-icon>
                                <Radio name="2" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </RadioGroup>
            </div>

            <!-- 实际应用场景 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 性别选择</div>
                <RadioGroup v-model="gender" direction="horizontal">
                    <Radio name="male" label="男" />
                    <Radio name="female" label="女" />
                    <Radio name="other" label="其他" />
                </RadioGroup>
            </div>

            <div class="demo-section">
                <div class="section-title">实际应用场景 - 支付方式</div>
                <RadioGroup v-model="paymentMethod">
                    <van-cell-group inset>
                        <van-cell clickable @click="paymentMethod = 'wechat'">
                            <template #title>
                                <div class="payment-option">
                                    <span class="payment-icon">💚</span>
                                    <span>微信支付</span>
                                </div>
                            </template>
                            <template #right-icon>
                                <Radio name="wechat" />
                            </template>
                        </van-cell>
                        <van-cell clickable @click="paymentMethod = 'alipay'">
                            <template #title>
                                <div class="payment-option">
                                    <span class="payment-icon">💙</span>
                                    <span>支付宝</span>
                                </div>
                            </template>
                            <template #right-icon>
                                <Radio name="alipay" />
                            </template>
                        </van-cell>
                        <van-cell clickable @click="paymentMethod = 'card'">
                            <template #title>
                                <div class="payment-option">
                                    <span class="payment-icon">💳</span>
                                    <span>银行卡</span>
                                </div>
                            </template>
                            <template #right-icon>
                                <Radio name="card" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </RadioGroup>
            </div>

            <!-- 当前选中 -->
            <div class="demo-section">
                <div class="section-title">当前选中值</div>
                <div class="current-value">
                    <div>基础用法: {{ radio1 }}</div>
                    <div>性别: {{ gender }}</div>
                    <div>支付方式: {{ paymentMethod }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Radio, RadioGroup } from '../../../packages/src/index.js';
import { showToast } from 'vant';

const router = useRouter();

const radio1 = ref('1');
const radio2 = ref('1');
const radio3 = ref('1');
const radio4 = ref('1');
const radio5 = ref('1');
const radio6 = ref('1');
const radio7 = ref('1');
const radio8 = ref('1');
const radio9 = ref('1');
const radio10 = ref('1');
const gender = ref('male');
const paymentMethod = ref('wechat');

const handleChange = (value) => {
    showToast(`选中: ${value}`);
};

const goBack = () => {
    router.back();
};
</script>

<style scoped lang="scss">
.demo-container {
    min-height: 100vh;
    background: #f7f8fa;
    padding-top: 46px;
}

.demo-content {
    padding-bottom: 20px;
}

.demo-section {
    margin-bottom: 16px;
    background: #fff;
    padding: 0 16px 16px;
}

.section-title {
    padding: 16px 0 12px;
    font-size: 14px;
    color: #969799;
    font-weight: 500;
}

.tip {
    margin-top: 8px;
    font-size: 12px;
    color: #969799;
}

.payment-option {
    display: flex;
    align-items: center;
    gap: 8px;

    .payment-icon {
        font-size: 20px;
    }
}

.current-value {
    padding: 16px;
    font-size: 14px;
    color: #323233;
    background: #f7f8fa;
    border-radius: 4px;
    margin-top: 12px;

    div {
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
