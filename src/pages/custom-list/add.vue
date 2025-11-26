<template>
  <view class="container">
    <view class="content-wrapper">
      <!-- 清单标题 -->
      <view class="form-section">
        <view class="section-label">标题 <text class="required">*</text></view>
        <input 
          class="title-input"
          v-model="formData.title"
          placeholder="请输入清单标题"
          maxlength="20"
        />
      </view>
      
      <!-- 清单描述 -->
      <view class="form-section">
        <view class="section-label">描述 <text class="required">*</text></view>
        <input 
          class="title-input"
          v-model="formData.description"
          placeholder="一句话描述这个清单"
          maxlength="30"
        />
      </view>

      <!-- 清单内容 -->
      <view class="form-section">
        <view class="section-label">清单内容 <text class="required">*</text> ({{ tagItems.length }})</view>
        <view class="content-area">
          <view 
            v-for="(item, index) in tagItems" 
            :key="index"
            class="tag-item"
          >
            <text class="tag-text">{{ item }}</text>
            <view class="tag-delete" @click="removeTag(index)">
              <text class="delete-icon">×</text>
            </view>
          </view>
        </view>
        
        <view class="input-row">
          <input 
            class="content-input"
            v-model="currentInput"
            placeholder="输入后按空格键继续添加"
            @input="handleInput"
            @confirm="addTag"
            :focus="true"
          />
          <view class="add-btn" @click="addTag">
            <text class="add-icon">✓</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
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
import { ref, computed, watch } from 'vue'
import { 
  createCustomList, 
  addCustomList, 
  canAddNewList 
} from '../../utils/custom-lists.js'

const formData = ref({
  title: '',
  description: ''
})

const tagItems = ref([])
const currentInput = ref('')
const isSaving = ref(false)
const scrollIntoView = ref('')
const inputFocus = ref(true)

const canSave = computed(() => {
  return formData.value.title.trim().length > 0 && 
         formData.value.description.trim().length > 0 &&
         tagItems.value.length > 0 && 
         !isSaving.value
})

const handleInput = (e) => {
  const value = e.detail.value
  // 检测是否以空格结尾
  if (value.endsWith(' ')) {
    const text = value.trim()
    if (text) {
      if (tagItems.value.includes(text)) {
        uni.showToast({ title: '已存在同名清单条目', icon: 'none' })
      } else {
        tagItems.value.push(text)
      }
      currentInput.value = ''
      setTimeout(() => {
        scrollIntoView.value = 'input-area'
      }, 100)
    } else {
      currentInput.value = ''
    }
  }
}

const addTag = () => {
  const text = currentInput.value.trim()
  if (text) {
    if (tagItems.value.includes(text)) {
      uni.showToast({ title: '已存在同名清单条目', icon: 'none' })
    } else {
      tagItems.value.push(text)
    }
    currentInput.value = ''
    setTimeout(() => {
      scrollIntoView.value = 'input-area'
    }, 100)
  }
}

const removeTag = (index) => {
  tagItems.value.splice(index, 1)
}

const saveList = () => {
  if (!formData.value.title.trim()) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  if (!formData.value.description.trim()) {
    uni.showToast({ title: '请输入描述', icon: 'none' })
    return
  }
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
      tagItems.value,
      formData.value.description.trim()
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
  const hasChanges = formData.value.title.trim().length > 0 || tagItems.value.length > 0
  
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

.required {
  color: #ff0000;
  font-weight: bold;
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

.content-area {
  min-height: 100rpx;
  margin-bottom: 16rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  row-gap: 5rpx;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  background: #f0f0f0;
  border-radius: 6rpx;
  padding: 8rpx 16rpx;
  gap: 8rpx;
  height: 56rpx;
  box-sizing: border-box;
}

.tag-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1;
}

.tag-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4rpx;
}

.delete-icon {
  font-size: 24rpx;
  color: #999;
  line-height: 1;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.content-input {
  flex: 1;
  height: 72rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  color: #333;
}

.add-btn {
  width: 72rpx;
  height: 72rpx;
  background: #333;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:active {
  opacity: 0.8;
}

.add-icon {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
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