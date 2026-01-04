<template>
    <div class="demo-container">
        <van-nav-bar title="Icon 图标" left-arrow fixed @click-left="goBack" />

        <div class="demo-content">
            <!-- 基础用法 -->
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <div class="icon-grid">
                    <div class="icon-item" v-for="icon in basicIcons" :key="icon">
                        <Icon :name="icon" />
                        <span>{{ icon }}</span>
                    </div>
                </div>
            </div>

            <!-- 图标颜色 -->
            <div class="demo-section">
                <div class="section-title">图标颜色</div>
                <div class="icon-row">
                    <Icon name="chat-o" color="#1989fa" size="32" />
                    <Icon name="chat-o" color="#07c160" size="32" />
                    <Icon name="chat-o" color="#ff976a" size="32" />
                    <Icon name="chat-o" color="#ee0a24" size="32" />
                    <Icon name="chat-o" color="#9c27b0" size="32" />
                </div>
            </div>

            <!-- 图标大小 -->
            <div class="demo-section">
                <div class="section-title">图标大小</div>
                <div class="icon-row">
                    <Icon name="chat-o" size="24" />
                    <Icon name="chat-o" size="32" />
                    <Icon name="chat-o" size="40" />
                    <Icon name="chat-o" size="48" />
                    <Icon name="chat-o" size="56" />
                </div>
            </div>

            <!-- 徽标提示 -->
            <div class="demo-section">
                <div class="section-title">徽标提示</div>
                <div class="icon-row">
                    <Icon name="chat-o" dot size="32" />
                    <Icon name="chat-o" badge="9" size="32" />
                    <Icon name="chat-o" badge="99+" size="32" />
                    <Icon name="chat-o" badge="Hot" size="32" />
                </div>
            </div>

            <!-- 常用图标 -->
            <div class="demo-section">
                <div class="section-title">常用图标</div>
                <div class="icon-grid">
                    <div class="icon-item" v-for="icon in commonIcons" :key="icon.name">
                        <Icon :name="icon.name" size="28" />
                        <span>{{ icon.label }}</span>
                    </div>
                </div>
            </div>

            <!-- 线框风格 -->
            <div class="demo-section">
                <div class="section-title">线框风格</div>
                <div class="icon-grid">
                    <div class="icon-item" v-for="icon in outlineIcons" :key="icon">
                        <Icon :name="icon" size="28" />
                        <span>{{ icon }}</span>
                    </div>
                </div>
            </div>

            <!-- 实心风格 -->
            <div class="demo-section">
                <div class="section-title">实心风格</div>
                <div class="icon-grid">
                    <div class="icon-item" v-for="icon in filledIcons" :key="icon">
                        <Icon :name="icon" size="28" />
                        <span>{{ icon }}</span>
                    </div>
                </div>
            </div>

            <!-- 点击事件 -->
            <div class="demo-section">
                <div class="section-title">点击事件</div>
                <div class="icon-row">
                    <Icon name="like-o" :color="liked ? '#ee0a24' : '#c8c9cc'" size="32" @click="liked = !liked" />
                    <Icon name="star-o" :color="starred ? '#ff976a' : '#c8c9cc'" size="32"
                        @click="starred = !starred" />
                    <Icon name="good-job-o" :color="thumbed ? '#1989fa' : '#c8c9cc'" size="32"
                        @click="thumbed = !thumbed" />
                </div>
            </div>

            <!-- 实际应用场景 - 底部导航 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 底部导航</div>
                <div class="tab-bar">
                    <div class="tab-item" :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">
                        <Icon :name="activeTab === 'home' ? 'wap-home' : 'wap-home-o'" size="24" />
                        <span>首页</span>
                    </div>
                    <div class="tab-item" :class="{ active: activeTab === 'category' }" @click="activeTab = 'category'">
                        <Icon :name="activeTab === 'category' ? 'apps' : 'apps-o'" size="24" />
                        <span>分类</span>
                    </div>
                    <div class="tab-item" :class="{ active: activeTab === 'cart' }" @click="activeTab = 'cart'">
                        <Icon :name="activeTab === 'cart' ? 'shopping-cart' : 'shopping-cart-o'" size="24" badge="5" />
                        <span>购物车</span>
                    </div>
                    <div class="tab-item" :class="{ active: activeTab === 'user' }" @click="activeTab = 'user'">
                        <Icon :name="activeTab === 'user' ? 'manager' : 'manager-o'" size="24" />
                        <span>我的</span>
                    </div>
                </div>
            </div>

            <!-- 实际应用场景 - 功能入口 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 功能入口</div>
                <div class="feature-grid">
                    <div class="feature-item" v-for="feature in features" :key="feature.name">
                        <div class="feature-icon" :style="{ background: feature.color }">
                            <Icon :name="feature.icon" size="24" color="#fff" />
                        </div>
                        <span>{{ feature.name }}</span>
                    </div>
                </div>
            </div>

            <!-- 实际应用场景 - 操作按钮 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 操作按钮</div>
                <div class="action-buttons">
                    <van-button type="primary" icon="plus" size="small">添加</van-button>
                    <van-button type="default" icon="edit" size="small">编辑</van-button>
                    <van-button type="default" icon="delete-o" size="small">删除</van-button>
                    <van-button type="default" icon="share-o" size="small">分享</van-button>
                </div>
            </div>

            <!-- 状态反馈 -->
            <div class="demo-section">
                <div class="section-title">状态反馈</div>
                <div class="status-feedback">
                    <div>点赞: {{ liked ? '已点赞' : '未点赞' }}</div>
                    <div>收藏: {{ starred ? '已收藏' : '未收藏' }}</div>
                    <div>点赞: {{ thumbed ? '已点赞' : '未点赞' }}</div>
                    <div>当前标签: {{ activeTab }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '../../../packages/src/index.js';
import { showToast } from 'vant';

const router = useRouter();

const basicIcons = [
    'chat-o',
    'smile-o',
    'music-o',
    'thumb-circle-o',
    'comment-o',
    'star-o',
];

const commonIcons = [
    { name: 'home-o', label: '首页' },
    { name: 'search', label: '搜索' },
    { name: 'friends-o', label: '好友' },
    { name: 'setting-o', label: '设置' },
    { name: 'location-o', label: '定位' },
    { name: 'like-o', label: '点赞' },
    { name: 'star-o', label: '收藏' },
    { name: 'phone-o', label: '电话' },
    { name: 'chat-o', label: '消息' },
    { name: 'cart-o', label: '购物车' },
    { name: 'coupon-o', label: '优惠券' },
    { name: 'gift-o', label: '礼物' },
];

const outlineIcons = [
    'home-o',
    'user-o',
    'setting-o',
    'search',
    'star-o',
    'like-o',
];

const filledIcons = [
    'home',
    'user',
    'setting',
    'star',
    'like',
    'success',
];

const liked = ref(false);
const starred = ref(false);
const thumbed = ref(false);
const activeTab = ref('home');

const features = [
    { name: '扫一扫', icon: 'scan', color: '#1989fa' },
    { name: '付款码', icon: 'qr', color: '#07c160' },
    { name: '充值', icon: 'balance-o', color: '#ff976a' },
    { name: '卡包', icon: 'card', color: '#ee0a24' },
    { name: '转账', icon: 'exchange', color: '#9c27b0' },
    { name: '账单', icon: 'records', color: '#00bcd4' },
    { name: '优惠券', icon: 'coupon-o', color: '#ff6600' },
    { name: '设置', icon: 'setting-o', color: '#969799' },
];

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

.icon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px 0;

        span {
            font-size: 12px;
            color: #646566;
            text-align: center;
            word-break: break-all;
        }
    }
}

.icon-row {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 12px 0;
}

.tab-bar {
    display: flex;
    background: #fff;
    border-top: 1px solid #ebedf0;
    padding: 8px 0;

    .tab-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        color: #646566;

        span {
            font-size: 12px;
        }

        &.active {
            color: #1989fa;
        }
    }
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 12px 0;

    .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .feature-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        span {
            font-size: 12px;
            color: #646566;
        }
    }
}

.action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    padding: 12px 0;
}

.status-feedback {
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
