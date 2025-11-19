<template>
  <view class="container">
    <!-- 胶带装饰 -->
    <view class="tape-decoration"></view>
    
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

    <!-- 感言区域 -->
    <view class="quote-section">
      <text class="quote-text">原来，我已经成为了自己想成为的大人。</text>
    </view>

    <!-- 装饰花 -->
    <view class="decoration-flower">
      <text>🌸</text>
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
  ctx.fillStyle = '#f9f3e8'
  ctx.fillRect(0, 0, width, height)
  
  // 背景纹理（简化版）
  ctx.strokeStyle = 'rgba(139, 105, 20, 0.02)'
  ctx.lineWidth = 1
  for (let i = 0; i < width; i += 20) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + 20, height)
    ctx.stroke()
  }
  
  // 胶带装饰（简化）
  ctx.fillStyle = 'rgba(210, 180, 140, 0.5)'
  ctx.fillRect(width - 200, -20, 120, 40)
  
  let y = padding + 40
  
  // 标题
  ctx.fillStyle = '#8b6914'
  ctx.font = 'normal 42px "KaiTi", "楷体", cursive, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 2
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  ctx.fillText(props.theme.name, width / 2, y)
  ctx.shadowBlur = 0
  y += 100
  
  // 清单项 - 显示所有项目
  ctx.textAlign = 'left'
  ctx.font = 'normal 30px "KaiTi", "楷体", cursive, serif'
  ctx.textBaseline = 'middle'
  
  props.items.forEach((item, index) => {
    const checkboxSize = 40
    const checkboxX = padding
    const checkboxY = y - checkboxSize / 2
    
    if (item.checked) {
      // 已勾选：棕色填充
      ctx.fillStyle = '#8b6914'
      ctx.fillRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
      
      // 对勾
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(checkboxX + 8, checkboxY + 20)
      ctx.lineTo(checkboxX + 16, checkboxY + 28)
      ctx.lineTo(checkboxX + 32, checkboxY + 12)
      ctx.stroke()
      
      ctx.fillStyle = '#8b6914'
    } else {
      // 未勾选：棕色边框
      ctx.strokeStyle = '#8b6914'
      ctx.lineWidth = 4
      ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
      
      ctx.fillStyle = '#8b6914'
      ctx.globalAlpha = 0.7
    }
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.05)'
    ctx.shadowBlur = 1
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.fillText(item.text, checkboxX + checkboxSize + 24, y)
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
    
    y += 60
  })
  
  // 感言
  y += 40
  ctx.fillStyle = '#8b6914'
  ctx.font = 'normal 26px "KaiTi", "楷体", cursive, serif'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.05)'
  ctx.shadowBlur = 1
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  ctx.fillText('原来，我已经成为了自己想成为的大人。', width / 2, y)
  ctx.shadowBlur = 0
  
  // 装饰花
  ctx.font = '60px sans-serif'
  ctx.fillText('🌸', width - 100, height - 200)
}

// 暴露方法供父组件调用
defineExpose({
  drawCanvas
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f9f3e8;
  background-image: 
    repeating-linear-gradient(45deg, transparent, transparent 10rpx, rgba(139, 105, 20, 0.02) 10rpx, rgba(139, 105, 20, 0.02) 20rpx);
  padding: 30rpx;
  position: relative;
}

/* 胶带装饰 */
.tape-decoration {
  position: absolute;
  top: -10rpx;
  right: 80rpx;
  width: 120rpx;
  height: 40rpx;
  background-color: rgba(210, 180, 140, 0.5);
  transform: rotate(5deg);
  border-radius: 2rpx;
  z-index: 10;
}

/* 装饰花 */
.decoration-flower {
  position: absolute;
  bottom: 120rpx;
  right: 40rpx;
  font-size: 60rpx;
  opacity: 0.6;
  pointer-events: none;
}

/* 标题 - 复古手写风 */
.title-section {
  margin-bottom: 50rpx;
}

.title {
  font-size: 42rpx;
  font-weight: normal;
  font-family: "KaiTi", "楷体", cursive, serif;
  color: #8b6914;
  text-align: center;
  display: block;
  letter-spacing: 3rpx;
  text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.1);
}

/* 清单项 */
.items-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
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
  gap: 20rpx;
  padding: 16rpx 0;
  transition: all 0.3s ease;
}

.item-content:active {
  transform: scale(0.98);
}

.checkbox {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #8b6914;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.checkbox.checked {
  background-color: #8b6914;
  transform: scale(1.1);
}

.check-icon {
  color: #fff;
  font-size: 22rpx;
  font-weight: bold;
}

.item-text {
  flex: 1;
  font-size: 30rpx;
  font-weight: normal;
  font-family: "KaiTi", "楷体", cursive, serif;
  color: #8b6914;
  transition: all 0.3s ease;
  line-height: 1.6;
  letter-spacing: 1rpx;
  text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.05);
}

.item-text.checked {
  opacity: 0.7;
}

/* 感言区域 */
.quote-section {
  margin-top: 50rpx;
  margin-bottom: 40rpx;
  padding: 24rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 12rpx;
}

.quote-text {
  font-size: 26rpx;
  font-weight: normal;
  font-family: "KaiTi", "楷体", cursive, serif;
  color: #8b6914;
  text-align: center;
  display: block;
  line-height: 1.8;
  letter-spacing: 2rpx;
  text-shadow: 1rpx 1rpx 2rpx rgba(0,0,0,0.05);
}

</style>
