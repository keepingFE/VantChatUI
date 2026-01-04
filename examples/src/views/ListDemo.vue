<template>
    <div class="demo-page">
        <Navbar title="List 列表消息" @click-left="$router.back()">
            <template #left>
                <van-icon name="arrow-left" />
            </template>
        </Navbar>

        <div class="demo-container">
            <div class="demo-section">
                <div class="demo-title">基础用法</div>
                <List :items="basicList" @click="handleClick" />
            </div>

            <div class="demo-section">
                <div class="demo-title">带头像</div>
                <List :items="avatarList" @click="handleClick" />
            </div>

            <div class="demo-section">
                <div class="demo-title">带徽章</div>
                <List :items="badgeList" @click="handleClick" />
            </div>

            <div class="demo-section">
                <div class="demo-title">自定义内容</div>
                <List :items="customList" @click="handleClick">
                    <template #avatar="{ item }">
                        <van-icon :name="item.icon" size="32" :color="item.color" />
                    </template>
                    <template #extra="{ item }">
                        <van-tag :type="item.status === 'online' ? 'success' : 'default'">
                            {{ item.status === "online" ? "在线" : "离线" }}
                        </van-tag>
                    </template>
                </List>
            </div>

            <div class="demo-section">
                <div class="demo-title">空状态</div>
                <List :items="[]" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Navbar, List } from "chatvant";
import { showToast } from "vant";

const basicList = [
    {
        id: 1,
        title: "张三",
        description: "你好，在吗？",
        time: "10:30",
    },
    {
        id: 2,
        title: "李四",
        description: "明天见面聊",
        time: "09:15",
    },
    {
        id: 3,
        title: "王五",
        description: "收到，谢谢！",
        time: "昨天",
    },
];

const avatarList = [
    {
        id: 1,
        avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "小猫咪",
        description: "喵喵喵~",
        time: "刚刚",
    },
    {
        id: 2,
        avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "小狗狗",
        description: "汪汪汪！",
        time: "5分钟前",
    },
];

const badgeList = [
    {
        id: 1,
        avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "工作群",
        description: "张三：大家好",
        time: "10:30",
        badge: 99,
    },
    {
        id: 2,
        avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "家人群",
        description: "妈妈：吃饭了吗？",
        time: "09:15",
        badge: 5,
    },
    {
        id: 3,
        avatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        title: "朋友群",
        description: "李四：周末聚会",
        time: "昨天",
        badge: 1,
    },
];

const customList = [
    {
        id: 1,
        icon: "user-o",
        color: "#1989fa",
        title: "客服小助手",
        description: "有什么可以帮您？",
        status: "online",
    },
    {
        id: 2,
        icon: "service-o",
        color: "#07c160",
        title: "技术支持",
        description: "工作时间：9:00-18:00",
        status: "offline",
    },
];

const handleClick = ({ item }) => {
    showToast(`点击了：${item.title}`);
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
    padding: 16px 0;
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
</style>
