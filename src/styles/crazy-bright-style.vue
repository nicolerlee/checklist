<template>
  <view class="container">
    <!-- 标题 -->
    <view class="title-section">
      <text class="title">{{ theme.emoji }} {{ theme.name }}</text>
    </view>

    <!-- 沙雕标签云列表 -->
    <view class="tags-section">
      <view
        v-for="(item, index) in items"
        :key="index"
        class="tag-item"
        :class="{ checked: item.checked, crazy: true }"
        :style="{
          backgroundColor: item.checked ? getGradientColor(index) : '#f0f0f0',
          borderColor: item.checked ? getBorderColor(index) : '#ddd',
          color: item.checked ? getTextColor(index) : '#666',
          '--glow-color': item.checked ? getGradientColor(index) : 'transparent',
          transform: `rotate(${getRandomRotation(index)}deg) scale(${item.checked ? 1.1 : 1})`,
          animationDelay: index * 0.03 + 's',
          zIndex: item.checked ? 10 : 1
        }"
        @click="toggleItem(index)"
      >
        <text class="tag-text" :style="{ fontWeight: index % 3 === 0 ? 'bold' : 'normal' }">
          {{ getRandomEmoji(index) }} {{ item.text }}
        </text>
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

// 霓虹彩虹色系（亮色版本，用于预览和生图）
const rainbowColors = [
  '#ff0080', // 荧光粉
  '#00ff88', // 荧光绿
  '#0080ff', // 荧光蓝
  '#ff8000', // 荧光橙
  '#8000ff', // 荧光紫
  '#ffff00', // 荧光黄
  '#ff4080', // 粉红
  '#40ff88', // 青绿
  '#4080ff', // 天蓝
  '#ff8040', // 橙红
  '#8040ff', // 紫蓝
  '#ffff40'  // 亮黄
]

const checkedCount = computed(() => {
  return props.items.filter(item => item.checked).length
})

const toggleItem = (index) => {
  emit('toggle', index)
}

// 获取渐变背景色（基于索引循环，预览时使用亮色）
const getGradientColor = (index) => {
  return rainbowColors[index % rainbowColors.length]
}

// 获取边框颜色（稍微深一点）
const getBorderColor = (index) => {
  const color = rainbowColors[index % rainbowColors.length]
  // 简化版：返回原色（实际可以用颜色处理库加深）
  return color
}

// 获取文字颜色（根据背景色判断，黄色、绿色等浅色用深色文字）
const getTextColor = (index) => {
  const bgColor = rainbowColors[index % rainbowColors.length] // 预览时使用亮色版本
  // 浅色背景使用深色文字：黄色系、绿色系
  const lightColors = ['#ffff00', '#ffff40', '#00ff88', '#40ff88'] // 对应亮色版本的浅色
  if (lightColors.includes(bgColor)) {
    return '#333333' // 深灰色文字
  }
  return '#fff' // 其他颜色使用白色文字
}

// 获取随机旋转角度（-12 到 12 度，基于索引）
const getRandomRotation = (index) => {
  // 使用索引生成"伪随机"角度，保持一致性
  const seed = (index * 37) % 25 // 37是质数，让分布更均匀
  return seed - 12 // -12 到 12 度
}

// 获取随机emoji装饰
const emojis = ['🤪', '😵', '💥', '🔥', '⚡', '🎭', '🌈', '🎪', '🎨', '💫', '✨', '🎯', '']
const getRandomEmoji = (index) => {
  // 每隔几个标签加emoji，不要太多
  if (index % 4 === 0) {
    return emojis[index % emojis.length]
  }
  return ''
}

