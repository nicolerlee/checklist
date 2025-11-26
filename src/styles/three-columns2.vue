<template>
  <view class="container">
    <view class="header">
      <text class="title-main">{{ theme.name.split('100')[0] || theme.name }}</text>
      <text class="title-sub">100件<text class="title-highlight">低成本</text>{{ theme.name.includes('快乐小事') ? '快乐小事' : theme.name.split('100')[1] || '' }}</text>
    </view>

    <view class="items-grid">
      <view class="column" v-for="col in 3" :key="col">
        <view
          v-for="(item, idx) in getColumnItems(col - 1)"
          :key="item.index"
          class="item"
          @click="toggleItem(item.index)"
        >
          <view class="checkbox" :class="{ checked: item.data.checked }"></view>
          <text class="item-text">{{ item.index + 1 }}. {{ item.data.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  theme: { type: Object, required: true }
})

const emit = defineEmits(['toggle'])

const toggleItem = (index) => {
  emit('toggle', index)
}

const getColumnItems = (colIndex) => {
  const itemsPerCol = Math.ceil(props.items.length / 3)
  const start = colIndex * itemsPerCol
  const end = Math.min(start + itemsPerCol, props.items.length)
  return props.items.slice(start, end).map((data, idx) => ({
    data,
    index: start + idx
  }))
}

const drawCanvas = async (ctx, canvas, config) => {
  const { width, height } = config
  const padding = 22
  
  ctx.fillStyle = '#f5d4d4'
  ctx.fillRect(0, 0, width, height)
  
  let y = padding + 35
  
  const titleParts = props.theme.name.split('100')
  ctx.fillStyle = '#000'
  ctx.font = '900 33px "PingFang SC", "Microsoft YaHei", "SimHei", sans-serif'
  ctx.textAlign = 'center'
  const centerX = width / 2
  ctx.fillText(titleParts[0] || props.theme.name, centerX, y)
  y += 38
  
  const line2 = '100件低成本' + (titleParts[1] || '快乐小事')
  const w1 = ctx.measureText('100件').width
  const w2 = ctx.measureText('低成本').width
  const totalWidth = ctx.measureText(line2).width
  const startX = centerX - totalWidth / 2
  
  ctx.fillStyle = '#000'
  ctx.textAlign = 'left'
  ctx.fillText('100件', startX, y)
  ctx.fillStyle = '#e88b9e'
  ctx.fillText('低成本', startX + w1, y)
  ctx.fillStyle = '#000'
  ctx.fillText(titleParts[1] || '快乐小事', startX + w1 + w2, y)
  y += 10
  
  const brushWidth = width * 0.8
  const brushX = centerX - brushWidth / 2
  const brushY = y - 20
  const gradient = ctx.createLinearGradient(brushX, brushY, brushX + brushWidth, brushY)
  gradient.addColorStop(0, 'rgba(245, 184, 197, 0)')
  gradient.addColorStop(0.2, 'rgba(245, 184, 197, 0.6)')
  gradient.addColorStop(0.5, 'rgba(232, 139, 158, 0.6)')
  gradient.addColorStop(0.8, 'rgba(245, 184, 197, 0.6)')
  gradient.addColorStop(1, 'rgba(245, 184, 197, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(brushX, brushY, brushWidth, 24)
  y += 20
  
  const cardX = padding
  const cardY = y
  const cardWidth = width - padding * 2
  const cardHeight = height - y - padding
  
  ctx.fillStyle = '#fce8e0'
  ctx.strokeStyle = '#f5b8c5'
  ctx.lineWidth = 2.5
  
  const radius = 30
  ctx.beginPath()
  ctx.moveTo(cardX + radius, cardY)
  ctx.lineTo(cardX + cardWidth - radius, cardY)
  ctx.arcTo(cardX + cardWidth, cardY, cardX + cardWidth, cardY + radius, radius)
  ctx.lineTo(cardX + cardWidth, cardY + cardHeight - radius)
  ctx.arcTo(cardX + cardWidth, cardY + cardHeight, cardX + cardWidth - radius, cardY + cardHeight, radius)
  ctx.lineTo(cardX + radius, cardY + cardHeight)
  ctx.arcTo(cardX, cardY + cardHeight, cardX, cardY + cardHeight - radius, radius)
  ctx.lineTo(cardX, cardY + radius)
  ctx.arcTo(cardX, cardY, cardX + radius, cardY, radius)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  
  const cols = 3
  const itemsPerCol = Math.ceil(props.items.length / cols)
  const colWidth = (cardWidth - 35) / cols
  const itemStartX = cardX + 18
  let currentY = cardY + 18
  
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#4a4a4a'
  
  props.items.forEach((item, index) => {
    const col = Math.floor(index / itemsPerCol)
    const row = index % itemsPerCol
    
    const x = itemStartX + col * colWidth
    const y = currentY + row * 24
    
    const boxSize = 12
    ctx.strokeStyle = '#f5b8c5'
    ctx.lineWidth = 1.5
    ctx.strokeRect(x, y - 6, boxSize, boxSize)
    
    if (item.checked) {
      ctx.strokeStyle = '#e88b9e'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(x + 3, y - 1)
      ctx.lineTo(x + 5, y + 1)
      ctx.lineTo(x + 9, y - 3)
      ctx.stroke()
    }
    
    ctx.fillStyle = '#333'
    const text = `${index + 1}. ${item.text}`
    const maxWidth = colWidth - 20
    if (ctx.measureText(text).width > maxWidth) {
      let truncated = text
      while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1)
      }
      ctx.fillText(truncated + '...', x + boxSize + 5, y)
    } else {
      ctx.fillText(text, x + boxSize + 5, y)
    }
  })
}

defineExpose({ drawCanvas })
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5d4d4;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
}

.header {
  margin-bottom: 25rpx;
  text-align: center;
  position: relative;
  padding-bottom: 15rpx;
}

.header::before {
  content: '';
  position: absolute;
  bottom: 5rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 32rpx;
  background: linear-gradient(90deg, transparent, #f5b8c5 20%, #e88b9e 50%, #f5b8c5 80%, transparent);
  opacity: 0.6;
  border-radius: 50%;
  z-index: 0;
}

.title-main, .title-sub {
  position: relative;
  z-index: 1;
}

.title-main {
  font-size: 44rpx;
  font-weight: 900;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'SimHei', sans-serif;
  color: #000;
  display: block;
  line-height: 1.1;
}

.title-sub {
  font-size: 44rpx;
  font-weight: 900;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'SimHei', sans-serif;
  color: #000;
  display: block;
  line-height: 1.1;
}

.title-highlight {
  color: #e88b9e;
}

.items-grid {
  background-color: #fce8e0;
  border: 3rpx solid #f5b8c5;
  border-radius: 40rpx;
  padding: 25rpx 20rpx;
  display: flex;
  gap: 15rpx;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 4rpx;
}

.checkbox {
  width: 14rpx;
  height: 14rpx;
  border: 1rpx solid #f5b8c5;
  border-radius: 2rpx;
  flex-shrink: 0;
  margin-top: 2rpx;
}

.checkbox.checked {
  border-color: #e88b9e;
  position: relative;
}

.checkbox.checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #e88b9e;
  font-size: 12rpx;
  font-weight: bold;
}

.item-text {
  font-size: 18rpx;
  color: #4a4a4a;
  line-height: 1.2;
  font-weight: 400;
}
</style>
