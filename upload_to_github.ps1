# 检查是否安装了 Git
Write-Host "🔍 检查 Git 安装..." -ForegroundColor Cyan
$gitVersion = git --version 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git 未安装！" -ForegroundColor Red
    Write-Host "`n请先安装 Git：" -ForegroundColor Yellow
    Write-Host "  1. 访问 https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "  2. 下载并安装 Git" -ForegroundColor White
    Write-Host "  3. 重启此脚本" -ForegroundColor White
    Write-Host "`n或者使用 winget 安装：" -ForegroundColor Yellow
    Write-Host "  winget install Git.Git" -ForegroundColor White
    Read-Host "`n按 Enter 键退出"
    exit
}

Write-Host "✅ Git 已安装: $gitVersion" -ForegroundColor Green

# 检查是否已经在 Git 仓库中
$isGitRepo = Test-Path ".git"

if (-not $isGitRepo) {
    Write-Host "`n📦 初始化 Git 仓库..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git 仓库已初始化" -ForegroundColor Green
} else {
    Write-Host "✅ 已是 Git 仓库" -ForegroundColor Green
}

# 设置远程仓库
Write-Host "`n🔗 添加远程仓库..." -ForegroundColor Cyan
$remoteUrl = "https://github.com/XiaoDus/Idiom-Memorization.git"

# 检查是否已有 origin
$hasOrigin = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "远程仓库已存在: $hasOrigin" -ForegroundColor Yellow
    $confirm = Read-Host "是否要更新远程仓库为新的地址? (y/N)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        git remote set-url origin $remoteUrl
        Write-Host "✅ 远程仓库已更新" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ 远程仓库已添加: $remoteUrl" -ForegroundColor Green
}

# 创建 .gitignore 文件
Write-Host "`n📝 创建 .gitignore 文件..." -ForegroundColor Cyan
$gitignoreContent = @"
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

# 临时文件和脚本
*.ps1
*.py
*.js（保留必要的）
!.gitignore
!"update_category.js"
!"fix_favorite.ps1"
!"check-fix-idioms.ps1"
!"fix-categories.js"
!"fix-categories.ps1"
!"generate_complete.ps1"
!"generate_html.py"
!"GITHUB_UPLOAD_GUIDE.md"
!"update_fill_to_choice.ps1"
"@

if (-not (Test-Path ".gitignore")) {
    $gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "✅ .gitignore 已创建" -ForegroundColor Green
} else {
    Write-Host "⚠️ .gitignore 已存在，跳过创建" -ForegroundColor Yellow
}

# 添加所有文件
Write-Host "`n📤 添加文件到暂存区..." -ForegroundColor Cyan
git add .
$status = git status --short
if ($status) {
    Write-Host "✅ 已添加以下文件：" -ForegroundColor Green
    Write-Host $status -ForegroundColor White
} else {
    Write-Host "⚠️ 没有文件变更" -ForegroundColor Yellow
}

# 提交
Write-Host "`n💾 提交代码..." -ForegroundColor Cyan
$commitMessage = "feat: 成语记忆大师完整版 - 含闪卡学习、测验、填空功能"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 提交成功！" -ForegroundColor Green
} else {
    Write-Host "❌ 提交失败，可能没有文件变更" -ForegroundColor Red
    Read-Host "`n按 Enter 键退出"
    exit
}

# 推送到 GitHub
Write-Host "`n🚀 推送到 GitHub..." -ForegroundColor Cyan
Write-Host "仓库地址: $remoteUrl" -ForegroundColor White

git branch -M main

Write-Host "`n⚠️ 即将推送到 GitHub，请确保：" -ForegroundColor Yellow
Write-Host "  1. 您已登录 GitHub 账号" -ForegroundColor White
Write-Host "  2. 仓库地址正确: $remoteUrl" -ForegroundColor White
Write-Host "  3. 您有推送权限" -ForegroundColor White

$confirm = Read-Host "`n是否继续推送? (y/N)"

if ($confirm -eq "y" -or $confirm -eq "Y") {
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n🎉 推送成功！" -ForegroundColor Green
        Write-Host "`n您可以访问以下链接查看代码：" -ForegroundColor Cyan
        Write-Host "  https://github.com/XiaoDus/Idiom-Memorization" -ForegroundColor White
        
        Write-Host "`n💡 提示：如果要在线访问网站，可以设置 GitHub Pages：" -ForegroundColor Yellow
        Write-Host "  1. 进入仓库 Settings" -ForegroundColor White
        Write-Host "  2. 找到 Pages 选项" -ForegroundColor White
        Write-Host "  3. Source 选择 'main' 分支" -ForegroundColor White
    } else {
        Write-Host "`n❌ 推送失败！" -ForegroundColor Red
        Write-Host "`n常见问题：" -ForegroundColor Yellow
        Write-Host "  • 没有推送权限 - 需要 GitHub token 或 SSH key" -ForegroundColor White
        Write-Host "  • 仓库不存在 - 需要先在 GitHub 上创建" -ForegroundColor White
        Write-Host "  • 网络问题 - 检查网络连接" -ForegroundColor White
    }
} else {
    Write-Host "`n已取消推送。" -ForegroundColor Yellow
    Write-Host "代码已提交到本地仓库，随时可以推送。" -ForegroundColor White
}

Write-Host "`n📚 详细指南请查看: GITHUB_UPLOAD_GUIDE.md" -ForegroundColor Cyan
Read-Host "`n按 Enter 键退出"
