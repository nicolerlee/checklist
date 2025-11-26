// 自定义清单存储工具模块

const STORAGE_KEY = 'custom_checklists'
const MAX_LISTS = 5

// 自定义清单数据结构
export const createCustomList = (title, items = [], description = '') => {
  return {
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    items: items.map(item => ({
      text: typeof item === 'string' ? item.trim() : item.text.trim(),
      checked: typeof item === 'string' ? false : (item.checked || false)
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// 获取所有自定义清单
export const getCustomLists = () => {
  try {
    const data = uni.getStorageSync(STORAGE_KEY)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('获取自定义清单失败:', error)
    return []
  }
}

// 保存所有自定义清单
export const saveCustomLists = (lists) => {
  try {
    uni.setStorageSync(STORAGE_KEY, lists)
    return true
  } catch (error) {
    console.error('保存自定义清单失败:', error)
    return false
  }
}

// 添加新的自定义清单
export const addCustomList = (list) => {
  const lists = getCustomLists()
  
  if (lists.length >= MAX_LISTS) {
    uni.showToast({
      title: `最多只能创建${MAX_LISTS}份清单`,
      icon: 'none'
    })
    return false
  }
  
  lists.unshift(list) // 新清单放在最前面
  return saveCustomLists(lists)
}

// 更新自定义清单
export const updateCustomList = (updatedList) => {
  const lists = getCustomLists()
  const index = lists.findIndex(list => list.id === updatedList.id)
  
  if (index === -1) {
    console.error('要更新的清单不存在')
    return false
  }
  
  lists[index] = {
    ...updatedList,
    updatedAt: new Date().toISOString()
  }
  
  return saveCustomLists(lists)
}

// 删除自定义清单
export const deleteCustomList = (id) => {
  const lists = getCustomLists()
  const filteredLists = lists.filter(list => list.id !== id)
  return saveCustomLists(filteredLists)
}

// 根据ID获取单个清单
export const getCustomListById = (id) => {
  const lists = getCustomLists()
  return lists.find(list => list.id === id) || null
}

// 检查是否可以添加新清单
export const canAddNewList = () => {
  return getCustomLists().length < MAX_LISTS
}

// 获取最大清单数量限制
export const getMaxListsLimit = () => {
  return MAX_LISTS
}