<template>
    <div class="demo-page">
        <van-nav-bar title="体态分析" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <PostureAnalysis :overall-score="78" :data="postureData" :analysis-details="postureDetails"
                :suggestions="postureSuggestions" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { PostureAnalysis } from '../../../packages/src/index.js'

const postureData = ref({
    head: { score: 85, angle: 5 },
    neck: { score: 70, angle: 15 },
    shoulders: { score: 80, leftHeight: 0, rightHeight: 2 },
    spine: { score: 75, curvature: 'slight' },
    pelvis: { score: 90, tilt: 2 }
})

const postureDetails = ref([
    { part: '头部前倾', score: 85, description: '头部前倾角度5°，略有前倾' },
    { part: '颈椎曲度', score: 70, description: '颈椎前倾15°，建议改善' },
    { part: '肩部平衡', score: 80, description: '右肩略高2cm，基本平衡' },
    { part: '脊柱侧弯', score: 75, description: '轻度侧弯，需要注意' },
    { part: '骨盆倾斜', score: 90, description: '骨盆倾斜2°，状态良好' }
])

const postureSuggestions = ref([
    { icon: '💺', title: '调整坐姿', description: '保持背部挺直，避免长时间低头' },
    { icon: '🧘', title: '拉伸运动', description: '每天进行颈部和肩部拉伸10分钟' },
    { icon: '💪', title: '核心训练', description: '加强核心肌群训练，改善体态' },
    { icon: '🪑', title: '工作环境', description: '调整显示器高度，保持视线平视' }
])
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    height: 100vh;
    background: #f7f8fa;
    overflow-y: auto;
    overflow-x: hidden;
}

.demo-page::-webkit-scrollbar {
    width: 6px;
}

.demo-page::-webkit-scrollbar-thumb {
    background-color: #dbdbdb;
    border-radius: 3px;
}

.demo-page::-webkit-scrollbar-track {
    background-color: transparent;
}

.content {
    padding: 62px 16px 16px;
}
</style>
