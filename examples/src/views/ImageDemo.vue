<template>
  <Chat ref="chatRef">
    <template #navbar>
      <van-nav-bar title="Image 图片" left-arrow fixed @click-left="goBack" />
    </template>

    <template #default>
      <!-- 代码演示 -->
      <div class="demo-section">
        <div class="section-title">代码演示</div>
      </div>

      <!-- 基础用法 -->
      <div class="demo-section">
        <div class="section-title">基础用法</div>
        <Flex gap="16px" wrap="wrap">
          <Image :src="photo1" width="100" height="100" />
          <Image :src="photo2" width="100" height="100" />
        </Flex>
      </div>

      <!-- 图片适配 -->
      <div class="demo-section">
        <div class="section-title">图片适配 - fill</div>
        <Image :src="photo1" width="100%" height="200" fit="fill" />
      </div>

      <div class="demo-section">
        <div class="section-title">图片适配 - contain</div>
        <Image :src="photo1" width="100%" height="200" fit="contain" />
      </div>

      <div class="demo-section">
        <div class="section-title">图片适配 - cover</div>
        <Image :src="photo1" width="100%" height="200" fit="cover" />
      </div>

      <div class="demo-section">
        <div class="section-title">图片适配 - none</div>
        <Image :src="photo1" width="100%" height="200" fit="none" />
      </div>

      <div class="demo-section">
        <div class="section-title">图片适配 - scale-down</div>
        <Image :src="photo1" width="100%" height="200" fit="scale-down" />
      </div>

      <!-- 圆形图片 -->
      <div class="demo-section">
        <div class="section-title">圆形图片</div>
        <Flex gap="16px">
          <Image :src="photo1" width="100" height="100" round />
          <Image :src="photo2" width="100" height="100" round />
        </Flex>
      </div>

      <!-- 圆角大小 -->
      <div class="demo-section">
        <div class="section-title">圆角大小</div>
        <Flex gap="16px" wrap="wrap">
          <div class="radius-item">
            <Image :src="photo1" width="100" height="100" :radius="0" />
            <div class="radius-label">默认</div>
          </div>
          <div class="radius-item">
            <Image :src="photo1" width="100" height="100" :radius="4" />
            <div class="radius-label">4px</div>
          </div>
          <div class="radius-item">
            <Image :src="photo1" width="100" height="100" :radius="8" />
            <div class="radius-label">8px</div>
          </div>
          <div class="radius-item">
            <Image :src="photo1" width="100" height="100" :radius="16" />
            <div class="radius-label">16px</div>
          </div>
        </Flex>
      </div>

      <!-- 懒加载 -->
      <div class="demo-section">
        <div class="section-title">懒加载</div>
        <Flex direction="column" gap="16px">
          <Image
            v-for="n in 5"
            :key="n"
            :src="`${photo1}?v=${n}`"
            width="100%"
            height="200"
            lazy
            fit="cover"
          />
        </Flex>
      </div>

      <!-- 加载失败 -->
      <div class="demo-section">
        <div class="section-title">加载失败</div>
        <Flex gap="16px">
          <Image
            src="https://invalid-url.com/image.jpg"
            width="100"
            height="100"
          />
          <Image
            src="https://invalid-url.com/image2.jpg"
            width="100"
            height="100"
            round
          />
        </Flex>
      </div>

      <!-- 自定义占位 -->
      <div class="demo-section">
        <div class="section-title">自定义占位</div>
        <Flex gap="16px">
          <Image
            src="https://invalid-url.com/image.jpg"
            width="100"
            height="100"
          >
            <template #error>
              <Flex
                direction="column"
                align="center"
                justify="center"
                style="height: 100%; background: #f7f8fa"
              >
                <div style="font-size: 24px">😢</div>
                <div style="font-size: 12px; color: #969799; margin-top: 4px">
                  加载失败
                </div>
              </Flex>
            </template>
          </Image>
          <Image :src="slowImage" width="100" height="100">
            <template #loading>
              <Flex
                align="center"
                justify="center"
                style="
                  height: 100%;
                  background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
                "
              >
                <van-loading type="spinner" size="20" color="#ff9a62" />
              </Flex>
            </template>
          </Image>
        </Flex>
      </div>

      <!-- 实际应用 -->
      <div class="demo-section">
        <div class="section-title">实际应用 - 用户头像</div>
        <Flex gap="12px" align="center">
          <Image :src="photo1" width="48" height="48" round />
          <div>
            <div style="font-size: 16px; font-weight: 600; color: #323233">
              用户名
            </div>
            <div style="font-size: 12px; color: #969799; margin-top: 4px">
              这是一段个性签名...
            </div>
          </div>
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 图片列表</div>
        <Flex gap="8px" wrap="wrap">
          <Image
            v-for="n in 6"
            :key="n"
            :src="n % 2 === 0 ? photo1 : photo2"
            width="calc(33.33% - 6px)"
            height="100"
            fit="cover"
            :radius="8"
          />
        </Flex>
      </div>

      <div class="demo-section">
        <div class="section-title">实际应用 - 卡片封面</div>
        <div class="demo-card">
          <Image :src="photo2" width="100%" height="160" fit="cover" />
          <div class="demo-card-content">
            <div class="demo-card-title">卡片标题</div>
            <div class="demo-card-desc">
              这是卡片的描述信息，可以是任何内容...
            </div>
            <Flex gap="8px" style="margin-top: 12px">
              <Button text="查看" type="primary" size="sm" block />
              <Button text="分享" type="default" size="sm" block />
            </Flex>
          </div>
        </div>
      </div>
    </template>
  </Chat>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Chat, Image, Flex, Button } from "../../../packages/src/index.js";

const router = useRouter();
const chatRef = ref(null);

// 示例图片
const photo1 = "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg";
const photo2 = "https://fastly.jsdelivr.net/npm/@vant/assets/logo.png";
const slowImage = "https://via.placeholder.com/100/ffd89b/ffffff?text=Loading";

const goBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.demo-section {
  padding: 16px;
  background: #f7f8fa;
  margin-bottom: 8px;
}

.section-title {
  font-size: 14px;
  color: #969799;
  margin-bottom: 12px;
}

.radius-item {
  text-align: center;
}

.radius-label {
  font-size: 12px;
  color: #646566;
  margin-top: 8px;
}

.demo-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.demo-card-content {
  padding: 16px;
}

.demo-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 8px;
}

.demo-card-desc {
  font-size: 14px;
  color: #646566;
  line-height: 1.6;
}
</style>
