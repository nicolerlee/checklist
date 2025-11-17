# 人生清单小程序

一个基于uni-app开发的微信小程序，帮助用户创建和管理人生清单，支持多种精美模板，让你的人生目标更有仪式感。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)

## ✨ 功能特性

- 📝 **8个清单主题** - 舌尖记忆、旅行风景、工作成长等，丰富的内容选择
- 🎨 **4种视觉风格** - 简约、正式、复古、标签云，可自由搭配
- 🔄 **风格切换** - 同一内容可配合不同风格，32种组合效果
- ✅ **简单勾选** - 预设选项，用户只需勾选已完成的项目
- 📸 **图片生成** - 使用Canvas将清单渲染为精美图片，支持分享
- 🎯 **默认推荐** - 每个主题都有推荐的默认风格
- 🌈 **流畅体验** - 精心设计的动画和交互效果

## 🎯 使用场景

- **个人成长**: 30岁前要做的30件事、年度目标清单
- **生活愿望**: 旅行地清单、美食清单、电影清单
- **工作目标**: 季度OKR、项目任务、职业规划
- **兴趣爱好**: 书单、游戏清单、收藏清单

## 🚀 快速开始

### 环境要求

- Node.js 14+
- npm 或 yarn
- 微信开发者工具

### 安装依赖

```bash
cd checklist-app
npm install
```

### 运行开发

```bash
# 微信小程序开发模式
npm run dev:mp-weixin
```

### 在微信开发者工具中打开

1. 打开微信开发者工具
2. 导入项目
3. 项目路径选择: `dist/dev/mp-weixin`
4. 开始开发和调试

### 构建发布

```bash
# 构建生产版本
npm run build:mp-weixin
```

## 📁 项目结构

```
checklist-app/
├── src/
│   ├── data/                   # 数据配置
│   │   ├── styles/             # 视觉风格配置
│   │   │   ├── simple.js       # 简约清新
│   │   │   ├── formal.js       # 正式简洁
│   │   │   ├── vintage.js      # 复古温馨
│   │   │   └── tags.js         # 标签云
│   │   └── checklists/         # 清单主题配置
│   │       ├── life-completed.js   # 人生已完成清单
│   │       ├── food-memories.js    # 舌尖上的记忆
│   │       ├── travel-stories.js   # 路上的风景
│   │       ├── work-growth.js      # 格子间与教室之外
│   │       ├── art-life.js         # 声音与光影
│   │       ├── daily-texture.js    # 生活的质地
│   │       ├── small-happiness.js  # 微小的确幸
│   │       └── movies.js           # 豆瓣Top250电影
│   ├── pages/                  # 页面目录
│   │   ├── index/              # 选择清单主题
│   │   └── checklist/          # 勾选页面（支持风格切换）
│   ├── components/             # 组件目录
│   │   ├── style-switcher/     # 风格切换器
│   │   └── theme-card/         # 清单主题卡片
│   ├── App.vue                 # 应用入口
│   ├── main.js                 # 入口文件
│   ├── pages.json              # 页面配置
│   └── manifest.json           # 应用配置
├── package.json                # 依赖配置
└── vite.config.js              # Vite配置
```

## 🎨 模板展示

### 小清单模板（适合10条以内）

#### 1. 简约清新 (Template 1)
- 🔵 蓝色主题，清新简约
- 👤 头像装饰
- 💬 底部感言区域
- 适合：个人成长清单

#### 2. 正式简洁 (Template 2)
- 🟢 绿色主题，专业正式
- ➖ 分隔线设计
- 适合：工作目标清单

#### 3. 复古温馨 (Template 3)
- 🟤 复古纹理背景
- 🎀 胶带和花朵装饰
- 💬 底部感言区域
- 适合：生活愿望清单

### 大清单模板（适合100+条）

#### 4. 标签云 (Template 4)
- 🌈 彩色标签布局
- 🏷️ 标签云自动排列
- 📋 支持大量清单项
- 适合：电影清单、书单等

## 🛠️ 技术栈

- **框架**: uni-app (支持多端开发)
- **UI库**: 自定义组件 + uni-ui
- **状态管理**: Vue 3 Composition API
- **数据存储**: uni.storage (本地存储)
- **图片生成**: Canvas 2D API
- **构建工具**: Vite
- **开发语言**: Vue 3 + JavaScript

## 📖 文档

- [开发文档](DEVELOPMENT.md) - 详细的开发指南
- [用户指南](USER_GUIDE.md) - 用户使用说明
- [测试清单](TESTING_CHECKLIST.md) - 完整的测试检查清单

## 🔧 核心功能

### 数据存储

使用 `uni.storage` 实现本地数据持久化：
- 创建、读取、更新、删除清单
- 自动保存编辑内容
- 支持多个清单同时管理

### 模板系统

4种预设模板，每个模板包含：
- 独特的样式配置（颜色、布局）
- 特殊装饰元素（头像、感言、纹理）
- 最大项目数限制
- 可扩展的模板架构

### Canvas图片生成

- 根据模板样式绘制清单
- 支持中文字体和自动换行
- 保存到相册（需用户授权）
- 优化的渲染性能

## 🎯 开发规范

### 代码风格
- Vue 3 Composition API
- `<script setup>` 语法
- 统一的命名规范（camelCase, PascalCase）
- ESLint 代码检查

### 组件开发
- 单一职责原则
- Props down, Events up
- 避免直接修改 props
- 合理使用 computed 和 watch

## 🚧 路线图

- [x] 基础框架搭建
- [x] 4种模板实现
- [x] 清单CRUD功能
- [x] Canvas图片生成
- [x] UI优化和动画
- [ ] 云端数据同步
- [ ] 更多模板样式
- [ ] 社交分享功能
- [ ] 数据导入导出

## 📝 更新日志

### v1.0.0 (2024-11-17)
- ✨ 首次发布
- 🎨 支持4种清单模板
- 📝 完整的清单管理功能
- 📸 Canvas图片生成
- 💾 本地数据持久化
- 🌈 流畅的动画效果

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 License

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📧 联系方式

如有问题或建议，欢迎：
- 提交 [Issue](../../issues)
- 发送邮件
- 微信交流

---

⭐ 如果这个项目对你有帮助，欢迎 Star！

