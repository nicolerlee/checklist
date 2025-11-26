<template>
  <view class="container">
    <view class="content-wrapper">
      <view class="form-section">
        <view class="section-label">标题 *</view>
        <input 
          class="title-input"
          v-model="formData.title"
          placeholder="请输入清单标题"
          maxlength="20"
        />
      </view>

      <view class="form-section">
        <view class="section-label">批量导入 (每行一项，共{{ itemCount }}项)</view>
        <textarea 
          class="batch-textarea"
          v-model="batchText"
          placeholder="请输入清单内容，每行一项"
          :maxlength="1000"
        />
        <view class="char-count">{{ batchText.length }}/1000</view>
      </view>
    </view>

    <view class="bottom-bar">
      <view class="cancel-btn" @click="goBack">
        <text class="btn-text">取消</text>
      </view>
      <view 
        class="save-btn" 
        :class="{ disabled: !canSave }"
        @click="saveList"
      >
        <text class="btn-text">保存</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const itemCount = computed(() => {
  return batchText.value.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0).length
})

const canSave = computed(() => {
  return formData.value.title.trim().length > 0 && 
         batchText.value.trim().length > 0 && 
         !isSaving.value
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

  const validItems = batchText.value.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  if (validItems.length === 0) {
    uni.showToast({ title: '请至少添加一个条目', icon: 'none' })
    return
  }

  isSaving.value = true
  uni.showLoading({ title: '保存中...' })

  try {
    const newList = createCustomList(
      formData.value.title.trim(),
      validItems
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
      confirmText: '离开',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack({ delta: 1 })
        }
      }
    })
  } else {
    uni.navigateBack({ delta: 1 })
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f5f1e8;
  padding-bottom: 140rpx;
}

.content-wrapper {
  padding: 32rpx;
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}

.section-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.title-input {
  width: 100%;
  height: 80rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

.batch-textarea {
  width: 100%;
  min-height: 700rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 26rpx;
  color: #333;
  line-height: 1.6;
  box-sizing: border-box;
}

.char-count {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: #fff;
  gap: 24rpx;
}

.cancel-btn, .save-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-btn {
  background: #e5e5e5;
}

.cancel-btn:active {
  opacity: 0.8;
}

.save-btn {
  background: #c0c0c0;
}

.save-btn:active {
  opacity: 0.8;
}

.save-btn.disabled {
  opacity: 0.5;
}

.btn-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}
</style>
