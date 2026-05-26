# 🎯 GitHub 上传完整指南

## 📋 准备工作

由于当前环境没有安装 Git，请按以下步骤操作：

---

## 🔧 方法一：一键上传（推荐）

### 步骤 1：安装 Git

**快速安装：**
1. 访问下载链接：https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe
2. 下载完成后双击运行
3. 安装选项全部保持默认，一路点击"Next"即可
4. 安装完成后**重启电脑**

### 步骤 2：运行上传脚本

1. 重启后，双击运行项目中的文件：
   ```
   d:\桌面\idiom\一键上传GitHub.bat
   ```

2. 脚本会自动完成：
   - ✅ 初始化 Git 仓库
   - ✅ 设置远程仓库
   - ✅ 创建 .gitignore
   - ✅ 提交代码
   - ✅ 推送到 GitHub

---

## 🔧 方法二：手动操作

### 步骤 1：安装 Git
1. 访问：https://git-scm.com/download/win
2. 下载并安装
3. 重启电脑

### 步骤 2：打开命令提示符

按 `Win + R`，输入 `cmd`，回车

### 步骤 3：进入项目目录

```cmd
cd "d:\桌面\idiom"
```

### 步骤 4：初始化 Git

```cmd
git init
```

### 步骤 5：设置远程仓库

```cmd
git remote add origin https://github.com/XiaoDus/Idiom-Memorization.git
```

### 步骤 6：创建 .gitignore

在文件资源管理器中，在 `d:\桌面\idiom\` 目录下创建新文件 `.gitignore`，内容如下：

```
# 依赖
node_modules/

# 构建
dist/

# 日志
*.log

# IDE
.vscode/
.idea/

# 临时文件
*.ps1
*.py
*.bat
```

### 步骤 7：添加并提交代码

```cmd
git add .
git commit -m "feat: 成语记忆大师完整版"
```

### 步骤 8：推送到 GitHub

```cmd
git branch -M main
git push -u origin main
```

---

## ❓ 常见问题

### Q1: 推送时要求登录？
**A:** 会弹出 GitHub 登录窗口，使用您的账号密码登录即可

### Q2: 推送被拒绝 (403)？
**A:** 可能是没有权限。需要：
1. 访问 https://github.com/settings/tokens
2. 创建 Personal Access Token
3. 使用 Token 代替密码登录

### Q3: 仓库不存在？
**A:** 需要先在 GitHub 上创建仓库：
1. 访问 https://github.com/new
2. Repository name 填写：`Idiom-Memorization`
3. 点击 "Create repository"

### Q4: 如何查看推送结果？
**A:** 访问 https://github.com/XiaoDus/Idiom-Memorization

---

## 🌐 推送后的操作

### 1. 启用 GitHub Pages（可选）

让网站在线访问：
1. 进入仓库 Settings
2. 左侧菜单找到 "Pages"
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"
5. 保存后访问：`https://XiaoDus.github.io/Idiom-Memorization`

### 2. 后续更新代码

以后修改代码后，运行：
```cmd
cd "d:\桌面\idiom"
git add .
git commit -m "描述你的更新"
git push
```

---

## 📞 需要帮助？

如果遇到问题，请查看：
- GitHub 官方文档：https://docs.github.com
- Git 教程：https://git-scm.com/doc

---

**祝您上传成功！🚀**
