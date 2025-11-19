<template>
  <view class="container">
    <!-- 头像 -->
    <view class="avatar-section">
      <view class="avatar">
        <view class="avatar-face">
          <view class="hair"></view>
          <view class="face">
            <view class="eye left-eye"></view>
            <view class="eye right-eye"></view>
            <view class="mouth"></view>
          </view>
          <view class="shirt"></view>
        </view>
      </view>
    </view>

    <!-- 标题 -->
    <view class="title-section">
      <text class="title">{{ theme.name }}</text>
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
    <view v-if="theme.quote" class="quote-section">
      <text class="quote-text">{{ theme.quote }}</text>
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

// 绘制多行文字（自动换行）
const drawMultilineText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split('')
  let line = ''
  let currentY = y
  const originalTextBaseline = ctx.textBaseline
  const originalTextAlign = ctx.textAlign
  
  ctx.textBaseline = 'top'
  
  // 收集所有行
  const lines = []
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i]
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && line.length > 0) {
      lines.push(line)
      line = words[i]
    } else {
      line = testLine
    }
  }
  
  if (line.length > 0) {
    lines.push(line)
  }
  
  // 绘制所有行
  lines.forEach((lineText) => {
    let drawX = x
    if (originalTextAlign === 'center') {
      const lineWidth = ctx.measureText(lineText).width
      drawX = x + (maxWidth - lineWidth) / 2
      ctx.textAlign = 'left'
    }
    ctx.fillText(lineText, drawX, currentY)
    currentY += lineHeight
  })
  
  ctx.textBaseline = originalTextBaseline
  ctx.textAlign = originalTextAlign
  return currentY - y
}

// 绘制Canvas的方法，供父组件调用
const drawCanvas = (ctx, canvas, config) => {
  const { width, height, padding = 60 } = config
  
  // 背景
  ctx.fillStyle = '#f5f1e8'
  ctx.fillRect(0, 0, width, height)
  
  let y = padding + 20
  
  // 头像
  drawAvatar2D(ctx, width / 2, y + 50, 50)
  y += 120
  
  // 标题
  ctx.fillStyle = '#1a1a1a'
  ctx.font = 'bold 48px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(props.theme.name, width / 2, y)
  y += 80
  
  // 清单项 - 显示所有项目
  ctx.textAlign = 'left'
  ctx.font = '34px sans-serif'
  ctx.textBaseline = 'middle'
  
  props.items.forEach((item, index) => {
    // 复选框
    const checkboxSize = 48
    const checkboxX = padding
    const checkboxY = y - checkboxSize / 2
    
    // 绘制边框（选中和未选中都画边框）
    ctx.strokeStyle = '#1890ff'
    ctx.lineWidth = 4
    ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
    
    if (item.checked) {
      // 已勾选：只显示勾，不填充
      ctx.strokeStyle = '#1890ff'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(checkboxX + 12, checkboxY + 24)
      ctx.lineTo(checkboxX + 20, checkboxY + 32)
      ctx.lineTo(checkboxX + 36, checkboxY + 16)
      ctx.stroke()
    }
    
    // 文字颜色保持一致
    ctx.fillStyle = '#1a1a1a'
    
    // 计算可用宽度
    const textX = checkboxX + checkboxSize + 24
    const maxTextWidth = width - textX - padding
    const lineHeight = 42
    
    // 绘制多行文字
    const textHeight = drawMultilineText(ctx, item.text, textX, y - lineHeight / 2, maxTextWidth, lineHeight)
    
    // 根据实际文字高度调整 y 坐标
    y += Math.max(75, textHeight)
  })
  
  // 感言
  y += 40
  if (props.theme.quote) {
    ctx.fillStyle = '#1a1a1a'
    ctx.font = '28px sans-serif'
    ctx.textAlign = 'center'
    
    const quoteMaxWidth = width - padding * 2
    const quoteLineHeight = 34
    const quoteY = y
    const quoteHeight = drawMultilineText(ctx, props.theme.quote, padding, quoteY, quoteMaxWidth, quoteLineHeight)
    y += quoteHeight
  }
}

// 暴露方法供父组件调用
defineExpose({
  drawCanvas
})

const drawAvatar2D = (ctx, x, y, radius) => {
  // 绘制简化的卡通头像（Canvas 2D API）
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.clip()
  
  // 头像背景（肤色）
  ctx.fillStyle = '#fdbcb4'
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
  
  // 头发
  ctx.fillStyle = '#2d2d2d'
  ctx.fillRect(x - radius * 0.8, y - radius, radius * 1.6, radius * 1.2)
  
  // 衣服
  ctx.fillStyle = '#ff6b6b'
  ctx.fillRect(x - radius, y + radius * 0.2, radius * 2, radius * 0.8)
  
  ctx.restore()
  
  // 头像边框
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.stroke()
}

</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f1e8;
  padding: 30rpx;
  padding-bottom: 160rpx;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  position: relative;
}

.avatar-face {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fdbcb4;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.hair {
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 60%;
  background-color: #2d2d2d;
  border-radius: 50rpx 50rpx 0 0;
}

.face {
  position: absolute;
  top: 25%;
  left: 20%;
  right: 20%;
  bottom: 35%;
}

.eye {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  background-color: #2d2d2d;
  border-radius: 50%;
  top: 20%;
}

.left-eye {
  left: 25%;
}

.right-eye {
  right: 25%;
}

.mouth {
  position: absolute;
  bottom: 20%;
  left: 35%;
  right: 35%;
  height: 4rpx;
  background-color: #ff6b6b;
  border-radius: 2rpx;
}

.shirt {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background-color: #ff6b6b;
}

/* 标题 */
.title-section {
  margin-bottom: 50rpx;
}

.title {
  font-size: 48rpx;
  font-weight: 900;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  color: #1a1a1a;
  text-align: center;
  display: block;
  letter-spacing: 1rpx;
}

/* 清单项 */
.items-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 50rpx;
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
  padding: 16rpx 0;
  transition: all 0.3s ease;
}

.item-content:active {
  transform: scale(0.98);
}

.checkbox {
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid #1890ff;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background-color: transparent;
}

.checkbox.checked {
  /* 选中后只显示勾，不填充背景 */
  background-color: transparent;
  transform: scale(1.05);
  border-color: #1890ff;
}

.check-icon {
  color: #1890ff;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 1;
}

.item-text {
  flex: 1;
  font-size: 34rpx;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  color: #1a1a1a;
  transition: all 0.3s ease;
  line-height: 1.4;
}


/* 感言区域 */
.quote-section {
  margin-top: 50rpx;
  margin-bottom: 40rpx;
  text-align: center;
}

.quote-text {
  font-size: 28rpx;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
  letter-spacing: 1rpx;
}

</style>
