// 作品集数据配置
// 精选作品展示，每个作品对应一个主题和样式的组合

const galleryItems = [
  {
    id: 'gallery-001',
    title: '人生中的100个愿望',
    description: '记录生活中的美好瞬间',
    themeId: 'life-100',
    styleId: 'tags',
    previewImage: '/static/styles/life-100.jpg',
    emoji: '🌟',
    featured: true
  },
  {
    id: 'gallery-006',
    title: '小丑回忆录（亮色版）',
    description: '那些让你怀疑自己智商的时刻',
    themeId: 'life-chaos',
    styleId: 'crazy-bright',
    previewImage: '/static/styles/life-chaos2.jpg',
    emoji: '🤯',
    featured: true
  }
]

// 获取精选作品（featured: true）
export const getFeaturedGallery = () => {
  return galleryItems.filter(item => item.featured === true)
}

// 获取所有作品
export const getAllGallery = () => {
  return galleryItems
}

export default galleryItems

