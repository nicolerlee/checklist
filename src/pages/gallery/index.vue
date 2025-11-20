<template>
  <view class="container">
    <!-- 头部区域 -->
    <view class="header">
      <view class="header-content">
        <view class="title-row">
          <text class="title">推荐</text>
        </view>
      </view>
    </view>

    <!-- 作品列表 - 瀑布流布局 -->
    <scroll-view class="gallery-list" scroll-y>
      <view class="waterfall-container">
        <view class="waterfall-column">
          <view
            v-for="(item, index) in leftColumnItems"
            :key="item.id"
            class="gallery-card"
            :class="'card-height-' + (index % 3)"
            :style="{ animationDelay: index * 0.1 + 's' }"
            @click="selectGallery(item)"
          >
            <!-- 预览图片 -->
            <view class="card-image-wrapper">
              <image
                class="card-image"
                :src="item.previewImage"
                mode="aspectFill"
                :lazy-load="false"
                @error="handleImageError($event, item)"
              />
              <view class="image-overlay">
                <text class="overlay-emoji">{{ item.emoji }}</text>
              </view>
            </view>

            <!-- 卡片内容 -->
            <view class="card-content">
              <view class="card-title-row">
                <text class="card-title">{{ item.title }}</text>
                <text class="card-action-text">做同款</text>
              </view>
            </view>
          </view>
        </view>
        
        <view class="waterfall-column">
          <view
            v-for="(item, index) in rightColumnItems"
            :key="item.id"
            class="gallery-card"
            :class="'card-height-' + ((index + 1) % 3)"
            :style="{ animationDelay: (index + 0.5) * 0.1 + 's' }"
            @click="selectGallery(item)"
          >
            <!-- 预览图片 -->
            <view class="card-image-wrapper">
              <image
                class="card-image"
                :src="item.previewImage"
                mode="aspectFill"
                :lazy-load="false"
                @error="handleImageError($event, item)"
              />
              <view class="image-overlay">
                <text class="overlay-emoji">{{ item.emoji }}</text>
              </view>
            </view>

            <!-- 卡片内容 -->
            <view class="card-content">
              <view class="card-title-row">
                <text class="card-title">{{ item.title }}</text>
                <text class="card-action-text">做同款</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllGallery } from '../../data/gallery.js'

const galleryItems = ref([])

onMounted(() => {
  // 加载所有作品（也可以只加载精选作品）
  galleryItems.value = getAllGallery()
  console.log('作品集加载完成，共', galleryItems.value.length, '个作品')
})

// 瀑布流：将作品分配到左右两列
const leftColumnItems = computed(() => {
  return galleryItems.value.filter((_, index) => index % 2 === 0)
})

const rightColumnItems = computed(() => {
  return galleryItems.value.filter((_, index) => index % 2 === 1)
})

const selectGallery = (item) => {
  // 跳转到 checklist 页面，传递 themeId 和 styleId
  uni.navigateTo({
    url: `/pages/checklist/index?themeId=${item.themeId}&styleId=${item.styleId}`,
    success: () => {
      console.log('跳转到作品：', item.title, '主题：', item.themeId, '样式：', item.styleId)
    },
    fail: (err) => {
      console.error('跳转失败：', err)
      uni.showToast({
        title: '跳转失败',
        icon: 'none'
      })
    }
  })
}

const handleImageError = (e, item) => {
  console.error('图片加载失败：', item.previewImage, e)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%);
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

/* 头部区域 */
.header {
  position: relative;
  width: 100%;
  padding: 50rpx 30rpx 32rpx;
  background: transparent;
}

.header-content {
  position: relative;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.title {
  font-size: 56rpx;
  font-weight: 900;
  color: #8b6914;
  letter-spacing: -1rpx;
  line-height: 1.1;
}

.title-accent {
  width: 6rpx;
  height: 56rpx;
  background: rgba(139, 105, 20, 0.4);
  border-radius: 3rpx;
}


/* 作品列表 - 瀑布流布局 */
.gallery-list {
  flex: 1;
  height: calc(100vh - 180rpx);
  position: relative;
  background: transparent;
  padding-bottom: env(safe-area-inset-bottom);
}

.waterfall-container {
  display: flex;
  gap: 20rpx;
  padding: 0 30rpx 40rpx;
  align-items: flex-start;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

/* 作品卡片 - 瀑布流垂直布局 */
.gallery-card {
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out both;
  border: 1rpx solid rgba(212, 165, 116, 0.12);
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  width: 100%;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gallery-card:active {
  transform: translateY(-4rpx) scale(0.98);
  box-shadow: 0 12rpx 32rpx rgba(212, 165, 116, 0.2);
  border-color: rgba(212, 165, 116, 0.35);
}

/* 预览图片区域 - 瀑布流不同高度 */
.card-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f1e8 0%, #e8e0d0 100%);
}

/* 不同卡片高度的图片区域 - 增强错落感 */
.card-height-0 .card-image-wrapper {
  height: 360rpx;
}

.card-height-1 .card-image-wrapper {
  height: 560rpx;
}

.card-height-2 .card-image-wrapper {
  height: 440rpx;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
}

.image-overlay {
  position: absolute;
  bottom: 20rpx;
  left: 20rpx;
  width: 72rpx;
  height: 72rpx;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  z-index: 2;
}

.overlay-emoji {
  font-size: 36rpx;
  line-height: 1;
}

/* 卡片内容 */
.card-content {
  padding: 24rpx 20rpx 20rpx;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.card-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.3rpx;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-action-text {
  font-size: 22rpx;
  color: #d4a574;
  font-weight: 500;
  letter-spacing: 0.3rpx;
  flex-shrink: 0;
  position: relative;
}

.card-action-text::after {
  content: '→';
  margin-left: 4rpx;
  font-size: 18rpx;
  color: #d4a574;
  transition: transform 0.3s ease;
}
</style>

