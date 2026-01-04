<template>
    <div class="demo-page">
        <Navbar title="ActionSheet 动作面板" @click-left="$router.back()">
            <template #left>
                <van-icon name="arrow-left" />
            </template>
        </Navbar>

        <div class="demo-container">
            <van-cell-group>
                <van-cell title="基础用法" is-link @click="showBasic = true" />
                <van-cell title="带标题和描述" is-link @click="showWithTitle = true" />
                <van-cell title="带图标" is-link @click="showWithIcon = true" />
                <van-cell title="带禁用项" is-link @click="showWithDisabled = true" />
                <van-cell title="带加载状态" is-link @click="showWithLoading = true" />
            </van-cell-group>

            <ActionSheet v-model:show="showBasic" :actions="basicActions" @select="handleSelect" />

            <ActionSheet v-model:show="showWithTitle" title="请选择操作" description="这是一段描述信息" :actions="basicActions"
                @select="handleSelect" />

            <ActionSheet v-model:show="showWithIcon" :actions="iconActions" @select="handleSelect" />

            <ActionSheet v-model:show="showWithDisabled" :actions="disabledActions" @select="handleSelect" />

            <ActionSheet v-model:show="showWithLoading" :actions="loadingActions" @select="handleSelect" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Navbar, ActionSheet } from "chatvant";
import { showToast } from "vant";

const showBasic = ref(false);
const showWithTitle = ref(false);
const showWithIcon = ref(false);
const showWithDisabled = ref(false);
const showWithLoading = ref(false);

const basicActions = [
    { name: "选项一" },
    { name: "选项二" },
    { name: "选项三" },
];

const iconActions = [
    { name: "分享", icon: "share-o" },
    { name: "收藏", icon: "star-o" },
    { name: "删除", icon: "delete-o", color: "#ee0a24" },
];

const disabledActions = [
    { name: "选项一" },
    { name: "选项二（禁用）", disabled: true },
    { name: "选项三" },
];

const loadingActions = [
    { name: "选项一" },
    { name: "加载中...", loading: true },
    { name: "选项三" },
];

const handleSelect = ({ action }) => {
    if (action.disabled || action.loading) return;
    showToast(action.name);
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
</style>
