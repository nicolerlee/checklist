<template>
  <view class="container">
    <!-- 标题 -->
    <view class="title-section">
      <text class="title">{{ theme.emoji }} {{ theme.name }}</text>
    </view>

    <!-- 标签云列表 -->
    <view class="tags-section">
      <view
        v-for="(item, index) in items"
        :key="index"
        class="tag-item"
        :class="{ checked: item.checked }"
        :style="{
          backgroundColor: item.checked ? getTagColor(index) : '#f8f8f8',
          borderColor: item.checked ? getTagColor(index) : '#e0e0e0',
          color: item.checked ? '#fff' : '#999',
          animationDelay: index * 0.02 + 's'
        }"
        @click="toggleItem(index)"
      >
        <text class="tag-text">{{ item.text }}</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  theme: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle'])

const tagColor = '#1890ff' // 统一的蓝色

const checkedCount = computed(() => {
  return props.items.filter(item => item.checked).length
})

const toggleItem = (index) => {
  emit('toggle', index)
}

const getTagColor = (index) => {
  return tagColor
}

// 绘制Canvas的方法，供父组件调用
const drawCanvas = (ctx, canvas, config) => {
  const { width, height, padding = 60 } = config
  
  // 背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  
  let y = padding + 40
  
  // 标题
  ctx.fillStyle = '#333333'
  ctx.font = 'bold 44px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(props.theme.name, width / 2, y)
  y += 100
  
  // 标签云 - 显示所有项目
  ctx.font = '22px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  
  let x = padding
  const tagHeight = 44
  const tagPadding = 18
  const tagMargin = 4
  
  props.items.forEach((item, index) => {
    const tagColor = getTagColor(index)
    const tagText = item.text
    const tagWidth = ctx.measureText(tagText).width + tagPadding * 2
    
    // 检查是否需要换行
    if (x + tagWidth > width - padding) {
      x = padding
      y += tagHeight + tagMargin
    }
    
    if (item.checked) {
      // 已勾选：彩色背景
      ctx.fillStyle = tagColor
      ctx.fillRect(x, y - tagHeight / 2, tagWidth, tagHeight)
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 22px sans-serif'
    } else {
      // 未勾选：透明背景，灰色文字
      ctx.strokeStyle = 'transparent'
      ctx.fillStyle = '#999'
      ctx.globalAlpha = 0.6
      ctx.font = '22px sans-serif'
    }
    
    ctx.fillText(tagText, x + tagPadding, y)
    ctx.globalAlpha = 1
    
    x += tagWidth + tagMargin
  })
}

// 暴露方法供父组件调用
defineExpose({
  drawCanvas
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 30rpx;
}

/* 标题 */
.title-section {
  margin-bottom: 40rpx;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
  display: block;
}

/* 标签云样式 */
.tags-section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 12rpx 4rpx;
  margin-bottom: 40rpx;
}

.tag-item {
  padding: 10rpx 18rpx;
  border-radius: 18rpx;
  border: 2rpx solid;
  font-size: 22rpx;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  margin: 0;
  min-width: 80rpx;
  text-align: center;
  height: 44rpx;
  line-height: 44rpx;
}

.tag-item.checked {
  transform: scale(1.05);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  font-weight: bold;
}

.tag-item:not(.checked) {
  opacity: 0.6;
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.tag-text {
  white-space: nowrap;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>
