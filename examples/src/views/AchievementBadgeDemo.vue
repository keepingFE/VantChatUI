<template>
    <div class="demo-page">
        <Navbar title="成就徽章" @back="$router.back()" />

        <div class="demo-content">
            <div class="demo-header">
                <h2>AchievementBadge</h2>
                <p>运动成就徽章，支持不同稀有度、等级、解锁动画</p>
            </div>

            <div class="demo-section">
                <h3>不同稀有度</h3>
                <div class="badge-grid">
                    <AchievementBadge icon="🏆" name="初学者" description="完成第一次训练" :unlocked="true" rarity="common"
                        unlock-date="2024-12-01" @click="handleBadgeClick" />
                    <AchievementBadge icon="⚡" name="速度之王" description="单次跑步超过10公里" :unlocked="true" rarity="rare"
                        :level="2" unlock-date="2024-12-15" />
                    <AchievementBadge icon="🔥" name="燃脂大师" description="累计消耗10000卡路里" :unlocked="true" rarity="epic"
                        :level="5" unlock-date="2024-12-20" />
                    <AchievementBadge icon="👑" name="传奇运动员" description="连续运动365天" :unlocked="true" rarity="legendary"
                        :level="10" unlock-date="2024-12-31" />
                </div>
            </div>

            <div class="demo-section">
                <h3>未解锁状态</h3>
                <div class="badge-grid">
                    <AchievementBadge icon="💪" name="力量之源" description="单次深蹲100kg" :unlocked="false"
                        :current-progress="80" :target-progress="100" rarity="rare" />
                    <AchievementBadge icon="🎯" name="精准射手" description="完成100次完美训练" :unlocked="false"
                        :current-progress="45" :target-progress="100" rarity="epic" />
                    <AchievementBadge icon="🌟" name="全能战士" description="解锁所有训练类型" :unlocked="false"
                        :current-progress="6" :target-progress="10" rarity="legendary" />
                </div>
            </div>

            <div class="demo-section">
                <h3>不同尺寸</h3>
                <div class="badge-grid">
                    <AchievementBadge icon="🏃" name="小徽章" description="小尺寸示例" :unlocked="true" size="small"
                        rarity="common" />
                    <AchievementBadge icon="🏃" name="中徽章" description="中尺寸示例" :unlocked="true" size="medium"
                        rarity="rare" />
                    <AchievementBadge icon="🏃" name="大徽章" description="大尺寸示例" :unlocked="true" size="large"
                        rarity="epic" />
                </div>
            </div>

            <div class="demo-section">
                <h3>简化版（无详细信息）</h3>
                <div class="badge-grid">
                    <AchievementBadge icon="🎖️" :unlocked="true" :show-info="false" rarity="rare" />
                    <AchievementBadge icon="🥇" :unlocked="true" :show-info="false" rarity="epic" />
                    <AchievementBadge icon="💎" :unlocked="true" :show-info="false" rarity="legendary" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { AchievementBadge, Navbar } from '../../../packages/src/index.js';
import { useRouter } from 'vue-router';

export default {
    name: 'AchievementBadgeDemo',
    components: {
        AchievementBadge,
        Navbar
    },
    setup() {
        const $router = useRouter();
        return { $router };
    },
    methods: {
        handleBadgeClick(data) {
            console.log('点击了徽章:', data);
        }
    }
};
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f7f8fa;
}

.demo-content {
    padding: 56px 16px 40px;
    max-width: 1200px;
    margin: 0 auto;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
}

.demo-content::-webkit-scrollbar {
    width: 6px;
}

.demo-content::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 3px;
}

.demo-content::-webkit-scrollbar-track {
    background-color: transparent;
}

.demo-header {
    margin-bottom: 24px;
}

.demo-header h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #333;
}

.demo-header p {
    margin: 0;
    color: #666;
    font-size: 14px;
}

.demo-section {
    margin-bottom: 40px;
}

.demo-section h3 {
    margin-bottom: 16px;
    color: #666;
    font-size: 16px;
    font-weight: 600;
}

.badge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
}
</style>
