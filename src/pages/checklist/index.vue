<template>
  <view v-if="currentTheme" class="page-container" :class="{ 'toolbar-hidden': isToolbarHidden }" @tap="handleScreenTap">
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
    <handwritten-style 
      v-else-if="currentStyleId === 'handwritten'"
      ref="currentStyleRef"
      :items="items"
      :theme="currentTheme"
      @toggle="toggleItem"
    />

    <!-- 底部操作栏（公共） -->
    <view class="action-bar" :class="{ hidden: isToolbarHidden }">
      <!-- 风格切换工具栏 -->
      <view class="style-toolbar">
        <view class="toolbar-label">风格</view>
        <view class="style-options">
          <view
            v-for="style in availableStyles"
            :key="style.id"
            class="style-option"
            :class="{ active: currentStyleId === style.id }"
            @click.stop="switchStyle(style.id)"
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
        <view class="action-btn" @click.stop="generateImage">
          <text class="action-text">生成图片</text>
        </view>
      </view>
    </view>
    
    <!-- 截图提示（首次隐藏时显示） -->
    <view 
      v-if="isToolbarHidden && showScreenshotHint" 
      class="screenshot-hint"
      @click.stop="showScreenshotHint = false"
    >
      <text class="hint-text">💡 双击屏幕可切换工具栏显示</text>
    </view>

    <!-- Canvas画布（公共，放在父组件） -->
    <canvas
      type="2d"
      id="checklist-canvas"
      class="canvas"
      :style="{ width: '750px', height: currentStyleId === 'handwritten' ? '1400px' : '1200px' }"
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
import HandwrittenStyle from '../../styles/handwritten-style.vue'

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
  'crazy-bright': CrazyBrightStyle,
  'handwritten': HandwrittenStyle
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
  { id: 'crazy-bright', name: '不规则-亮色', bgColor: '#ffeef8' },
  { id: 'handwritten', name: '手写风格', bgColor: '#ffffff' }
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

// 工具栏显示/隐藏状态
const isToolbarHidden = ref(false)
const showScreenshotHint = ref(false)

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
  setInteractionFlag()
  items.value[index].checked = !items.value[index].checked
}

const switchStyle = (newStyleId) => {
  setInteractionFlag()
  currentStyleId.value = newStyleId
}

// 切换工具栏显示/隐藏
const toggleToolbar = () => {
  // 标记有交互，避免连续触发
  setInteractionFlag()
  
  const wasHidden = isToolbarHidden.value
  isToolbarHidden.value = !isToolbarHidden.value
  
  // 如果是第一次隐藏，显示提示
  if (!wasHidden && isToolbarHidden.value) {
    showScreenshotHint.value = true
    // 3秒后自动隐藏提示
    setTimeout(() => {
      showScreenshotHint.value = false
    }, 3000)
  }
  
  // 调整页面padding，避免内容被遮挡
  // 这个通过CSS的transition自动处理
}

// 双击检测变量
let lastTapTime = 0
let lastTapTarget = null
const DOUBLE_TAP_DELAY = 350 // 双击间隔时间（毫秒）

// 标记是否有其他交互发生（用于避免双击误触）
let hasOtherInteraction = false
let interactionTimer = null

// 设置交互标记
const setInteractionFlag = () => {
  hasOtherInteraction = true
  if (interactionTimer) {
    clearTimeout(interactionTimer)
  }
  interactionTimer = setTimeout(() => {
    hasOtherInteraction = false
  }, DOUBLE_TAP_DELAY + 100)
}

// 处理屏幕点击，实现双击切换工具栏
const handleScreenTap = (e) => {
  // 如果有其他交互发生，不处理双击
  if (hasOtherInteraction) {
    return
  }
  
  const target = e.target
  const currentTarget = e.currentTarget
  
  // 如果点击的不是容器本身，检查是否是可交互元素
  if (target !== currentTarget) {
    const isInteractive = checkIfInteractiveElement(target)
    if (isInteractive) {
      setInteractionFlag()
      return
    }
  }
  
  // 延迟处理，给其他事件处理机会
  setTimeout(() => {
    // 如果在这期间有其他交互，不处理
    if (hasOtherInteraction) {
      return
    }
    
    const currentTime = Date.now()
    const timeDiff = currentTime - lastTapTime
    
    // 双击检测：时间间隔短
    if (timeDiff < DOUBLE_TAP_DELAY && timeDiff > 0) {
      // 双击检测成功
      toggleToolbar()
      lastTapTime = 0
      lastTapTarget = null
    } else {
      // 记录这次点击
      lastTapTime = currentTime
      lastTapTarget = target
    }
  }, 50) // 延迟50ms，让其他事件先处理
}

// 检查元素是否是可交互元素
const checkIfInteractiveElement = (element) => {
  if (!element) return false
  
  try {
    // 在小程序中，可能需要通过其他方式获取class
    // 尝试多种方式获取className
    let classStr = ''
    
    if (element.className) {
      if (typeof element.className === 'string') {
        classStr = element.className
      } else if (typeof element.className === 'object' && element.className.baseVal) {
        classStr = element.className.baseVal
      } else if (Array.isArray(element.className)) {
        classStr = element.className.join(' ')
      }
    }
    
    // 也可以通过 dataset 或其他属性判断
    const dataset = element.dataset || {}
    
    // 可交互元素的class关键词
    const interactiveKeywords = [
      'tag-item',
      'action-btn',
      'style-option',
      'screenshot-hint',
      'container' // 样式组件的容器，点击它也不应该触发
    ]
    
    // 如果包含可交互关键词，返回true
    if (interactiveKeywords.some(keyword => classStr.includes(keyword))) {
      return true
    }
    
    // 检查tagName
    const tagName = (element.tagName || '').toLowerCase()
    const interactiveTags = ['button', 'input', 'textarea', 'select']
    if (interactiveTags.includes(tagName)) {
      return true
    }
  } catch (err) {
    // 如果获取信息失败，保守处理，不认为是可交互元素
    console.log('checkIfInteractiveElement error:', err)
  }
  
  return false
}

const generateImage = async () => {
  setInteractionFlag()
  
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
        const canvasHeight = currentStyleId.value === 'handwritten' ? 1400 : 1200
        if (currentStyleRef.value && typeof currentStyleRef.value.drawCanvas === 'function') {
          await currentStyleRef.value.drawCanvas(ctx, canvas, { width: 750, height: canvasHeight })
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
  transition: padding-bottom 0.3s ease;
  position: relative;
}

/* 工具栏隐藏时，减少底部padding */
.page-container.toolbar-hidden {
  padding-bottom: env(safe-area-inset-bottom);
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
  transform: translateY(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-bar.hidden {
  transform: translateY(100%);
  box-shadow: none;
}

/* 风格切换工具栏 */
.style-toolbar {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
  position: relative;
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


/* 截图提示 */
.screenshot-hint {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 24rpx 40rpx;
  border-radius: 16rpx;
  z-index: 200;
  animation: hintFadeIn 0.3s ease;
  max-width: 80%;
  text-align: center;
  backdrop-filter: blur(10rpx);
}

.hint-text {
  font-size: 28rpx;
  line-height: 1.5;
  color: #fff;
}

@keyframes hintFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
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