# TabBar 图标快速创建指南

## 当前状态
✅ 已创建临时占位图标（使用 `simple-style.png` 复制）
⚠️ 需要替换为真正的图标

## 快速解决方案

### 方案1：使用在线图标工具（推荐）
1. 访问 [iconfont](https://www.iconfont.cn/) 或 [IconPark](https://iconpark.oceanengine.com/)
2. 搜索 "home" 和 "gallery" 或 "作品集"
3. 下载 PNG 格式，尺寸 81x81px（2倍图）或 162x162px（3倍图）
4. 替换 `src/static/images/` 目录下的对应文件：
   - `home.png` - 首页未选中（灰色 #7a7e83）
   - `home-active.png` - 首页选中（金色 #d4a574）
   - `gallery.png` - 作品集未选中（灰色 #7a7e83）
   - `gallery-active.png` - 作品集选中（金色 #d4a574）

### 方案2：使用 Python 生成简单图标（临时）
如果需要快速生成简单的文字图标，可以使用以下 Python 脚本：

```python
from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(text, color, output_path, size=162):
    # 创建图片
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制圆形背景
    margin = 10
    draw.ellipse([margin, margin, size-margin, size-margin], 
                 fill=color, outline=None)
    
    # 尝试加载字体（如果失败则使用默认字体）
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
    except:
        font = ImageFont.load_default()
    
    # 绘制文字（居中）
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size - text_width) / 2, (size - text_height) / 2 - 10)
    draw.text(position, text, fill=(255, 255, 255, 255), font=font)
    
    img.save(output_path, 'PNG')

# 创建图标
os.makedirs('static/images', exist_ok=True)

# 首页图标
create_icon('家', '#7a7e83', 'static/images/home.png')
create_icon('家', '#d4a574', 'static/images/home-active.png')

# 作品集图标
create_icon('作', '#7a7e83', 'static/images/gallery.png')
create_icon('作', '#d4a574', 'static/images/gallery-active.png')

print('图标创建完成！')
```

运行：`python create_tabbar_icons.py`

### 方案3：使用现有图标资源
如果有设计资源，可以使用设计工具（如 Figma、Sketch）导出：
- 尺寸：81x81px（2倍图）
- 格式：PNG，支持透明
- 颜色：未选中 #7a7e83，选中 #d4a574

## 图标要求总结
- ✅ 尺寸：81x81px（推荐）或 162x162px
- ✅ 格式：PNG，支持透明背景
- ✅ 颜色：未选中 `#7a7e83`，选中 `#d4a574`
- ✅ 文件位置：`src/static/images/`

## 注意事项
⚠️ 当前使用的是临时占位图标，建议尽快替换为正式图标以获得更好的用户体验。

