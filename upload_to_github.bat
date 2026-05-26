@echo off
chcp 65001 >nul
echo ========================================
echo     成语记忆大师 - Git 上传脚本
echo ========================================
echo.

:: 检查是否安装了 Chocolatey
where choco >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Chocolatey 包管理器
    echo.
    echo 正在尝试安装 Chocolatey...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Chocolatey 安装失败
        echo.
        echo 请手动安装 Git：
        echo 1. 访问 https://git-scm.com/download/win
        echo 2. 下载并安装 Git
        echo 3. 重启此电脑
        echo 4. 重新运行此脚本
        pause
        exit /b 1
    )
)

echo 🔍 检查 Git 安装状态...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo 📦 正在安装 Git...
    choco install git -y
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Git 安装失败
        echo.
        echo 请手动安装 Git：
        echo 1. 访问 https://git-scm.com/download/win
        echo 2. 下载并安装 Git
        echo 3. 重启此电脑
        echo 4. 重新运行此脚本
        pause
        exit /b 1
    )
    
    echo.
    echo ⚠️ Git 已安装，请重启命令提示符或电脑使 PATH 更新
    echo 然后重新运行此脚本
    pause
    exit /b 0
)

echo ✅ Git 已安装
echo.

:: 检查是否在 Git 仓库中
if not exist ".git" (
    echo 📦 初始化 Git 仓库...
    git init
    echo ✅ Git 仓库已初始化
) else (
    echo ✅ 已是 Git 仓库
)
echo.

:: 设置远程仓库
echo 🔗 设置远程仓库...
git remote -v
git remote set-url origin https://github.com/XiaoDus/Idiom-Memorization.git
echo ✅ 远程仓库已设置为: https://github.com/XiaoDus/Idiom-Memorization.git
echo.

:: 创建 .gitignore
if not exist ".gitignore" (
    echo 📝 创建 .gitignore...
    (
        echo # 依赖
        echo node_modules/
        echo.
        echo # 构建输出
        echo dist/
        echo.
        echo # 日志
        echo *.log
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo.
        echo # 临时文件
        echo *.ps1
        echo *.py
        echo !*.gitignore
        echo !GITHUB_UPLOAD_GUIDE.md
        echo !upload_to_github.bat
    ) > .gitignore
    echo ✅ .gitignore 已创建
) else (
    echo ⚠️ .gitignore 已存在
)
echo.

:: 添加文件
echo 📤 添加文件到暂存区...
git add .
git status --short
echo.

:: 提交
set /p commit_msg=请输入提交信息（直接回车使用默认）:
if "%commit_msg%"=="" set commit_msg=feat: 成语记忆大师完整版 - 含闪卡学习、测验、填空功能

echo 💾 提交代码...
git commit -m "%commit_msg%"
echo.

:: 推送
echo 🚀 准备推送到 GitHub...
echo.
echo ⚠️ 请确保：
echo 1. 您已登录 GitHub
echo 2. 仓库地址正确: https://github.com/XiaoDus/Idiom-Memorization
echo.
set /p confirm=是否推送? (Y/N):
if /i "%confirm%"=="Y" (
    echo.
    echo 正在推送...
    git branch -M main
    git push -u origin main
    
    if %errorlevel% equ 0 (
        echo.
        echo 🎉 推送成功！
        echo.
        echo 您可以访问：
        echo   https://github.com/XiaoDus/Idiom-Memorization
        echo.
    ) else (
        echo.
        echo ❌ 推送失败！
        echo.
        echo 可能的问题：
        echo • 没有推送权限 - 需要 GitHub Token
        echo • 仓库不存在 - 需要先在 GitHub 创建
        echo • 网络问题 - 检查网络连接
        echo.
        echo 详细指南请查看: GITHUB_UPLOAD_GUIDE.md
    )
) else (
    echo.
    echo 已取消推送
    echo 代码已提交到本地仓库
    echo 随时可以使用 git push 命令推送
)

echo.
pause
