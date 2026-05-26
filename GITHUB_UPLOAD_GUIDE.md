# 🚀 Git 上传到 GitHub 指南

## 📋 前置要求

### 1️⃣ 安装 Git（如果还没有）

**Windows 用户：**
1. 访问 https://git-scm.com/download/win
2. 下载 Windows 版本的 Git
3. 运行安装程序，一路"Next"即可
4. 安装完成后，打开 CMD 或 PowerShell，输入 `git --version` 验证安装

**或者使用 PowerShell 安装：**
```powershell
winget install Git.Git
```

## 📁 项目说明

您的项目位于：`d:\桌面\idiom`

### 主要文件：
- ✅ `idioms.json` - 成语数据文件
- ✅ `index.html` - 静态版本
- ✅ `preview_complete.html` - 完整功能版本
- ✅ `src/` - React 源代码目录
- ✅ `package.json` - 项目配置
- ✅ `vite.config.ts` - Vite 配置

## 🔧 上传步骤

### 步骤 1：打开终端

打开 PowerShell 或 CMD，进入项目目录：
```powershell
cd "d:\桌面\idiom"
```

### 步骤 2：初始化 Git 仓库

```powershell
git init
```

### 步骤 3：创建 .gitignore 文件

创建 `.gitignore` 文件（已经包含在项目中），内容如下：
```
# 依赖
node_modules/
.pnp
.pnp.js

# 构建输出
dist/
dist-ssr/

# 本地开发日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/*
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# macOS
.DS_Store

# 临时文件
*.ps1
*.py
*.js（除了必要的）
```

### 步骤 4：添加远程仓库

```powershell
git remote add origin https://github.com/XiaoDus/Idiom-Memorization.git
```

### 步骤 5：配置 Git 用户信息（如果还没有）

```powershell
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

### 步骤 6：添加文件到暂存区

```powershell
git add .
```

### 步骤 7：提交代码

```powershell
git commit -m "Initial commit: 成语记忆大师完整版"
```

### 步骤 8：推送到 GitHub

```powershell
git branch -M main
git push -u origin main
```

## ⚠️ 可能遇到的问题

### 问题 1：Git 未安装
**解决**：先安装 Git，下载地址：https://git-scm.com/download/win

### 问题 2：没有 GitHub 账号
**解决**：访问 https://github.com 注册一个账号

### 问题 3：仓库不存在
**解决**：先在 GitHub 上创建仓库，或者使用：
```powershell
git remote set-url origin https://github.com/XiaoDus/Idiom-Memorization.git
```

### 问题 4：推送被拒绝
**解决**：如果是新仓库，可能需要：
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## 🎉 完成后

推送成功后，您可以：
1. 访问 https://github.com/XiaoDus/Idiom-Memorization 查看代码
2. 访问 GitHub Pages（如果有配置）查看网站
3. 克隆到其他电脑继续开发

## 💡 后续更新代码

以后更新代码时，只需执行：
```powershell
git add .
git commit -m "描述你的更新"
git push
```

## 📝 推荐创建 GitHub Pages

如果您想让网站在线访问：
1. 进入 GitHub 仓库 Settings
2. 找到 Pages 选项
3. Source 选择 "main" 分支
4. 访问 https://XiaoDus.github.io/Idiom-Memorization

---
**祝您上传成功！🎊**
