<template>
  <view class="container">
    <!-- 头部封面区域 -->
    <view class="header-cover">
      <image 
        class="cover-image" 
        src="@/static/images/life-footprints.png" 
        mode="aspectFill"
      />
      <view class="header-content">
        <view class="title-row">
          <text class="title">足迹</text>
          <view class="title-accent"></view>
        </view>
        <text class="subtitle">收藏时光的碎片</text>
      </view>
    </view>

    <!-- 主题列表 -->
    <scroll-view class="theme-list" scroll-y>
      <view class="theme-list-content">
        <theme-card
          v-for="(theme, index) in themes"
          :key="theme.id"
          :theme="theme"
          :index="index"
          :animation-delay="index * 0.05 + 's'"
          @select="selectTheme(theme)"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import ThemeCard from '../../components/theme-card/theme-card.vue'

// 导入清单主题

import life100 from '../../data/checklists/life-100.js'
import smallHappiness from '../../data/checklists/small-happiness.js'
import smallThing from '../../data/checklists/small-thing.js'
import foodMemories from '../../data/checklists/food-memories.js'
import travelStories from '../../data/checklists/travel-stories.js'
import workGrowth from '../../data/checklists/work-growth.js'
import artLife from '../../data/checklists/art-life.js'
import dailyTexture from '../../data/checklists/daily-texture.js'
import movies from '../../data/checklists/movies.js'

const themes = ref([
 
  life100,
  smallHappiness,
  smallThing,
  foodMemories,
  travelStories,
  workGrowth,
  artLife,
  dailyTexture,
  movies
])

const selectTheme = (theme) => {
  uni.navigateTo({
    url: `/pages/checklist/index?themeId=${theme.id}&styleId=${theme.defaultStyle}`
  })
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

/* 头部封面区域 */
.header-cover {
  position: relative;
  width: calc(100% - 60rpx);
  height: 360rpx;
  margin: 0 auto;
  border-radius: 0 0 32rpx 32rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}


.header-content {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  padding: 30rpx;
  text-align: right;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.title {
  font-size: 56rpx;
  font-weight: 900;
  color: #8b6914;
  letter-spacing: -1rpx;
  line-height: 1.1;
  text-shadow: 0 2rpx 8rpx rgba(255, 255, 255, 0.8);
}

.title-accent {
  width: 6rpx;
  height: 56rpx;
  background: rgba(139, 105, 20, 0.4);
  border-radius: 3rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #8b6914;
  font-weight: 500;
  letter-spacing: 0.5rpx;
  text-shadow: 0 1rpx 4rpx rgba(255, 255, 255, 0.8);
}

/* 主题列表 */
.theme-list {
  flex: 1;
  height: calc(100vh - 360rpx);
  position: relative;
  background: transparent;
}

.theme-list-content {
  padding: 24rpx 30rpx 40rpx;
  background: transparent;
}

</style>
