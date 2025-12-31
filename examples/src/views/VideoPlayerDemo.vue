<template>
    <div class="demo-page">
        <van-nav-bar title="VideoPlayer 视频播放器" left-arrow @click-left="onClickLeft" fixed placeholder />

        <div class="demo-container">

            <section class="demo-section">
                <h2>基础用法</h2>
                <p>基本的视频播放功能</p>
                <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4"
                    poster="https://via.placeholder.com/640x360/000000/FFFFFF?text=Video+Poster" width="100%"
                    :height="360" />
            </section>

            <section class="demo-section">
                <h2>自动播放（静音）</h2>
                <p>设置 autoplay 和 muted 属性实现自动播放</p>
                <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" width="100%" :height="360" autoplay muted
                    loop />
            </section>

            <section class="demo-section">
                <h2>自定义尺寸</h2>
                <p>可以自定义视频播放器的宽度和高度</p>
                <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" width="100%" :height="400" />
            </section>

            <section class="demo-section">
                <h2>圆角样式</h2>
                <p>使用 radius 属性设置圆角</p>
                <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" width="100%" :height="360" :radius="16" />
            </section>

            <section class="demo-section">
                <h2>横竖屏响应式适配 ⭐</h2>
                <p>组件会自动检测横竖屏变化并调整布局，竖屏时隐藏音量控制以节省空间</p>
                <VideoPlayer ref="orientationVideoRef" src="https://www.w3schools.com/html/mov_bbb.mp4" width="100%"
                    :height="400" :responsive="true" :show-orientation-hint="true"
                    @orientationchange="handleOrientationChange" />
                <div class="orientation-info">
                    <p><strong>当前方向:</strong> {{ currentOrientation }}</p>
                    <p><strong>屏幕尺寸:</strong> {{ screenSize }}</p>
                    <van-button type="primary" @click="checkOrientation">检测当前方向</van-button>
                </div>
            </section>

            <section class="demo-section">
                <h2>事件监听</h2>
                <p>监听视频播放的各种事件</p>
                <VideoPlayer ref="videoPlayerRef" src="https://www.w3schools.com/html/mov_bbb.mp4" width="100%"
                    :height="360" @play="handlePlay" @pause="handlePause" @ended="handleEnded" @error="handleError" />
                <div class="event-log">
                    <h3>事件日志：</h3>
                    <ul>
                        <li v-for="(log, index) in eventLogs" :key="index">{{ log }}</li>
                    </ul>
                </div>
            </section>

            <section class="demo-section">
                <h2>方法调用</h2>
                <p>通过 ref 调用组件方法</p>
                <VideoPlayer ref="controlVideoRef" src="https://www.w3schools.com/html/mov_bbb.mp4" width="100%"
                    :height="360" @volumechange="handleVolumeChange" />
                <div class="volume-status">
                    <p><strong>当前音量:</strong> {{ currentVolumeDisplay }}%</p>
                </div>
                <div class="volume-control">
                    <span class="volume-label">🔊 音量调节:</span>
                    <input type="range" class="volume-slider" v-model="volumeSliderValue" min="0" max="100" step="1"
                        @input="handleSliderChange" :style="{ '--volume-percent': volumeSliderValue + '%' }" />
                    <span class="volume-value">{{ volumeSliderValue }}%</span>
                </div>
                <div class="control-buttons">
                    <van-button type="primary" @click="playVideo">播放</van-button>
                    <van-button @click="pauseVideo">暂停</van-button>
                    <van-button @click="seekTo(10)">跳转到 10 秒</van-button>
                    <van-button @click="setVolume(0)">静音</van-button>
                    <van-button @click="setVolume(0.3)">音量 30%</van-button>
                    <van-button @click="setVolume(0.5)">音量 50%</van-button>
                    <van-button @click="setVolume(0.8)">音量 80%</van-button>
                    <van-button @click="setVolume(1)">音量 100%</van-button>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { VideoPlayer } from "../../../packages/src/index.js";

const router = useRouter();
const videoPlayerRef = ref(null);
const controlVideoRef = ref(null);
const orientationVideoRef = ref(null);
const eventLogs = ref([]);
const currentOrientation = ref("检测中...");
const screenSize = ref("检测中...");
const currentVolumeDisplay = ref(100);
const volumeSliderValue = ref(100);

const onClickLeft = () => {
    router.back();
};

const handleSliderChange = () => {
    const volume = volumeSliderValue.value / 100;
    setVolume(volume);
};

const handlePlay = () => {
    addEventLog("视频开始播放");
};

const handlePause = () => {
    addEventLog("视频暂停");
};

const handleEnded = () => {
    addEventLog("视频播放结束");
};

const handleError = (event) => {
    addEventLog("视频加载错误");
};

const handleVolumeChange = (event) => {
    if (event.target) {
        const volume = Math.round(event.target.volume * 100);
        currentVolumeDisplay.value = volume;
        volumeSliderValue.value = volume;
        addEventLog(`音量改变: ${volume}%`);
    }
};

