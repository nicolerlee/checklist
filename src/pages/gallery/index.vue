<template>
  <view class="container">
    <!-- 头部区域 -->
    <view class="header">
      <view class="header-content">
        <view class="title-row">
          <text class="title">推荐</text>
          <view class="title-accent"></view>
        </view>
      </view>
    </view>

    <!-- 作品列表 - 单列大卡片布局 -->
    <scroll-view class="gallery-list" scroll-y>
      <view class="list-container">
        <view
          v-for="(item, index) in galleryItems"
          :key="item.id"
          class="gallery-card"
          :style="{ animationDelay: index * 0.06 + 's' }"
          @click="selectGallery(item)"
        >
          <!-- 预览图片 -->
          <view class="card-image-wrapper">
            <image
              class="card-image"
              :src="item.previewImage"
              mode="aspectFit"
              :lazy-load="false"
              @error="handleImageError($event, item)"
            />
            <view class="image-gradient"></view>
            <view class="image-overlay">
              <text class="overlay-emoji">{{ item.emoji }}</text>
            </view>
          </view>

          <!-- 卡片内容 -->
          <view class="card-content">
            <view class="card-header">
              <text class="card-title">{{ item.title }}</text>
              <view class="card-emoji-small">
                <text class="emoji-small">{{ item.emoji }}</text>
              </view>
            </view>
            <text class="card-desc">{{ item.description }}</text>
            <view class="card-footer">
              <text class="card-action">制作同款 →</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllGallery } from '../../data/gallery.js'

const galleryItems = ref([])

onMounted(() => {
  // 加载所有作品（也可以只加载精选作品）
  galleryItems.value = getAllGallery()
  console.log('作品集加载完成，共', galleryItems.value.length, '个作品')
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


/* 作品列表 - 单列大卡片布局 */
.gallery-list {
  flex: 1;
  height: calc(100vh - 180rpx);
  position: relative;
  background: transparent;
  padding-bottom: env(safe-area-inset-bottom);
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 0 30rpx 40rpx;
}

/* 作品卡片 - 大卡片横向布局 */
.gallery-card {
  background: #ffffff;
  border-radius: 28rpx;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInLeft 0.6s ease-out both;
  border: 1rpx solid rgba(212, 165, 116, 0.1);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 380rpx;
  padding: 20rpx;
  position: relative;
  align-items: stretch;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.gallery-card:active {
  transform: translateX(4rpx) scale(0.99);
  box-shadow: 0 12rpx 40rpx rgba(212, 165, 116, 0.18);
  border-color: rgba(212, 165, 116, 0.25);
}

/* 预览图片区域 - 横向布局左侧 */
.card-image-wrapper {
  position: relative;
  width: 260rpx;
  min-width: 260rpx;
  height: 380rpx;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f1e8 0%, #e8e0d0 100%);
  flex-shrink: 0;
  align-self: center;
}

.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  z-index: 1;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  z-index: 2;
}

.overlay-emoji {
  font-size: 32rpx;
  line-height: 1;
}

/* 卡片内容 - 右侧信息区域 */
.card-content {
  flex: 1;
  padding: 32rpx 28rpx 28rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.card-title {
  font-size: 36rpx;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5rpx;
  line-height: 1.3;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-emoji-small {
  width: 56rpx;
  height: 56rpx;
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(201, 160, 104, 0.15) 100%);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.emoji-small {
  font-size: 32rpx;
  line-height: 1;
}

.card-desc {
  font-size: 28rpx;
  color: #6b7280;
  line-height: 1.6;
  font-weight: 400;
  margin-bottom: 24rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.card-action {
  font-size: 26rpx;
  color: #d4a574;
  font-weight: 600;
  letter-spacing: 0.5rpx;
}
</style>

