<template>
  <view class="container">
    <!-- 标题 -->
    <view class="title-section">
      <text class="title">{{ theme.name }}</text>
      <text class="subtitle" v-if="theme.emoji">{{ theme.emoji }}</text>
    </view>

    <!-- 三列布局的清单项列表 -->
    <view class="items-section">
      <!-- 第一列 -->
      <view class="column column-1">
        <view
          v-for="(data, colIndex) in getColumnItems(0)"
          :key="data.originalIndex"
          class="item-wrapper"
          :style="{ animationDelay: data.originalIndex * 0.03 + 's' }"
          @click="toggleItem(data.originalIndex)"
        >
          <view class="item-content">
            <!-- 圆形复选框 -->
            <view class="checkbox" :class="{ checked: data.item.checked }">
              <text v-if="data.item.checked" class="check-icon">✓</text>
            </view>
            <!-- 编号 -->
            <text class="item-number">{{ data.originalIndex + 1 }}.</text>
            <!-- 文字 -->
            <text class="item-text" :class="{ checked: data.item.checked }">
              {{ data.item.text }}
            </text>
          </view>
        </view>
      </view>
      <!-- 第二列 -->
      <view class="column column-2">
        <view
          v-for="(data, colIndex) in getColumnItems(1)"
          :key="data.originalIndex"
          class="item-wrapper"
          :style="{ animationDelay: data.originalIndex * 0.03 + 's' }"
          @click="toggleItem(data.originalIndex)"
        >
          <view class="item-content">
            <!-- 圆形复选框 -->
            <view class="checkbox" :class="{ checked: data.item.checked }">
              <text v-if="data.item.checked" class="check-icon">✓</text>
            </view>
            <!-- 编号 -->
            <text class="item-number">{{ data.originalIndex + 1 }}.</text>
            <!-- 文字 -->
            <text class="item-text" :class="{ checked: data.item.checked }">
              {{ data.item.text }}
            </text>
          </view>
        </view>
      </view>
      <!-- 第三列 -->
      <view class="column column-3">
        <view
          v-for="(data, colIndex) in getColumnItems(2)"
          :key="data.originalIndex"
          class="item-wrapper"
          :style="{ animationDelay: data.originalIndex * 0.03 + 's' }"
          @click="toggleItem(data.originalIndex)"
        >
          <view class="item-content">
            <!-- 圆形复选框 -->
            <view class="checkbox" :class="{ checked: data.item.checked }">
              <text v-if="data.item.checked" class="check-icon">✓</text>
            </view>
            <!-- 编号 -->
            <text class="item-number">{{ data.originalIndex + 1 }}.</text>
            <!-- 文字 -->
            <text class="item-text" :class="{ checked: data.item.checked }">
              {{ data.item.text }}
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

