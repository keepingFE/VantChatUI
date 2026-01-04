<template>
    <div class="demo-page">
        <Navbar title="Recorder 语音录制" @back="$router.back()" />
        <div class="demo-container">
            <div class="demo-section">
                <h3>基础用法</h3>
                <p class="tip">按住按钮开始录音，松开发送</p>
                <Recorder @start="handleStart" @stop="handleStop" @cancel="handleCancel" @complete="handleComplete" />
            </div>

            <div class="demo-section">
                <h3>自定义时长</h3>
                <p class="tip">最长录制30秒，最短1秒</p>
                <Recorder :max-duration="30" :min-duration="1" @complete="handleComplete" />
            </div>

            <div class="demo-section">
                <h3>录音记录</h3>
                <div v-if="recordings.length === 0" class="no-recordings">
                    暂无录音
                </div>
                <div v-else class="recordings-list">
                    <div v-for="(recording, index) in recordings" :key="index" class="recording-item">
                        <van-icon name="audio" />
                        <span>录音 {{ index + 1 }}</span>
                        <span class="duration">{{ recording.duration }}秒</span>
                        <van-button type="primary" size="small" @click="playRecording(recording)">
                            播放
                        </van-button>
                    </div>
                </div>
            </div>

            <div class="demo-section">
                <h3>使用说明</h3>
                <div class="instructions">
                    <p>1. 首次使用需要授权麦克风权限</p>
                    <p>2. 按住按钮开始录音</p>
                    <p>3. 松开按钮发送录音</p>
                    <p>4. 录音时长不足1秒会自动取消</p>
                    <p>5. 录音超过最大时长会自动停止</p>
                    <p>6. 移出按钮区域会取消录音</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Recorder, Toast, Navbar } from '../../../packages/src/index.js';
import { Button as VanButton, Icon as VanIcon } from 'vant';

const recordings = ref([]);

const handleStart = () => {
    console.log('开始录音');
};

const handleStop = ({ duration }) => {
    console.log('停止录音', duration);
};

const handleCancel = ({ reason }) => {
    if (reason === 'too-short') {
        Toast.error('录音时间太短');
    } else if (reason === 'permission-denied') {
        Toast.error('麦克风权限被拒绝');
    } else {
        Toast('已取消录音');
    }
};

const handleComplete = ({ blob, duration }) => {
    console.log('录音完成', blob, duration);
    recordings.value.push({
        blob,
        duration,
        url: URL.createObjectURL(blob)
    });
    Toast.success(`录音成功 ${duration}秒`);
};

const playRecording = (recording) => {
    const audio = new Audio(recording.url);
    audio.play();
    Toast('播放录音');
};
</script>

<style scoped>
.demo-page {
    min-height: 100vh;
    background-color: #f7f8fa;
    overflow-y: auto;
}

.demo-container {
    padding: 56px 20px 20px;
    max-height: calc(100vh - 56px);
    overflow-y: auto;
}

.demo-section {
    margin-bottom: 32px;
}

.demo-section h3 {
    margin-bottom: 12px;
    font-size: 16px;
    color: #323233;
}

.tip {
    font-size: 14px;
    color: #969799;
    margin-bottom: 12px;
}

.no-recordings {
    padding: 32px;
    text-align: center;
    color: #969799;
    background-color: #f7f8fa;
    border-radius: 8px;
}

.recordings-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recording-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background-color: #f7f8fa;
    border-radius: 8px;
}

.recording-item .van-icon {
    font-size: 20px;
    color: #1989fa;
}

.recording-item span {
    flex: 1;
    font-size: 14px;
    color: #323233;
}

.recording-item .duration {
    flex: none;
    color: #969799;
}

.instructions {
    padding: 16px;
    background-color: #fff3cd;
    border-radius: 8px;
    border: 1px solid #ffc107;
}

.instructions p {
    font-size: 14px;
    color: #856404;
    line-height: 1.8;
    margin: 0;
}
</style>
