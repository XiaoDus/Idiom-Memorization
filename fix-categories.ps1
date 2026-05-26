# 读取 idioms.json 文件
$jsonPath = "d:\桌面\idiom\idioms.json"
$jsonContent = Get-Content $jsonPath -Raw -Encoding UTF8
$idioms = $jsonContent | ConvertFrom-Json

Write-Host "总共有 $($idioms.Count) 个成语" -ForegroundColor Cyan
Write-Host ("=" * 50)

# 检查分类情况
$noCategoryCount = 0
$noCategoryIdioms = @()

for ($i = 0; $i -lt $idioms.Count; $i++) {
    $idiom = $idioms[$i]
    if (-not $idiom.category -or $idiom.category.Trim() -eq '') {
        $noCategoryCount++
        $noCategoryIdioms += @{
            Index = $i
            Idiom = $idiom.idiom
            Meaning = $idiom.meaning
        }
        # 给没有分类的成语添加默认分类
        $idiom.category = "其他"
    }
}

if ($noCategoryCount -gt 0) {
    Write-Host "`n发现 $noCategoryCount 个没有分类的成语：`n" -ForegroundColor Yellow
    $noCategoryIdioms | ForEach-Object {
        Write-Host "- $($_.Idiom) (索引: $($_.Index))"
    }
    
    # 保存修复后的文件
    $idioms | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8
    Write-Host "`n✅ 已修复！已给 $noCategoryCount 个成语添加了 `"其他`" 分类，更新文件保存成功！" -ForegroundColor Green
    
    # 同时也更新其他位置的文件
    try {
        $targetPath1 = "d:\桌面\idiom\src\data\idioms.json"
        $idioms | ConvertTo-Json -Depth 10 | Set-Content $targetPath1 -Encoding UTF8
        Write-Host "✅ src/data/idioms.json 也已更新！" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  无法更新 src/data/idioms.json" -ForegroundColor Yellow
    }
    
    try {
        $targetPath2 = "d:\桌面\idiom\public\idioms.json"
        $idioms | ConvertTo-Json -Depth 10 | Set-Content $targetPath2 -Encoding UTF8
        Write-Host "✅ public/idioms.json 也已更新！" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  无法更新 public/idioms.json" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ 所有成语都有分类！" -ForegroundColor Green
}