// 获取指定列的项目，返回包含原始索引和项目的数据
const getColumnItems = (columnIndex) => {
  return props.items
    .map((item, index) => ({ item, originalIndex: index }))
    .filter((data) => data.originalIndex % 3 === columnIndex)
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
  const { width, height, padding = 30 } = config
  
  // 背景 - 白色
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  
  // 绘制边框
  ctx.strokeStyle = '#d0d0d0'
  ctx.lineWidth = 1.5
  ctx.strokeRect(1, 1, width - 2, height - 2)
  
  let y = padding + 20
  
  // 标题 - 蓝色手写风格，靠左对齐
  ctx.fillStyle = '#4a90e2' // 蓝色
  ctx.font = 'bold 48px "KaiTi", "楷体", "STKaiti", "华文楷体", cursive, serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  
  const titleX = padding + 10 // 靠左，留出一些边距
  
  // 绘制标题（不包含emoji）
  ctx.fillText(props.theme.name, titleX, y)
  
  // 绘制emoji在标题下方
  if (props.theme.emoji) {
    ctx.font = '32px sans-serif'
    ctx.fillText(props.theme.emoji, titleX, y + 60)
  }
  
  y = y + 120 // 标题和内容之间的间距
  
  // 三列布局
  // 考虑列之间的gap，实际列宽需要减去gap
  const columnGap = 10 // 与CSS的gap: 20rpx对应，约10px (20rpx ≈ 10px)
  const totalWidth = width - padding * 2
  const actualColumnWidth = (totalWidth - columnGap * 2) / 3 // 减去gap后的实际列宽
  const columnPadding = 6
  
  // 清单项 - 三列显示
  ctx.textAlign = 'left'
  ctx.font = 'normal 16px sans-serif'
  ctx.textBaseline = 'middle'
  
  // 为每列维护独立的 y 坐标和项目列表
  const columnData = [[], [], []]
  props.items.forEach((item, index) => {
    const columnIndex = index % 3
    columnData[columnIndex].push({ item, index })
  })
  
  // 计算每列的最大高度
  let maxColumnHeight = 0
  const columnYs = [y, y, y]
  
  // 先计算所有列的高度
  columnData.forEach((columnItems, columnIndex) => {
    let currentY = y
    columnItems.forEach(({ item, index }) => {
      const text = item.text
      const textWidth = ctx.measureText(text).width
      const maxTextWidth = actualColumnWidth - 80 // 留出复选框、编号和间距的空间
      const estimatedLines = Math.ceil(textWidth / maxTextWidth) || 1
      const itemHeight = Math.max(28, estimatedLines * 22 + 12)
      currentY += itemHeight
    })
    maxColumnHeight = Math.max(maxColumnHeight, currentY - y)
  })
  
  // 绘制每列的内容
  columnData.forEach((columnItems, columnIndex) => {
    let currentY = y
    // 计算每列的起始X位置，考虑gap
    const columnX = padding + columnIndex * (actualColumnWidth + columnGap) + columnPadding
    
    columnItems.forEach(({ item, index }) => {
      // 圆形复选框 - 放在最前面
      const checkboxSize = 20
      const checkboxX = columnX
      const checkboxY = currentY - checkboxSize / 2
      
      // 绘制圆形边框
      ctx.strokeStyle = '#cccccc'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(checkboxX + checkboxSize / 2, checkboxY + checkboxSize / 2, checkboxSize / 2 - 1.5, 0, Math.PI * 2)
      ctx.stroke()
      
      if (item.checked) {
        // 已勾选：绘制红色手写风格的勾
        ctx.strokeStyle = '#ff4444' // 红色
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        
        const centerX = checkboxX + checkboxSize / 2
        const centerY = checkboxY + checkboxSize / 2
        
        ctx.beginPath()
        // 手写风格的勾
        ctx.moveTo(centerX - checkboxSize * 0.25, centerY + checkboxSize * 0.1)
        ctx.lineTo(centerX - checkboxSize * 0.05, centerY + checkboxSize * 0.15)
        ctx.lineTo(centerX + checkboxSize * 0.3, centerY - checkboxSize * 0.2)
        ctx.stroke()
      }
      
      // 编号 - 放在checkbox后面，与文字使用相同基线
      const numberText = `${index + 1}.`
      ctx.fillStyle = '#666666'
      ctx.font = 'normal 14px sans-serif'
      ctx.textBaseline = 'top'  // 与文字使用相同基线
      const numberX = checkboxX + checkboxSize + 4
      const baselineY = currentY - 12  // 调整到合适的基线位置
      ctx.fillText(numberText, numberX, baselineY)
      
      // 文字
      ctx.fillStyle = item.checked ? '#666666' : '#666666'
      ctx.font = 'normal 16px sans-serif'
      
      const numberWidth = ctx.measureText(numberText).width
      const textX = numberX + numberWidth + 8  // 固定8px间距
      const maxTextWidth = actualColumnWidth - (textX - columnX) - columnPadding
      const lineHeight = 22
      
      // 绘制文字，使用相同的基线Y坐标
      const textHeight = drawMultilineText(ctx, item.text, textX, baselineY, maxTextWidth, lineHeight)
      
      // 更新当前列的 y 坐标 - 减小行间距
      currentY += Math.max(28, textHeight + 12)
    })
  })
  
  // 绘制整体选项区域边框，与预览图保持一致
  ctx.strokeStyle = '#d0d0d0'
  ctx.lineWidth = 1.5
  const contentStartY = y - 20
  const contentEndY = y + maxColumnHeight + 30  // 减少底部空间
  ctx.strokeRect(padding, contentStartY, totalWidth, contentEndY - contentStartY)
  
  // 绘制列之间的分割线（在所有内容绘制完成后）
  // 分割线位于两列之间空白的1/2处
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 0.5
  // 计算分割线的起始和结束位置
  const dividerStartY = contentStartY
  const dividerEndY = contentEndY
  
  // 第一列和第二列之间的分割线 - 位于两列之间空白的1/2处
  // 第一列右边缘：padding + actualColumnWidth
  // 第二列左边缘：padding + actualColumnWidth + columnGap
  // 分割线位置（空白中心）：第一列右边缘 + columnGap / 2
  const divider1X = padding + actualColumnWidth + columnGap / 2
  ctx.beginPath()
  ctx.moveTo(divider1X, dividerStartY)
  ctx.lineTo(divider1X, dividerEndY)
  ctx.stroke()
  
  // 第二列和第三列之间的分割线 - 位于两列之间空白的1/2处
  // 第二列右边缘：padding + actualColumnWidth * 2 + columnGap
  // 第三列左边缘：padding + actualColumnWidth * 2 + columnGap * 2
  // 分割线位置（空白中心）：第二列右边缘 + columnGap / 2
  const divider2X = padding + actualColumnWidth * 2 + columnGap * 1.5
  ctx.beginPath()
  ctx.moveTo(divider2X, dividerStartY)
  ctx.lineTo(divider2X, dividerEndY)
  ctx.stroke()
}

