<template>
    <div class="demo-page">
        <Navbar title="Badge 徽章" @click-left="$router.back()">
            <template #left>
                <van-icon name="arrow-left" />
            </template>
        </Navbar>

        <div class="demo-container">
            <div class="demo-section">
                <div class="demo-title">基础用法</div>
                <div class="badge-row">
                    <Badge :content="5">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="10">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="99">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="200">
                        <div class="badge-box" />
                    </Badge>
                </div>
            </div>

            <div class="demo-section">
                <div class="demo-title">小红点</div>
                <div class="badge-row">
                    <Badge dot>
                        <div class="badge-box" />
                    </Badge>
                    <Badge dot>
                        <van-icon name="chat-o" size="24" />
                    </Badge>
                </div>
            </div>

            <div class="demo-section">
                <div class="demo-title">自定义颜色</div>
                <div class="badge-row">
                    <Badge :content="5" color="#1989fa">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="10" color="#07c160">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="99" color="#ff976a">
                        <div class="badge-box" />
                    </Badge>
                </div>
            </div>

            <div class="demo-section">
                <div class="demo-title">自定义位置</div>
                <div class="badge-row">
                    <Badge :content="5" position="top-left">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="10" position="top-right">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="99" position="bottom-left">
                        <div class="badge-box" />
                    </Badge>
                    <Badge :content="200" position="bottom-right">
                        <div class="badge-box" />
                    </Badge>
                </div>
            </div>

            <div class="demo-section">
                <div class="demo-title">独立使用</div>
                <div class="badge-row">
                    <van-badge :content="5" />
                    <van-badge :content="99" />
                    <van-badge :content="200" />
                    <van-badge dot />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Navbar, Badge } from "chatvant";
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    padding-top: 56px;
    max-height: 100vh;
    overflow-y: auto;
}

.demo-container {
    padding: 16px;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
}

.demo-section {
    margin-bottom: 24px;
}

.demo-title {
    font-size: 14px;
    color: #646566;
    padding: 8px 0;
    margin-bottom: 12px;
}

.badge-row {
    display: flex;
    gap: 24px;
    align-items: center;
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
}

.badge-box {
    width: 40px;
    height: 40px;
    background-color: #f7f8fa;
    border-radius: 4px;
}
</style>
