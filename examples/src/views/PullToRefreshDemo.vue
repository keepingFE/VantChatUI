<template>
    <div class="demo-container">
        <van-nav-bar title="PullToRefresh 下拉刷新" left-arrow fixed @click-left="goBack" />

        <div class="demo-content">
            <!-- 基础用法 -->
            <div class="demo-section">
                <div class="section-title">基础用法（下拉试试）</div>
                <PullToRefresh v-model="loading1" @refresh="onRefresh1">
                    <div class="refresh-content">
                        <div class="content-item" v-for="i in count1" :key="i">
                            列表项 {{ i }}
                        </div>
                    </div>
                </PullToRefresh>
            </div>

            <!-- 自定义提示文案 -->
            <div class="demo-section">
                <div class="section-title">自定义提示文案</div>
                <PullToRefresh v-model="loading2" pulling-text="用力拉..." loosing-text="放开我..." loading-text="拼命加载中..."
                    success-text="加载成功啦！" @refresh="onRefresh2">
                    <div class="refresh-content">
                        <div class="content-item" v-for="i in count2" :key="i">
                            内容 {{ i }}
                        </div>
                    </div>
                </PullToRefresh>
            </div>

            <!-- 自定义成功提示时长 -->
            <div class="demo-section">
                <div class="section-title">自定义成功提示时长</div>
                <PullToRefresh v-model="loading3" :success-duration="2000" @refresh="onRefresh3">
                    <div class="refresh-content">
                        <div class="content-item" v-for="i in count3" :key="i">
                            项目 {{ i }}
                        </div>
                    </div>
                </PullToRefresh>
            </div>

            <!-- 实际应用场景 - 新闻列表 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 新闻列表</div>
                <PullToRefresh v-model="newsLoading" @refresh="refreshNews">
                    <div class="news-list">
                        <div class="news-item" v-for="news in newsList" :key="news.id">
                            <div class="news-title">{{ news.title }}</div>
                            <div class="news-meta">
                                <span>{{ news.source }}</span>
                                <span>{{ news.time }}</span>
                            </div>
                        </div>
                    </div>
                </PullToRefresh>
            </div>

            <!-- 实际应用场景 - 消息列表 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 消息列表</div>
                <PullToRefresh v-model="messageLoading" @refresh="refreshMessages">
                    <div class="message-list">
                        <div class="message-item" v-for="msg in messageList" :key="msg.id">
                            <div class="message-avatar">{{ msg.avatar }}</div>
                            <div class="message-content">
                                <div class="message-name">{{ msg.name }}</div>
                                <div class="message-text">{{ msg.text }}</div>
                            </div>
                            <div class="message-time">{{ msg.time }}</div>
                        </div>
                    </div>
                </PullToRefresh>
            </div>

            <!-- 实际应用场景 - 商品列表 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 商品列表</div>
                <PullToRefresh v-model="productLoading" @refresh="refreshProducts">
                    <div class="product-grid">
                        <div class="product-item" v-for="product in productList" :key="product.id">
                            <div class="product-image">{{ product.image }}</div>
                            <div class="product-name">{{ product.name }}</div>
                            <div class="product-price">¥{{ product.price }}</div>
                        </div>
                    </div>
                </PullToRefresh>
            </div>

            <!-- 刷新统计 -->
            <div class="demo-section">
                <div class="section-title">刷新统计</div>
                <div class="refresh-stats">
                    <div>基础用法刷新次数: {{ refreshCount1 }}</div>
                    <div>新闻列表刷新次数: {{ newsRefreshCount }}</div>
                    <div>消息列表刷新次数: {{ messageRefreshCount }}</div>
                    <div>商品列表刷新次数: {{ productRefreshCount }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { PullToRefresh } from '../../../packages/src/index.js';
import { showToast } from 'vant';

const router = useRouter();

// 基础用法
const loading1 = ref(false);
const count1 = ref(10);
const refreshCount1 = ref(0);

const onRefresh1 = () => {
    setTimeout(() => {
        loading1.value = false;
        count1.value = Math.floor(Math.random() * 10) + 5;
        refreshCount1.value++;
        showToast('刷新成功');
    }, 1000);
};

// 自定义提示
const loading2 = ref(false);
const count2 = ref(8);

const onRefresh2 = () => {
    setTimeout(() => {
        loading2.value = false;
        count2.value = Math.floor(Math.random() * 10) + 5;
    }, 1500);
};

// 自定义时长
const loading3 = ref(false);
const count3 = ref(6);

const onRefresh3 = () => {
    setTimeout(() => {
        loading3.value = false;
        count3.value = Math.floor(Math.random() * 10) + 5;
    }, 1200);
};

// 新闻列表
const newsLoading = ref(false);
const newsRefreshCount = ref(0);
const newsList = ref([
    { id: 1, title: '科技公司发布新产品', source: '科技日报', time: '2小时前' },
    { id: 2, title: '经济形势持续向好', source: '财经新闻', time: '3小时前' },
    { id: 3, title: '体育赛事精彩纷呈', source: '体育周刊', time: '5小时前' },
    { id: 4, title: '文化活动丰富多彩', source: '文化频道', time: '6小时前' },
]);

const refreshNews = () => {
    setTimeout(() => {
        newsLoading.value = false;
        newsRefreshCount.value++;
        // 模拟新数据
        newsList.value = [
            { id: Date.now(), title: '最新：重大新闻发布', source: '新闻中心', time: '刚刚' },
            ...newsList.value.slice(0, 3),
        ];
        showToast('新闻已更新');
    }, 1500);
};

// 消息列表
const messageLoading = ref(false);
const messageRefreshCount = ref(0);
const messageList = ref([
    { id: 1, avatar: '👨', name: '张三', text: '你好，在吗？', time: '10:30' },
    { id: 2, avatar: '👩', name: '李四', text: '今天有空吗？', time: '09:15' },
    { id: 3, avatar: '👦', name: '王五', text: '文件已发送', time: '昨天' },
]);

const refreshMessages = () => {
    setTimeout(() => {
        messageLoading.value = false;
        messageRefreshCount.value++;
        messageList.value = [
            { id: Date.now(), avatar: '👨', name: '新消息', text: '这是最新的消息', time: '刚刚' },
            ...messageList.value,
        ];
        showToast('消息已更新');
    }, 1000);
};

// 商品列表
const productLoading = ref(false);
const productRefreshCount = ref(0);
const productList = ref([
    { id: 1, image: '📱', name: '智能手机', price: '2999' },
    { id: 2, image: '💻', name: '笔记本电脑', price: '5999' },
    { id: 3, image: '⌚', name: '智能手表', price: '1299' },
    { id: 4, image: '🎧', name: '无线耳机', price: '599' },
]);

const refreshProducts = () => {
    setTimeout(() => {
        productLoading.value = false;
        productRefreshCount.value++;
        // 随机打乱商品顺序
        productList.value = [...productList.value].sort(() => Math.random() - 0.5);
        showToast('商品已更新');
    }, 1200);
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
}

.section-title {
    padding: 16px 16px 8px;
    font-size: 14px;
    color: #969799;
    font-weight: 500;
}

.refresh-content {
    min-height: 200px;
    padding: 16px;

    .content-item {
        padding: 12px;
        margin-bottom: 8px;
        background: #f7f8fa;
        border-radius: 4px;
        font-size: 14px;
        color: #323233;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.news-list {
    padding: 16px;

    .news-item {
        padding: 12px 0;
        border-bottom: 1px solid #ebedf0;

        &:last-child {
            border-bottom: none;
        }

        .news-title {
            font-size: 15px;
            color: #323233;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .news-meta {
            display: flex;
            gap: 16px;
            font-size: 12px;
            color: #969799;
        }
    }
}

.message-list {
    padding: 16px;

    .message-item {
        display: flex;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #ebedf0;

        &:last-child {
            border-bottom: none;
        }

        .message-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #f7f8fa;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }

        .message-content {
            flex: 1;
            min-width: 0;

            .message-name {
                font-size: 14px;
                color: #323233;
                font-weight: 500;
                margin-bottom: 4px;
            }

            .message-text {
                font-size: 13px;
                color: #969799;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .message-time {
            font-size: 12px;
            color: #c8c9cc;
            flex-shrink: 0;
        }
    }
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;

    .product-item {
        background: #f7f8fa;
        border-radius: 8px;
        padding: 12px;
        text-align: center;

        .product-image {
            font-size: 48px;
            margin-bottom: 8px;
        }

        .product-name {
            font-size: 14px;
            color: #323233;
            margin-bottom: 4px;
        }

        .product-price {
            font-size: 16px;
            color: #ee0a24;
            font-weight: 600;
        }
    }
}

.refresh-stats {
    padding: 16px;
    font-size: 14px;
    color: #323233;

    div {
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
