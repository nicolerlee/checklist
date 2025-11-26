<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">{{ isEdit ? '编辑清单' : '新建清单' }}</text>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-container" scroll-y>
      <view class="form-content">
        <!-- 清单标题 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-title">清单标题</text>
            <text class="required">*</text>
          </view>
          <input 
            class="title-input"
            v-model="formData.title"
            placeholder="请输入清单标题"
            maxlength="20"
          />
        </view>

        <!-- 输入模式切换 -->
        <view class="mode-switch">
          <view 
            class="mode-btn" 
            :class="{ active: inputMode === 'single' }"
            @click="inputMode = 'single'"
          >
            <text class="mode-text">逐项输入</text>
          </view>
          <view 
            class="mode-btn" 
            :class="{ active: inputMode === 'batch' }"
            @click="inputMode = 'batch'"
          >
            <text class="mode-text">批量输入</text>
          </view>
        </view>

        <!-- 逐项输入模式 -->
        <view v-if="inputMode === 'single'" class="form-section">
          <view class="section-header">
            <text class="section-title">清单条目</text>
            <text class="required">*</text>
            <text class="item-count">{{ formData.items.length }} 项</text>
          </view>
          
          <view class="items-list">
            <view 
              v-for="(item, index) in formData.items" 
              :key="index"
              class="item-row"
            >
              <view class="item-number">{{ index + 1 }}</view>
              <input 
                class="item-input"
                v-model="item.text"
                :placeholder="`第 ${index + 1} 项内容`"
                maxlength="50"
              />
              <view class="item-delete" @click="removeItem(index)">
                <text class="delete-icon">×</text>
              </view>
            </view>
          </view>

          <view class="add-item-btn" @click="addItem">
            <text class="add-icon">+</text>
            <text class="add-text">添加条目</text>
          </view>
        </view>

        <!-- 批量输入模式 -->
        <view v-else class="form-section">
          <view class="section-header">
            <text class="section-title">批量输入</text>
            <text class="required">*</text>
            <text class="tip">每行一项</text>
          </view>
          <textarea 
            class="batch-textarea"
            v-model="batchText"
            placeholder="请输入清单内容，每行一项"
            :maxlength="1000"
          />
          <view class="char-count">{{ batchText.length }}/1000</view>
        </view>
      </view>
    </scroll-view>

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
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { 
  createCustomList, 
  addCustomList, 
  updateCustomList, 
  getCustomListById 
} from '../../utils/custom-lists.js'

const isEdit = ref(false)
const editId = ref('')

const inputMode = ref('batch') // 默认批量输入模式
const batchText = ref('')
const isSaving = ref(false)

const formData = ref({
  title: '',
  items: [{ text: '' }]
})

const canSave = computed(() => {
  const hasTitle = formData.value.title.trim().length > 0
  if (inputMode.value === 'batch') {
    return hasTitle && batchText.value.trim().length > 0 && !isSaving.value
  } else {
    return hasTitle && formData.value.items.some(item => item.text.trim().length > 0) && !isSaving.value
  }
})

onLoad((options) => {
  if (options.id) {
    isEdit.value = true
    editId.value = options.id
    loadEditData()
  }
})

