<template>
    <div class="demo-page">
        <Navbar title="Navbar 导航栏" @back="router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <div class="navbar-example">
                    <Navbar title="聊天" :fixed="false" @back="handleBack" />
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义左侧</h3>
                <div class="navbar-example">
                    <Navbar title="聊天" :fixed="false">
                        <template #left>
                            <van-icon name="wap-home" @click="handleHome" />
                        </template>
                    </Navbar>
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义右侧</h3>
                <div class="navbar-example">
                    <Navbar title="聊天" :fixed="false" @back="handleBack">
                        <template #right>
                            <van-icon name="search" @click="handleSearch" style="margin-right: 12px;" />
                            <van-icon name="ellipsis" @click="handleMore" />
                        </template>
                    </Navbar>
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义标题</h3>
                <div class="navbar-example">
                    <Navbar :fixed="false" @back="handleBack">
                        <template #title>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <Avatar :src="avatarUrl" :size="32" />
                                <div style="text-align: left;">
                                    <div style="font-size: 14px; font-weight: 500; color: #323233;">AI 助手</div>
                                    <div style="font-size: 12px; color: #07c160;">在线</div>
                                </div>
                            </div>
                        </template>
                    </Navbar>
                </div>
            </div>

            <div class="demo-section">
                <h3>无返回按钮</h3>
                <div class="navbar-example">
                    <Navbar title="聊天" :fixed="false" :show-back="false">
                        <template #right>
                            <van-icon name="plus" @click="handleAdd" />
                        </template>
                    </Navbar>
                </div>
            </div>

            <div class="demo-section">
                <h3>完整示例</h3>
                <div class="navbar-example">
                    <Navbar title="聊天详情" :fixed="false" @back="handleBack">
                        <template #right>
                            <van-icon name="search" style="margin-right: 8px;" @click="handleSearch" />
                            <van-icon name="ellipsis" @click="handleMore" />
                        </template>
                    </Navbar>
                </div>
            </div>

            <div class="tips-section">
                <h3>事件说明</h3>
                <div class="tips-card">
                    <p><strong>@back</strong> - 点击返回按钮触发</p>
                    <p><strong>@click-left</strong> - 点击左侧区域触发（包括返回按钮）</p>
                    <p><strong>@click-right</strong> - 点击右侧区域触发</p>
                    <p class="tip-note">💡 点击上方示例中的图标查看交互效果</p>
                </div>
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
    Toast('点击了返回按钮');
};

const handleHome = () => {
    Toast('点击了首页图标');
};

const handleSearch = () => {
    Toast('点击了搜索图标');
};

const handleMore = () => {
    Toast('点击了更多图标');
};

const handleAdd = () => {
    Toast('点击了添加图标');
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
    margin-bottom: 12px;
    font-size: 16px;
    color: #323233;
    font-weight: 600;
}

.navbar-example {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tips-section {
    margin-top: 40px;
    margin-bottom: 20px;
}

.tips-section h3 {
    margin-bottom: 12px;
    font-size: 16px;
    color: #323233;
    font-weight: 600;
}

.tips-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tips-card p {
    margin: 8px 0;
    font-size: 14px;
    color: #646566;
    line-height: 1.6;
}

.tips-card p strong {
    color: #323233;
    font-weight: 600;
}

.tip-note {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #ebedf0;
    color: #969799 !important;
    font-size: 13px !important;
}
</style>
