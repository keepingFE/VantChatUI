<template>
    <div class="demo-container">
        <van-nav-bar title="挑战卡片" left-arrow @click-left="$router.back()" fixed placeholder />

        <div class="demo-content">
            <div class="demo-header">
                <h2>ChallengeCard</h2>
                <p>运动挑战活动卡片，进度追踪、奖励展示、社交互动</p>
            </div>

            <div class="demo-section">
                <h3>精选挑战（进行中）</h3>
                <ChallengeCard title="30天跑步挑战" description="连续30天每天跑步至少3公里，养成运动习惯，提升心肺功能" icon="🏃" category="跑步"
                    status="ongoing" :current-value="12" :target-value="30" unit="天" start-date="2024-12-01"
                    end-date="2024-12-30" :days-remaining="18" :rewards="[
                        { icon: '🏆', text: '跑步达人徽章' },
                        { icon: '💎', text: '100积分' },
                        { icon: '🎁', text: '神秘礼包' }
                    ]" :participants="1234" :featured="true" @click="handleCardClick" @action="handleAction"
                    @share="handleShare" />
            </div>

            <div class="demo-section">
                <h3>未开始的挑战</h3>
                <ChallengeCard title="100公里骑行挑战" description="本月累计骑行100公里，探索城市的每个角落" icon="🚴"
                    icon-color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" category="骑行" status="not-started"
                    :current-value="0" :target-value="100" unit="公里" start-date="2025-01-01" end-date="2025-01-31"
                    :days-remaining="31" :rewards="[
                        { icon: '🚴', text: '骑行者徽章' },
                        { icon: '💎', text: '150积分' }
                    ]" :participants="856" />
            </div>

            <div class="demo-section">
                <h3>已完成的挑战</h3>
                <ChallengeCard title="7天瑜伽挑战" description="连续7天练习瑜伽，放松身心，提升柔韧性" icon="🧘"
                    icon-color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" category="瑜伽" status="completed"
                    :current-value="7" :target-value="7" unit="天" start-date="2024-12-15" end-date="2024-12-21"
                    :days-remaining="0" :rewards="[
                        { icon: '🧘', text: '瑜伽大师徽章' },
                        { icon: '💎', text: '80积分' }
                    ]" :participants="2341" :show-participants="true" />
            </div>

            <div class="demo-section">
                <h3>紧急挑战（即将结束）</h3>
                <ChallengeCard title="周末燃脂挑战" description="周末两天消耗1000卡路里，燃烧多余脂肪" icon="🔥"
                    icon-color="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" category="综合" status="ongoing"
                    :current-value="650" :target-value="1000" unit="千卡" start-date="2024-12-28" end-date="2024-12-29"
                    :days-remaining="1" :rewards="[
                        { icon: '🔥', text: '燃脂达人' },
                        { icon: '💎', text: '50积分' }
                    ]" :participants="567" />
            </div>

            <div class="demo-section">
                <h3>失败的挑战</h3>
                <ChallengeCard title="深夜运动挑战" description="连续14天晚上10点后运动30分钟" icon="🌙"
                    icon-color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" category="综合" status="failed"
                    :current-value="8" :target-value="14" unit="天" start-date="2024-12-01" end-date="2024-12-14"
                    :days-remaining="0" :rewards="[
                        { icon: '🌙', text: '夜猫子徽章' },
                        { icon: '💎', text: '60积分' }
                    ]" :participants="234" />
            </div>

            <div class="demo-section">
                <h3>简化版（无参与者和分享）</h3>
                <ChallengeCard title="个人力量训练" description="完成20次力量训练课程" icon="💪" category="力量" status="ongoing"
                    :current-value="15" :target-value="20" unit="次" :rewards="[{ icon: '💪', text: '力量之源' }]"
                    :show-participants="false" :show-share="false" />
            </div>
        </div>
    </div>
</template>

<script>
import { ChallengeCard } from '../../../packages/src/index.js';

export default {
    name: 'ChallengeCardDemo',
    components: {
        ChallengeCard
    },
    methods: {
        handleCardClick(data) {
            console.log('点击了卡片:', data);
        },
        handleAction(data) {
            console.log('点击了操作按钮:', data);
        },
        handleShare(data) {
            console.log('点击了分享:', data);
        }
    }
};
</script>

<style scoped>
.demo-container {
    min-height: 100vh;
    height: 100vh;
    background-color: #f7f8fa;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
}

.demo-container :deep(.van-nav-bar) {
    z-index: 999;
}

.demo-container::-webkit-scrollbar {
    width: 6px;
}

.demo-container::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 3px;
}

.demo-container::-webkit-scrollbar-track {
    background-color: transparent;
}

.demo-content {
    padding: 16px;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 40px;
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
</style>
