<template>
  <view class="container">
    <view class="header">
      <text class="title">Canvas 图片绘制测试</text>
    </view>

    <!-- 测试图片 -->
    <view class="test-section">
      <text class="section-title">测试图片：</text>
      <image 
        src="/static/images/simple-style.png" 
        mode="aspectFit"
        class="test-image"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <text class="image-info">图片路径: /static/images/simple-style.png</text>
    </view>

    <!-- 测试按钮 -->
    <view class="test-section">
      <view class="test-btn" @click="testDrawImage">
        <text class="btn-text">测试绘制图片到 Canvas</text>
      </view>
    </view>

    <!-- Canvas（隐藏） -->
    <canvas
      type="2d"
      id="test-canvas"
      class="canvas"
      :style="{ width: '750px', height: '1000px' }"
    ></canvas>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const imageLoaded = ref(false)
const imageInfo = ref(null)

const handleImageLoad = (e) => {
  console.log('图片加载成功:', e)
  imageLoaded.value = true
}

const handleImageError = (e) => {
  console.error('图片加载失败:', e)
  uni.showToast({
    title: '图片加载失败',
    icon: 'none'
  })
}

const testDrawImage = () => {
  console.log('=== 开始测试绘制图片 ===')
  
  if (!imageLoaded.value) {
    uni.showToast({
      title: '请等待图片加载完成',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: '绘制中...'
  })

  // 获取 Canvas 节点
  const query = uni.createSelectorQuery()
  query.select('#test-canvas')
    .fields({ node: true, size: true })
    .exec(async (res) => {
      if (!res || !res[0] || !res[0].node) {
        uni.hideLoading()
        console.error('Canvas 节点获取失败:', res)
        uni.showToast({
          title: 'Canvas 节点获取失败',
          icon: 'none'
        })
        return
      }

      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = uni.getSystemInfoSync().pixelRatio

      // 设置 Canvas 尺寸
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)

      console.log('Canvas 尺寸:', canvas.width, canvas.height)
      console.log('Canvas 显示尺寸:', res[0].width, res[0].height)
      console.log('设备像素比:', dpr)

      // 绘制白色背景
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 750, 1000)

      // 绘制文字
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 40px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Canvas 测试', 375, 100)

      // 方法1：使用 getImageInfo 获取图片信息
      const imagePath = '/static/images/simple-style.png'
      
          uni.getImageInfo({
        src: imagePath,
        success: (imgRes) => {
          console.log('获取图片信息成功:', imgRes)
          console.log('图片路径:', imgRes.path)
          console.log('图片宽度:', imgRes.width)
          console.log('图片高度:', imgRes.height)
          console.log('完整图片信息:', JSON.stringify(imgRes))

          // 在微信小程序 Canvas 2D API 中，必须使用 canvas.createImage() 创建 Image 对象
          // drawImage 不能直接使用字符串路径
          if (canvas && typeof canvas.createImage === 'function') {
            console.log('使用 canvas.createImage() 创建 Image 对象')
            const img = canvas.createImage()
            
            img.onload = () => {
              console.log('Image 对象加载成功')
              try {
                // 使用 Image 对象绘制
                ctx.drawImage(img, 50, 200, 650, 400)
                console.log('✅ 图片绘制成功!')
                
                // 绘制说明文字
                ctx.fillStyle = '#666666'
                ctx.font = '24px sans-serif'
                ctx.textAlign = 'left'
                ctx.fillText('✅ 绘制成功: 使用 canvas.createImage()', 50, 650)
                ctx.fillText('图片尺寸: ' + imgRes.width + 'x' + imgRes.height, 50, 680)
                ctx.fillText('Canvas尺寸: 750x1000', 50, 710)
                
                // 导出图片
                exportCanvas(canvas)
              } catch (drawErr) {
                console.error('Canvas drawImage 失败:', drawErr)
                console.error('错误详情:', drawErr.message)
                uni.hideLoading()
                uni.showToast({
                  title: '绘制失败: ' + drawErr.message,
                  icon: 'none',
                  duration: 3000
                })
              }
            }
            
            img.onerror = (err) => {
              console.error('图片加载失败 (createImage):', err)
              console.error('尝试的图片路径:', imgRes.path)
              console.error('原始路径:', imagePath)
              
              // 如果相对路径失败，尝试使用原始绝对路径
              if (imgRes.path !== imagePath && imagePath.startsWith('/')) {
                console.log('尝试使用原始绝对路径:', imagePath)
                img.src = imagePath
              } else {
                uni.hideLoading()
                uni.showToast({
                  title: '图片加载失败，请检查路径',
                  icon: 'none',
                  duration: 3000
                })
              }
            }
            
            // 优先使用原始绝对路径，因为更可靠
            // 如果 res.path 是完整的本地路径（包含协议），使用 res.path
            // 否则使用原始路径 imagePath（绝对路径）
            let srcPath = imgRes.path
            
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
              console.warn('使用原始路径:', imagePath)
              srcPath = imagePath
            }
            
            console.log('设置 Image src 为:', srcPath)
            img.src = srcPath
          } else {
            console.error('canvas.createImage 不可用')
            uni.hideLoading()
            uni.showToast({
              title: 'canvas.createImage 不可用',
              icon: 'none'
            })
          }
        },
        fail: (err) => {
          console.error('获取图片信息失败:', err)
          uni.hideLoading()
          uni.showToast({
            title: '获取图片信息失败: ' + (err.errMsg || '未知错误'),
            icon: 'none',
            duration: 3000
          })
        }
      })
    })
}

const exportCanvas = (canvas) => {
  console.log('开始导出 Canvas...')
  
  setTimeout(() => {
    uni.canvasToTempFilePath({
      canvas: canvas,
      success: (res) => {
        console.log('✅ Canvas 导出成功:', res.tempFilePath)
        uni.hideLoading()
        
        uni.previewImage({
          urls: [res.tempFilePath],
          success: () => {
            uni.showModal({
              title: '测试成功',
              content: 'Canvas 绘制成功！是否保存到相册？',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  uni.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: () => {
                      uni.showToast({
                        title: '已保存到相册',
                        icon: 'success'
                      })
                    },
                    fail: (saveErr) => {
                      console.error('保存失败:', saveErr)
                    }
                  })
                }
              }
            })
          }
        })
      },
      fail: (err) => {
        console.error('❌ Canvas 导出失败:', err)
        uni.hideLoading()
        uni.showToast({
          title: '导出失败: ' + (err.errMsg || '未知错误'),
          icon: 'none',
          duration: 3000
        })
      }
    })
  }, 500)
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 30rpx;
}

.header {
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  display: block;
}

.test-section {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 20rpx;
  font-weight: 600;
}

.test-image {
  width: 100%;
  max-width: 600rpx;
  height: auto;
  display: block;
  margin: 0 auto 20rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
}

.image-info {
  font-size: 24rpx;
  color: #999;
  display: block;
  text-align: center;
}

.test-btn {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: #fff;
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
}

.test-btn:active {
  transform: scale(0.98);
}

.btn-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 600;
}

.canvas {
  position: fixed;
  left: -9999rpx;
  top: 0;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}
</style>
