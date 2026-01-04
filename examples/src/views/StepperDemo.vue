<template>
    <div class="demo-page">
        <Navbar title="Stepper 步进器" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <Stepper v-model="value1" />
                <div class="demo-value">当前值: {{ value1 }}</div>
            </div>

            <div class="demo-section">
                <h3>步长设置</h3>
                <Stepper v-model="value2" :step="2" />
                <div class="demo-value">当前值: {{ value2 }}</div>
            </div>

            <div class="demo-section">
                <h3>限制范围</h3>
                <Stepper v-model="value3" :min="1" :max="10" />
                <div class="demo-value">当前值: {{ value3 }} (范围: 1-10)</div>
            </div>

            <div class="demo-section">
                <h3>禁用状态</h3>
                <Stepper v-model="value4" disabled />
            </div>

            <div class="demo-section">
                <h3>禁用输入框</h3>
                <Stepper v-model="value5" disable-input />
            </div>

            <div class="demo-section">
                <h3>小数步长</h3>
                <Stepper v-model="value6" :step="0.1" :decimal-length="1" />
                <div class="demo-value">当前值: {{ value6 }}</div>
            </div>

            <div class="demo-section">
                <h3>自定义大小</h3>
                <div style="margin-bottom: 12px;">
                    <Stepper v-model="value7" style="--stepper-width: 50px; --stepper-height: 40px;" />
                </div>
            </div>

            <div class="demo-section">
                <h3>事件监听</h3>
                <Stepper v-model="value8" @change="handleChange" @plus="handlePlus" @minus="handleMinus" />
                <div class="demo-value">{{ eventLog }}</div>
            </div>

            <div class="demo-section">
                <h3>购物车示例</h3>
                <div class="cart-item">
                    <img src="https://via.placeholder.com/80" class="cart-item__image" />
                    <div class="cart-item__content">
                        <div class="cart-item__title">商品名称</div>
                        <div class="cart-item__footer">
                            <span class="cart-item__price">¥99.00</span>
                            <Stepper v-model="cartCount" :min="1" :max="99" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Stepper, Navbar, Toast } from '../../../packages/src/index.js';

const value1 = ref(1);
const value2 = ref(0);
const value3 = ref(5);
const value4 = ref(1);
const value5 = ref(1);
const value6 = ref(1.0);
const value7 = ref(1);
const value8 = ref(1);
const cartCount = ref(1);
const eventLog = ref('等待操作...');

const handleChange = (value) => {
    eventLog.value = `值改变: ${value}`;
    Toast(`当前值: ${value}`);
};

const handlePlus = () => {
    eventLog.value = '点击了加号';
};

const handleMinus = () => {
    eventLog.value = '点击了减号';
};
</script>

<style scoped>
.demo-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f7f8fa;
    overflow-y: auto;
}

.demo-container {
    padding: 56px 20px 20px;
}

.demo-section {
    margin-bottom: 32px;
}

.demo-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #323233;
}

.demo-value {
    margin-top: 12px;
    font-size: 14px;
    color: #646566;
}

.cart-item {
    display: flex;
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

.cart-item__image {
    width: 80px;
    height: 80px;
    margin-right: 12px;
    border-radius: 8px;
}

.cart-item__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.cart-item__title {
    font-size: 14px;
    color: #323233;
}

.cart-item__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.cart-item__price {
    font-size: 16px;
    font-weight: 500;
    color: #ee0a24;
}
</style>
