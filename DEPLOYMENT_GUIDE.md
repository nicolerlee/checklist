# 部署指南

本文档提供人生清单小程序的完整部署流程。

## 前置准备

### 1. 开发工具

- [Node.js](https://nodejs.org/) v14.0.0 或更高版本
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 最新稳定版
- 代码编辑器（推荐 VSCode）

### 2. 微信小程序账号

1. 注册微信小程序账号：https://mp.weixin.qq.com/
2. 获取 AppID（在设置-开发设置中）
3. 配置服务器域名（如需要）

## 本地开发部署

### Step 1: 克隆项目

```bash
git clone <repository-url>
cd checklist-app
```

### Step 2: 安装依赖

```bash
npm install
```

如果安装过程中遇到问题，可以尝试：

```bash
# 清除npm缓存
npm cache clean --force

# 使用淘宝镜像
npm install --registry=https://registry.npmmirror.com
```

### Step 3: 配置AppID

编辑 `manifest.json` 文件：

```json
{
  "mp-weixin": {
    "appid": "你的小程序AppID"
  }
}
```

### Step 4: 启动开发服务器

```bash
npm run dev:mp-weixin
```

成功后会在 `dist/dev/mp-weixin` 目录生成小程序代码。

### Step 5: 在微信开发者工具中打开

1. 打开微信开发者工具
2. 点击 "导入项目"
3. 项目目录选择: `dist/dev/mp-weixin`
4. AppID: 选择你的小程序AppID
5. 点击 "导入"

### Step 6: 开发调试

在微信开发者工具中：
- 点击 "编译" 查看效果
- 使用 "真机调试" 在手机上测试
- 查看 Console 调试信息
- 使用 Network 面板查看请求

## 生产环境部署

### Step 1: 构建生产版本

```bash
npm run build:mp-weixin
```

构建完成后，代码在 `dist/build/mp-weixin` 目录。

### Step 2: 检查构建结果

检查以下内容：
- [ ] 代码体积是否合理（< 2MB）
- [ ] 是否包含不必要的文件
- [ ] 是否正确处理了静态资源
- [ ] Console是否有错误信息

### Step 3: 在开发者工具中测试

1. 在微信开发者工具中打开 `dist/build/mp-weixin`
2. 完整测试所有功能
3. 检查性能和内存占用
4. 使用真机预览测试

### Step 4: 上传代码

在微信开发者工具中：
1. 点击右上角 "上传"
2. 填写版本号（如 1.0.0）
3. 填写项目备注（描述本次更新内容）
4. 点击 "上传"

### Step 5: 提交审核

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入 "版本管理" 页面
3. 找到刚上传的版本
4. 点击 "提交审核"
5. 填写审核信息：
   - 服务类目：选择合适的类目
   - 标签：添加相关标签
   - 功能页面：描述主要功能
   - 测试账号：提供测试账号（如需要）

### Step 6: 等待审核

- 审核时间：通常1-7个工作日
- 审核状态：可在公众平台查看
- 审核失败：根据反馈修改后重新提交

### Step 7: 发布上线

审核通过后：
1. 在版本管理页面点击 "发布"
2. 确认发布信息
3. 点击 "确定" 完成发布

## 版本更新流程

### 1. 开发新版本

```bash
# 切换到开发分支
git checkout -b feature/new-feature

# 开发和测试
npm run dev:mp-weixin

# 提交代码
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### 2. 合并到主分支

```bash
git checkout main
git merge feature/new-feature
```

### 3. 更新版本号

编辑 `package.json`:

```json
{
  "version": "1.1.0"
}
```

编辑 `manifest.json`:

```json
{
  "versionName": "1.1.0",
  "versionCode": "110"
}
```

### 4. 构建和发布

```bash
# 构建生产版本
npm run build:mp-weixin

# 上传、审核、发布（参考上面的流程）
```

### 5. 打标签

```bash
git tag v1.1.0
git push origin v1.1.0
```

## 配置优化

### 1. 减小代码包体积

**移除未使用的依赖:**
```bash
npm prune --production
```

**压缩图片资源:**
- 使用 webp 格式
- 压缩 PNG/JPG
- 合理设置图片尺寸

**分包加载:**

编辑 `pages.json`:

```json
{
  "subPackages": [
    {
      "root": "pagesA",
      "pages": [
        {
          "path": "preview/index"
        }
      ]
    }
  ]
}
```

### 2. 性能优化

**启用按需编译:**

编辑 `manifest.json`:

```json
{
  "mp-weixin": {
    "optimization": {
      "subPackages": true
    }
  }
}
```

**使用缓存:**
- 合理使用 uni.storage
- 设置缓存过期时间
- 清理无用缓存

### 3. 安全配置

**配置服务器域名:**

在微信公众平台 "开发-开发管理-服务器域名" 中配置：
- request合法域名
- uploadFile合法域名
- downloadFile合法域名

## 监控和分析

### 1. 小程序数据分析

在微信公众平台查看：
- 用户访问数据
- 页面访问路径
- 实时统计
- 用户画像

### 2. 性能监控

使用微信开发者工具的性能分析工具：
- 启动性能
- 运行性能
- 网络性能
- 渲染性能

### 3. 错误监控

**添加错误上报:**

在 `App.vue` 中：

```javascript
onError((err) => {
  console.error('Global error:', err)
  // 可以上报到错误监控平台
})
```

## 常见问题

### Q1: 开发工具无法预览

**解决方案:**
1. 检查 AppID 是否正确
2. 确认项目路径是否正确
3. 重启微信开发者工具
4. 清除编译缓存

### Q2: 上传失败

**解决方案:**
1. 检查代码包大小（不能超过2MB）
2. 检查是否有语法错误
3. 确认网络连接
4. 重新登录开发者工具

### Q3: 审核被拒

**常见原因:**
- 缺少必要的用户协议
- 功能描述不清晰
- 测试账号无法登录
- 违反平台规范

**解决方法:**
- 根据拒绝理由修改
- 完善功能说明
- 提供有效的测试账号
- 仔细阅读平台规范

### Q4: 真机运行异常

**调试步骤:**
1. 使用真机调试功能
2. 查看真机Console日志
3. 检查API兼容性
4. 测试不同机型

## 回滚方案

如果发布后发现严重问题：

### 1. 快速回滚

在微信公众平台：
1. 进入 "版本管理"
2. 找到上一个稳定版本
3. 点击 "版本回退"

### 2. 紧急修复

```bash
# 切换到紧急修复分支
git checkout -b hotfix/urgent-fix

# 快速修复问题
# 测试验证

# 构建和发布
npm run build:mp-weixin

# 提交加急审核（需要额外申请）
```

## 持续集成 (CI/CD)

### 使用 GitHub Actions

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy MiniProgram

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build:mp-weixin
      
      - name: Upload to WeChat
        run: |
          # 使用 miniprogram-ci 上传
          # 需要配置密钥
```

## 备份和恢复

### 1. 代码备份

```bash
# 定期提交到 Git
git add .
git commit -m "backup: $(date +%Y-%m-%d)"
git push
```

### 2. 数据备份

用户数据存储在本地，建议提示用户：
- 定期生成清单图片保存
- 截图保存重要内容
- 导出数据（未来功能）

## 联系支持

遇到部署问题？
- 查看 [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- 提交 Issue
- 联系开发团队

---

**最后更新**: 2024-11-17
**适用版本**: v1.0.0+

