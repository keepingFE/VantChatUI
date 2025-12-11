<template>
    <div class="waterfall-demo">
        <van-nav-bar title="Waterfall 瀑布流" left-arrow fixed @click-left="goBack" />

        <div class="content">
            <!-- 控制面板 -->
            <div class="demo-controls">
                <div class="control-item">
                    <label>列数：</label>
                    <select v-model.number="columnCount">
                        <option :value="2">2列</option>
                        <option :value="3">3列</option>
                        <option :value="4">4列</option>
                        <option :value="5">5列</option>
                    </select>
                </div>

                <div class="control-item">
                    <label>间距：</label>
                    <select v-model.number="gap">
                        <option :value="5">5px</option>
                        <option :value="10">10px</option>
                        <option :value="15">15px</option>
                        <option :value="20">20px</option>
                    </select>
                </div>

                <div class="control-item">
                    <label>圆角：</label>
                    <select v-model.number="radius">
                        <option :value="0">无</option>
                        <option :value="4">4px</option>
                        <option :value="8">8px</option>
                        <option :value="12">12px</option>
                    </select>
                </div>

                <button @click="addMoreImages" class="add-btn">加载更多</button>
            </div>

            <!-- 基础用法 -->
            <div class="demo-section demo-section--scroll">
                <h3>基础用法</h3>
                <div class="waterfall-wrapper">
                    <Waterfall :list="imageList" :column-count="columnCount" :gap="gap" :radius="radius" height="100%"
                        @click="handleImageClick" @load="handleImageLoad" />
                </div>
            </div>

            <!-- 带标题和简介 -->
            <div class="demo-section">
                <h3>带标题和简介</h3>
                <Waterfall :list="imageListWithInfo" :column-count="2" :gap="10" :radius="8" :show-info="true"
                    @click="handleImageClick" />
            </div>

            <!-- 自定义内容 -->
            <div class="demo-section">
                <h3>自定义内容</h3>
                <Waterfall :list="customImageList" :column-count="3" :gap="10">
                    <template #default="{ item }">
                        <div class="custom-item">
                            <img :src="item.src" :alt="item.alt" class="custom-image" />
                            <div class="custom-overlay">
                                <div class="custom-title">{{ item.title }}</div>
                                <div class="custom-desc">{{ item.description }}</div>
                            </div>
                        </div>
                    </template>
                </Waterfall>
            </div>
        </div>

        <!-- 图片预览弹窗 -->
        <div v-if="previewImage" class="preview-modal" @click="closePreview">
            <div class="preview-content">
                <img :src="previewImage" alt="预览图片" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Waterfall from "../../../packages/src/components/Waterfall/index.vue";

const router = useRouter();

// 返回上一页
const goBack = () => {
    router.back();
};

// 控制参数
const columnCount = ref(2);
const gap = ref(10);
const radius = ref(8);

// 生成随机高度的图片URL
const generateImageUrl = (width, height, index) => {
    return `https://picsum.photos/${width}/${height}?random=${index}`;
};

// 图片列表
const imageList = ref([]);

// 初始化图片列表
const initImageList = () => {
    const heights = [300, 400, 350, 450, 380, 420, 360, 390, 410, 370];
    imageList.value = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        src: generateImageUrl(400, heights[index % heights.length], index),
        alt: `图片 ${index + 1}`,
    }));
};

// 带标题和简介的图片列表
const imageListWithInfo = ref([
    {
        id: 1,
        src: "https://picsum.photos/400/300?random=200",
        alt: "图片1",
        title: "美丽的风景",
        description: "这是一张非常美丽的风景照片，展示了大自然的壮丽景色，让人心旷神怡，流连忘返。",
    },
    {
        id: 2,
        src: "https://picsum.photos/400/450?random=201",
        alt: "图片2",
        title: "城市建筑",
        description: "现代化的城市建筑群，高楼林立。",
    },
    {
        id: 3,
        src: "https://picsum.photos/400/350?random=202",
        alt: "图片3",
        title: "自然风光",
        description: "山川河流，美不胜收，这里的景色让人流连忘返，是摄影爱好者的天堂，每一个角度都能拍出绝美的照片。",
    },
    {
        id: 4,
        src: "https://picsum.photos/400/400?random=203",
        alt: "图片4",
        title: "海边日落",
        description: "夕阳西下，海天一色。",
    },
    {
        id: 5,
        src: "https://picsum.photos/400/380?random=204",
        alt: "图片5",
        title: "森林小径",
        description: "幽静的森林小路，两旁绿树成荫，阳光透过树叶洒下斑驳的光影，空气中弥漫着清新的气息。",
    },
    {
        id: 6,
        src: "https://picsum.photos/400/420?random=205",
        alt: "图片6",
        title: "雪山景观",
        description: "白雪皑皑的山峰。",
    },
    {
        id: 7,
        src: "https://picsum.photos/400/360?random=206",
        alt: "图片7",
        title: "田园风光",
        description: "金黄的麦田随风摇曳。",
    },
    {
        id: 8,
        src: "https://picsum.photos/400/390?random=207",
        alt: "图片8",
        title: "湖光山色",
        description: "清澈的湖水倒映着远处的青山，湖面波光粼粼，偶尔有几只水鸟掠过，构成了一幅宁静祥和的画面。",
    },
    {
        id: 9,
        src: "https://picsum.photos/400/410?random=208",
        alt: "图片9",
        title: "古镇街景",
        description: "古色古香的建筑。",
    },
]);

