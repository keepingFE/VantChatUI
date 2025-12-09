<!-- File: packages/src/components/MessageStatus/index.vue -->
<template>
    <div class="message-status">
        <!-- 加载中状态 -->
        <div v-if="status === 'loading'" class="status-loading">
            <van-loading type="spinner" size="16" color="#969799" />
        </div>

        <!-- 成功状态 -->
        <div v-else-if="status === 'success'" class="status-success">
            <span class="status-text">发送成功</span>
        </div>

        <!-- 失败状态 -->
        <div v-else-if="status === 'failed'" class="status-failed">
            <div class="status-icon-error">
                <span class="icon-text">!</span>
            </div>
        </div>
    </div>
</template>

<script setup>
// Props 定义
const props = defineProps({
    status: {
        type: String,
        default: 'loading', // loading | success | failed
        validator: (value) => ['loading', 'success', 'failed'].includes(value)
    }
})
</script>

<style scoped lang="scss">
.message-status {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 24px;
}

.status-loading {
    display: flex;
    align-items: center;
}

.status-success {
    display: flex;
    align-items: center;
}

.status-text {
    font-size: 12px;
    color: #969799;
    line-height: 1.5;
}

.status-failed {
    display: flex;
    align-items: center;
}

.status-icon-error {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ee0a24;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-text {
    color: #ffffff;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
}
</style>
