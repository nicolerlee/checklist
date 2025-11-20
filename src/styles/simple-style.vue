<template>
  <view class="container">
    <!-- 顶部图片 -->
    <view class="header-image">
      <image 
        src="/static/images/simple-style.png" 
        mode="aspectFit"
        class="header-img"
        @error="handleImageError"
        @load="handleImageLoad"
      />
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

// 图片路径 - 使用 @ 别名或相对路径（在 uni-app 中更可靠）
// 在开发环境可能需要使用 @/static/，在生产环境可能需要 /static/
const headerImagePath = '@/static/images/simple-style.png'

// 图片加载处理
const handleImageError = (e) => {
  console.error('图片加载失败:', e)
  console.error('尝试的路径:', headerImagePath)
}

const handleImageLoad = (e) => {
  console.log('图片加载成功', e)
  console.log('图片尺寸:', e.detail?.width, e.detail?.height)
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
const drawCanvas = async (ctx, canvas, config) => {
  const { width, height, padding = 60 } = config
  
  // 背景 - 淡粉色
  ctx.fillStyle = '#fef5f0'
  ctx.fillRect(0, 0, width, height)
  
  let y = padding
  
  // 绘制顶部图片（根据实际图片比例 1458x458，宽高比约 3.18:1）
  // 图片宽度和清单卡片宽度保持一致
  const cardPadding = 30 // 卡片左右边距，与下方卡片保持一致
  const availableWidth = width - cardPadding * 2
  const imgWidth = availableWidth
  const imgHeight = imgWidth * 458 / 1458 // 图片实际比例，高度自适应
  const imgX = cardPadding // 与卡片左对齐
  
  // 在微信小程序的 Canvas 2D API 中，drawImage 需要 Image 对象，不能直接使用字符串路径
  // 正确的做法：
  // 1. 使用 uni.getImageInfo 获取图片的本地路径
  // 2. 使用 canvas.createImage() 创建 Image 对象
  // 3. 将 getImageInfo 返回的路径赋值给 Image 对象的 src
  // 4. 等待图片加载完成后，使用 Image 对象调用 drawImage
  
  if (typeof uni !== 'undefined') {
    // uni-app 环境（微信小程序）
    await new Promise((resolve) => {
      // 尝试多种路径格式
      // 1. 使用 @ 别名
      // 2. 使用绝对路径 /static/
      // 3. 使用相对路径
      const tryPaths = [
        '@/static/images/simple-style.png',
        '/static/images/simple-style.png',
        'static/images/simple-style.png',
        headerImagePath
      ]
      
      let currentPathIndex = 0
      
      const tryGetImageInfo = (path) => {
        // 先获取图片信息
        uni.getImageInfo({
          src: path,
          success: (res) => {
            console.log('获取图片信息成功:', res.path)
            console.log('图片信息:', res)
          
            // 在微信小程序 Canvas 2D API 中，drawImage 可以直接使用 getImageInfo 返回的 path
            // 但需要确保 path 是正确的本地路径格式
            // res.path 应该是类似 "http://tmp/" 或 "wxfile://" 开头的本地路径
            
            // 在微信小程序 Canvas 2D API 中，必须使用 canvas.createImage() 创建 Image 对象
            // drawImage 不能直接使用字符串路径
            if (canvas && typeof canvas.createImage === 'function') {
              const img = canvas.createImage()
              
              img.onload = () => {
                try {
                  ctx.drawImage(img, imgX, y, imgWidth, imgHeight)
                  console.log('图片绘制成功 (createImage):', res.path)
                  y += imgHeight // 去掉 + 40，让图片和 checklist 紧贴
                } catch (drawErr) {
                  console.error('Canvas drawImage 失败:', drawErr)
                  console.error('使用的图片路径:', res.path)
                  // 即使失败也继续，留出空白区域
                  y += imgHeight // 去掉 + 40
                }
                resolve()
              }
              
              img.onerror = (err) => {
                console.error('图片加载失败 (createImage):', res.path)
                console.error('错误详情:', err)
                console.error('原始路径:', path)
                
                // 如果相对路径失败，尝试使用原始绝对路径
                if (res.path !== path && path.startsWith('/')) {
                  console.log('尝试使用原始绝对路径:', path)
                  img.src = path
                } else {
                  // 加载失败时，留出空白区域
                  y += imgHeight // 去掉 + 40
                  resolve()
                }
              }
              
              // 优先使用原始绝对路径，因为更可靠
              // 如果 res.path 是完整的本地路径（包含协议），使用 res.path
              // 否则使用原始路径 path（绝对路径）
              let srcPath = res.path
              
              // 检查 res.path 是否是完整的路径
              // 完整的路径应该以 http://、https://、wxfile:// 开头，或者是绝对路径 /
              if (srcPath.startsWith('http://') || 
                  srcPath.startsWith('https://') || 
                  srcPath.startsWith('wxfile://') ||
                  srcPath.startsWith('/')) {
                // 是完整路径，可以使用
                console.log('使用 getImageInfo 返回的路径:', srcPath)
              } else {
                // 是相对路径，使用原始绝对路径
                console.warn('getImageInfo 返回的是相对路径，使用原始绝对路径')
                console.warn('res.path:', srcPath)
                console.warn('使用原始路径:', path)
                srcPath = path
              }
              
              console.log('设置 Image src 为:', srcPath)
              img.src = srcPath
            } else {
              // 如果 createImage 也不可用，只能留出空白区域
              console.error('canvas.createImage 不可用')
              y += imgHeight // 去掉 + 40
              resolve()
            }
          },
          fail: (err) => {
            console.warn(`路径 ${path} 获取图片信息失败，尝试下一个路径`)
            
            // 尝试下一个路径
            currentPathIndex++
            if (currentPathIndex < tryPaths.length) {
              const nextPath = tryPaths[currentPathIndex]
              console.log(`尝试路径 ${currentPathIndex + 1}/${tryPaths.length}:`, nextPath)
              tryGetImageInfo(nextPath)
            } else {
              // 所有路径都失败了
              console.error('所有路径都失败，无法获取图片信息')
              console.error('尝试的路径列表:', tryPaths)
              console.error('最后一个错误:', err)
              // 获取失败时，留出空白区域
              y += imgHeight // 去掉 + 40
              resolve()
            }
          }
        })
      }
      
      // 开始尝试第一个路径
      console.log(`开始尝试路径 1/${tryPaths.length}:`, tryPaths[0])
      tryGetImageInfo(tryPaths[0])
    })
  } else {
    // 非 uni-app 环境（如浏览器），使用标准 Image 对象
    await new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        try {
          ctx.drawImage(img, imgX, y, imgWidth, imgHeight)
          y += imgHeight // 去掉 + 40
        } catch (err) {
          console.error('Canvas 图片绘制失败:', err)
          y += imgHeight // 去掉 + 40
        }
        resolve()
      }
      img.onerror = () => {
        console.error('图片加载失败:', headerImagePath)
        y += imgHeight // 去掉 + 40
        resolve()
      }
      img.src = headerImagePath
    })
  }
  
  // 白色卡片区域（使用上方已定义的 cardPadding）
  // 图片和卡片背景连接在一起，但文字内容区域有上方 padding
  const cardX = cardPadding
  const cardY = y // 卡片从图片底部开始，连接在一起
  const cardWidth = width - cardPadding * 2
  let cardContentY = cardY + padding // 文字内容区域上方添加 padding，增加空白（仅生图时）
  
  // 绘制白色背景卡片
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(cardX, cardY, cardWidth, height - cardY - padding)
  
  // 清单项 - 显示所有项目（在白色卡片内）
  ctx.textAlign = 'left'
  ctx.font = 'normal 34px -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textBaseline = 'middle'
  
  props.items.forEach((item, index) => {
    const checkboxSize = 36
    const leftOffset = -20 // checkbox 和文字整体往左移动 20px（仅生图时）
    const checkboxX = cardX + padding + leftOffset
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
    const lineHeight = 46 // 行高增大，从 38 改为 46（仅生图时）
    
    // 绘制多行文字
    const textHeight = drawMultilineText(ctx, item.text, textX, cardContentY - lineHeight / 2, maxTextWidth, lineHeight)
    
    // 根据实际文字高度调整 y 坐标，行间距增大（仅生图时）
    cardContentY += Math.max(70, textHeight + 12) // 增大行间距，从 56 改为 70，并额外增加 12px
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

/* 顶部图片 - 根据实际图片比例自适应 */
.header-image {
  position: relative;
  width: 100%;
  max-width: 600rpx;
  margin: 20rpx auto 0; /* 去掉底部 margin，让图片和卡片紧贴 */
  /* 图片实际尺寸 1458x458，宽高比约 3.18:1，高度占宽度的 31.4% */
  padding-bottom: 31.4%; /* 458 / 1458 ≈ 0.314 */
  height: 0;
  overflow: hidden;
  border-radius: 0; /* 确保容器是直角 */
}

.header-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 0; /* 确保图片是直角 */
}

/* 白色清单项卡片 */
.items-card {
  background-color: #ffffff;
  border-radius: 0; /* 改为直角，不要圆角 */
  padding: 0 30rpx 30rpx; /* 移除顶部 padding，让列表项紧贴标题 */
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  margin-top: 0; /* 去掉顶部 margin，让卡片紧贴图片 */
}

/* 清单项 */
.items-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 40rpx;
  padding-top: 0; /* 确保顶部无间距 */
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
