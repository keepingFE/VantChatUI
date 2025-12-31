<template>
    <div class="demo-page">
        <van-nav-bar title="运动排行榜" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <LeaderboardCard :rankings="rankings" :my-rank="myRank" unit="步" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { LeaderboardCard } from '../../../packages/src/index.js'

const rankings = ref([
    { id: 1, rank: 1, name: '张三', avatar: 'https://via.placeholder.com/100', value: 15000, description: '连续7天第一' },
    { id: 2, rank: 2, name: '李四', avatar: 'https://via.placeholder.com/100', value: 14500 },
    { id: 3, rank: 3, name: '王五', avatar: 'https://via.placeholder.com/100', value: 14000 },
    { id: 4, rank: 4, name: '赵六', avatar: 'https://via.placeholder.com/100', value: 13500 },
    { id: 5, rank: 5, name: '我', avatar: 'https://via.placeholder.com/100', value: 12000, isMe: true },
    { id: 6, rank: 6, name: '钱七', avatar: 'https://via.placeholder.com/100', value: 11500 },
    { id: 7, rank: 7, name: '孙八', avatar: 'https://via.placeholder.com/100', value: 11000 },
    { id: 8, rank: 8, name: '周九', avatar: 'https://via.placeholder.com/100', value: 10500 },
    { id: 9, rank: 9, name: '吴十', avatar: 'https://via.placeholder.com/100', value: 10000 }
])

const myRank = ref({
    rank: 5,
    value: 12000,
    trend: 2
})
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    height: 100vh;
    background: #f7f8fa;
    overflow-y: auto;
    overflow-x: hidden;
}

.demo-page::-webkit-scrollbar {
    width: 6px;
}

.demo-page::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 3px;
}

.demo-page::-webkit-scrollbar-track {
    background-color: transparent;
}

.content {
    padding: 62px 16px 16px;
}
</style>
