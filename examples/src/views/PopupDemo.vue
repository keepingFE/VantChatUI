<template>
    <div class="demo-page">
        <Navbar title="Popup 弹出层" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <van-button type="primary" @click="showCenter = true">居中弹出</van-button>
                <Popup v-model="showCenter" position="center" width="300px" height="200px">
                    <div class="popup-content">
                        <h3>居中弹出</h3>
                        <p>这是一个居中弹出的内容</p>
                    </div>
                </Popup>
            </div>

            <div class="demo-section">
                <h3>底部弹出</h3>
                <van-button type="primary" @click="showBottom = true">底部弹出</van-button>
                <Popup v-model="showBottom" position="bottom" round>
                    <div class="popup-content" style="padding: 32px;">
                        <h3>底部弹出</h3>
                        <p>这是一个从底部弹出的内容</p>
                        <van-button type="primary" block @click="showBottom = false" style="margin-top: 20px;">
                            关闭
                        </van-button>
                    </div>
                </Popup>
            </div>

            <div class="demo-section">
                <h3>顶部弹出</h3>
                <van-button type="primary" @click="showTop = true">顶部弹出</van-button>
                <Popup v-model="showTop" position="top" round>
                    <div class="popup-content" style="padding: 32px;">
                        <h3>顶部弹出</h3>
                        <p>这是一个从顶部弹出的内容</p>
                    </div>
                </Popup>
            </div>

            <div class="demo-section">
                <h3>左侧弹出</h3>
                <van-button type="primary" @click="showLeft = true">左侧弹出</van-button>
                <Popup v-model="showLeft" position="left" width="70%">
                    <div class="popup-content" style="padding: 32px;">
                        <h3>左侧弹出</h3>
                        <p>这是一个从左侧弹出的内容</p>
                    </div>
                </Popup>
            </div>

            <div class="demo-section">
                <h3>右侧弹出</h3>
                <van-button type="primary" @click="showRight = true">右侧弹出</van-button>
                <Popup v-model="showRight" position="right" width="70%">
                    <div class="popup-content" style="padding: 32px;">
                        <h3>右侧弹出</h3>
                        <p>这是一个从右侧弹出的内容</p>
                    </div>
                </Popup>
            </div>

            <div class="demo-section">
                <h3>显示关闭按钮</h3>
                <van-button type="primary" @click="showWithClose = true">显示关闭按钮</van-button>
                <Popup v-model="showWithClose" position="center" width="300px" show-close>
                    <div class="popup-content">
                        <h3>带关闭按钮</h3>
                        <p>点击右上角关闭按钮可以关闭弹出层</p>
                    </div>
                </Popup>
            </div>

            <div class="demo-section">
                <h3>禁止点击遮罩关闭</h3>
                <van-button type="primary" @click="showNoOverlay = true">禁止点击遮罩关闭</van-button>
                <Popup v-model="showNoOverlay" position="center" :close-on-click-overlay="false" show-close>
                    <div class="popup-content">
                        <h3>禁止点击遮罩关闭</h3>
                        <p>只能通过关闭按钮关闭</p>
                    </div>
                </Popup>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Popup, Navbar } from '../../../packages/src/index.js';
import { Button as VanButton } from 'vant';

const showCenter = ref(false);
const showBottom = ref(false);
const showTop = ref(false);
const showLeft = ref(false);
const showRight = ref(false);
const showWithClose = ref(false);
const showNoOverlay = ref(false);
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    overflow-y: auto;
}

.demo-container {
    padding: 56px 20px 20px;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
}

.demo-section {
    margin-bottom: 24px;
}

.demo-section h3 {
    margin-bottom: 12px;
    font-size: 16px;
    color: #323233;
}

.popup-content {
    padding: 24px;
    text-align: center;
}

.popup-content h3 {
    margin-bottom: 12px;
    font-size: 18px;
    color: #323233;
}

.popup-content p {
    font-size: 14px;
    color: #646566;
    line-height: 1.6;
}
</style>
