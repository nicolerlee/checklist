<template>
  <view class="container">
    <view class="header">
      <text class="title">足迹</text>
      <text class="subtitle">选择一个模板开始记录你的足迹</text>
    </view>

    <view class="theme-list">
      <theme-card
        v-for="(theme, index) in themes"
        :key="theme.id"
        :theme="theme"
        :style="{ animationDelay: index * 0.1 + 's' }"
        @select="selectTheme(theme)"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import ThemeCard from '../../components/theme-card/theme-card.vue'

// 导入清单主题
import lifeCompleted from '../../data/checklists/life-completed.js'
import foodMemories from '../../data/checklists/food-memories.js'
import travelStories from '../../data/checklists/travel-stories.js'
import workGrowth from '../../data/checklists/work-growth.js'
import artLife from '../../data/checklists/art-life.js'
import dailyTexture from '../../data/checklists/daily-texture.js'
import smallHappiness from '../../data/checklists/small-happiness.js'
import movies from '../../data/checklists/movies.js'

const themes = ref([
  lifeCompleted,
  foodMemories,
  travelStories,
  workGrowth,
  artLife,
  dailyTexture,
  smallHappiness,
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
  background-color: #f8f8f8;
  padding-bottom: 20rpx;
}

.header {
  padding: 40rpx 30rpx 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
}

.theme-list {
  padding: 0 30rpx;
}

</style>
