<template>
  <view class="container">
    <!-- 装饰图案 -->
    <view class="decoration">
      <view class="decoration-branch"></view>
    </view>
    
    <!-- 标题 -->
    <view class="title-section">
      <text class="title">{{ theme.name }}</text>
    </view>

    <!-- 清单项列表 - 白色背景卡片 -->
    <view class="items-card">
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

// 绘制装饰枝条
const drawBranch = (ctx, x, y, size) => {
  ctx.save()
  ctx.strokeStyle = '#a68b6b'
  ctx.fillStyle = '#a68b6b'
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'
  ctx.globalAlpha = 0.5
  
  // 绘制对称的枝条
  const branchLength = size * 0.45
  
  // 左侧枝条
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.quadraticCurveTo(x - branchLength * 0.25, y - branchLength * 0.15, x - branchLength, y - branchLength * 0.35)
  ctx.stroke()
  
  // 左侧叶子（小圆点）
  ctx.beginPath()
  ctx.arc(x - branchLength * 0.72, y - branchLength * 0.25, size * 0.08, 0, Math.PI * 2)
  ctx.fill()
  
  // 右侧枝条
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.quadraticCurveTo(x + branchLength * 0.25, y - branchLength * 0.15, x + branchLength, y - branchLength * 0.35)
  ctx.stroke()
  
  // 右侧叶子（小圆点）
  ctx.beginPath()
  ctx.arc(x + branchLength * 0.72, y - branchLength * 0.25, size * 0.08, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.globalAlpha = 1
  ctx.restore()
}

// 绘制Canvas的方法，供父组件调用
const drawCanvas = (ctx, canvas, config) => {
  const { width, height, padding = 60 } = config
  
  // 背景 - 淡粉色
  ctx.fillStyle = '#fef5f0'
  ctx.fillRect(0, 0, width, height)
  
  let y = padding + 60
  
  // 装饰枝条（在淡粉色背景上）
  drawBranch(ctx, width / 2, y, 80)
  y += 80
  
  // 标题 - 深棕色，手写字体（在淡粉色背景上）
  ctx.fillStyle = '#5c4a37'
  ctx.font = 'bold 56px "KaiTi", "STKaiti", "楷体", cursive, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(props.theme.name, width / 2, y)
  y += 100
  
  // 白色卡片区域
  const cardPadding = 30
  const cardX = cardPadding
  const cardY = y
  const cardWidth = width - cardPadding * 2
  let cardContentY = cardY + padding
  
  // 绘制白色背景卡片
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cardX, cardY, cardWidth, height - cardY - padding)
  
  // 清单项 - 显示所有项目（在白色卡片内）
  ctx.textAlign = 'left'
  ctx.font = 'normal 30px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textBaseline = 'middle'
  
  props.items.forEach((item, index) => {
    const checkboxSize = 36
    const checkboxX = cardX + padding
    const checkboxY = cardContentY - checkboxSize / 2
    
    // 绘制边框（选中和未选中都画边框）- 棕色
    ctx.strokeStyle = '#8b6f47'
    ctx.lineWidth = 2
    ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
    
    if (item.checked) {
      // 已勾选：只显示勾，不填充
      ctx.strokeStyle = '#8b6f47'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(checkboxX + 7, checkboxY + 18)
      ctx.lineTo(checkboxX + 14, checkboxY + 25)
      ctx.lineTo(checkboxX + 29, checkboxY + 11)
      ctx.stroke()
    }
    
    // 文字颜色 - 深棕色
    ctx.fillStyle = '#5c4a37'
    
    // 计算可用宽度
    const textX = checkboxX + checkboxSize + 20
    const maxTextWidth = cardX + cardWidth - textX - padding
    const lineHeight = 38
    
    // 绘制多行文字
    const textHeight = drawMultilineText(ctx, item.text, textX, cardContentY - lineHeight / 2, maxTextWidth, lineHeight)
    
    // 根据实际文字高度调整 y 坐标
    cardContentY += Math.max(56, textHeight)
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
  background-color: #fef5f0;
  padding: 30rpx 100rpx;
  position: relative;
}

/* 白色清单项卡片 */
.items-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  margin-top: 20rpx;
}

/* 装饰图案 */
.decoration {
  display: flex;
  justify-content: center;
  margin-bottom: 24rpx;
  margin-top: 20rpx;
}

.decoration-branch {
  width: 140rpx;
  height: 60rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-branch::before,
.decoration-branch::after {
  content: '';
  position: absolute;
  top: 0;
  width: 1.5rpx;
  height: 45rpx;
  background: #a68b6b;
  border-radius: 1rpx;
  opacity: 0.5;
}

.decoration-branch::before {
  left: 30%;
  transform: rotate(-18deg);
  transform-origin: top center;
}

.decoration-branch::after {
  right: 30%;
  transform: rotate(18deg);
  transform-origin: top center;
}

/* 叶子装饰 - 小圆点 */
.decoration-branch {
  background-image: 
    radial-gradient(circle at 28% 40%, #a68b6b 2.5rpx, transparent 2.5rpx),
    radial-gradient(circle at 72% 40%, #a68b6b 2.5rpx, transparent 2.5rpx);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

/* 标题 - 温暖米色风格 */
.title-section {
  margin-bottom: 30rpx;
}

.title {
  font-size: 56rpx;
  font-weight: bold;
  font-family: "KaiTi", "STKaiti", "楷体", cursive, serif;
  color: #5c4a37;
  text-align: center;
  display: block;
  letter-spacing: 1rpx;
  line-height: 1.2;
}

/* 清单项 */
.items-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
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
  align-items: flex-start;
  gap: 20rpx;
  padding: 16rpx 0;
  transition: all 0.3s ease;
}

.item-content:active {
  transform: scale(0.98);
}

.checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #8b6f47;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background-color: transparent;
  margin-top: 4rpx;
}

.checkbox.checked {
  /* 选中后只显示勾，不填充背景 */
  background-color: transparent;
  transform: scale(1.05);
}

.check-icon {
  color: #8b6f47;
  font-size: 24rpx;
  font-weight: bold;
}

.item-text {
  flex: 1;
  font-size: 30rpx;
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  color: #5c4a37;
  transition: all 0.3s ease;
  line-height: 1.2;
  letter-spacing: 0.3rpx;
}


</style>