// 加载更多图片
const addMoreImages = () => {
    const currentLength = imageList.value.length;
    const heights = [300, 400, 350, 450, 380, 420, 360, 390, 410, 370];
    const newImages = Array.from({ length: 10 }, (_, index) => ({
        id: currentLength + index + 1,
        src: generateImageUrl(400, heights[index % heights.length], currentLength + index),
        alt: `图片 ${currentLength + index + 1}`,
    }));
    imageList.value.push(...newImages);
};

// 自定义内容图片列表
const customImageList = ref([
    {
        id: 1,
        src: "https://picsum.photos/400/300?random=100",
        alt: "风景1",
        title: "美丽的日落",
        description: "夕阳西下，美不胜收",
    },
    {
        id: 2,
        src: "https://picsum.photos/400/450?random=101",
        alt: "风景2",
        title: "山间小溪",
        description: "清澈的溪水潺潺流淌",
    },
    {
        id: 3,
        src: "https://picsum.photos/400/350?random=102",
        alt: "风景3",
        title: "城市夜景",
        description: "灯火辉煌的都市",
    },
    {
        id: 4,
        src: "https://picsum.photos/400/400?random=103",
        alt: "风景4",
        title: "森林深处",
        description: "茂密的树林",
    },
    {
        id: 5,
        src: "https://picsum.photos/400/380?random=104",
        alt: "风景5",
        title: "海边沙滩",
        description: "碧海蓝天",
    },
    {
        id: 6,
        src: "https://picsum.photos/400/420?random=105",
        alt: "风景6",
        title: "雪山之巅",
        description: "白雪皑皑",
    },
]);

// 预览图片
const previewImage = ref(null);

const handleImageClick = (item) => {
    previewImage.value = item.src;
};

const closePreview = () => {
    previewImage.value = null;
};

const handleImageLoad = ({ item }) => {
    console.log("图片加载完成:", item.alt);
};

// 初始化
initImageList();
</script>

<style scoped lang="scss">
.waterfall-demo {
    min-height: 100vh;
    background: #f7f8fa;

    .content {
        padding: 62px 20px 16px;

        h3 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #646566;
        }
    }
}

.demo-controls {
    display: flex;
    gap: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
    flex-shrink: 0;

    .control-item {
        display: flex;
        align-items: center;
        gap: 8px;

        label {
            font-size: 14px;
            color: #646566;
        }

        select {
            padding: 6px 12px;
            border: 1px solid #dcdee0;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;

            &:focus {
                outline: none;
                border-color: #1989fa;
            }
        }
    }

    .add-btn {
        padding: 8px 16px;
        background: #1989fa;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
            background: #1677d2;
        }

        &:active {
            background: #1567c0;
        }
    }
}

.demo-section {
    margin-bottom: 40px;

    &--scroll {
        display: flex;
        flex-direction: column;
        height: 500px;

        h3 {
            flex-shrink: 0;
        }

        .waterfall-wrapper {
            flex: 1;
            overflow: hidden;
        }
    }
}

// 自定义内容样式
.custom-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;

    .custom-image {
        display: block;
        width: 100%;
        height: auto;
        transition: transform 0.3s ease;
    }

    .custom-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
        color: white;
        transform: translateY(100%);
        transition: transform 0.3s ease;
    }

    &:hover {
        .custom-image {
            transform: scale(1.05);
        }

        .custom-overlay {
            transform: translateY(0);
        }
    }

    .custom-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 4px;
    }

    .custom-desc {
        font-size: 12px;
        opacity: 0.9;
    }
}

// 预览弹窗
.preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
    animation: fadeIn 0.3s ease;

    .preview-content {
        max-width: 90%;
        max-height: 90%;

        img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            animation: zoomIn 0.3s ease;
        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes zoomIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
