<template>
    <div class="demo-container">
        <div class="demo-header">
            <h1>Search 搜索框</h1>
        </div>

        <div class="demo-section">
            <h2>基础用法</h2>
            <Search v-model="searchValue1" placeholder="请输入搜索关键词" @search="handleSearch" />
            <div class="demo-result">搜索内容: {{ searchValue1 }}</div>
        </div>

        <div class="demo-section">
            <h2>禁用状态</h2>
            <Search v-model="searchValue2" placeholder="禁用状态" disabled />
        </div>

        <div class="demo-section">
            <h2>不启用清除图标</h2>
            <Search v-model="searchValue3" placeholder="不显示清除按钮" :show-clear="false" @search="handleSearch" />
        </div>

        <div class="demo-section">
            <h2>带搜索按钮</h2>
            <Search v-model="searchValue4" placeholder="带搜索按钮" show-button button-text="Search"
                @search="handleSearch" />
        </div>

        <div class="demo-section">
            <h2>自定义按钮文本</h2>
            <Search v-model="searchValue5" placeholder="自定义按钮文本" show-button button-text="搜索" @search="handleSearch" />
        </div>

        <div class="demo-section">
            <h2>事件监听</h2>
            <Search v-model="searchValue6" placeholder="监听各种事件" @search="handleSearch" @input="handleInput"
                @focus="handleFocus" @blur="handleBlur" @clear="handleClear" />
            <div class="demo-result">
                <div>最后触发的事件: {{ lastEvent }}</div>
                <div>输入内容: {{ searchValue6 }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '../../../packages/src/index.js'

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
</script>

<style scoped lang="scss">
.demo-container {
    min-height: 100vh;
    background: #f7f8fa;
    padding-bottom: 20px;
}

.demo-header {
    background: #ffffff;
    padding: 20px 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    h1 {
        margin: 0;
        font-size: 24px;
        color: #323233;
        font-weight: 600;
    }
}

.demo-section {
    background: #ffffff;
    margin-bottom: 12px;
    padding: 16px 0;

    h2 {
        margin: 0 0 12px 0;
        padding: 0 16px;
        font-size: 16px;
        color: #646566;
        font-weight: 500;
    }
}

.demo-result {
    padding: 12px 16px;
    margin-top: 12px;
    background: #f7f8fa;
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
