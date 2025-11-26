<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">我的清单</text>
      <text class="subtitle">{{ customLists.length }}/{{ maxLists }} 份</text>
    </view>

    <!-- 空状态 -->
    <view v-if="customLists.length === 0" class="empty-state">
      <text class="empty-icon">📝</text>
      <text class="empty-title">还没有自定义清单</text>
      <text class="empty-desc">创建你的第一份专属清单吧</text>
      <view class="create-btn" @click="createNewList">
        <text class="create-btn-text">创建清单</text>
      </view>
    </view>

    <!-- 清单列表 -->
    <scroll-view v-else class="list-container" scroll-y>
      <view class="list-content">
        <view 
          v-for="(list, index) in customLists" 
          :key="list.id"
          class="list-item"
          :style="{ 'animation-delay': index * 0.1 + 's' }"
        >
          <view class="list-info" @click="generateFromList(list)">
            <view class="list-header">
              <text class="list-title">{{ list.title }}</text>
              <text class="list-count">{{ list.items.length }} 项</text>
            </view>
            <text class="list-time">{{ formatTime(list.updatedAt) }}</text>
          </view>
          
          <view class="list-actions">
            <view class="action-btn edit-btn" @click="editList(list)">
              <text class="action-text">编辑</text>
            </view>
            <view class="action-btn delete-btn" @click="confirmDelete(list)">
              <text class="action-text">删除</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部新建按钮 -->
    <view v-if="customLists.length > 0" class="bottom-bar">
      <view 
        class="new-btn" 
        :class="{ disabled: !canAddNew }"
        @click="createNewList"
      >
        <text class="new-btn-text">
          {{ canAddNew ? '新建清单' : `最多${maxLists}份清单` }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  getCustomLists, 
  deleteCustomList, 
  getMaxListsLimit,
  canAddNewList 
} from '../../utils/custom-lists.js'

const customLists = ref([])
const maxLists = ref(getMaxListsLimit())

const canAddNew = computed(() => canAddNewList())

onMounted(() => {
  loadCustomLists()
})

const loadCustomLists = () => {
  customLists.value = getCustomLists()
}

const createNewList = () => {
  if (!canAddNew.value) {
    uni.showToast({
      title: `最多只能创建${maxLists.value}份清单`,
      icon: 'none'
    })
    return
  }
  
  uni.navigateTo({
    url: '/pages/custom-list/edit'
  })
}

const editList = (list) => {
  uni.navigateTo({
    url: `/pages/custom-list/edit?id=${list.id}`
  })
}

const generateFromList = (list) => {
  // 将自定义清单数据传递给清单展示页
  const listData = encodeURIComponent(JSON.stringify(list))
  uni.navigateTo({
    url: `/pages/checklist/index?customList=${listData}`
  })
}

const confirmDelete = (list) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除清单"${list.title}"吗？`,
    success: (res) => {
      if (res.confirm) {
        const success = deleteCustomList(list.id)
        if (success) {
          loadCustomLists()
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '删除失败',
            icon: 'error'
          })
        }
      }
    }
  })
}

const formatTime = (timeStr) => {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 1天内
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) { // 1周内
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return date.toLocaleDateString()
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
  padding: 40rpx 30rpx 30rpx;
  text-align: center;
}

.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #374151;
  display: block;
  margin-bottom: 8rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #6b7280;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 60rpx;
  text-align: center;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 40rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #6b7280;
  margin-bottom: 60rpx;
  line-height: 1.5;
}

.create-btn {
  padding: 20rpx 60rpx;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.create-btn:active {
  transform: scale(0.95);
}

.create-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

/* 清单列表 */
.list-container {
  flex: 1;
  height: calc(100vh - 200rpx);
}

.list-content {
  padding: 0 30rpx;
}

.list-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20rpx);
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-info {
  flex: 1;
  margin-right: 20rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.list-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #374151;
  max-width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-count {
  font-size: 24rpx;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
}

.list-time {
  font-size: 24rpx;
  color: #9ca3af;
}

.list-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  padding: 12rpx 20rpx;
  border-radius: 12rpx;
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.95);
}

.edit-btn {
  background: #e5e7eb;
}

.delete-btn {
  background: #fee2e2;
}

.action-text {
  font-size: 24rpx;
  font-weight: 500;
}

.edit-btn .action-text {
  color: #374151;
}

.delete-btn .action-text {
  color: #dc2626;
}

/* 底部新建按钮 */
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

.new-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.new-btn:active {
  transform: scale(0.98);
}

.new-btn.disabled {
  background: #d1d5db;
  box-shadow: none;
}

.new-btn-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 600;
}

.new-btn.disabled .new-btn-text {
  color: #9ca3af;
}
</style>