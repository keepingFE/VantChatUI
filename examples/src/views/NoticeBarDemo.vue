<template>
    <div class="demo-container">
        <van-nav-bar title="NoticeBar 通知栏" left-arrow fixed @click-left="goBack" />

        <div class="demo-content">
            <!-- 基础用法 -->
            <div class="demo-section">
                <div class="section-title">基础用法</div>
                <NoticeBar text="这是一条通知消息，会自动滚动播放。" />
            </div>

            <!-- 滚动播放 -->
            <div class="demo-section">
                <div class="section-title">滚动播放</div>
                <NoticeBar :scrollable="true" text="这是一条很长的通知消息，内容超出一行时会自动滚动播放，速度可以自定义。" />
            </div>

            <!-- 多行展示 -->
            <div class="demo-section">
                <div class="section-title">多行展示</div>
                <NoticeBar :wrapable="true" :scrollable="false"
                    text="这是一条很长的通知消息，设置 wrapable 属性后会自动换行显示，不会滚动。这样可以完整展示所有内容。" />
            </div>

            <!-- 可关闭 -->
            <div class="demo-section">
                <div class="section-title">可关闭</div>
                <NoticeBar v-if="showNotice1" mode="closeable" text="这条通知可以关闭" @close="showNotice1 = false" />
                <div v-else class="reset-btn">
                    <van-button type="primary" size="small" @click="showNotice1 = true">
                        重新显示
                    </van-button>
                </div>
            </div>

            <!-- 链接模式 -->
            <div class="demo-section">
                <div class="section-title">链接模式</div>
                <NoticeBar mode="link" text="点击查看详情" @click="handleClick" />
            </div>

            <!-- 自定义样式 -->
            <div class="demo-section">
                <div class="section-title">自定义样式</div>
                <NoticeBar text="自定义颜色的通知栏" color="#1989fa" background="#ecf9ff" left-icon="info-o" />
                <div style="margin-top: 12px;">
                    <NoticeBar text="成功提示通知" color="#07c160" background="#e8f8f0" left-icon="success" />
                </div>
                <div style="margin-top: 12px;">
                    <NoticeBar text="警告提示通知" color="#ff976a" background="#fff7e8" left-icon="warning-o" />
                </div>
                <div style="margin-top: 12px;">
                    <NoticeBar text="错误提示通知" color="#ee0a24" background="#fff1f0" left-icon="close" />
                </div>
            </div>

            <!-- 自定义滚动速度 -->
            <div class="demo-section">
                <div class="section-title">自定义滚动速度</div>
                <NoticeBar text="慢速滚动的通知消息，速度为 30px/s" :speed="30" />
                <div style="margin-top: 12px;">
                    <NoticeBar text="快速滚动的通知消息，速度为 100px/s" :speed="100" />
                </div>
            </div>

            <!-- 无图标 -->
            <div class="demo-section">
                <div class="section-title">无图标</div>
                <NoticeBar text="不显示左侧图标的通知" left-icon="" />
            </div>

            <!-- 自定义延迟 -->
            <div class="demo-section">
                <div class="section-title">自定义延迟</div>
                <NoticeBar text="延迟 3 秒后开始滚动" :delay="3" />
            </div>

            <!-- 实际应用场景 -->
            <div class="demo-section">
                <div class="section-title">实际应用场景</div>
                <NoticeBar mode="closeable" text="🎉 新用户注册立享 8 折优惠！" color="#ff6600" background="#fff4e6"
                    @close="handleClose" />
                <div style="margin-top: 12px;">
                    <NoticeBar mode="link" text="📢 系统将于今晚 22:00-24:00 进行维护升级" @click="showToast('查看详情')" />
                </div>
                <div style="margin-top: 12px;">
                    <NoticeBar :wrapable="true" :scrollable="false" text="⚠️ 重要提示：为了您的账户安全，请定期修改密码，不要将密码告诉他人。"
                        color="#ff976a" background="#fff7e8" />
                </div>
            </div>

            <!-- 点击反馈 -->
            <div class="demo-section">
                <div class="section-title">点击反馈</div>
                <div class="click-feedback">
                    最后操作: {{ lastAction || '暂无' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { NoticeBar } from '../../../packages/src/index.js';
import { showToast } from 'vant';

const router = useRouter();

const showNotice1 = ref(true);
const lastAction = ref('');

const handleClick = () => {
    lastAction.value = '点击了链接通知';
    showToast('查看详情');
};

const handleClose = () => {
    lastAction.value = '关闭了通知';
    showToast('通知已关闭');
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
    padding: 0 16px 16px;
}

.section-title {
    padding: 16px 0 12px;
    font-size: 14px;
    color: #969799;
    font-weight: 500;
}

.reset-btn {
    padding: 12px 0;
    text-align: center;
}

.click-feedback {
    padding: 16px;
    font-size: 14px;
    color: #323233;
    text-align: center;
    font-weight: 500;
    background: #f7f8fa;
    border-radius: 4px;
    margin-top: 12px;
}
</style>
