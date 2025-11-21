<template>
  <view class="container">
    <!-- 标题区域 -->
    <view class="title-section">
      <text class="main-title">MY 100</text>
      <text class="subtitle">{{ theme.name }}</text>
      <text class="description" v-if="theme.description">{{ theme.description }}</text>
    </view>

    <!-- 两列布局的清单项列表 -->
    <view class="items-section">
      <!-- 第一列 -->
      <view class="column">
        <view
          v-for="(data, colIndex) in getColumnItems(0)"
          :key="data.originalIndex"
          class="item-wrapper"
          @click="toggleItem(data.originalIndex)"
        >
          <view class="item-content">
            <!-- 方形复选框 -->
            <view class="checkbox" :class="{ checked: data.item.checked }">
              <text v-if="data.item.checked" class="check-icon">✓</text>
            </view>
            <!-- 编号和文字 -->
            <text class="item-text" :class="{ checked: data.item.checked }">
              {{ data.originalIndex + 1 }}. {{ data.item.text }}
            </text>
          </view>
        </view>
      </view>
      
      <!-- 第二列 -->
      <view class="column">
        <view
          v-for="(data, colIndex) in getColumnItems(1)"
          :key="data.originalIndex"
          class="item-wrapper"
          @click="toggleItem(data.originalIndex)"
        >
          <view class="item-content">
            <!-- 方形复选框 -->
            <view class="checkbox" :class="{ checked: data.item.checked }">
              <text v-if="data.item.checked" class="check-icon">✓</text>
            </view>
            <!-- 编号和文字 -->
            <text class="item-text" :class="{ checked: data.item.checked }">
              {{ data.originalIndex + 1 }}. {{ data.item.text }}
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

const toggleItem = (index) => {
  emit('toggle', index)
}

// 获取指定列的项目，返回包含原始索引和项目的数据
const getColumnItems = (columnIndex) => {
  return props.items
    .map((item, index) => ({ item, originalIndex: index }))
    .filter((data) => data.originalIndex % 2 === columnIndex)
}

// 绘制多行文字（自动换行）
const drawMultilineText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split('')
  let line = ''
  let currentY = y
  const originalTextBaseline = ctx.textBaseline
  
  ctx.textBaseline = 'top'
  
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
  
  lines.forEach((lineText) => {
    ctx.fillText(lineText, x, currentY)
    currentY += lineHeight
  })
  
  ctx.textBaseline = originalTextBaseline
  return currentY - y
}

// 绘制Canvas的方法，供父组件调用
const drawCanvas = (ctx, canvas, config) => {
  const { width, height, padding = 40 } = config
  
  // 背景 - 米色渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, '#f5f0e8')
  gradient.addColorStop(1, '#ede4d3')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  let y = padding + 30
  
  // 主标题 "MY 100"
  ctx.fillStyle = '#d4669a'
  ctx.font = 'bold 72px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('MY 100', width / 2, y)
  
  y += 90
  
  // 副标题
  ctx.fillStyle = '#d4669a'
  ctx.font = '28px serif'
  ctx.fillText(props.theme.name, width / 2, y)
  
  y += 40
  
  // 描述文字
  if (props.theme.description) {
    ctx.fillStyle = '#a0a0a0'
    ctx.font = '20px serif'
    ctx.fillText(props.theme.description, width / 2, y)
  }
  
  y += 60
  
  // 两列布局
  const columnWidth = (width - padding * 2 - 40) / 2
  const leftColumnX = padding
  const rightColumnX = padding + columnWidth + 40
  
  // 为每列维护独立的项目列表
  const columnData = [[], []]
  props.items.forEach((item, index) => {
    const columnIndex = index % 2
    columnData[columnIndex].push({ item, index })
  })
  
  // 增加底部空白
  const bottomPadding = 80
  
  // 绘制两列内容
  columnData.forEach((columnItems, columnIndex) => {
    let currentY = y
    const columnX = columnIndex === 0 ? leftColumnX : rightColumnX
    
    columnItems.forEach(({ item, index }, itemIndex) => {
      // 方形复选框
      const checkboxSize = 16
      const checkboxX = columnX
      const checkboxY = currentY - checkboxSize / 2
      
      ctx.strokeStyle = '#d4669a'
      ctx.lineWidth = 1.5
      ctx.strokeRect(checkboxX, checkboxY, checkboxSize, checkboxSize)
      
      if (item.checked) {
        ctx.fillStyle = '#d4669a'
        ctx.fillRect(checkboxX + 2, checkboxY + 2, checkboxSize - 4, checkboxSize - 4)
      }
      
      // 编号和文字
      const textX = checkboxX + checkboxSize + 8
      ctx.fillStyle = '#8b4a6b'
      ctx.font = '18px serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      
      const itemText = `${index + 1}. ${item.text}`
      const maxTextWidth = columnWidth - checkboxSize - 16
      
      // 简单文字绘制（不换行）
      ctx.fillText(itemText, textX, currentY)
      
      // 在最后一项之后增加额外的底部间距
      const itemSpacing = itemIndex === columnItems.length - 1 ? 28 + bottomPadding : 28
      currentY += itemSpacing
    })
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
  background: linear-gradient(to bottom, #f5f0e8 0%, #ede4d3 100%);
  padding: 40rpx;
  box-sizing: border-box;
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 60rpx;
}

.main-title {
  font-size: 72rpx;
  font-weight: bold;
  color: #d4669a;
  display: block;
  margin-bottom: 20rpx;
  font-family: serif;
}

.subtitle {
  font-size: 28rpx;
  color: #d4669a;
  display: block;
  margin-bottom: 10rpx;
  font-family: serif;
}

.description {
  font-size: 20rpx;
  color: #a0a0a0;
  display: block;
  font-family: serif;
}

/* 两列布局的清单项 */
.items-section {
  display: flex;
  gap: 40rpx;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-wrapper {
  margin-bottom: 16rpx;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

/* 方形复选框 */
.checkbox {
  width: 16rpx;
  height: 16rpx;
  border: 1.5rpx solid #d4669a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: transparent;
}

.checkbox.checked {
  background-color: #d4669a;
}

.check-icon {
  color: #ffffff;
  font-size: 12rpx;
  font-weight: bold;
}

/* 文字 */
.item-text {
  font-size: 18rpx;
  color: #8b4a6b;
  font-family: serif;
  line-height: 1.4;
}

.item-text.checked {
  opacity: 0.7;
}
</style>