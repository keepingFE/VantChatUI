<template>
    <div class="demo-page">
        <Navbar title="InfiniteScroll 无限滚动" @click-left="$router.back()">
            <template #left>
                <van-icon name="arrow-left" />
            </template>
        </Navbar>

        <div class="demo-container">
            <InfiniteScroll :loading="loading" :finished="finished" :error="error" @load="onLoad"
                @error-click="onErrorClick">
                <van-cell v-for="item in list" :key="item" :title="`消息 ${item}`" />
            </InfiniteScroll>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Navbar, InfiniteScroll } from "chatvant";

const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const error = ref(false);

const onLoad = () => {
    loading.value = true;
    error.value = false;

    setTimeout(() => {
        const start = list.value.length + 1;
        const end = start + 10;

        for (let i = start; i < end; i++) {
            list.value.push(i);
        }

        loading.value = false;

        if (list.value.length >= 50) {
            finished.value = true;
        }

        // 模拟错误
        // error.value = Math.random() > 0.7;
    }, 1000);
};

const onErrorClick = () => {
    onLoad();
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
    height: calc(100vh - 56px);
    overflow-y: auto;
}
</style>
