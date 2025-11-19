<template>
  <view 
    class="theme-card" 
    :style="{ animationDelay: animationDelay }"
    @click="$emit('select')"
  >
    <view class="card-gradient"></view>
    <view class="card-content">
      <view class="card-header">
        <view class="emoji-wrapper">
          <view class="emoji-bg"></view>
          <text class="emoji">{{ theme.emoji }}</text>
        </view>
        <view class="card-info">
          <text class="theme-name">{{ theme.name }}</text>
          <text class="theme-desc">{{ theme.description }}</text>
        </view>
      </view>
      
      <view class="divider"></view>
      
      <view class="preview-items">
        <view
          v-for="(item, idx) in theme.items.slice(0, 3)"
          :key="idx"
          class="preview-item"
        >
          <view class="item-bullet"></view>
          <text class="item-text">{{ item }}</text>
        </view>
        <view v-if="theme.items.length > 3" class="more-items">
          <text class="more-text">还有 {{ theme.items.length - 3 }} 项</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  theme: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  },
  animationDelay: {
    type: String,
    default: '0s'
  }
})

const emit = defineEmits(['select'])
</script>

<style scoped>
.theme-card {
  position: relative;
  background: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out both;
  border: 1rpx solid rgba(212, 165, 116, 0.2);
  box-shadow: 0 4rpx 20rpx rgba(212, 165, 116, 0.08);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40rpx) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.theme-card:active {
  transform: translateY(-2rpx) scale(0.99);
  box-shadow: 0 12rpx 40rpx rgba(212, 165, 116, 0.2);
}

.card-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: linear-gradient(90deg, #d4a574 0%, #c9a068 50%, #b8956a 100%);
}

.card-content {
  padding: 36rpx;
  position: relative;
  z-index: 1;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.emoji-wrapper {
  position: relative;
  width: 96rpx;
  height: 96rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #d4a574 0%, #c9a068 100%);
  border-radius: 22rpx;
  opacity: 0.15;
}

.emoji {
  font-size: 52rpx;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  min-width: 0;
  padding-top: 4rpx;
}

.theme-name {
  font-size: 36rpx;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5rpx;
  line-height: 1.25;
}

.theme-desc {
  font-size: 26rpx;
  color: #64748b;
  line-height: 1.5;
  font-weight: 400;
}

.divider {
  height: 1rpx;
  background: linear-gradient(90deg, transparent 0%, rgba(212, 165, 116, 0.3) 50%, transparent 100%);
  margin: 0 0 28rpx 0;
}

.preview-items {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.preview-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.item-bullet {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4a574 0%, #c9a068 100%);
  margin-top: 12rpx;
  flex-shrink: 0;
  box-shadow: 0 2rpx 6rpx rgba(212, 165, 116, 0.4);
}

.item-text {
  font-size: 28rpx;
  color: #334155;
  line-height: 1.6;
  flex: 1;
  font-weight: 400;
}

.more-items {
  margin-top: 8rpx;
  padding-left: 24rpx;
}

.more-text {
  font-size: 24rpx;
  color: #94a3b8;
  font-weight: 400;
}
</style>
