@echo off
chcp 65001 >nul
echo ========================================
echo     成语记忆大师 - 一键上传 GitHub
echo ========================================
echo.

:: 尝试直接使用 git 命令
where git >nul 2>&1
if %errorlevel% equ 0 (
    goto :git_found
)

echo ❌ Git 未安装
echo.
echo 正在下载并安装 Git...
echo.

:: 下载 Git for Windows
echo 📥 下载 Git 安装包...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/Git-2.44.0-64-bit.exe' -OutFile 'git-installer.exe'"

if not exist "git-installer.exe" (
    echo ❌ 下载失败
    echo.
    echo 请手动下载安装：
    echo 1. 访问 https://git-scm.com/download/win
    echo 2. 下载并安装 Git
    echo 3. 重启电脑
    echo 4. 重新运行此脚本
    pause
    exit /b 1
)

echo ✅ 下载完成
echo.
echo 🔧 正在安装 Git（静默安装）...
start /wait git-installer.exe /VERYSILENT /NORESTART /NOCANCEL /SP- /CLOSEAPPLICATIONS /RESTARTAPPLICATIONS /COMPONENTS="icons,ext\reg\shellhere\assoc,assoc,assoc_sh" /PATH="C:\Git"

:: 清理安装包
del git-installer.exe

echo.
echo ✅ Git 安装完成
echo.
echo ⚠️ 请关闭此窗口，重新打开一个新的命令提示符
echo 然后再次运行此脚本
echo.
pause
exit

:git_found
echo ✅ 检测到 Git 已安装
git --version
echo.

:: 初始化仓库
if not exist ".git" (
    echo 📦 初始化 Git 仓库...
    git init
) else (
    echo ✅ Git 仓库已存在
)
echo.

:: 设置远程仓库
echo 🔗 设置远程仓库...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/XiaoDus/Idiom-Memorization.git
echo ✅ 远程仓库: https://github.com/XiaoDus/Idiom-Memorization.git
echo.

:: 创建 .gitignore
echo 📝 创建 .gitignore...
(
    echo # 依赖
    echo node_modules/
    echo.
    echo # 构建
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
    echo *.bat
    echo !.gitignore
) > .gitignore
echo ✅ .gitignore 已创建
echo.

:: 添加所有文件
echo 📤 添加文件...
git add .
git status --short
echo.

:: 提交
echo 💾 提交代码...
git commit -m "feat: 成语记忆大师完整版 - 含闪卡学习、测验、填空功能"
echo.

:: 推送
echo.
echo 🚀 准备推送到 GitHub...
echo.
echo 请确保：
echo 1. 您的 GitHub 账号已登录
echo 2. 仓库存在：https://github.com/XiaoDus/Idiom-Memorization
echo.
set /p confirm=是否立即推送? (Y/N):
if /i "%confirm%"=="Y" (
    echo.
    echo 正在推送...
    git branch -M main
    
    :: 使用凭据管理器或要求登录
    git push -u origin main --force
    
    if %errorlevel% equ 0 (
        echo.
        echo ╔═══════════════════════════════════════╗
        echo ║         🎉 推送成功！                ║
        echo ╚═══════════════════════════════════════╝
        echo.
        echo 🌐 访问您的仓库：
        echo https://github.com/XiaoDus/Idiom-Memorization
        echo.
    ) else (
        echo.
        echo ╔═══════════════════════════════════════╗
        echo ║         ❌ 推送失败                  ║
        echo ╚═══════════════════════════════════════╝
        echo.
        echo 可能的原因：
        echo • 没有 GitHub 推送权限
        echo • 需要 GitHub Token 或 SSH Key
        echo • 仓库不存在
        echo.
        echo 解决方案：
        echo 1. 访问 https://github.com/new 创建仓库
        echo 2. 或配置 GitHub Token
        echo.
    )
) else (
    echo.
    echo 已取消。代码已提交到本地。
    echo 稍后可以运行: git push -u origin main
)

echo.
pause