// 暴露方法供父组件调用
defineExpose({
  drawCanvas
})
</script>

<style scoped>
.container {
  min-height: auto;
  background-color: #ffffff;
  padding: 20rpx;
  border: 1.5rpx solid #d0d0d0;
  border-radius: 4rpx;
  margin: 8rpx;
  box-sizing: border-box;
}

/* 标题区域 */
.title-section {
  margin-bottom: 10rpx;
  text-align: left;
  position: relative;
  padding-left: 20rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  font-family: "KaiTi", "楷体", "STKaiti", "华文楷体", cursive, serif;
  color: #4a90e2;
  display: block;
  margin-bottom: 5rpx;
  letter-spacing: 1rpx;
  line-height: 1.2;
}

.subtitle {
  font-size: 24rpx;
  color: #4a90e2;
  opacity: 0.7;
}

/* 三列布局的清单项 */
.items-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20rpx; /* 列之间留出空白 */
  margin-bottom: 15rpx;
  position: relative;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

/* 列之间的分割线 - 位于两列之间空白的1/2处 */
.column-1::after,
.column-2::after {
  content: '';
  position: absolute;
  right: -10rpx; /* 位于列之间空白的中心，gap: 20rpx，中心就是 -10rpx */
  top: 0;
  bottom: 0;
  width: 0.5rpx;
  background-color: #e0e0e0;
  z-index: 1;
}

.item-wrapper {
  width: 100%;
  animation: slideIn 0.3s ease-out;
  box-sizing: border-box;
  margin-bottom: 8rpx;
}

.item-content {
  display: flex;
  align-items: flex-start;
  gap: 5rpx;
  padding: 3rpx 0;
  transition: all 0.3s ease;
}

.item-content:active {
  transform: scale(0.98);
}

/* 圆形复选框 */
.checkbox {
  width: 20rpx;
  height: 20rpx;
  border: 1.5rpx solid #cccccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background-color: transparent;
  margin-top: 1rpx;
}

/* 编号 */
.item-number {
  font-size: 16rpx;
  color: #666666;
  font-weight: normal;
  flex-shrink: 0;
  margin-top: 1rpx;
  line-height: 1;
}

.checkbox.checked {
  border-color: #ff4444;
  transform: scale(1.05);
}

.check-icon {
  color: #ff4444;
  font-size: 14rpx;
  font-weight: bold;
  font-family: "KaiTi", "楷体", cursive, serif;
}

/* 文字 */
.item-text {
  flex: 1;
  font-size: 18rpx;
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  color: #333333;
  transition: all 0.3s ease;
  line-height: 1.2;
  word-break: break-word;
}

.item-text.checked {
  color: #666666;
  text-decoration: none;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media screen and (max-width: 750rpx) {
  .item-wrapper {
    width: calc(33.333% - 8rpx);
  }
  
  .item-text {
    font-size: 18rpx;
  }
  
  .item-number {
    font-size: 16rpx;
  }
  
  .checkbox {
    width: 20rpx;
    height: 20rpx;
  }
  
  .check-icon {
    font-size: 14rpx;
  }
}
</style>