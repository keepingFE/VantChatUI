<template>
    <div class="demo-container">
        <van-nav-bar title="Accordion 手风琴" left-arrow fixed @click-left="goBack" />

        <div class="demo-content">
            <!-- 基础用法 -->
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <Accordion v-model="activeNames1" @change="handleChange">
                    <AccordionItem name="1" title="标题 1">
                        代码是写出来给人看的，附带能在机器上运行。
                    </AccordionItem>
                    <AccordionItem name="2" title="标题 2">
                        技术是开发它的人的共同灵魂。
                    </AccordionItem>
                    <AccordionItem name="3" title="标题 3">
                        在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 手风琴模式 -->
            <div class="demo-section">
                <div class="section-title">手风琴模式</div>
                <Accordion v-model="activeNames2" accordion>
                    <AccordionItem name="1" title="标题 1">
                        手风琴模式下，同时只能展开一个面板。
                    </AccordionItem>
                    <AccordionItem name="2" title="标题 2">
                        点击其他面板时，当前面板会自动收起。
                    </AccordionItem>
                    <AccordionItem name="3" title="标题 3">
                        这种模式适合内容较多的场景。
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 禁用状态 -->
            <div class="demo-section">
                <div class="section-title">禁用状态</div>
                <Accordion v-model="activeNames3">
                    <AccordionItem name="1" title="标题 1">
                        这是正常的面板内容。
                    </AccordionItem>
                    <AccordionItem name="2" title="标题 2（禁用）" disabled>
                        这个面板被禁用了，无法展开。
                    </AccordionItem>
                    <AccordionItem name="3" title="标题 3">
                        这也是正常的面板内容。
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 自定义标题 -->
            <div class="demo-section">
                <div class="section-title">自定义标题</div>
                <Accordion v-model="activeNames4">
                    <AccordionItem name="1">
                        <template #title>
                            <div class="custom-title">
                                <span class="icon">📝</span>
                                <span>自定义标题 1</span>
                            </div>
                        </template>
                        支持通过插槽自定义标题内容。
                    </AccordionItem>
                    <AccordionItem name="2">
                        <template #title>
                            <div class="custom-title">
                                <span class="icon">🎨</span>
                                <span>自定义标题 2</span>
                            </div>
                        </template>
                        可以添加图标、徽章等元素。
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 带标题栏右侧内容 -->
            <div class="demo-section">
                <div class="section-title">带标题栏右侧内容</div>
                <Accordion v-model="activeNames5">
                    <AccordionItem name="1" title="标题 1" value="内容">
                        标题栏右侧可以显示额外信息。
                    </AccordionItem>
                    <AccordionItem name="2" title="标题 2" value="文本">
                        比如状态、数量等。
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 带描述信息 -->
            <div class="demo-section">
                <div class="section-title">带描述信息</div>
                <Accordion v-model="activeNames6">
                    <AccordionItem name="1" title="标题 1" label="这是描述信息">
                        标题下方可以显示描述信息。
                    </AccordionItem>
                    <AccordionItem name="2" title="标题 2" label="支持多行描述">
                        用于补充说明标题内容。
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 实际应用场景 - FAQ -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 常见问题</div>
                <Accordion v-model="faqActive" accordion>
                    <AccordionItem name="1" title="如何注册账号？">
                        <div class="faq-content">
                            <p>1. 点击页面右上角的"注册"按钮</p>
                            <p>2. 填写手机号码并获取验证码</p>
                            <p>3. 设置登录密码</p>
                            <p>4. 完成注册</p>
                        </div>
                    </AccordionItem>
                    <AccordionItem name="2" title="忘记密码怎么办？">
                        <div class="faq-content">
                            <p>1. 点击登录页面的"忘记密码"</p>
                            <p>2. 输入注册手机号</p>
                            <p>3. 通过短信验证码重置密码</p>
                        </div>
                    </AccordionItem>
                    <AccordionItem name="3" title="如何联系客服？">
                        <div class="faq-content">
                            <p>客服热线: 400-123-4567</p>
                            <p>工作时间: 周一至周五 9:00-18:00</p>
                            <p>在线客服: 点击右下角客服图标</p>
                        </div>
                    </AccordionItem>
                    <AccordionItem name="4" title="支持哪些支付方式？">
                        <div class="faq-content">
                            <p>• 微信支付</p>
                            <p>• 支付宝</p>
                            <p>• 银行卡支付</p>
                            <p>• Apple Pay</p>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 实际应用场景 - 订单详情 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 订单详情</div>
                <Accordion v-model="orderActive">
                    <AccordionItem name="1" title="商品信息" value="3件">
                        <div class="order-content">
                            <div class="order-item">
                                <span>商品 A × 1</span>
                                <span>¥99.00</span>
                            </div>
                            <div class="order-item">
                                <span>商品 B × 2</span>
                                <span>¥158.00</span>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem name="2" title="配送信息">
                        <div class="order-content">
                            <div class="order-item">
                                <span>收货人:</span>
                                <span>张三</span>
                            </div>
                            <div class="order-item">
                                <span>联系电话:</span>
                                <span>138****8888</span>
                            </div>
                            <div class="order-item">
                                <span>收货地址:</span>
                                <span>北京市朝阳区xxx街道xxx号</span>
                            </div>
                        </div>
                    </AccordionItem>
                    <AccordionItem name="3" title="费用明细">
                        <div class="order-content">
                            <div class="order-item">
                                <span>商品总额:</span>
                                <span>¥257.00</span>
                            </div>
                            <div class="order-item">
                                <span>运费:</span>
                                <span>¥10.00</span>
                            </div>
                            <div class="order-item">
                                <span>优惠券:</span>
                                <span class="discount">-¥20.00</span>
                            </div>
                            <div class="order-item total">
                                <span>实付金额:</span>
                                <span>¥247.00</span>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>

            <!-- 当前展开 -->
            <div class="demo-section">
                <div class="section-title">当前展开的面板</div>
                <div class="current-value">
                    <div>基础用法: {{ activeNames1 }}</div>
                    <div>手风琴模式: {{ activeNames2 }}</div>
                    <div>FAQ: {{ faqActive }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Accordion, AccordionItem } from '../../../packages/src/index.js';
import { showToast } from 'vant';

const router = useRouter();

const activeNames1 = ref(['1']);
const activeNames2 = ref('1');
const activeNames3 = ref(['1']);
const activeNames4 = ref(['1']);
const activeNames5 = ref(['1']);
const activeNames6 = ref(['1']);
const faqActive = ref('');
const orderActive = ref(['1', '2', '3']);

const handleChange = (value) => {
    showToast(`当前展开: ${value}`);
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
}

.section-title {
    padding: 16px 16px 8px;
    font-size: 14px;
    color: #969799;
    font-weight: 500;
    background: #f7f8fa;
}

.custom-title {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
        font-size: 18px;
    }
}

.faq-content {
    padding: 12px 16px;
    font-size: 14px;
    color: #646566;
    line-height: 1.8;

    p {
        margin: 8px 0;
    }
}

.order-content {
    padding: 12px 16px;

    .order-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        font-size: 14px;
        color: #323233;

        &.total {
            margin-top: 8px;
            padding-top: 12px;
            border-top: 1px solid #ebedf0;
            font-weight: 600;
            color: #ee0a24;
        }
    }

    .discount {
        color: #ee0a24;
    }
}

.current-value {
    padding: 16px;
    font-size: 14px;
    color: #323233;
    background: #fff;

    div {
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
