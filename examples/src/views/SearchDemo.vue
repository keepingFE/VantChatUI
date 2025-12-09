<template>
    <Chat ref="chatRef">
        <template #navbar>
            <van-nav-bar title="Search 搜索框" left-arrow fixed @click-left="goBack" />
        </template>

        <template #default>
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <Search v-model="searchValue1" placeholder="请输入搜索关键词" @search="handleSearch" />
                <div class="demo-result">搜索内容: {{ searchValue1 }}</div>
            </div>

            <div class="demo-section">
                <div class="section-title">禁用状态</div>
                <Search v-model="searchValue2" placeholder="禁用状态" disabled />
            </div>

            <div class="demo-section">
                <div class="section-title">不启用清除图标</div>
                <Search v-model="searchValue3" placeholder="不显示清除按钮" :show-clear="false" @search="handleSearch" />
            </div>

            <div class="demo-section">
                <div class="section-title">带搜索按钮</div>
                <Search v-model="searchValue4" placeholder="带搜索按钮" show-button button-text="Search"
                    @search="handleSearch" />
            </div>

            <div class="demo-section">
                <div class="section-title">自定义按钮文本</div>
                <Search v-model="searchValue5" placeholder="自定义按钮文本" show-button button-text="搜索"
                    @search="handleSearch" />
            </div>

            <div class="demo-section">
                <div class="section-title">事件监听</div>
                <Search v-model="searchValue6" placeholder="监听各种事件" @search="handleSearch" @input="handleInput"
                    @focus="handleFocus" @blur="handleBlur" @clear="handleClear" />
                <div class="demo-result">
                    <div>最后触发的事件: {{ lastEvent }}</div>
                    <div>输入内容: {{ searchValue6 }}</div>
                </div>
            </div>
        </template>
    </Chat>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Chat, Search } from '../../../packages/src/index.js'

const router = useRouter()
const chatRef = ref(null)

const searchValue1 = ref('')
const searchValue2 = ref('sss')
const searchValue3 = ref('')
const searchValue4 = ref('')
const searchValue5 = ref('')
const searchValue6 = ref('')
const lastEvent = ref('')

const handleSearch = (value) => {
    console.log('搜索:', value)
    lastEvent.value = `搜索: ${value}`
}

const handleInput = (value) => {
    console.log('输入:', value)
    lastEvent.value = `输入: ${value}`
}

const handleFocus = () => {
    console.log('聚焦')
    lastEvent.value = '聚焦'
}

const handleBlur = () => {
    console.log('失焦')
    lastEvent.value = '失焦'
}

const handleClear = () => {
    console.log('清除')
    lastEvent.value = '清除'
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

.demo-result {
    padding: 12px 16px;
    margin-top: 12px;
    background: #ffffff;
    border-radius: 4px;
    font-size: 14px;
    color: #646566;
    line-height: 1.6;

    div {
        margin-bottom: 4px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
