<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="Card 卡片" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <Card title="我是标题" description="内容详情内容详情内容详情" :cover="cardImage" primary-text="提交评价"
                    secondary-text="前去留言" @primary-click="handlePrimaryClick" @secondary-click="handleSecondaryClick" />
            </div>

            <div class="demo-section">
                <div class="section-title">卡片尺寸</div>
                <div class="size-demo">
                    <div class="size-item">
                        <div class="size-label">xs</div>
                        <Card size="xs" title="超小卡片" description="内容详情内容详情内容详情" :cover="cardImage" primary-text="强按钮"
                            secondary-text="弱按钮" @primary-click="handlePrimaryClick"
                            @secondary-click="handleSecondaryClick" />
                    </div>

                    <div class="size-item">
                        <div class="size-label">sm</div>
                        <Card size="sm" title="小卡片" description="内容详情内容详情内容详情" :cover="cardImage" primary-text="强按钮"
                            secondary-text="弱按钮" @primary-click="handlePrimaryClick"
                            @secondary-click="handleSecondaryClick" />
                    </div>

                    <div class="size-item">
                        <div class="size-label">md</div>
                        <Card size="md" title="中等卡片" description="内容详情内容详情内容详情" :cover="cardImage" primary-text="强按钮"
                            secondary-text="弱按钮" @primary-click="handlePrimaryClick"
                            @secondary-click="handleSecondaryClick" />
                    </div>

                    <div class="size-item">
                        <div class="size-label">lg</div>
                        <Card size="lg" title="大卡片" description="内容详情内容详情内容详情" :cover="cardImage" primary-text="强按钮"
                            secondary-text="弱按钮" @primary-click="handlePrimaryClick"
                            @secondary-click="handleSecondaryClick" />
                    </div>

                    <div class="size-item">
                        <div class="size-label">xl</div>
                        <Card size="xl" title="超大卡片" description="内容详情内容详情内容详情" :cover="cardImage" primary-text="强按钮"
                            secondary-text="弱按钮" @primary-click="handlePrimaryClick"
                            @secondary-click="handleSecondaryClick" />
                    </div>
                </div>
            </div>

            <div class="demo-section">
                <div class="section-title">自适应宽度</div>
                <Card size="fluid" title="自适应宽度卡片" description="内容详情内容详情内容详情内容详情内容详情内容详情" :cover="cardImage"
                    primary-text="强按钮" secondary-text="弱按钮" @primary-click="handlePrimaryClick"
                    @secondary-click="handleSecondaryClick" />
            </div>

            <div class="demo-section">
                <div class="section-title">按钮竖排</div>
                <Card title="竖排按钮卡片" description="内容详情内容详情内容详情内容详情内容详情内容详情" primary-text="强按钮" secondary-text="弱按钮"
                    @primary-click="handlePrimaryClick" @secondary-click="handleSecondaryClick">
                    <template #default>
                        <div class="vertical-actions">
                            <button class="vertical-button vertical-button-primary" @click="handlePrimaryClick">
                                强按钮
                            </button>
                            <button class="vertical-button vertical-button-secondary" @click="handleSecondaryClick">
                                弱按钮
                            </button>
                        </div>
                    </template>
                </Card>
            </div>

            <div class="demo-section">
                <div class="section-title">Search 搜索框</div>

                <div class="search-item">
                    <div class="search-label">基础用法</div>
                    <Search v-model="searchValue1" placeholder="请输入搜索关键词" @search="handleSearch" />
                </div>

                <div class="search-item">
                    <div class="search-label">禁用状态</div>
                    <Search v-model="searchValue2" placeholder="禁用状态" disabled />
                </div>

                <div class="search-item">
                    <div class="search-label">不启用清除图标</div>
                    <Search v-model="searchValue3" placeholder="不显示清除按钮" :show-clear="false" @search="handleSearch" />
                </div>
            </div>
        </template>

        <template #composer>
            <Composer @send="handleSend" />
        </template>
    </Chat>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, Composer, Card, Search } from '../../../packages/src/index.js'
import { showToast } from 'vant'
import cardImage from '../assets/card-placeholder.svg'

const router = useRouter()
const chatRef = ref(null)

const searchValue1 = ref('')
const searchValue2 = ref('sss')
const searchValue3 = ref('')

const handlePrimaryClick = () => {
    showToast('点击了主按钮')
}

const handleSecondaryClick = () => {
    showToast('点击了次按钮')
}

const handleSearch = (value) => {
    showToast(`搜索: ${value}`)
}

const handleSend = (text) => {
    console.log('发送消息:', text)
}

const goBack = () => {
    router.back()
}
</script>

<style scoped lang="scss">
.demo-section {
    padding: 16px;
    background: #f7f8fa;
    margin-bottom: 8px;
}

.section-title {
    font-size: 14px;
    color: #969799;
    margin-bottom: 12px;
}

.size-demo {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.size-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.size-label {
    font-size: 16px;
    font-weight: 600;
    color: #323233;
    margin-bottom: 12px;
}

.vertical-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
}

.vertical-button {
    width: 100%;
    height: 44px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &:active {
        transform: scale(0.98);
    }
}

.vertical-button-primary {
    background: #ff6600;
    color: #ffffff;

    &:hover {
        background: #ff7700;
    }
}

.vertical-button-secondary {
    background: #ffffff;
    color: #999999;
    border: 1px solid #e0e0e0;

    &:hover {
        background: #f5f5f5;
    }
}

.search-item {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.search-label {
    font-size: 13px;
    color: #646566;
    margin-bottom: 8px;
    padding-left: 4px;
}
</style>