const handleOrientationChange = (data) => {
    currentOrientation.value = data.isLandscape ? "横屏 (Landscape)" : "竖屏 (Portrait)";
    screenSize.value = `${data.width} x ${data.height}`;
    addEventLog(`屏幕方向改变: ${currentOrientation.value}`);
};

const checkOrientation = () => {
    const orientation = orientationVideoRef.value?.getOrientation();
    if (orientation) {
        currentOrientation.value = orientation.isLandscape ? "横屏 (Landscape)" : "竖屏 (Portrait)";
        screenSize.value = `${orientation.width} x ${orientation.height}`;
    }
};

const addEventLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    eventLogs.value.unshift(`[${timestamp}] ${message}`);
    if (eventLogs.value.length > 10) {
        eventLogs.value.pop();
    }
};

const playVideo = () => {
    controlVideoRef.value?.play();
};

const pauseVideo = () => {
    controlVideoRef.value?.pause();
};

const seekTo = (time) => {
    controlVideoRef.value?.seek(time);
};

const setVolume = (volume) => {
    controlVideoRef.value?.setVolume(volume);
    volumeSliderValue.value = Math.round(volume * 100);
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

/* Firefox 滚动条样式 */
.demo-page {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}

.demo-container {
    padding: 20px;
    padding-bottom: 40px;
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
}

.demo-section {
    margin-bottom: 24px;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    overflow: hidden;
}

.demo-section:first-child {
    margin-top: 0;
}

.demo-section:last-child {
    margin-bottom: 20px;
}

.demo-section h2 {
    font-size: 20px;
    margin-bottom: 12px;
    color: #333;
    font-weight: 600;
}

.demo-section p {
    margin-bottom: 16px;
    color: #666;
    font-size: 14px;
    line-height: 1.6;
}

.orientation-info {
    margin-top: 16px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 4px;
}

.orientation-info p {
    margin: 8px 0;
    color: #333;
    font-size: 14px;
}

.orientation-info strong {
    color: #1989fa;
}

.volume-status {
    margin-top: 16px;
    padding: 12px 16px;
    background: #e8f4ff;
    border-radius: 4px;
    border-left: 4px solid #1989fa;
}

.volume-status p {
    margin: 0;
    color: #333;
    font-size: 14px;
}

.volume-status strong {
    color: #1989fa;
}

.volume-control {
    margin-top: 16px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    border: 2px solid #1989fa;
    display: flex;
    align-items: center;
    gap: 16px;
}

.volume-label {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    white-space: nowrap;
}

.volume-slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    outline: none;
    background: linear-gradient(to right, #1989fa 0%, #1989fa var(--volume-percent, 100%), #e5e5e5 var(--volume-percent, 100%), #e5e5e5 100%);
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.volume-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1989fa;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(25, 137, 250, 0.4);
    transition: all 0.3s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 8px rgba(25, 137, 250, 0.6);
}

.volume-slider::-webkit-slider-thumb:active {
    transform: scale(1.1);
}

.volume-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1989fa;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(25, 137, 250, 0.4);
    transition: all 0.3s ease;
}

.volume-slider::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 8px rgba(25, 137, 250, 0.6);
}

.volume-slider::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: #e5e5e5;
}

.volume-value {
    font-size: 16px;
    font-weight: 600;
    color: #1989fa;
    min-width: 50px;
    text-align: right;
}

.event-log {
    margin-top: 16px;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 4px;
}

.event-log h3 {
    font-size: 16px;
    margin-bottom: 8px;
    color: #333;
}

.event-log ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
}

.event-log li {
    padding: 4px 0;
    color: #666;
    font-size: 14px;
    font-family: monospace;
}

.control-buttons {
    margin-top: 16px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .demo-container {
        padding: 12px;
    }

    .demo-section {
        margin-bottom: 16px;
        padding: 16px;
    }

    .demo-section h2 {
        font-size: 18px;
        margin-bottom: 8px;
    }

    .demo-section p {
        font-size: 13px;
        margin-bottom: 12px;
    }

    .orientation-info,
    .event-log {
        padding: 12px;
    }

    .control-buttons {
        gap: 8px;
    }

    .volume-control {
        padding: 12px;
        gap: 12px;
    }

    .volume-label {
        font-size: 14px;
    }

    .volume-value {
        font-size: 14px;
        min-width: 45px;
    }
}

@media (max-width: 480px) {
    .demo-container {
        padding: 10px;
    }

    .demo-section {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 6px;
    }

    .demo-section h2 {
        font-size: 16px;
    }

    .demo-section p {
        font-size: 12px;
    }

    .orientation-info p,
    .event-log li {
        font-size: 12px;
    }

    .control-buttons {
        gap: 6px;
    }

    .volume-control {
        padding: 10px;
        gap: 8px;
        flex-wrap: wrap;
    }

    .volume-label {
        font-size: 13px;
    }

    .volume-slider {
        min-width: 100%;
        order: 2;
    }

    .volume-value {
        font-size: 13px;
        min-width: 40px;
    }
}
</style>
