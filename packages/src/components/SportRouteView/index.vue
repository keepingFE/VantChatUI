<template>
  <div class="sport-route-view">
    <div class="map-container">
      <!-- 模拟地图背景 -->
      <svg class="route-svg" viewBox="0 0 300 200">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #3b82f6; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #ef4444; stop-opacity: 1" />
          </linearGradient>
        </defs>

        <!-- 简单的网格背景 -->
        <line x1="0" y1="50" x2="300" y2="50" stroke="#f0f0f0" />
        <line x1="0" y1="100" x2="300" y2="100" stroke="#f0f0f0" />
        <line x1="0" y1="150" x2="300" y2="150" stroke="#f0f0f0" />
        <line x1="100" y1="0" x2="100" y2="200" stroke="#f0f0f0" />
        <line x1="200" y1="0" x2="200" y2="200" stroke="#f0f0f0" />

        <!-- 轨迹路径 (模拟生成的路径) -->
        <path
          d="M 50 150 Q 80 100 120 120 T 180 80 T 250 50"
          fill="none"
          stroke="url(#routeGradient)"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="path-animation"
        />

        <!-- 起点 -->
        <circle
          cx="50"
          cy="150"
          r="6"
          fill="#22c55e"
          stroke="#fff"
          stroke-width="2"
        />
        <!-- 终点 -->
        <circle
          cx="250"
          cy="50"
          r="6"
          fill="#ef4444"
          stroke="#fff"
          stroke-width="2"
        />
      </svg>

      <div class="overlay-info">
        <div class="route-logo">
          <van-icon name="guide-o" size="20" color="#fff" />
        </div>
      </div>
    </div>

    <div class="route-stats">
      <div class="stat-box">
        <div class="val">5.02</div>
        <div class="lbl">距离 (km)</div>
      </div>
      <div class="sep"></div>
      <div class="stat-box">
        <div class="val">28:30</div>
        <div class="lbl">时长</div>
      </div>
      <div class="sep"></div>
      <div class="stat-box">
        <div class="val">5'42"</div>
        <div class="lbl">配速</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SportRouteView",
};
</script>

<style scoped>
.sport-route-view {
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.map-container {
  height: 200px;
  background: #fdfdfd;
  position: relative;
  border-bottom: 1px solid #f5f5f5;
}

.route-svg {
  width: 100%;
  height: 100%;
}

.path-animation {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  animation: dash 3s ease-out forwards;
}

@keyframes dash {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.overlay-info {
  position: absolute;
  top: 12px;
  right: 12px;
}

.route-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.route-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.stat-box {
  text-align: center;
}

.val {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  font-family: monospace;
}

.lbl {
  font-size: 12px;
  color: #999;
}

.sep {
  width: 1px;
  height: 20px;
  background: #eee;
}
</style>
