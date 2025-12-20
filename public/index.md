## PixelBeads.org 首页分析与主要功能梳理

> 站点：`https://pixelbeads.org/`  
> 首页标题：Free Pixel Beads Pattern Creator to Turn Image to Pixel Art  
> 一句话总结：**把图片一键转换成适配拼豆（Hama/Perler/Artkal 等）色卡的像素网格图案，并生成可打印 PDF + 物料清单（颜色/数量）**。

## 网站的主要功能是什么

- **图片 → 拼豆图案生成（核心）**  
  上传 JPG/PNG（页面也提示支持 CSV 数据文件），将图片转换为像素网格/像素艺术，并映射到拼豆可用颜色。

- **可调参数与实时迭代**  
  - 水平分辨率/网格宽度：`Horizontal Resolution (10-300)`（默认 100）  
  - 颜色相似度：`Color Similarity (0-100)`（默认 30）  
  - 模式：`Cartoon (Dominant)` / `Realistic (Average)`  
  - 应用参数：`Apply Settings`

- **色卡/配色体系选择与管理**  
  首页提供 `Color System` 切换按钮（如：`MARD`、`COCO`、`ManMan`、`PanPan`、`MiXiaoWo`），并提供 `Manage Palette (291 colors)` 的调色板管理入口（用于限制/管理可用颜色集合）。

- **“去除杂色”与颜色级别的控制**  
  `Remove stray colors` 区域展示颜色列表与每色珠子数量，支持点击某个颜色将其从可用列表中排除（用于减少噪点色/孤立色，让成品更干净、更易拼）。

- **珠子数量统计与物料清单（购物清单）**  
  页面文案与模块强调会统计每种颜色所需珠子数量，便于购买与备料，减少浪费。

- **导出/下载成品图纸**  
  首页存在主 CTA：`Download Bead Pattern`，并在下方模块强调 **“可打印 PDF 图纸导出（含颜色键/放置指南）”**。

- **隐私与本地处理（承诺）**  
  首页宣称：图片在浏览器本地处理、无需注册、不会存储图片（提升隐私安全感与使用门槛）。

## 首页信息架构（从上到下）

### 顶部导航（Navigation）

- **Logo**：Pixelbeads（返回首页）
- **导航项**：`Pricing` / `Feature` / `FAQ` / `Blog`  
  - `Feature`、`FAQ` 为首页锚点跳转  
  - `Blog` 为独立内容页（可用）  
  - `Pricing` 当前看起来仍指向 `/`（更像占位或未来入口）

### 首屏（Hero + 交互式工作台）

- **价值主张（H1 + 副文案）**  
  “Transform Photos Into Pixel Beads Patterns”：把照片/图片转成拼豆图案，支持 Hama/Perler/Artkal。

- **核心交互=直接开工**（这点是首页的关键差异）  
  首屏不是营销落地页，而是直接把“生成器”嵌在首页中：  
  - 参数面板（分辨率、相似度、模式、色系、调色板管理）  
  - 上传区（拖拽/点击上传）  
  - 颜色列表与“去除杂色”交互  
  - 主下载按钮（Download Bead Pattern）

### 功能卖点分区（Feature Sections）

首页在首屏之后，用多段图文解释“为什么好用”，主要围绕：

- **专业输出**：可打印 PDF、颜色键、放置指导；并强调多页格式以适配大图案
- **Shopping Lists**：每色数量统计帮助备料
- **移动端优化**：响应式 + 缩放，手机也能当“拼豆参考图”
- **多品牌/多色卡支持**：强调 Hama/Perler/Artkal 等
- **可定制**：尺寸、复杂度、颜色集合（限制颜色数、适配库存）
- **隐私与安全**：本地处理、不存储、无需注册

### 教程式引导（How it works）

三步流程强化“易用”心智：

1. Upload Your Image（上传图片）
2. Customize Settings（调整参数）
3. Generate & Download（生成并下载 PDF）

### 社会证明（Testimonials）

“What Bead Artists Say”轮播式评价（面向新用户的信任增强）。

### FAQ

围绕新手常见疑问（如何转网格、是否适合新手、如何使用、图片选择建议、是否支持多品牌、尺寸限制、是否可编辑等）做答疑入口。

### 尾部 CTA + Footer

- **尾部 CTA**：Create Your First Pattern（回到首屏工具区）
- **Footer 链接**：Blog、ShowCase（指向 `/`）、Pricing（指向 `/`）、privacy policy、terms of service

## 首页用户路径（转化漏斗视角）

- **入口**：搜索/社媒/口碑 → 首页  
- **第一关键动作**：拖拽/选择图片（极低阻力、零注册）  
- **第二关键动作**：调参（分辨率/相似度/模式/色系/调色板）→ 看到预览与颜色统计  
- **第三关键动作**：去除杂色（减少颜色种类、让图更“可拼”）  
- **最终转化**：下载 PDF 图纸 + 物料清单（Download Bead Pattern）  
- **留存/再访**：Blog 教程内容 + 再次生成更多图案

## 亮点与定位判断

- **产品型首页**：把“生成器”放在首屏，强转化、强体验，适合工具类网站的最佳实践（先让用户立即获得结果）。  
- **“可实现性”卖点突出**：不仅转像素图，还强调色卡匹配 + 珠子数量统计 + PDF 图纸，直接对应拼豆制作的真实需求。  
- **隐私承诺加分**：本地处理/不存储/免注册降低顾虑与门槛。

## 风险点与可改进项（基于当前可见信息）

- **合规页面可用性问题**  
  - `privacy policy` 当前打开为 404（首页与 Blog 页脚都有入口，但页面不可用）  
  - `terms of service` 似乎会重定向回首页（未看到独立条款内容）  
  这会削弱“本地处理/不存储”的信任背书，建议尽快补齐并确保链接有效。

- **Pricing 入口语义不清**  
  `Pricing` 链接当前仍指向首页（未呈现明确的定价/套餐信息）。如果确实免费，可在导航/首屏更明确地声明，避免用户误解。

- **ShowCase/Resource 入口偏弱**  
  Footer 的 `ShowCase` 也指向 `/`，若要承接灵感/案例，建议建设独立展示页或锚点区块。

## 相关页面补充（用于理解首页导流）

- **Blog（可用）**：`/blog` 提供多篇教程/科普文章（如“how to use pixel beads”“how do I turn a picture into a pixel grid”等），明显用于 SEO 获取新用户并导回生成器。
