# 成语记忆大师 📚

一个帮助您高效记忆和理解中文成语的交互式学习平台。

## ✨ 功能特色

- **📖 成语库浏览** - 按分类浏览所有成语，支持搜索功能
- **🎴 闪卡学习** - 翻转式闪卡学习，加深记忆效果
- **📝 智能测验** - 测试成语掌握程度，即时反馈
- **❤️ 收藏功能** - 收藏重要或喜欢的成语
- **📊 进度追踪** - 可视化学习进度和统计

## 🎨 设计风格

- 新中式极简风格，融合传统文化与现代美学
- 使用朱砂红、墨色、宣纸白等传统中国配色
- 响应式设计，适配桌面和移动端
- 流畅的动画效果，提升用户体验

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **路由管理**: React Router v6
- **状态管理**: React Context

## 🚀 快速开始

### 环境要求

- Node.js 16+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
npm run build
```

构建完成后的文件在 `dist` 目录。

## 📚 项目结构

```
d:\桌面\idiom/
├── src/
│   ├── components/       # React 组件
│   ├── pages/           # 页面组件
│   ├── context/         # 全局状态管理
│   ├── data/           # 成语数据
│   ├── types/          # TypeScript 类型定义
│   ├── utils/          # 工具函数
│   ├── App.tsx         # 主应用组件
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
├── public/             # 静态资源
├── index.html         # HTML 模板
├── package.json      # 项目配置
├── vite.config.ts    # Vite 配置
├── tailwind.config.js # Tailwind 配置
└── tsconfig.json      # TypeScript 配置
```

## 📖 学习指南

### 首页
浏览所有成语，按分类筛选或使用搜索功能查找特定成语。

### 闪卡学习
1. 进入学习页面开始闪卡学习
2. 点击卡片查看成语释义和例句
3. 根据记忆情况选择"认识"或"不认识"
4. 完成学习后查看学习报告

### 测验模式
1. 参加成语知识测验
2. 从4个选项中选择正确答案
3. 即时获得反馈
4. 查看最终得分和学习建议

### 收藏夹
收藏喜欢的成语，方便日后复习。

## 🎯 数据说明

所有成语数据保存在 `src/data/idioms.json`，包含：
- `category`: 成语分类
- `idiom`: 成语名称
- `meaning`: 释义
- `examples`: 使用例句

您可以编辑该文件添加更多成语。

## 💾 数据存储

所有用户数据（收藏、学习进度、测验记录）保存在浏览器本地存储（localStorage）中，不会上传到任何服务器，保护您的隐私。

## 🎨 自定义

### 修改配色

编辑 `tailwind.config.js` 中的颜色配置：

```javascript
colors: {
  'zhuhong': '#C73E3A',    // 朱砂红
  'zhuise': '#2B2B2B',      // 墨色
  'xuanzhi': '#F8F6F1',    // 宣纸白
  'jinse': '#D4A84B',      // 金色
  'mibai': '#FAFAF8',      // 米白
}
```

### 修改字体

编辑 `index.html` 中的 Google Fonts 链接，选择喜欢的字体。

## 📝 许可证

MIT License

## 🙏 致谢

感谢使用成语记忆大师！希望这个工具能帮助您更好地学习和记忆中华文化精髓。
