<template>
    <div class="demo-page">
        <Navbar title="Navbar 导航栏" @back="router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <Navbar title="聊天" @back="handleBack" />
            </div>

            <div class="demo-section">
                <h3>自定义左侧</h3>
                <Navbar title="聊天">
                    <template #left>
                        <van-icon name="wap-home" @click="handleHome" />
                    </template>
                </Navbar>
            </div>

            <div class="demo-section">
                <h3>自定义右侧</h3>
                <Navbar title="聊天" @back="handleBack">
                    <template #right>
                        <van-icon name="search" @click="handleSearch" style="margin-right: 12px;" />
                        <van-icon name="ellipsis" @click="handleMore" />
                    </template>
                </Navbar>
            </div>

            <div class="demo-section">
                <h3>自定义标题</h3>
                <Navbar @back="handleBack">
                    <template #title>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <Avatar :src="avatarUrl" size="small" />
                            <div>
                                <div style="font-size: 14px; font-weight: 500;">AI 助手</div>
                                <div style="font-size: 12px; color: #07c160;">在线</div>
                            </div>
                        </div>
                    </template>
                </Navbar>
            </div>

            <div class="demo-section">
                <h3>无返回按钮</h3>
                <Navbar title="聊天" :show-back="false">
                    <template #right>
                        <van-icon name="plus" />
                    </template>
                </Navbar>
            </div>

            <div class="demo-section">
                <h3>非固定定位</h3>
                <Navbar title="聊天" :fixed="false" @back="handleBack" />
            </div>

            <div class="demo-section">
                <h3>左侧点击事件</h3>
                <Navbar title="聊天" @click-left="handleClickLeft" />
            </div>

            <div class="demo-section">
                <h3>右侧点击事件</h3>
                <Navbar title="聊天" :show-back="false" @click-right="handleClickRight">
                    <template #right>
                        <van-icon name="setting-o" />
                    </template>
                </Navbar>
            </div>

            <div class="demo-section">
                <h3>同时监听 back 和 click-left</h3>
                <Navbar title="聊天" @back="handleBack" @click-left="handleClickLeft" />
                <p style="margin-top: 8px; font-size: 12px; color: #969799;">点击返回按钮会同时触发 back 和 click-left 事件</p>
            </div>

            <div class="demo-section">
                <h3>完整示例</h3>
                <Navbar title="聊天详情" @back="handleBack" @click-left="handleClickLeft" @click-right="handleClickRight">
                    <template #right>
                        <van-icon name="search" style="margin-right: 8px;" />
                        <van-icon name="ellipsis" />
                    </template>
                </Navbar>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Navbar, Avatar, Toast } from '../../../packages/src/index.js';
import { Icon as VanIcon } from 'vant';
import { useRouter } from 'vue-router';

const router = useRouter();
const avatarUrl = 'https://avatars.githubusercontent.com/u/1?v=4';

const handleBack = () => {
    Toast('返回');
};

const handleHome = () => {
    Toast('首页');
};

const handleSearch = () => {
    Toast('搜索');
};

const handleMore = () => {
    Toast('更多');
};

const handleClickLeft = () => {
    Toast('左侧点击');
};

const handleClickRight = () => {
    Toast('右侧点击');
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
    margin-bottom: 40px;
}

.demo-section h3 {
    margin-bottom: 16px;
    font-size: 16px;
    color: #323233;
}
</style>
