<template>
  <div class="breathing-guide">
    <div class="circle-container" :class="currentPhase">
      <div class="outer-ring"></div>
      <div class="breathing-circle" :style="{ transform: `scale(${scale})` }">
        <div class="status-text">{{ statusText }}</div>
        <div class="timer" v-if="isActive">{{ timeLeft }}s</div>
      </div>
    </div>

    <div class="controls">
      <div class="description" v-if="!isActive">
        <h3>4-7-8 呼吸法</h3>
        <p>吸气 4秒 · 屏气 7秒 · 呼气 8秒</p>
        <p class="sub-text">帮助快速通过放松身心，减轻焦虑</p>
      </div>

      <van-button
        round
        block
        type="primary"
        size="large"
        class="action-btn"
        :color="isActive ? '#ff6b6b' : '#22c55e'"
        @click="toggleTraining"
      >
        {{ isActive ? "停止训练" : "开始训练" }}
      </van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BreathingGuide",
  data() {
    return {
      isActive: false,
      currentPhase: "idle", // idle, inhale, hold, exhale
      statusText: "准备",
      timeLeft: 0,
      scale: 1,
      timer: null,
      phaseTimer: null,
    };
  },
  beforeUnmount() {
    this.stopTraining();
  },
  methods: {
    toggleTraining() {
      if (this.isActive) {
        this.stopTraining();
      } else {
        this.startTraining();
      }
    },
    startTraining() {
      this.isActive = true;
      this.runCycle();
    },
    stopTraining() {
      this.isActive = false;
      this.currentPhase = "idle";
      this.statusText = "准备";
      this.scale = 1;
      this.timeLeft = 0;
      clearTimeout(this.timer);
      clearInterval(this.phaseTimer);
    },
    runCycle() {
      if (!this.isActive) return;

      // 1. Inhale (4s)
      this.setPhase("inhale", "吸气", 4, 1.5);

      this.timer = setTimeout(() => {
        if (!this.isActive) return;

        // 2. Hold (7s)
        this.setPhase("hold", "屏气", 7, 1.5);

        this.timer = setTimeout(() => {
          if (!this.isActive) return;

          // 3. Exhale (8s)
          this.setPhase("exhale", "呼气", 8, 1.0);

          this.timer = setTimeout(() => {
            if (!this.isActive) return;
            this.runCycle(); // Loop
          }, 8000);
        }, 7000);
      }, 4000);
    },
    setPhase(phase, text, duration, targetScale) {
      this.currentPhase = phase;
      this.statusText = text;
      this.timeLeft = duration;
      this.scale = targetScale;

      // Countdown timer for visualization
      clearInterval(this.phaseTimer);
      this.phaseTimer = setInterval(() => {
        if (this.timeLeft > 1) {
          this.timeLeft--;
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
.breathing-guide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  height: 100%;
}

.circle-container {
  position: relative;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
}

.outer-ring {
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 2px dashed #e2e8f0;
  pointer-events: none;
}

.breathing-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a7f3d0 0%, #34d399 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 10px 30px -10px rgba(52, 211, 153, 0.6);
  transition: transform 4s ease-in-out, background-color 0.5s;
  z-index: 10;
}

.status-text {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.timer {
  font-size: 32px;
  font-weight: 700;
  font-family: monospace;
}

/* Phase Styles */
.circle-container.inhale .breathing-circle {
  /* 4s ease-out for inhale */
  transition: transform 4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.6);
}

.circle-container.hold .breathing-circle {
  /* No transform change during hold, keeps scale */
  transition: transform 0.1s;
  background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%);
  box-shadow: 0 10px 40px -10px rgba(245, 158, 11, 0.6);
}

.circle-container.exhale .breathing-circle {
  /* 8s ease-in-out for exhale */
  transition: transform 8s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #a7f3d0 0%, #34d399 100%);
  box-shadow: 0 10px 30px -10px rgba(52, 211, 153, 0.6);
}

.controls {
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.description {
  margin-bottom: 30px;
}

.description h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 8px;
}

.description p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 4px;
}

.description .sub-text {
  font-size: 12px;
  color: #94a3b8;
}

.action-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
