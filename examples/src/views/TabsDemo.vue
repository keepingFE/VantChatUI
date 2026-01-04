<template>
    <div class="demo-container">
        <van-nav-bar title="Tabs 标签页" left-arrow fixed @click-left="goBack" />

        <div class="demo-content">
            <!-- 基础用法 -->
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <Tabs v-model="activeTab1" @change="handleChange">
                    <TabPane title="标签 1" name="tab1">
                        <div class="tab-content">标签 1 的内容</div>
                    </TabPane>
                    <TabPane title="标签 2" name="tab2">
                        <div class="tab-content">标签 2 的内容</div>
                    </TabPane>
                    <TabPane title="标签 3" name="tab3">
                        <div class="tab-content">标签 3 的内容</div>
                    </TabPane>
                    <TabPane title="标签 4" name="tab4">
                        <div class="tab-content">标签 4 的内容</div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 卡片样式 -->
            <div class="demo-section">
                <div class="section-title">卡片样式</div>
                <Tabs v-model="activeTab2" type="card">
                    <TabPane title="标签 1" name="1">
                        <div class="tab-content">卡片样式标签 1</div>
                    </TabPane>
                    <TabPane title="标签 2" name="2">
                        <div class="tab-content">卡片样式标签 2</div>
                    </TabPane>
                    <TabPane title="标签 3" name="3">
                        <div class="tab-content">卡片样式标签 3</div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 自定义颜色 -->
            <div class="demo-section">
                <div class="section-title">自定义颜色</div>
                <Tabs v-model="activeTab3" color="#07c160">
                    <TabPane title="绿色" name="1">
                        <div class="tab-content">自定义绿色主题</div>
                    </TabPane>
                    <TabPane title="标签 2" name="2">
                        <div class="tab-content">标签 2 内容</div>
                    </TabPane>
                    <TabPane title="标签 3" name="3">
                        <div class="tab-content">标签 3 内容</div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 禁用标签 -->
            <div class="demo-section">
                <div class="section-title">禁用标签</div>
                <Tabs v-model="activeTab4">
                    <TabPane title="标签 1" name="1">
                        <div class="tab-content">标签 1 内容</div>
                    </TabPane>
                    <TabPane title="标签 2（禁用）" name="2" disabled>
                        <div class="tab-content">标签 2 内容</div>
                    </TabPane>
                    <TabPane title="标签 3" name="3">
                        <div class="tab-content">标签 3 内容</div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 徽标提示 -->
            <div class="demo-section">
                <div class="section-title">徽标提示</div>
                <Tabs v-model="activeTab5">
                    <TabPane title="标签 1" name="1" dot>
                        <div class="tab-content">带小红点的标签</div>
                    </TabPane>
                    <TabPane title="标签 2" name="2" badge="5">
                        <div class="tab-content">带徽标数字的标签</div>
                    </TabPane>
                    <TabPane title="标签 3" name="3" badge="99+">
                        <div class="tab-content">带徽标文字的标签</div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 滑动切换 -->
            <div class="demo-section">
                <div class="section-title">滑动切换</div>
                <Tabs v-model="activeTab6" swipeable animated>
                    <TabPane title="标签 1" name="1">
                        <div class="tab-content">支持手势滑动切换</div>
                    </TabPane>
                    <TabPane title="标签 2" name="2">
                        <div class="tab-content">左右滑动试试</div>
                    </TabPane>
                    <TabPane title="标签 3" name="3">
                        <div class="tab-content">带动画效果</div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 多标签滚动 -->
            <div class="demo-section">
                <div class="section-title">多标签滚动</div>
                <Tabs v-model="activeTab7">
                    <TabPane v-for="i in 8" :key="i" :title="`标签 ${i}`" :name="i">
                        <div class="tab-content">标签 {{ i }} 的内容</div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 粘性定位 -->
            <div class="demo-section">
                <div class="section-title">粘性定位</div>
                <Tabs v-model="activeTab8" sticky :offset-top="46">
                    <TabPane title="标签 1" name="1">
                        <div class="tab-content" style="height: 300px;">
                            向下滚动页面，标签栏会固定在顶部
                        </div>
                    </TabPane>
                    <TabPane title="标签 2" name="2">
                        <div class="tab-content" style="height: 300px;">
                            标签 2 的内容
                        </div>
                    </TabPane>
                    <TabPane title="标签 3" name="3">
                        <div class="tab-content" style="height: 300px;">
                            标签 3 的内容
                        </div>
                    </TabPane>
                </Tabs>
            </div>

            <!-- 当前选中 -->
            <div class="demo-section">
                <div class="section-title">当前选中</div>
                <div class="current-tab">
                    当前选中的标签: {{ activeTab1 }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Tabs, TabPane } from '../../../packages/src/index.js';
import { showToast } from 'vant';

const router = useRouter();

const activeTab1 = ref('tab1');
const activeTab2 = ref('1');
const activeTab3 = ref('1');
const activeTab4 = ref('1');
const activeTab5 = ref('1');
const activeTab6 = ref('1');
const activeTab7 = ref(1);
const activeTab8 = ref('1');

const handleChange = (name, title) => {
    showToast(`切换到: ${title || name}`);
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
    background: #fff;
}

.section-title {
    padding: 16px 16px 8px;
    font-size: 14px;
    color: #969799;
    font-weight: 500;
}

.tab-content {
    padding: 24px 16px;
    font-size: 14px;
    color: #323233;
    line-height: 1.6;
}

.current-tab {
    padding: 16px;
    font-size: 14px;
    color: #323233;
    text-align: center;
    font-weight: 500;
}
</style>
