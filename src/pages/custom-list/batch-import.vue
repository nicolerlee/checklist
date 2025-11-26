<template>
  <view class="container">


    <view class="form-content">
      <!-- 清单标题 -->
      <view class="form-section">
        <text class="section-title">清单标题 *</text>
        <input 
          class="title-input"
          v-model="formData.title"
          placeholder="请输入清单标题"
          maxlength="20"
        />
      </view>

      <!-- 批量输入区域 -->
      <view class="form-section">
        <view class="section-header">
          <text class="section-title">清单内容 *</text>
          <text class="tip">每行一项，支持换行批量输入</text>
        </view>
        <textarea 
          class="batch-textarea"
          v-model="batchText"
          placeholder="请输入清单内容，每行一项"
          :maxlength="2000"
        />
        <view class="char-count">{{ batchText.length }}/2000</view>
      </view>

      <!-- 预览区域 -->
      <view v-if="previewItems.length > 0" class="preview-section">
        <text class="section-title">预览 ({{ previewItems.length }} 项)</text>
        <scroll-view class="preview-list" scroll-y>
          <view 
            v-for="(item, index) in previewItems" 
            :key="'preview-' + index"
            class="preview-item"
          >
            <text class="item-number">{{ index + 1 }}</text>
            <text class="item-text">{{ item }}</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="btn-group">
        <view class="cancel-btn" @click="goBack">
          <text class="cancel-text">取消</text>
        </view>
        <view 
          class="save-btn" 
          :class="{ disabled: !canSave }"
          @click="saveList"
        >
          <text class="save-text">保存</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  createCustomList, 
  addCustomList, 
  canAddNewList 
} from '../../utils/custom-lists.js'

const formData = ref({
  title: ''
})

const batchText = ref('')
const isSaving = ref(false)

const previewItems = computed(() => {
  if (!batchText.value.trim()) return []
  
  return batchText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .slice(0, 100) // 最多100项
})

const canSave = computed(() => {
  return formData.value.title.trim().length > 0 && previewItems.value.length > 0 && !isSaving.value
})

const saveList = () => {
  if (!canSave.value || isSaving.value) {
    if (!isSaving.value) {
      uni.showToast({ title: '请填写完整信息', icon: 'none' })
    }
    return
  }

  if (!canAddNewList()) {
    uni.showToast({ title: '最多只能创建5份清单', icon: 'none' })
    return
  }

  isSaving.value = true
  uni.showLoading({ title: '保存中...' })

  try {
    const newList = createCustomList(
      formData.value.title.trim(),
      previewItems.value
    )
    
    const success = addCustomList(newList)
    uni.hideLoading()

    if (success) {
      uni.showToast({ title: '创建成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      uni.showToast({ title: '创建失败', icon: 'error' })
      isSaving.value = false
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '操作失败', icon: 'error' })
    isSaving.value = false
  }
}

const goBack = () => {
  const hasChanges = formData.value.title.trim().length > 0 || batchText.value.trim().length > 0
  
  if (hasChanges) {
    uni.showModal({
      title: '确认离开',
      content: '有未保存的更改，确定要离开吗？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack()
        }
      }
    })
  } else {
    uni.navigateBack()
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%);
  padding-bottom: 120rpx;
}

.header {
  padding: 40rpx 30rpx 20rpx;
  text-align: center;
}

.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #374151;
}

.form-content {
  padding: 40rpx 30rpx 0;
}

.form-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #374151;
}

.tip {
  font-size: 24rpx;
  color: #6b7280;
}

.title-input {
  width: 100%;
  height: 80rpx;
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #374151;
}

.batch-textarea {
  width: 100%;
  min-height: 300rpx;
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #374151;
  line-height: 1.6;
}

.char-count {
  text-align: right;
  font-size: 24rpx;
  color: #9ca3af;
  margin-top: 8rpx;
}

.preview-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.preview-list {
  max-height: 400rpx;
  margin-top: 16rpx;
}

.preview-item {
  display: flex;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f3f4f6;
  gap: 16rpx;
}

.preview-item:last-child {
  border-bottom: none;
}

.item-number {
  width: 48rpx;
  height: 32rpx;
  background: #374151;
  color: #fff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.item-text {
  flex: 1;
  font-size: 26rpx;
  color: #374151;
  line-height: 1.4;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  border-top: 1rpx solid rgba(0, 0, 0, 0.06);
}

.btn-group {
  display: flex;
  gap: 20rpx;
}

.cancel-btn, .save-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cancel-btn {
  background: #f3f4f6;
  border: 2rpx solid #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
}

.save-btn.disabled {
  background: #d1d5db;
}

.cancel-text, .save-text {
  font-size: 32rpx;
  font-weight: 600;
}

.cancel-text {
  color: #374151;
}

.save-text {
  color: #fff;
}

.save-btn.disabled .save-text {
  color: #9ca3af;
}
</style>