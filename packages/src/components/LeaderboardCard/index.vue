<template>
    <div class="leaderboard-card">
        <div class="header">
            <div class="title">{{ title }}</div>
            <div class="period-selector">
                <span v-for="p in periods" :key="p.value" class="period-item" :class="{ active: period === p.value }"
                    @click="changePeriod(p.value)">
                    {{ p.label }}
                </span>
            </div>
        </div>

        <div class="my-rank" v-if="myRank">
            <div class="rank-badge" :class="getRankClass(myRank.rank)">
                {{ myRank.rank }}
            </div>
            <div class="rank-info">
                <div class="rank-name">我的排名</div>
                <div class="rank-value">{{ myRank.value }} {{ unit }}</div>
            </div>
            <div class="rank-trend" :class="myRank.trend > 0 ? 'up' : 'down'">
                <van-icon :name="myRank.trend > 0 ? 'arrow-up' : 'arrow-down'" />
                <span>{{ Math.abs(myRank.trend) }}</span>
            </div>
        </div>

        <div class="top-three" v-if="rankings.length >= 3">
            <div class="podium">
                <div class="podium-item second">
                    <div class="avatar">
                        <img :src="rankings[1].avatar" alt="" />
                    </div>
                    <div class="medal">🥈</div>
                    <div class="name">{{ rankings[1].name }}</div>
                    <div class="value">{{ rankings[1].value }}</div>
                    <div class="podium-bar" style="height: 80px"></div>
                </div>
                <div class="podium-item first">
                    <div class="avatar">
                        <img :src="rankings[0].avatar" alt="" />
                    </div>
                    <div class="medal">🥇</div>
                    <div class="name">{{ rankings[0].name }}</div>
                    <div class="value">{{ rankings[0].value }}</div>
                    <div class="podium-bar" style="height: 100px"></div>
                </div>
                <div class="podium-item third">
                    <div class="avatar">
                        <img :src="rankings[2].avatar" alt="" />
                    </div>
                    <div class="medal">🥉</div>
                    <div class="name">{{ rankings[2].name }}</div>
                    <div class="value">{{ rankings[2].value }}</div>
                    <div class="podium-bar" style="height: 60px"></div>
                </div>
            </div>
        </div>

        <div class="rankings-list">
            <div v-for="(item, index) in otherRankings" :key="item.id" class="ranking-item"
                :class="{ highlight: item.isMe }">
                <div class="rank-number">{{ item.rank }}</div>
                <div class="user-avatar">
                    <img :src="item.avatar" alt="" />
                </div>
                <div class="user-info">
                    <div class="user-name">{{ item.name }}</div>
                    <div class="user-desc" v-if="item.description">{{ item.description }}</div>
                </div>
                <div class="user-value">
                    <span class="value">{{ item.value }}</span>
                    <span class="unit">{{ unit }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: '运动排行榜'
    },
    unit: {
        type: String,
        default: '步'
    },
    rankings: {
        type: Array,
        required: true
        // rankings 结构：
        // [
        //   { id: 1, rank: 1, name: '张三', avatar: 'url', value: 15000, description: '连续7天第一' },
        //   ...
        // ]
    },
    myRank: {
        type: Object,
        default: null
        // myRank 结构：
        // { rank: 5, value: 12000, trend: 2 } // trend: 正数上升，负数下降
    }
})

const emit = defineEmits(['periodChange'])

const period = ref('week')
const periods = [
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' }
]

const otherRankings = computed(() => {
    return props.rankings.slice(3)
})

const changePeriod = (value) => {
    period.value = value
    emit('periodChange', value)
}

const getRankClass = (rank) => {
    if (rank === 1) return 'gold'
    if (rank === 2) return 'silver'
    if (rank === 3) return 'bronze'
    return ''
}
</script>

<style scoped lang="scss">
.leaderboard-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }

    .period-selector {
        display: flex;
        gap: 8px;
    }

    .period-item {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 14px;
        color: #8c8c8c;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
            background: #1890ff;
            color: #fff;
        }

        &:not(.active):active {
            background: #f0f0f0;
        }
    }
}

.my-rank {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    margin-bottom: 20px;
    color: #fff;

    .rank-badge {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.2);

        &.gold {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #8b4513;
        }

        &.silver {
            background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
            color: #666;
        }

        &.bronze {
            background: linear-gradient(135deg, #cd7f32 0%, #e6a85c 100%);
            color: #fff;
        }
    }

    .rank-info {
        flex: 1;

        .rank-name {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 4px;
        }

        .rank-value {
            font-size: 20px;
            font-weight: 600;
        }
    }

    .rank-trend {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        background: rgba(255, 255, 255, 0.2);

        &.up {
            color: #52c41a;
            background: rgba(82, 196, 26, 0.2);
        }

        &.down {
            color: #ff7875;
            background: rgba(255, 120, 117, 0.2);
        }
    }
}

.top-three {
    margin-bottom: 20px;
}

.podium {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 12px;
    padding: 20px 0;
}

.podium-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 8px;
        border: 3px solid #f0f0f0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .medal {
        font-size: 24px;
        margin-bottom: 4px;
    }

    .name {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a1a;
        margin-bottom: 4px;
    }

    .value {
        font-size: 16px;
        font-weight: 600;
        color: #1890ff;
        margin-bottom: 8px;
    }

    .podium-bar {
        width: 100%;
        background: linear-gradient(to top, #e6e6e6, #f7f8fa);
        border-radius: 8px 8px 0 0;
    }

    &.first {
        .avatar {
            width: 70px;
            height: 70px;
            border-color: #ffd700;
        }

        .podium-bar {
            background: linear-gradient(to top, #ffd700, #ffed4e);
        }
    }

    &.second {
        .avatar {
            border-color: #c0c0c0;
        }

        .podium-bar {
            background: linear-gradient(to top, #c0c0c0, #e8e8e8);
        }
    }

    &.third {
        .avatar {
            border-color: #cd7f32;
        }

        .podium-bar {
            background: linear-gradient(to top, #cd7f32, #e6a85c);
        }
    }
}

.rankings-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.ranking-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 12px;
    transition: all 0.2s;

    &.highlight {
        background: #e6f7ff;
        border: 1px solid #1890ff;
    }

    .rank-number {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        color: #8c8c8c;
        flex-shrink: 0;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .user-info {
        flex: 1;

        .user-name {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 2px;
        }

        .user-desc {
            font-size: 12px;
            color: #8c8c8c;
        }
    }

    .user-value {
        text-align: right;

        .value {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
        }

        .unit {
            font-size: 12px;
            color: #8c8c8c;
            margin-left: 2px;
        }
    }
}
</style>
