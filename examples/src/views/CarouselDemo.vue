<template>
    <div class="demo-page">
        <Navbar title="Carousel 轮播卡片" @click-left="$router.back()">
            <template #left>
                <van-icon name="arrow-left" />
            </template>
        </Navbar>

        <div class="demo-container">
            <div class="demo-section">
                <div class="demo-title">基础用法</div>
                <Carousel :items="products" @click="handleClick" />
            </div>

            <div class="demo-section">
                <div class="demo-title">自动播放</div>
                <Carousel :items="products" :gap="16" :autoplay="true" :interval="2000" @change="handleChange" />
            </div>

            <div class="demo-section">
                <div class="demo-title">自定义内容</div>
                <Carousel :items="customItems">
                    <template #default="{ item }">
                        <div class="custom-card">
                            <div class="custom-card__header" :style="{ backgroundColor: item.color }">
                                <van-icon :name="item.icon" size="32" color="#fff" />
                            </div>
                            <div class="custom-card__body">
                                <div class="custom-card__title">{{ item.title }}</div>
                                <div class="custom-card__desc">{{ item.description }}</div>
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>

            <div class="demo-section">
                <div class="demo-title">隐藏指示器</div>
                <Carousel :items="products" :show-indicators="false" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Navbar, Carousel } from "chatvant";
import { showToast } from "vant";

const products = [
    {
        image: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "商品名称 1",
        description: "这是一段商品描述文字，介绍商品的特点和优势",
        price: "¥299.00",
    },
    {
        image: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "商品名称 2",
        description: "这是一段商品描述文字，介绍商品的特点和优势",
        price: "¥399.00",
    },
    {
        image: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "商品名称 3",
        description: "这是一段商品描述文字，介绍商品的特点和优势",
        price: "¥499.00",
    },
    {
        image: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "商品名称 4",
        description: "这是一段商品描述文字，介绍商品的特点和优势",
        price: "¥599.00",
    },
];

const customItems = [
    {
        icon: "fire-o",
        color: "#ff6b6b",
        title: "热门推荐",
        description: "精选热门商品",
    },
    {
        icon: "star-o",
        color: "#ffd93d",
        title: "新品上市",
        description: "最新款式抢先看",
    },
    {
        icon: "like-o",
        color: "#6bcf7f",
        title: "人气好评",
        description: "用户好评如潮",
    },
    {
        icon: "gift-o",
        color: "#4d96ff",
        title: "限时优惠",
        description: "限时特价促销",
    },
];

const handleClick = ({ item, index }) => {
    showToast(`点击了第 ${index + 1} 个卡片`);
};

const handleChange = (index) => {
    console.log("当前索引:", index);
};
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
    padding: 8px 16px;
    margin-bottom: 12px;
}

.custom-card {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: 100%;
}

.custom-card__header {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.custom-card__body {
    padding: 16px;
}

.custom-card__title {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
    margin-bottom: 8px;
}

.custom-card__desc {
    font-size: 12px;
    color: #969799;
}
</style>
