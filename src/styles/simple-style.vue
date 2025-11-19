<template>
  <view class="container">
    <!-- 标题 -->
    <view class="title-section">
      <text class="title">{{ theme.emoji }} {{ theme.name }}</text>
    </view>

    <!-- 清单项列表 -->
    <view class="items-section">
      <view
        v-for="(item, index) in items"
        :key="index"
        class="item-wrapper"
        :style="{ animationDelay: index * 0.05 + 's' }"
        @click="toggleItem(index)"
      >
        <view class="item-content">
          <view class="checkbox" :class="{ checked: item.checked }">
            <text v-if="item.checked" class="check-icon">✓</text>
          </view>
          <text class="item-text" :class="{ checked: item.checked }">
            {{ item.text }}
          </text>
        </view>
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

const checkedCount = computed(() => {
  return props.items.filter(item => item.checked).length
})

const toggleItem = (index) => {
  emit('toggle', index)
}

// 绘制Canvas的方法，供父组件调用
const drawCanvas = (ctx, canvas, config) => {
  const { width, height, padding = 60 } = config
  
  // 背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, width, height)
  
  let y = padding + 40
  
  // 标题
  ctx.fillStyle = '#2c3e50'
  ctx.font = '300 46px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(props.theme.name, width / 2, y)
  y += 100
  
  // 清单项 - 显示所有项目
  ctx.textAlign = 'left'
  ctx.font = '300 32px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textBaseline = 'middle'
  
  props.items.forEach((item, index) => {
    const checkboxSize = 44
    const checkboxX = padding
    const checkboxY = y - checkboxSize / 2
    
    if (item.checked) {
      // 已勾选：蓝色填充
      ctx.fillStyle = '#3498db'
      ctx.fillRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
      
      // 对勾
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(checkboxX + 10, checkboxY + 22)
      ctx.lineTo(checkboxX + 18, checkboxY + 30)
      ctx.lineTo(checkboxX + 34, checkboxY + 14)
      ctx.stroke()
      
      ctx.fillStyle = '#2c3e50'
    } else {
      // 未勾选：蓝色边框
      ctx.strokeStyle = '#3498db'
      ctx.lineWidth = 3
      ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
      
      ctx.fillStyle = '#2c3e50'
      ctx.globalAlpha = 0.7
    }
    
    ctx.fillText(item.text, checkboxX + checkboxSize + 24, y)
    ctx.globalAlpha = 1
    
    y += 75
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
  background-color: #f8f9fa;
  padding: 30rpx;
}

/* 标题 - 简约现代风 */
.title-section {
  margin-bottom: 50rpx;
}

.title {
  font-size: 46rpx;
  font-weight: 300;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2c3e50;
  text-align: center;
  display: block;
  letter-spacing: 3rpx;
}

/* 清单项 */
.items-section {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  margin-bottom: 40rpx;
}

.item-wrapper {
  animation: slideIn 0.3s ease-out;
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

.item-content {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx 0;
  transition: all 0.3s ease;
}

.item-content:active {
  transform: scale(0.98);
}

.checkbox {
  width: 44rpx;
  height: 44rpx;
  border: 3rpx solid #3498db;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background-color: #3498db;
  transform: scale(1.1);
}

.check-icon {
  color: #fff;
  font-size: 24rpx;
  font-weight: bold;
}

.item-text {
  flex: 1;
  font-size: 32rpx;
  font-weight: 300;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2c3e50;
  transition: all 0.3s ease;
  line-height: 1.5;
  letter-spacing: 1rpx;
}

.item-text.checked {
  opacity: 0.7;
}

</style>
