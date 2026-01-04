<template>
    <div class="demo-container">
        <van-nav-bar title="Select 选择器" left-arrow fixed @click-left="goBack" />

        <div class="demo-content">
            <!-- 基础用法 -->
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <Select v-model="value1" label="城市" placeholder="请选择城市" :options="cityOptions" @change="handleChange" />
            </div>

            <!-- 自定义字段名 -->
            <div class="demo-section">
                <div class="section-title">自定义字段名</div>
                <Select v-model="value2" label="水果" placeholder="请选择水果" :options="fruitOptions" label-field="name"
                    value-field="id" />
            </div>

            <!-- 禁用状态 -->
            <div class="demo-section">
                <div class="section-title">禁用状态</div>
                <Select v-model="value3" label="城市" placeholder="请选择城市" :options="cityOptions" disabled />
            </div>

            <!-- 必填项 -->
            <div class="demo-section">
                <div class="section-title">必填项</div>
                <Select v-model="value4" label="城市" placeholder="请选择城市" :options="cityOptions" required />
            </div>

            <!-- 错误提示 -->
            <div class="demo-section">
                <div class="section-title">错误提示</div>
                <Select v-model="value5" label="城市" placeholder="请选择城市" :options="cityOptions" error
                    error-message="请选择城市" />
            </div>

            <!-- 自定义标签宽度 -->
            <div class="demo-section">
                <div class="section-title">自定义标签宽度</div>
                <Select v-model="value6" label="所在城市" placeholder="请选择" :options="cityOptions" label-width="100px" />
            </div>

            <!-- 自定义选择器标题 -->
            <div class="demo-section">
                <div class="section-title">自定义选择器标题</div>
                <Select v-model="value7" label="城市" placeholder="请选择城市" :options="cityOptions"
                    picker-title="请选择您所在的城市" />
            </div>

            <!-- 自定义按钮文字 -->
            <div class="demo-section">
                <div class="section-title">自定义按钮文字</div>
                <Select v-model="value8" label="城市" placeholder="请选择城市" :options="cityOptions" confirm-button-text="完成"
                    cancel-button-text="返回" />
            </div>

            <!-- 实际应用场景 - 个人信息表单 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 个人信息</div>
                <van-cell-group inset>
                    <Select v-model="userInfo.country" label="国家/地区" placeholder="请选择" :options="countryOptions"
                        required />
                    <Select v-model="userInfo.province" label="省份" placeholder="请选择" :options="provinceOptions"
                        required />
                    <Select v-model="userInfo.city" label="城市" placeholder="请选择" :options="cityOptions" required />
                    <Select v-model="userInfo.education" label="学历" placeholder="请选择" :options="educationOptions" />
                    <Select v-model="userInfo.industry" label="行业" placeholder="请选择" :options="industryOptions" />
                </van-cell-group>
            </div>

            <!-- 实际应用场景 - 订单筛选 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景 - 订单筛选</div>
                <van-cell-group inset>
                    <Select v-model="orderFilter.status" label="订单状态" placeholder="全部" :options="orderStatusOptions" />
                    <Select v-model="orderFilter.timeRange" label="时间范围" placeholder="全部" :options="timeRangeOptions" />
                    <Select v-model="orderFilter.sortBy" label="排序方式" placeholder="默认排序" :options="sortOptions" />
                </van-cell-group>
            </div>

            <!-- 当前选中值 -->
            <div class="demo-section">
                <div class="section-title">当前选中值</div>
                <div class="current-value">
                    <div>基础用法: {{ value1 }}</div>
                    <div>自定义字段: {{ value2 }}</div>
                    <div>用户信息: {{ JSON.stringify(userInfo, null, 2) }}</div>
                    <div>订单筛选: {{ JSON.stringify(orderFilter, null, 2) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Select } from '../../../packages/src/index.js';
import { showToast } from 'vant';

const router = useRouter();

const value1 = ref('');
const value2 = ref('');
const value3 = ref('beijing');
const value4 = ref('');
const value5 = ref('');
const value6 = ref('');
const value7 = ref('');
const value8 = ref('');

const userInfo = reactive({
    country: '',
    province: '',
    city: '',
    education: '',
    industry: '',
});

const orderFilter = reactive({
    status: '',
    timeRange: '',
    sortBy: '',
});

const cityOptions = [
    '北京',
    '上海',
    '广州',
    '深圳',
    '杭州',
    '成都',
    '重庆',
    '武汉',
];

const fruitOptions = [
    { id: '1', name: '苹果' },
    { id: '2', name: '香蕉' },
    { id: '3', name: '橙子' },
    { id: '4', name: '西瓜' },
    { id: '5', name: '葡萄' },
];

const countryOptions = ['中国', '美国', '日本', '韩国', '英国'];

const provinceOptions = [
    '北京市',
    '上海市',
    '广东省',
    '浙江省',
    '江苏省',
    '四川省',
];

const educationOptions = [
    '高中及以下',
    '大专',
    '本科',
    '硕士',
    '博士',
];

const industryOptions = [
    '互联网/IT',
    '金融',
    '教育',
    '医疗',
    '制造业',
    '服务业',
    '其他',
];

const orderStatusOptions = [
    { text: '全部', value: '' },
    { text: '待付款', value: 'pending' },
    { text: '待发货', value: 'paid' },
    { text: '待收货', value: 'shipped' },
    { text: '已完成', value: 'completed' },
    { text: '已取消', value: 'cancelled' },
];

const timeRangeOptions = [
    { text: '全部', value: '' },
    { text: '最近一周', value: 'week' },
    { text: '最近一月', value: 'month' },
    { text: '最近三月', value: 'quarter' },
    { text: '最近一年', value: 'year' },
];

const sortOptions = [
    { text: '默认排序', value: '' },
    { text: '时间升序', value: 'time_asc' },
    { text: '时间降序', value: 'time_desc' },
    { text: '金额升序', value: 'amount_asc' },
    { text: '金额降序', value: 'amount_desc' },
];

const handleChange = (value) => {
    showToast(`选择: ${value}`);
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
}

.section-title {
    padding: 16px 16px 8px;
    font-size: 14px;
    color: #969799;
    font-weight: 500;
    background: #fff;
}

.current-value {
    padding: 16px;
    font-size: 12px;
    color: #323233;
    background: #fff;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;

    div {
        margin-bottom: 12px;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
