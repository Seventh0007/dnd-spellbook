# D&D 法术书网站

一个面向中文桌游（跑团）玩家的D&D法术查询工具网站，采用**D&D官方Stat Block设计风格**。

## ✨ 特性

- 📖 **D&D Stat Block风格**：完全模仿D&D官方规则书的视觉风格
- 🔍 **快速搜索**：实时搜索法术名称、描述、学派、职业
- 🎯 **多维度筛选**：按环数、学派、职业筛选法术
- 📱 **响应式设计**：完美适配桌面端、平板、手机
- 🎨 **沉浸式体验**：仿古纸张背景、装饰性边框、双线分隔符

## 🚀 技术栈

- **前端**：HTML5、CSS3、原生JavaScript（ES6+）
- **数据**：JSON格式（静态数据，无需数据库）
- **部署**：GitHub Pages（免费静态网站托管）

## 📁 项目结构

```
dnd-spellbook/
├── index.html              # 首页
├── dndspells.html         # 法术查询页
├── css/
│   └── stat-block.css     # D&D Stat Block风格样式
├── js/                   # JavaScript文件（待开发）
├── data/                 # 法术数据（JSON格式，待添加）
├── 项目任务与需求文档.md  # 详细需求文档
└── README.md             # 本文件
```

## 🎮 使用说明

### 本地预览

直接用浏览器打开 `index.html` 即可预览。

### 部署到GitHub Pages

1. 在GitHub上创建新仓库（如 `dnd-spellbook`）
2. 推送代码到GitHub：
   ```bash
   git init
   git add .
   git commit -m "初始提交：D&D法术书网站"
   git remote add origin https://github.com/Sevnth0007/dnd-spellbook.git
   git push -u origin main
   ```
3. 在GitHub仓库设置中启用GitHub Pages
4. 访问 `https://sevnth0007.github.io/dnd-spellbook/` 查看线上版本

## 📋 待开发功能

- [ ] 完善法术数据（JSON格式，目标100+法术）
- [ ] 实现法术查询页（搜索、筛选、卡片展示）
- [ ] 实现法术详情弹窗（完整Stat Block样式）
- [ ] 添加新手指南、施法教程、用户手册页面
- [ ] 实现冷知识模块（首页展示）

## 🎨 设计风格

本项目采用**D&D官方Stat Block设计风格**，核心设计元素包括：

- **仿古纸张背景**：`#fdf1dc`（羊皮纸色）
- **装饰性边框**：双线边框，`#7a200d`（深红色）
- **双线分隔符**：用于标题下方、元数据之间
- **字体方案**：Georgia、Garamond、「宋体」等衬线字体
- **色彩方案**：Earth Tone（深红、羊皮纸、深灰）

详细设计规格请参考 `项目任务与需求文档.md`。

## 📜 许可证

本项目仅供学习和个人使用。D&D相关术语和规则版权归Wizards of the Coast所有。

## 📧 联系方式

- GitHub：[@Sevnth0007](https://github.com/Sevnth0007)

---

**⚡ 快速开始：** 直接用浏览器打开 `index.html` 查看效果！
