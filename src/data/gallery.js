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
    id: 'gallery-002',
    title: '我的101个缺点',
    description: '诚实地面对自己，记录那些不完美',
    themeId: 'my-101-flaws',
    styleId: 'tags2',
    previewImage: '/static/styles/my-101-flaws.jpg',
    emoji: '😔',
    featured: true
  },
  {
    id: 'gallery-003',
    title: '小丑回忆录',
    description: '那些让你怀疑自己智商的时刻',
    themeId: 'life-chaos',
    styleId: 'crazy',
    previewImage: '/static/styles/life-chaos1.jpg',
    emoji: '🤯',
    featured: true
  },
  {
    id: 'gallery-004',
    title: '小确幸',
    description: '生活中的小美好',
    themeId: 'small-happiness',
    styleId: 'simple',
    previewImage: '/static/styles/small_happiness.jpg',
    emoji: '😊',
    featured: true
  },
  {
    id: 'gallery-005',
    title: '人生中的重要时刻',
    description: '记录人生中的重要时刻和成就',
    themeId: 'small-thing',
    styleId: 'avatar-warm',
    previewImage: '/static/styles/small-thing.jpg',
    emoji: '✨',
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
    featured: false
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

