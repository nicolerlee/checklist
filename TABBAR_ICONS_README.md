# TabBar 图标说明

## 需要添加的图标文件

为了让 TabBar 正常工作，需要在 `src/static/images/` 目录下添加以下 4 个图标文件：

### 首页图标
- `home.png` - 首页未选中图标（建议尺寸：81x81px）
- `home-active.png` - 首页选中图标（建议尺寸：81x81px）

### 作品集图标
- `gallery.png` - 作品集未选中图标（建议尺寸：81x81px）
- `gallery-active.png` - 作品集选中图标（建议尺寸：81x81px）

## 图标要求

- **尺寸**：建议 81x81px（2倍图）或 162x162px（3倍图）
- **格式**：PNG 格式，支持透明背景
- **颜色**：
  - 未选中：`#7a7e83`（灰色）
  - 选中：`#d4a574`（金色，与主题色一致）

## 临时方案

如果暂时没有图标，可以：
1. 使用在线图标生成工具创建简单的图标
2. 或者使用现有图片临时替换
3. 开发阶段可以先不配置 tabBar，直接访问页面路径测试功能

## 图标推荐工具

- [iconfont](https://www.iconfont.cn/) - 阿里图标库
- [IconPark](https://iconpark.oceanengine.com/) - 字节跳动图标库
- [Font Awesome](https://fontawesome.com/) - 字体图标库

