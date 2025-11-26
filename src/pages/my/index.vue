<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">我的清单</text>
      <view class="header-actions">
        <view class="action-btn" @click="batchImport">
          <text class="action-text">批量导入</text>
        </view>
        <view class="action-btn primary" @click="createNewList">
          <text class="action-text">新建</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="customLists.length === 0" class="empty-state">
      <text class="empty-icon">📝</text>
      <text class="empty-title">还没有自定义清单</text>
      <text class="empty-desc">创建你的第一份专属清单吧</text>
    </view>

    <!-- 清单列表 -->
    <scroll-view v-else class="list-container" scroll-y>
      <view class="list-content">
        <view 
          v-for="(list, index) in customLists" 
          :key="list.id"
          class="list-item"
        >
          <view class="list-info" @click="generateFromList(list)">
            <text class="list-title">{{ list.title }}</text>
            <text class="list-count">{{ list.items.length }} 项</text>
          </view>
          
          <view class="list-actions">
            <view class="action-btn-small edit" @click="editList(list)">编辑</view>
            <view class="action-btn-small delete" @click="confirmDelete(list)">删除</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { 
  getCustomLists, 
  deleteCustomList, 
  canAddNewList 
} from '../../utils/custom-lists.js'

const customLists = ref([])

onMounted(() => {
  loadCustomLists()
})

onShow(() => {
  loadCustomLists()
})

const loadCustomLists = () => {
  customLists.value = getCustomLists()
}

const createNewList = () => {
  if (!canAddNewList()) {
    uni.showToast({ title: '最多只能创建5份清单', icon: 'none' })
    return
  }
  uni.navigateTo({ url: '/pages/custom-list/edit' })
}

const batchImport = () => {
  uni.navigateTo({ url: '/pages/custom-list/batch-import' })
}

const editList = (list) => {
  uni.navigateTo({ url: `/pages/custom-list/edit?id=${list.id}` })
}

const generateFromList = (list) => {
  const listData = encodeURIComponent(JSON.stringify(list))
  uni.navigateTo({ url: `/pages/checklist/index?customList=${listData}` })
}

const confirmDelete = (list) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除清单"${list.title}"吗？`,
    success: (res) => {
      if (res.confirm) {
        deleteCustomList(list.id)
        loadCustomLists()
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%);
}

.header {
  padding: 40rpx 30rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 48rpx;
  font-weight: 700;
  color: #374151;
}

.header-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn {
  padding: 12rpx 24rpx;
  background: #f3f4f6;
  border-radius: 20rpx;
}

.action-btn.primary {
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
}

.action-btn.primary .action-text {
  color: #fff;
}

.action-text {
  font-size: 24rpx;
  color: #374151;
  font-weight: 500;
}

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
}

.list-container {
  flex: 1;
  height: calc(100vh - 200rpx);
}

.list-content {
  padding: 0 30rpx 40rpx;
}

.list-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-info {
  flex: 1;
}

.list-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 8rpx;
}

.list-count {
  font-size: 24rpx;
  color: #6b7280;
}

.list-actions {
  display: flex;
  gap: 12rpx;
}

.action-btn-small {
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
}

.action-btn-small.edit {
  background: #e5e7eb;
  color: #374151;
}

.action-btn-small.delete {
  background: #fee2e2;
  color: #dc2626;
}
</style>