<template>
    <div class="demo-page">
        <van-nav-bar title="录音波形图动画" left-arrow @click-left="$router.back()" fixed />
        <div class="content">
            <div class="demo-section">
                <h3>Siri 风格（默认）</h3>
                <AudioWaveform :isRecording="isRecording1" />
                <div class="controls">
                    <button @click="isRecording1 = !isRecording1">
                        {{ isRecording1 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>自定义文字和颜色</h3>
                <AudioWaveform :isRecording="isRecording2" statusText="正在录音..." backgroundColor="#5b7c99" />
                <div class="controls">
                    <button @click="isRecording2 = !isRecording2">
                        {{ isRecording2 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>深色主题</h3>
                <AudioWaveform :isRecording="isRecording3" statusText="Recording..." backgroundColor="#2c3e50"
                    barColor="#ecf0f1" barActiveColor="#3498db" />
                <div class="controls">
                    <button @click="isRecording3 = !isRecording3">
                        {{ isRecording3 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>显示计时器</h3>
                <AudioWaveform :isRecording="isRecording4" :showTimer="true" statusText="Listening..."
                    backgroundColor="#34495e" />
                <div class="controls">
                    <button @click="isRecording4 = !isRecording4">
                        {{ isRecording4 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>显示音量指示器</h3>
                <AudioWaveform :isRecording="isRecording5" :audioLevel="audioLevel" :showLevel="true"
                    statusText="Recording..." backgroundColor="#16a085" />
                <div class="controls">
                    <button @click="toggleRecording5">
                        {{ isRecording5 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>渐变背景</h3>
                <div class="gradient-wrapper">
                    <AudioWaveform :isRecording="isRecording6" statusText="Voice Assistant"
                        backgroundColor="transparent" />
                </div>
                <div class="controls">
                    <button @click="isRecording6 = !isRecording6">
                        {{ isRecording6 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>更多波形条</h3>
                <AudioWaveform :isRecording="isRecording7" :barCount="80" statusText="Processing..."
                    backgroundColor="#8e44ad" />
                <div class="controls">
                    <button @click="isRecording7 = !isRecording7">
                        {{ isRecording7 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>不显示文字</h3>
                <AudioWaveform :isRecording="isRecording8" :showText="false" backgroundColor="#e74c3c" />
                <div class="controls">
                    <button @click="isRecording8 = !isRecording8">
                        {{ isRecording8 ? '停止' : '开始录音' }}
                    </button>
                </div>
            </div>

            <div class="demo-section">
                <h3>可调节动画速度</h3>
                <AudioWaveform :isRecording="isRecording9" :animationSpeed="animationSpeed"
                    statusText="Adjustable Speed" backgroundColor="#27ae60" />
                <div class="controls">
                    <button @click="isRecording9 = !isRecording9">
                        {{ isRecording9 ? '停止' : '开始录音' }}
                    </button>
                </div>
                <div class="speed-control">
                    <label>动画速度: {{ animationSpeed }}ms</label>
                    <input type="range" v-model.number="animationSpeed" min="50" max="500" step="10" />
                    <div class="speed-labels">
                        <span>快 (50ms)</span>
                        <span>慢 (500ms)</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AudioWaveform from '../../../packages/src/components/AudioWaveform/index.vue'

const isRecording1 = ref(false)
const isRecording2 = ref(false)
const isRecording3 = ref(false)
const isRecording4 = ref(false)
const isRecording5 = ref(false)
const isRecording6 = ref(false)
const isRecording7 = ref(false)
const isRecording8 = ref(false)
const isRecording9 = ref(false)

const audioLevel = ref(0)
const animationSpeed = ref(100)
let levelInterval = null

const toggleRecording5 = () => {
    isRecording5.value = !isRecording5.value

    if (isRecording5.value) {
        // 模拟音量变化
        levelInterval = setInterval(() => {
            audioLevel.value = Math.random() * 100
        }, 200)
    } else {
        if (levelInterval) {
            clearInterval(levelInterval)
            levelInterval = null
        }
        audioLevel.value = 0
    }
}
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

h3 {
    font-size: 16px;
    margin-bottom: 12px;
    color: #595959;
    font-weight: 600;
}

.demo-section {
    margin-bottom: 24px;
}

.gradient-wrapper {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    overflow: hidden;
}

.controls {
    margin-top: 16px;
    text-align: center;
}

button {
    padding: 10px 24px;
    font-size: 14px;
    border: none;
    border-radius: 6px;
    background: #1890ff;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
}

button:hover {
    background: #40a9ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

button:active {
    transform: translateY(0);
}

.speed-control {
    margin-top: 16px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.speed-control label {
    display: block;
    font-size: 14px;
    color: #595959;
    margin-bottom: 12px;
    font-weight: 500;
}

.speed-control input[type="range"] {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #e8e8e8;
    outline: none;
    -webkit-appearance: none;
}

.speed-control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1890ff;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.4);
    transition: all 0.3s;
}

.speed-control input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 8px rgba(24, 144, 255, 0.6);
}

.speed-control input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #1890ff;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.4);
    transition: all 0.3s;
}

.speed-control input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 8px rgba(24, 144, 255, 0.6);
}

.speed-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 12px;
    color: #8c8c8c;
}
</style>
