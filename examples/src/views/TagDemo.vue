<template>
    <div class="demo-page">
        <Navbar title="Tag 标签" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <div class="tag-group">
                    <Tag>默认标签</Tag>
                    <Tag type="primary">主要标签</Tag>
                    <Tag type="success">成功标签</Tag>
                    <Tag type="warning">警告标签</Tag>
                    <Tag type="danger">危险标签</Tag>
                </div>
            </div>

            <div class="demo-section">
                <h3>空心样式</h3>
                <div class="tag-group">
                    <Tag plain>默认标签</Tag>
                    <Tag type="primary" plain>主要标签</Tag>
                    <Tag type="success" plain>成功标签</Tag>
                    <Tag type="warning" plain>警告标签</Tag>
                    <Tag type="danger" plain>危险标签</Tag>
                </div>
            </div>

            <div class="demo-section">
                <h3>圆角样式</h3>
                <div class="tag-group">
                    <Tag round>默认标签</Tag>
                    <Tag type="primary" round>主要标签</Tag>
                    <Tag type="success" round>成功标签</Tag>
                    <Tag type="warning" round>警告标签</Tag>
                    <Tag type="danger" round>危险标签</Tag>
                </div>
            </div>

            <div class="demo-section">
                <h3>标记样式</h3>
                <div class="tag-group">
                    <Tag mark>默认标签</Tag>
                    <Tag type="primary" mark>主要标签</Tag>
                    <Tag type="success" mark>成功标签</Tag>
                    <Tag type="warning" mark>警告标签</Tag>
                    <Tag type="danger" mark>危险标签</Tag>
                </div>
            </div>

            <div class="demo-section">
                <h3>标签大小</h3>
                <div class="tag-group" style="align-items: center;">
                    <Tag size="large">大号标签</Tag>
                    <Tag size="medium">中号标签</Tag>
                    <Tag size="small">小号标签</Tag>
                </div>
            </div>

            <div class="demo-section">
                <h3>可关闭标签</h3>
                <div class="tag-group">
                    <Tag v-if="show1" type="primary" closeable @close="show1 = false">标签1</Tag>
                    <Tag v-if="show2" type="success" closeable @close="show2 = false">标签2</Tag>
                    <Tag v-if="show3" type="warning" closeable @close="show3 = false">标签3</Tag>
                </div>
                <van-button size="small" @click="resetTags" style="margin-top: 12px;">重置标签</van-button>
            </div>

            <div class="demo-section">
                <h3>自定义颜色</h3>
                <div class="tag-group">
                    <Tag color="#7232dd">紫色</Tag>
                    <Tag color="#7232dd" plain>紫色空心</Tag>
                    <Tag color="#ffe1e1" text-color="#ad0000">自定义</Tag>
                </div>
            </div>

            <div class="demo-section">
                <h3>点击事件</h3>
                <div class="tag-group">
                    <Tag type="primary" @click="handleClick('标签1')">点击标签1</Tag>
                    <Tag type="success" @click="handleClick('标签2')">点击标签2</Tag>
                </div>
            </div>

            <div class="demo-section">
                <h3>在聊天中使用</h3>
                <div class="message-card">
                    <div class="message-card__header">
                        <span class="message-card__name">AI助手</span>
                        <Tag type="primary" size="small">官方</Tag>
                    </div>
                    <div class="message-card__content">
                        你好！我是AI助手，有什么可以帮助你的吗？
                    </div>
                    <div class="message-card__tags">
                        <Tag size="small" plain @click="handleQuickReply('功能介绍')">功能介绍</Tag>
                        <Tag size="small" plain @click="handleQuickReply('使用帮助')">使用帮助</Tag>
                        <Tag size="small" plain @click="handleQuickReply('联系客服')">联系客服</Tag>
                    </div>
                </div>
            </div>

            <div class="demo-section">
                <h3>标签组</h3>
                <div class="tag-group">
                    <Tag v-for="tag in tags" :key="tag.id" :type="tag.type" closeable @close="removeTag(tag.id)">
                        {{ tag.name }}
                    </Tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Tag, Navbar, Toast } from '../../../packages/src/index.js';
import { Button as VanButton } from 'vant';

const show1 = ref(true);
const show2 = ref(true);
const show3 = ref(true);

const tags = ref([
    { id: 1, name: 'Vue.js', type: 'primary' },
    { id: 2, name: 'React', type: 'success' },
    { id: 3, name: 'Angular', type: 'warning' },
    { id: 4, name: 'Svelte', type: 'danger' }
]);

const resetTags = () => {
    show1.value = true;
    show2.value = true;
    show3.value = true;
    Toast.success('标签已重置');
};

const handleClick = (name) => {
    Toast(`点击了${name}`);
};

const handleQuickReply = (text) => {
    Toast(`快速回复: ${text}`);
};

const removeTag = (id) => {
    tags.value = tags.value.filter(tag => tag.id !== id);
    Toast('标签已删除');
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

.tag-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.message-card {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

.message-card__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.message-card__name {
    font-size: 14px;
    font-weight: 500;
    color: #323233;
}

.message-card__content {
    font-size: 14px;
    line-height: 20px;
    color: #646566;
    margin-bottom: 12px;
}

.message-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
</style>