// 绘制Canvas的方法，供父组件调用
const drawCanvas = (ctx, canvas, config) => {
  const { width, height, padding = 60 } = config
  
  // 背景 - 白色带点纹理感
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  
  // 添加一些随机小点装饰
  ctx.fillStyle = '#f0f0f0'
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.beginPath()
    ctx.arc(x, y, 1, 0, Math.PI * 2)
    ctx.fill()
  }
  
  let y = padding + 40
  
  // 标题 - 稍微倾斜
  ctx.save()
  ctx.translate(width / 2, y)
  ctx.rotate(-2 * Math.PI / 180) // -2度
  ctx.fillStyle = '#333333'
  ctx.font = 'bold 44px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(props.theme.name, 0, 0)
  ctx.restore()
  y += 100
  
  // 标签云 - 沙雕风格绘制（使用渐变）
  ctx.font = '22px sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  
  let x = padding + 20
  const tagHeight = 50
  const tagPadding = 20
  const tagMargin = 20 // 增加间距，从 8 改为 20
  const lineHeight = tagHeight + tagMargin
  let currentY = y
  let maxWidth = width - padding * 2
  
  props.items.forEach((item, index) => {
    const emoji = getRandomEmoji(index)
    const tagText = emoji ? `${emoji} ${item.text}` : item.text
    const textWidth = ctx.measureText(tagText).width
    const tagWidth = textWidth + tagPadding * 2
    
    // 检查是否需要换行
    if (x + tagWidth > width - padding + 40) {
      x = padding + Math.random() * 40 // 随机起始位置，增加混乱感
      currentY += lineHeight
    }
    
    // 随机角度（-10 到 10 度）
    const rotation = getRandomRotation(index) * Math.PI / 180
    
    ctx.save()
    ctx.translate(x + tagWidth / 2, currentY)
    ctx.rotate(rotation)
    
    if (item.checked) {
      // 已勾选：彩虹渐变背景（使用渐变）
      const gradient = ctx.createLinearGradient(-tagWidth/2, -tagHeight/2, tagWidth/2, tagHeight/2)
      const color1 = rainbowColors[index % rainbowColors.length]
      const color2 = rainbowColors[(index + 1) % rainbowColors.length]
      gradient.addColorStop(0, color1)
      gradient.addColorStop(1, color2)
      
      ctx.fillStyle = gradient
      // 绘制圆角矩形（无边框，渐变背景）
      drawRoundedRect(ctx, -tagWidth/2, -tagHeight/2, tagWidth, tagHeight, 12)
      ctx.fill()
      
      // 无边框设计，靠颜色和阴影突出效果
      
      // 根据背景色判断文字颜色（黄色、绿色等浅色用深色文字）
      const bgColor = rainbowColors[index % rainbowColors.length]
      const lightColors = ['#ffff00', '#ffff40', '#00ff88', '#40ff88'] // 对应亮色版本的浅色
      if (lightColors.includes(bgColor)) {
        ctx.fillStyle = '#333333' // 深灰色文字
      } else {
        ctx.fillStyle = '#fff' // 白色文字
      }
      ctx.font = index % 3 === 0 ? 'bold 22px sans-serif' : '22px sans-serif'
    } else {
      // 未勾选：淡灰色
      ctx.fillStyle = '#f0f0f0'
      drawRoundedRect(ctx, -tagWidth/2, -tagHeight/2, tagWidth, tagHeight, 12)
      ctx.fill()
      
      // 未选中状态也去掉边框，使用轻微阴影
      
      ctx.fillStyle = '#666'
      ctx.globalAlpha = 0.6
      ctx.font = '22px sans-serif'
    }
    
    ctx.fillText(tagText, -textWidth/2, 0)
    ctx.globalAlpha = 1
    ctx.restore()
    
    x += tagWidth + tagMargin + 8 // 固定间距，不再随机（从 tagMargin + Math.random() * 10 改为 tagMargin + 8）
  })
}

// 绘制圆角矩形的辅助函数
const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// 暴露方法供父组件调用
defineExpose({
  drawCanvas
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffeef8 0%, #fff0e8 50%, #eefff0 100%);
  padding: 30rpx;
  position: relative;
  overflow: hidden;
}

/* 添加背景装饰点 */
.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle, #ff0080 1px, transparent 1px),
    radial-gradient(circle, #00ff88 1px, transparent 1px),
    radial-gradient(circle, #0080ff 1px, transparent 1px);
  background-size: 100rpx 100rpx, 80rpx 80rpx, 120rpx 120rpx;
  background-position: 0 0, 20rpx 20rpx, 40rpx 40rpx;
  opacity: 0.05;
  pointer-events: none;
}

/* 标题 */
.title-section {
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 48rpx;
  font-weight: 900;
  color: #333333;
  text-align: center;
  display: block;
  transform: rotate(-1deg);
  text-shadow: 
    2rpx 2rpx 0 #ff0080,
    -2rpx -2rpx 0 #00ff88;
}

/* 标签云样式 */
.tags-section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center; /* 改为居中展示 */
  align-content: flex-start;
  gap: 16rpx 12rpx; /* 增加水平间距，从 8rpx 改为 12rpx */
  margin-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.tag-item {
  padding: 12rpx 20rpx;
  border-radius: 16rpx;
  border: none; /* 去掉边框，用发光效果代替 */
  font-size: 24rpx;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation: slideInCrazy 0.4s ease-out;
  box-shadow: 
    0 2rpx 6rpx rgba(0, 0, 0, 0.1);
  margin: 0;
  min-width: 80rpx;
  text-align: center;
  height: 50rpx;
  line-height: 50rpx;
  position: relative;
}

.tag-item.checked {
  animation: bounceCrazy 0.5s ease-out;
  /* 轻微的发光效果 */
  box-shadow: 
    0 4rpx 12rpx rgba(0, 0, 0, 0.15),
    0 0 12rpx var(--glow-color, rgba(255, 0, 128, 0.3));
  transform: rotate(var(--rotate, 0deg)) scale(1.15) !important;
}

.tag-item:not(.checked) {
  opacity: 0.75;
  background-color: #f0f0f0 !important;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.08) !important;
}

.tag-text {
  white-space: nowrap;
  display: inline-block;
}

/* 沙雕动画 */
@keyframes slideInCrazy {
  0% {
    opacity: 0;
    transform: translateX(-30rpx) translateY(-20rpx) rotate(-10deg) scale(0.8);
  }
  50% {
    transform: translateX(10rpx) translateY(5rpx) rotate(5deg) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) rotate(0deg) scale(1);
  }
}

@keyframes bounceCrazy {
  0%, 100% {
    transform: rotate(var(--rotate, 0deg)) scale(1.1);
  }
  25% {
    transform: rotate(calc(var(--rotate, 0deg) + 5deg)) scale(1.2);
  }
  50% {
    transform: rotate(calc(var(--rotate, 0deg) - 5deg)) scale(1.15);
  }
  75% {
    transform: rotate(calc(var(--rotate, 0deg) + 3deg)) scale(1.18);
  }
}

</style>

