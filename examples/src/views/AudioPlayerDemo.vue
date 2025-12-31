<template>
    <div class="demo-page">
        <van-nav-bar title="AudioPlayer 音频播放器" left-arrow @click-left="onClickLeft" fixed placeholder />

        <div class="demo-container">
            <h1>AudioPlayer 音频播放器</h1>
            <p class="demo-description">移动端音频播放组件，支持响应式适配</p>

            <div class="demo-section">
                <h2>基础用法</h2>
                <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" title="示例音频 1"
                    artist="Sound Helix" />
            </div>

            <div class="demo-section">
                <h2>带封面图</h2>
                <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" title="美妙的旋律"
                    artist="未知艺术家" cover="https://picsum.photos/300/300?random=1" theme-color="#ff6b6b" />
            </div>

            <div class="demo-section">
                <h2>紧凑模式（无封面）</h2>
                <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" title="播客节目"
                    artist="主播名称" :show-cover="false" theme-color="#51cf66" />
            </div>

            <div class="demo-section">
                <h2>带播放速度控制</h2>
                <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" title="有声书章节"
                    artist="朗读者" :show-cover="false" :show-playback-rate="true" theme-color="#845ef7" />
            </div>

            <div class="demo-section">
                <h2>自定义宽度</h2>
                <div style="max-width: 400px; margin: 0 auto;">
                    <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" title="限制宽度"
                        artist="艺术家" cover="https://picsum.photos/300/300?random=2" theme-color="#f59f00" />
                </div>
            </div>

            <div class="demo-section">
                <h2>隐藏音量控制</h2>
                <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" title="简洁播放器"
                    artist="音乐人" :show-cover="false" :show-volume-control="false" theme-color="#20c997" />
            </div>

            <div class="demo-section">
                <h2>事件监听</h2>
                <AudioPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" title="事件测试"
                    artist="测试" :show-cover="false" @play="handlePlay" @pause="handlePause" @ended="handleEnded"
                    @timeupdate="handleTimeUpdate" />
                <div class="event-log">
                    <div v-for="(log, index) in eventLogs" :key="index" class="event-item">
                        {{ log }}
                    </div>
                </div>
            </div>

            <div class="demo-section">
                <h2>API 调用</h2>
                <AudioPlayer ref="audioPlayerRef" src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
                    title="API 控制" artist="测试" :show-cover="false" />
                <div class="api-buttons">
                    <button @click="handleApiPlay">播放</button>
                    <button @click="handleApiPause">暂停</button>
                    <button @click="handleApiSeek">跳转到 30s</button>
                    <button @click="handleApiVolume">设置音量 50%</button>
                    <button @click="handleApiRate">设置速度 1.5x</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AudioPlayer } from "../../../packages/src/index.js";

const router = useRouter();
const audioPlayerRef = ref(null);
const eventLogs = ref([]);

const onClickLeft = () => {
    router.back();
};

const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    eventLogs.value.unshift(`[${timestamp}] ${message}`);
    if (eventLogs.value.length > 5) {
        eventLogs.value.pop();
    }
};

const handlePlay = () => {
    addLog("播放开始");
};

const handlePause = () => {
    addLog("播放暂停");
};

const handleEnded = () => {
    addLog("播放结束");
};

const handleTimeUpdate = (event) => {
    // 每秒记录一次，避免日志过多
    const currentTime = Math.floor(event.target.currentTime);
    if (currentTime % 5 === 0) {
        addLog(`播放进度: ${currentTime}s`);
    }
};

const handleApiPlay = () => {
    audioPlayerRef.value?.play();
};

const handleApiPause = () => {
    audioPlayerRef.value?.pause();
};

const handleApiSeek = () => {
    audioPlayerRef.value?.seek(30);
};

const handleApiVolume = () => {
    audioPlayerRef.value?.setVolume(0.5);
};

const handleApiRate = () => {
    audioPlayerRef.value?.setPlaybackRate(1.5);
};
</script>

<style scoped>
.demo-page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
}

/* 自定义滚动条样式 */
.demo-page::-webkit-scrollbar {
    width: 8px;
}

.demo-page::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.demo-page::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.demo-page::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.demo-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

h1 {
    font-size: 28px;
    margin-bottom: 8px;
    color: #333;
}

.demo-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 32px;
}

.demo-section {
    margin-bottom: 48px;
}

.demo-section h2 {
    font-size: 20px;
    margin-bottom: 16px;
    color: #333;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
}

.event-log {
    margin-top: 16px;
    padding: 12px;
    background-color: #f5f5f5;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
}

.event-item {
    padding: 4px 0;
    color: #666;
}

.api-buttons {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.api-buttons button {
    padding: 8px 16px;
    background-color: #1989fa;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.api-buttons button:hover {
    background-color: #1573cc;
}

.api-buttons button:active {
    transform: scale(0.95);
}

@media (max-width: 768px) {
    .demo-container {
        padding: 16px;
    }

    h1 {
        font-size: 24px;
    }

    .demo-section h2 {
        font-size: 18px;
    }
}
</style>
