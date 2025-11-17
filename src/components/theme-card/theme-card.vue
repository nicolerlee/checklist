<template>
  <view class="theme-card" @click="$emit('select')">
    <view class="card-header">
      <text class="emoji">{{ theme.emoji }}</text>
      <view class="card-info">
        <text class="theme-name">{{ theme.name }}</text>
        <text class="theme-desc">{{ theme.description }}</text>
      </view>
      <view class="item-count">
        <text class="count-text">{{ theme.items.length }}项</text>
      </view>
    </view>
    
    <view class="preview-items">
      <text
        v-for="(item, index) in theme.items.slice(0, 3)"
        :key="index"
        class="preview-item"
      >
        {{ item }}
      </text>
      <text v-if="theme.items.length > 3" class="more-items">
        ...还有{{ theme.items.length - 3 }}项
      </text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  theme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.theme-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.theme-card:active {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.emoji {
  font-size: 60rpx;
  line-height: 1;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.theme-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.theme-desc {
  font-size: 26rpx;
  color: #999;
}

.item-count {
  padding: 8rpx 16rpx;
  background-color: #4a90e2;
  border-radius: 8rpx;
}

.count-text {
  font-size: 22rpx;
  color: #fff;
}

.preview-items {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.preview-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.more-items {
  font-size: 24rpx;
  color: #999;
  font-style: italic;
}
</style>
