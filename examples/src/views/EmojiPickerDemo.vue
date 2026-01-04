<template>
    <div class="demo-page">
        <Navbar title="EmojiPicker 表情选择器" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <EmojiPicker @select="handleSelect" />
            </div>

            <div class="demo-section">
                <h3>在输入框中使用</h3>
                <div class="input-container">
                    <van-field v-model="message" type="textarea" placeholder="请输入消息" rows="3" />
                    <div class="toolbar">
                        <van-button type="default" size="small" @click="showEmojiPicker = !showEmojiPicker">
                            <van-icon name="smile-o" />
                            {{ showEmojiPicker ? '隐藏' : '显示' }}表情
                        </van-button>
                        <van-button type="primary" size="small" @click="handleSend">
                            发送
                        </van-button>
                    </div>
                    <div v-if="showEmojiPicker" class="emoji-picker-wrapper">
                        <EmojiPicker @select="handleEmojiSelect" />
                    </div>
                </div>
            </div>

            <div class="demo-section">
                <h3>在弹出层中使用</h3>
                <van-button type="primary" @click="showPopup = true">
                    打开表情选择器
                </van-button>
                <Popup v-model="showPopup" position="bottom" round>
                    <div style="padding: 16px;">
                        <div
                            style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <h3 style="margin: 0;">选择表情</h3>
                            <van-icon name="cross" @click="showPopup = false" />
                        </div>
                        <EmojiPicker @select="handlePopupSelect" />
                    </div>
                </Popup>
            </div>

            <div class="demo-section">
                <h3>已选择的表情</h3>
                <div v-if="selectedEmojis.length === 0" class="no-emojis">
                    还没有选择表情
                </div>
                <div v-else class="selected-emojis">
                    <span v-for="(emoji, index) in selectedEmojis" :key="index" class="emoji-item">
                        {{ emoji }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { EmojiPicker, Popup, Toast, Navbar } from '../../../packages/src/index.js';
import { Button as VanButton, Icon as VanIcon, Field as VanField } from 'vant';

const message = ref('');
const showEmojiPicker = ref(false);
const showPopup = ref(false);
const selectedEmojis = ref([]);

const handleSelect = (emoji) => {
    console.log('选择表情:', emoji);
    selectedEmojis.value.push(emoji);
    Toast(`选择了 ${emoji}`);
};

const handleEmojiSelect = (emoji) => {
    message.value += emoji;
    selectedEmojis.value.push(emoji);
};

const handlePopupSelect = (emoji) => {
    selectedEmojis.value.push(emoji);
    Toast(`选择了 ${emoji}`);
    showPopup.value = false;
};

const handleSend = () => {
    if (!message.value.trim()) {
        Toast.error('请输入消息');
        return;
    }
    Toast.success('发送成功');
    message.value = '';
    showEmojiPicker.value = false;
};
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
    margin-bottom: 32px;
}

.demo-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #323233;
}

.input-container {
    border: 1px solid #ebedf0;
    border-radius: 8px;
    overflow: hidden;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    background-color: #f7f8fa;
    border-top: 1px solid #ebedf0;
}

.emoji-picker-wrapper {
    border-top: 1px solid #ebedf0;
}

.no-emojis {
    padding: 32px;
    text-align: center;
    color: #969799;
    background-color: #f7f8fa;
    border-radius: 8px;
}

.selected-emojis {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 16px;
    background-color: #f7f8fa;
    border-radius: 8px;
}

.emoji-item {
    font-size: 32px;
    padding: 8px;
    background-color: #fff;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
}

.emoji-item:hover {
    transform: scale(1.2);
}
</style>
