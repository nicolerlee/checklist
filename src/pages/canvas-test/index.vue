<template>
  <view class="container">
    <view class="header">
      <text class="title">Canvas测试页面</text>
    </view>

    <view class="test-section">
      <view class="test-item">
        <text class="test-label">测试1: 旧版Canvas API</text>
        <view class="test-btn" @click="testOldCanvas">
          <text>测试旧版API</text>
        </view>
      </view>

      <view class="test-item">
        <text class="test-label">测试2: Canvas 2D API</text>
        <view class="test-btn" @click="testCanvas2D">
          <text>测试2D API</text>
        </view>
      </view>
    </view>

    <!-- 旧版Canvas -->
    <canvas
      canvas-id="old-canvas"
      id="old-canvas"
      class="canvas"
      :style="{ width: '750px', height: '1000px' }"
    ></canvas>

    <!-- Canvas 2D -->
    <canvas
      type="2d"
      id="canvas-2d"
      class="canvas"
      :style="{ width: '750px', height: '1000px' }"
    ></canvas>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const testOldCanvas = () => {
  console.log('=== 测试旧版Canvas API ===')
  uni.showLoading({ title: '测试中...' })

  try {
    const ctx = uni.createCanvasContext('old-canvas')
    console.log('旧版Canvas上下文创建:', ctx)

    // 绘制测试内容
    ctx.setFillStyle('#ff0000')
    ctx.fillRect(0, 0, 200, 200)
    
    ctx.setFillStyle('#000000')
    ctx.setFontSize(40)
    ctx.setTextAlign('center')
    ctx.fillText('旧版API测试', 375, 500)

    console.log('调用ctx.draw(true)...')
    ctx.draw(true, () => {
      console.log('旧版Canvas draw回调执行了！')
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'old-canvas',
          success: (res) => {
            console.log('旧版Canvas导出成功:', res.tempFilePath)
            uni.hideLoading()
            uni.previewImage({
              urls: [res.tempFilePath],
              success: () => {
                uni.showToast({
                  title: '旧版API成功',
                  icon: 'success'
                })
              }
            })
          },
          fail: (err) => {
            console.error('旧版Canvas导出失败:', err)
            uni.hideLoading()
            uni.showToast({
              title: '旧版API失败: ' + err.errMsg,
              icon: 'none'
            })
          }
        })
      }, 1000)
    })
  } catch (error) {
    console.error('旧版Canvas错误:', error)
    uni.hideLoading()
    uni.showToast({
      title: '旧版API错误',
      icon: 'none'
    })
  }
}

const testCanvas2D = () => {
  console.log('=== 测试Canvas 2D API ===')
  uni.showLoading({ title: '测试中...' })

  try {
    const query = uni.createSelectorQuery()
    query.select('#canvas-2d')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log('Canvas 2D查询结果:', res)
        
        if (!res || !res[0] || !res[0].node) {
          console.error('Canvas 2D节点获取失败:', res)
          uni.hideLoading()
          uni.showToast({
            title: 'Canvas 2D节点获取失败',
            icon: 'none'
          })
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = uni.getSystemInfoSync().pixelRatio

        // 设置Canvas实际尺寸
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        console.log('Canvas 2D上下文创建成功，尺寸:', canvas.width, canvas.height)

        // 绘制测试内容
        ctx.fillStyle = '#00ff00'
        ctx.fillRect(0, 0, 200, 200)
        
        ctx.fillStyle = '#000000'
        ctx.font = 'bold 40px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('2D API测试', 375, 500)

        console.log('Canvas 2D绘制完成，准备导出...')
        
        setTimeout(() => {
          uni.canvasToTempFilePath({
            canvas: canvas,
            success: (res) => {
              console.log('Canvas 2D导出成功:', res.tempFilePath)
              uni.hideLoading()
              uni.previewImage({
                urls: [res.tempFilePath],
                success: () => {
                  uni.showToast({
                    title: '2D API成功',
                    icon: 'success'
                  })
                }
              })
            },
            fail: (err) => {
              console.error('Canvas 2D导出失败:', err)
              uni.hideLoading()
              uni.showToast({
                title: '2D API失败: ' + err.errMsg,
                icon: 'none'
              })
            }
          })
        }, 500)
      })
  } catch (error) {
    console.error('Canvas 2D错误:', error)
    uni.hideLoading()
    uni.showToast({
      title: '2D API错误',
      icon: 'none'
    })
  }
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
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  margin-bottom: 40rpx;
}

.test-item {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.test-label {
  font-size: 28rpx;
  color: #666;
  display: block;
  margin-bottom: 20rpx;
}

.test-btn {
  background-color: #4a90e2;
  color: #fff;
  padding: 24rpx;
  border-radius: 12rpx;
  text-align: center;
}

.test-btn text {
  font-size: 28rpx;
  color: #fff;
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