const loadEditData = () => {
  const list = getCustomListById(editId.value)
  if (list) {
    formData.value = {
      title: list.title,
      items: list.items.map(item => ({ text: item.text }))
    }
    // 同步到批量输入
    batchText.value = list.items.map(item => item.text).join('\n')
  } else {
    uni.showToast({ title: '清单不存在', icon: 'error' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
}

const addItem = () => {
  formData.value.items.push({ text: '' })
}

const removeItem = (index) => {
  if (formData.value.items.length <= 1) {
    uni.showToast({
      title: '至少保留一个条目',
      icon: 'none'
    })
    return
  }
  formData.value.items.splice(index, 1)
}

const saveList = () => {
  if (!canSave.value || isSaving.value) {
    if (!isSaving.value) {
      uni.showToast({ title: '请填写完整信息', icon: 'none' })
    }
    return
  }

  let validItems = []
  if (inputMode.value === 'batch') {
    validItems = batchText.value.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
  } else {
    validItems = formData.value.items
      .filter(item => item.text.trim().length > 0)
      .map(item => item.text.trim())
  }
  
  if (validItems.length === 0) {
    uni.showToast({ title: '请至少添加一个条目', icon: 'none' })
    return
  }

  isSaving.value = true
  uni.showLoading({ title: '保存中...' })

  try {
    let success = false
    
    if (isEdit.value) {
      const updatedList = {
        id: editId.value,
        title: formData.value.title.trim(),
        items: validItems.map(text => ({ text, checked: false }))
      }
      success = updateCustomList(updatedList)
    } else {
      const newList = createCustomList(formData.value.title.trim(), validItems)
      success = addCustomList(newList)
    }

    uni.hideLoading()
    if (success) {
      uni.showToast({ title: isEdit.value ? '更新成功' : '创建成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    } else {
      uni.showToast({ title: isEdit.value ? '更新失败' : '创建失败', icon: 'error' })
      isSaving.value = false
    }
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: '操作失败', icon: 'error' })
    isSaving.value = false
  }
}

const goBack = () => {
  // 检查是否有未保存的更改
  const hasChanges = formData.value.title.trim().length > 0 || 
    formData.value.items.some(item => item.text.trim().length > 0)
  
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

.form-container {
  flex: 1;
  height: calc(100vh - 200rpx);
}

.form-content {
  padding: 0 30rpx;
}

.form-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  gap: 8rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #374151;
}

.required {
  font-size: 32rpx;
  color: #dc2626;
}

.item-count {
  font-size: 24rpx;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  margin-left: auto;
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

.title-input:focus {
  border-color: #374151;
}

.items-list {
  margin-bottom: 20rpx;
}

.item-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  gap: 12rpx;
}

.item-number {
  width: 48rpx;
  height: 48rpx;
  background: #374151;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.item-input {
  flex: 1;
  height: 64rpx;
  background: #f9fafb;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 16rpx;
  font-size: 26rpx;
  color: #374151;
}

.item-input:focus {
  border-color: #374151;
}

.item-delete {
  width: 48rpx;
  height: 48rpx;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-delete:active {
  transform: scale(0.9);
}

.delete-icon {
  font-size: 32rpx;
  color: #dc2626;
  font-weight: bold;
}

.add-item-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  background: #f3f4f6;
  border: 2rpx dashed #d1d5db;
  border-radius: 12rpx;
  gap: 8rpx;
  transition: all 0.3s ease;
}

.add-item-btn:active {
  transform: scale(0.98);
  background: #e5e7eb;
}

.add-icon {
  font-size: 32rpx;
  color: #6b7280;
  font-weight: bold;
}

.add-text {
  font-size: 26rpx;
  color: #6b7280;
}

/* 模式切换 */
.mode-switch {
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  padding: 8rpx;
  margin: 0 30rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.mode-btn {
  flex: 1;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.mode-btn.active {
  background: #374151;
}

.mode-text {
  font-size: 26rpx;
  color: #6b7280;
  font-weight: 500;
}

.mode-btn.active .mode-text {
  color: #fff;
  font-weight: 600;
}

/* 批量输入 */
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

.tip {
  font-size: 24rpx;
  color: #6b7280;
  margin-left: auto;
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
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f3f4f6;
  border: 2rpx solid #e5e7eb;
}

.cancel-btn:active {
  transform: scale(0.98);
  background: #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.save-btn:active {
  transform: scale(0.98);
}

.save-btn.disabled {
  background: #d1d5db;
  box-shadow: none;
}

.cancel-text {
  font-size: 32rpx;
  color: #374151;
  font-weight: 600;
}

.save-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

.save-btn.disabled .save-text {
  color: #9ca3af;
}
</style>