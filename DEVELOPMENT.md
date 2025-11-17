# 开发文档

## 开发环境设置

### 1. 安装依赖

```bash
npm install
```

### 2. 运行开发服务器

```bash
# 微信小程序
npm run dev:mp-weixin
```

### 3. 微信开发者工具配置

1. 打开微信开发者工具
2. 导入项目
3. 项目路径选择: `dist/dev/mp-weixin`
4. AppID: 使用测试号或自己的AppID

## 项目架构

### 目录结构

```
checklist-app/
├── pages/                   # 页面目录
│   ├── index/              # 我的清单列表页
│   ├── template-center/    # 模板中心页
│   ├── checklist-detail/   # 清单详情页
│   └── preview/            # 图片预览页
├── components/             # 组件目录
│   ├── checklist-item/     # 清单项组件
│   └── template-preview/   # 模板预览组件
├── utils/                  # 工具类
│   ├── storage.js          # 本地存储工具
│   ├── templates.js        # 模板配置
│   └── canvas.js           # Canvas图片生成
├── static/                 # 静态资源
└── App.vue                 # 应用入口
```

### 核心功能模块

#### 1. 数据存储 (utils/storage.js)

使用 `uni.storage` 实现本地数据持久化。

**API:**
- `getChecklists()` - 获取所有清单
- `getChecklistById(id)` - 根据ID获取清单
- `createChecklist(templateId, title)` - 创建新清单
- `updateChecklist(checklist)` - 更新清单
- `deleteChecklistById(id)` - 删除清单

#### 2. 模板系统 (utils/templates.js)

定义了4种清单模板：

**小清单模板 (适合10条以内):**
1. template1 - 简约清新
2. template2 - 正式简洁
3. template3 - 复古温馨

**大清单模板 (适合100+条):**
4. template4 - 标签云

每个模板包含：
- 样式配置 (颜色、布局等)
- 特殊元素 (头像、感言、装饰等)
- 最大项目数限制

#### 3. Canvas图片生成 (utils/canvas.js)

支持将清单渲染为图片并保存到相册。

**功能:**
- 根据模板样式绘制清单
- 支持4种不同的渲染模式
- 自动处理文字换行
- 保存到相册 (需用户授权)

## 开发规范

### 1. 命名规范

- 文件名: kebab-case (如: `checklist-item.vue`)
- 组件名: PascalCase (如: `ChecklistItem`)
- 变量名: camelCase (如: `checklistId`)
- 常量名: UPPER_SNAKE_CASE (如: `STORAGE_KEY`)

### 2. 代码风格

- 使用 Vue 3 Composition API
- 使用 `<script setup>` 语法
- 统一使用单引号
- 缩进: 2空格

### 3. 组件开发

组件应该：
- 单一职责
- 通过 props 接收数据
- 通过 emit 触发事件
- 避免直接修改 props

## 性能优化建议

### 1. 图片资源

- 使用适当尺寸的图标 (建议81x81px)
- 压缩图片文件
- 使用 webp 格式 (如果支持)

### 2. Canvas 渲染

- Canvas绘制在后台进行
- 避免频繁重绘
- 大清单使用虚拟列表

### 3. 数据存储

- 定期清理无用数据
- 避免存储过大的对象
- 考虑数据压缩

## 调试技巧

### 1. 微信开发者工具调试

- 使用 Console 查看日志
- 使用 Network 检查网络请求
- 使用 Storage 查看本地数据

### 2. 真机调试

```bash
# 构建生产版本
npm run build:mp-weixin

# 在微信开发者工具中点击"预览"
# 使用微信扫码在真机上测试
```

### 3. 常见问题

**问题: Canvas生成图片失败**
- 检查Canvas ID是否正确
- 确保在组件mounted后执行
- 检查Canvas尺寸设置

**问题: 本地存储数据丢失**
- 检查是否超出存储限制
- 确保正确调用saveChecklists
- 检查是否有异常捕获

**问题: 样式不生效**
- 检查rpx单位是否正确
- 确认scoped样式作用域
- 检查CSS选择器优先级

## 扩展开发

### 添加新模板

1. 在 `utils/templates.js` 添加模板配置
2. 在 `components/template-preview/` 中添加预览样式
3. 在 `utils/canvas.js` 中实现Canvas渲染逻辑
4. 测试各个页面的显示效果

### 添加新功能

1. 在对应的页面或组件中实现
2. 更新相关的工具类
3. 添加必要的样式
4. 测试功能完整性

## 发布流程

### 1. 构建生产版本

```bash
npm run build:mp-weixin
```

### 2. 微信小程序审核

1. 在微信开发者工具中点击"上传"
2. 填写版本号和备注
3. 登录微信公众平台提交审核
4. 等待审核通过后发布

### 3. 版本管理

- 遵循语义化版本 (Semantic Versioning)
- 主版本号.次版本号.修订号
- 维护 CHANGELOG.md

## 测试检查清单

- [ ] 所有页面正常跳转
- [ ] 清单创建、编辑、删除功能正常
- [ ] 清单项添加、删除、勾选功能正常
- [ ] 4种模板样式显示正确
- [ ] Canvas图片生成功能正常
- [ ] 图片保存到相册功能正常
- [ ] 本地数据持久化正常
- [ ] TabBar切换正常
- [ ] 空状态显示正常
- [ ] 动画效果流畅
- [ ] 真机测试通过
- [ ] 适配安全区域

## 联系方式

如有问题，请提交 Issue 或 Pull Request。

