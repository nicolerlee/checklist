<template>
  <view v-if="currentTheme" class="page-container">
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
    <tags-style2 
      v-else-if="currentStyleId === 'tags2'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />
    <crazy-style 
      v-else-if="currentStyleId === 'crazy'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />
    <crazy-bright-style 
      v-else-if="currentStyleId === 'crazy-bright'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />
    <normal-style 
      v-else-if="currentStyleId === 'normal'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />

    <!-- 底部操作栏（公共） -->
    <view class="action-bar">
      <!-- 风格切换工具栏 -->
      <view class="style-toolbar">
        <view class="toolbar-label">风格</view>
        <view class="style-options">
          <view
            v-for="style in availableStyles"
            :key="style.id"
            class="style-option"
            :class="{ active: currentStyleId === style.id }"
            @click="switchStyle(style.id)"
          >
            <text class="style-name">{{ style.name }}</text>
          </view>
        </view>
      </view>
      
      <!-- 进度和生成按钮 -->
      <view class="action-section">
        <view class="progress-info">
          <text class="progress-text">已完成 {{ checkedCount }}/{{ items.length }} 项</text>
        </view>
        <view class="action-btn" @click="generateImage">
          <text class="action-text">生成图片</text>
        </view>
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

// 从索引文件自动加载所有清单主题
import themesModule from '../../data/checklists/index.js'

const themes = themesModule.default || themesModule

console.log('自动加载的清单主题数量:', Object.keys(themes).length)
console.log('清单主题列表:', Object.keys(themes).map(id => themes[id].name))

// 导入样式组件
import AvatarWarmStyle from '../../styles/avatar-warm-style.vue'
import SimpleStyle from '../../styles/simple-style.vue'
import FormalStyle from '../../styles/formal-style.vue'
import VintageStyle from '../../styles/vintage-style.vue'
import TagsStyle from '../../styles/tags-style1.vue'
import TagsStyle2 from '../../styles/tags-style2.vue'
import NormalStyle from '../../styles/normal-style.vue'
import CrazyStyle from '../../styles/crazy-style.vue'
import CrazyBrightStyle from '../../styles/crazy-bright-style.vue'

// themes 对象已通过 require.context 自动加载（见上方）

const styleComponents = {
  'avatar-warm': AvatarWarmStyle,
  'simple': SimpleStyle,
  'normal': NormalStyle,
  'formal': FormalStyle,
  'vintage': VintageStyle,
  'tags': TagsStyle,
  'tags2': TagsStyle2,
  'crazy': CrazyStyle,
  'crazy-bright': CrazyBrightStyle
}

// 所有可用的样式定义
const allStyles = [
  { id: 'avatar-warm', name: '头像温暖', bgColor: '#f5f1e8' },
  { id: 'simple', name: '简约清新', bgColor: '#f8f9fa' },
  { id: 'normal', name: '标准样式', bgColor: '#f8f9fa' },
  { id: 'formal', name: '正式简洁', bgColor: '#f5f1e8' },
  { id: 'vintage', name: '复古温馨', bgColor: '#f9f3e8' },
  { id: 'tags', name: '标签云', bgColor: '#e6f7ff' },
  { id: 'tags2', name: '标签云2', bgColor: '#ffffff' },
  { id: 'crazy', name: '不规则', bgColor: '#ffeef8' },
  { id: 'crazy-bright', name: '不规则-亮色', bgColor: '#ffeef8' }
]

// 当前主题可用的样式（根据主题配置动态计算）
const availableStyles = computed(() => {
  if (!currentTheme.value || !currentTheme.value.availableStyles) {
    // 如果主题没有定义 availableStyles，使用所有样式
    return allStyles
  }
  
  // 根据主题的 availableStyles 过滤
  const themeStyleIds = currentTheme.value.availableStyles
  return allStyles.filter(style => themeStyleIds.includes(style.id))
})

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
    
    // 获取当前主题可用的样式 ID 列表
    const themeAvailableStyleIds = currentTheme.value.availableStyles 
      ? currentTheme.value.availableStyles 
      : allStyles.map(s => s.id)
    
    // 如果传入的 styleId 不在可用样式中，使用 defaultStyle 或第一个可用样式
    if (!themeAvailableStyleIds.includes(currentStyleId.value)) {
      currentStyleId.value = currentTheme.value.defaultStyle || themeAvailableStyleIds[0] || 'simple'
    }
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
  background: linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%);
  padding-bottom: 240rpx; /* 为底部操作栏留出空间 */
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-top: 1rpx solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

/* 风格切换工具栏 */
.style-toolbar {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.toolbar-label {
  font-size: 26rpx;
  color: #1f2937;
  font-weight: 600;
  flex-shrink: 0;
}

.style-options {
  display: flex;
  gap: 12rpx;
  flex: 1;
  overflow-x: auto;
}

.style-options::-webkit-scrollbar {
  display: none;
}

.style-option {
  padding: 12rpx 24rpx;
  background: #f3f4f6;
  border-radius: 20rpx;
  border: 1rpx solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

.style-option:active {
  transform: scale(0.95);
}

.style-option.active {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.style-name {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
}

.style-option.active .style-name {
  color: #fff;
  font-weight: 600;
}

/* 进度和生成按钮区域 */
.action-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rpx 30rpx;
  gap: 16rpx;
}

.progress-info {
  width: 100%;
  text-align: center;
}

.progress-text {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 400;
}

.action-btn {
  width: 100%;
  max-width: 600rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.action-text {
  font-size: 32rpx;
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