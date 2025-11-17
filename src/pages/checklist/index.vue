<template>
  <view v-if="currentTheme" class="page-container">
    <!-- 风格切换器 -->
    <view class="style-switcher">
      <view class="switcher-header">
        <text class="switcher-title">选择风格</text>
      </view>
      <view class="style-options">
        <view
          v-for="style in availableStyles"
          :key="style.id"
          class="style-option"
          :class="{ active: currentStyleId === style.id }"
          @click="switchStyle(style.id)"
        >
          <view 
            class="style-preview"
            :style="{ backgroundColor: style.bgColor }"
          >
            <text class="preview-text">Aa</text>
          </view>
          <text class="style-name">{{ style.name }}</text>
        </view>
      </view>
    </view>

    <!-- 条件渲染样式组件 -->
    <avatar-warm-style 
      v-if="currentStyleId === 'avatar-warm'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />
    <simple-style 
      v-else-if="currentStyleId === 'simple'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />
    <formal-style 
      v-else-if="currentStyleId === 'formal'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />
    <vintage-style 
      v-else-if="currentStyleId === 'vintage'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />
    <tags-style 
      v-else-if="currentStyleId === 'tags'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />

    <!-- 底部操作栏（公共） -->
    <view class="action-bar">
      <view class="progress-info">
        <text class="progress-text">已完成 {{ checkedCount }}/{{ items.length }} 项</text>
      </view>
      <view class="action-btn" @click="generateImage">
        <text class="action-text">生成图片</text>
      </view>
    </view>

    <!-- Canvas画布（公共，放在父组件） -->
    <canvas
      type="2d"
      id="checklist-canvas"
      class="canvas"
      :style="{ width: '750px', height: '1200px' }"
    ></canvas>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 导入清单主题
import lifeCompleted from '../../data/checklists/life-completed.js'
import foodMemories from '../../data/checklists/food-memories.js'
import travelStories from '../../data/checklists/travel-stories.js'
import workGrowth from '../../data/checklists/work-growth.js'
import artLife from '../../data/checklists/art-life.js'
import dailyTexture from '../../data/checklists/daily-texture.js'
import smallHappiness from '../../data/checklists/small-happiness.js'
import movies from '../../data/checklists/movies.js'

// 导入样式组件
import AvatarWarmStyle from '../../styles/avatar-warm-style.vue'
import SimpleStyle from '../../styles/simple-style.vue'
import FormalStyle from '../../styles/formal-style.vue'
import VintageStyle from '../../styles/vintage-style.vue'
import TagsStyle from '../../styles/tags-style.vue'

const themes = {
  'life-completed': lifeCompleted,
  'food-memories': foodMemories,
  'travel-stories': travelStories,
  'work-growth': workGrowth,
  'art-life': artLife,
  'daily-texture': dailyTexture,
  'small-happiness': smallHappiness,
  'movies': movies
}

const styleComponents = {
  'avatar-warm': AvatarWarmStyle,
  'simple': SimpleStyle,
  'formal': FormalStyle,
  'vintage': VintageStyle,
  'tags': TagsStyle
}

const availableStyles = ref([
  { id: 'avatar-warm', name: '头像温暖', bgColor: '#f5f1e8' },
  { id: 'simple', name: '简约清新', bgColor: '#f8f9fa' },
  { id: 'formal', name: '正式简洁', bgColor: '#f5f1e8' },
  { id: 'vintage', name: '复古温馨', bgColor: '#f9f3e8' },
  { id: 'tags', name: '标签云', bgColor: '#e6f7ff' }
])

const currentThemeId = ref('')
const currentStyleId = ref('')
const currentTheme = ref(null)
const items = ref([])
const currentStyleRef = ref(null) // 当前样式组件的引用

onLoad((options) => {
  currentThemeId.value = options.themeId
  currentStyleId.value = options.styleId || 'avatar-warm'
  
  currentTheme.value = themes[currentThemeId.value]
  
  if (currentTheme.value) {
    items.value = currentTheme.value.items.map(text => ({
      text,
      checked: false
    }))
  }
})

// 移除动态组件逻辑，改用条件渲染

const checkedCount = computed(() => {
  return items.value.filter(item => item.checked).length
})

const toggleItem = (index) => {
  items.value[index].checked = !items.value[index].checked
}

const switchStyle = (newStyleId) => {
  currentStyleId.value = newStyleId
}

const generateImage = async () => {
  if (!currentStyleRef.value) {
    uni.showToast({
      title: '样式组件未加载',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: '生成中...'
  })

  try {
    // 等待DOM更新
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 500))

    // 获取Canvas节点（Canvas 2D API）
    // 在页面中直接使用createSelectorQuery，不需要.in()
    const query = uni.createSelectorQuery()
    query.select('#checklist-canvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        if (!res || !res[0] || !res[0].node) {
          uni.hideLoading()
          uni.showToast({
            title: 'Canvas节点获取失败',
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

        // 调用当前样式组件的绘制方法
        if (currentStyleRef.value && typeof currentStyleRef.value.drawCanvas === 'function') {
          await currentStyleRef.value.drawCanvas(ctx, canvas, { width: 750, height: 1200 })
        } else {
          throw new Error('样式组件未提供drawCanvas方法')
        }

        // 导出图片
        setTimeout(() => {
          uni.canvasToTempFilePath({
            canvas: canvas,
            success: (res) => {
              uni.hideLoading()
              uni.previewImage({
                urls: [res.tempFilePath],
                success: () => {
                  uni.showModal({
                    title: '保存图片',
                    content: '是否保存到相册？',
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
                          fail: (err) => {
                            if (err.errMsg.includes('auth')) {
                              uni.showModal({
                                title: '提示',
                                content: '需要授权访问相册',
                                success: (settingRes) => {
                                  if (settingRes.confirm) {
                                    uni.openSetting()
                                  }
                                }
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            },
            fail: (err) => {
              uni.hideLoading()
              uni.showToast({
                title: '导出失败: ' + err.errMsg,
                icon: 'none'
              })
            }
          })
        }, 500)
      })
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '生成失败: ' + (error.message || '未知错误'),
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 160rpx; /* 为底部操作栏留出空间 */
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 140rpx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.progress-info {
  margin-bottom: 10rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #999;
}

.action-btn {
  width: 600rpx;
  height: 80rpx;
  background-color: #1890ff;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
}

.action-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.canvas {
  position: fixed;
  left: -9999rpx;
  top: 0;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

/* 风格切换器 */
.style-switcher {
  background-color: #fff;
  padding: 30rpx;
  margin: 20rpx 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.switcher-header {
  margin-bottom: 20rpx;
}

.switcher-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.style-options {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: all 0.3s ease;
}

.style-option:active {
  transform: scale(0.95);
}

.style-preview {
  width: 100rpx;
  height: 60rpx;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid transparent;
  transition: all 0.3s ease;
}

.style-option.active .style-preview {
  border-color: #4a90e2;
  transform: scale(1.05);
}

.preview-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #333;
}

.style-name {
  font-size: 22rpx;
  color: #666;
  text-align: center;
}

.style-option.active .style-name {
  color: #4a90e2;
  font-weight: bold;
}
</style>