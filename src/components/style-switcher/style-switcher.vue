<template>
  <view class="style-switcher">
    <view class="switcher-header">
      <text class="switcher-title">选择风格</text>
    </view>
    <view class="style-options">
      <view
        v-for="style in availableStyles"
        :key="style.id"
        class="style-option"
        :class="{ active: currentStyleId === style.id }"
        @click="selectStyle(style.id)"
      >
        <view 
          class="style-preview"
          :style="{ backgroundColor: style.colors.background }"
        >
          <view 
            class="preview-text"
            :style="{ 
              color: style.colors.title,
              fontSize: style.fonts.titleSize / 2 + 'rpx',
              fontWeight: style.fonts.titleWeight
            }"
          >
            Aa
          </view>
        </view>
        <text class="style-name">{{ style.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  currentStyleId: {
    type: String,
    required: true
  },
  availableStyles: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['styleChange'])

const selectStyle = (styleId) => {
  emit('styleChange', styleId)
}
</script>

<style scoped>
.style-switcher {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.switcher-header {
  margin-bottom: 20rpx;
}

.switcher-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.style-options {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: all 0.3s ease;
}

.style-option:active {
  transform: scale(0.95);
}

.style-preview {
  width: 120rpx;
  height: 80rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid transparent;
  transition: all 0.3s ease;
}

.style-option.active .style-preview {
  border-color: #4a90e2;
  transform: scale(1.05);
}

.preview-text {
  font-size: 32rpx;
  font-weight: bold;
}

.style-name {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}

.style-option.active .style-name {
  color: #4a90e2;
  font-weight: bold;
}
</style>
