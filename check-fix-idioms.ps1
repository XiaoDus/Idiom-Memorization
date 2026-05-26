# 检查并修复 idioms.json 文件
$jsonPath = "d:\桌面\idiom\idioms.json"
$jsonContent = Get-Content $jsonPath -Raw -Encoding UTF8
$idioms = $jsonContent | ConvertFrom-Json

Write-Host "正在检查 $($idioms.Count) 个成语的分类..." -ForegroundColor Cyan
Write-Host ("=" * 60)

$noCategoryCount = 0
$problematicIdioms = @()

for ($i = 0; $i -lt $idioms.Count; $i++) {
    $idiom = $idioms[$i]
    if (-not $idiom.category -or $idiom.category.Trim() -eq '') {
        $noCategoryCount++
        $problematicIdioms += @{
            Index = $i
            Idiom = $idiom.idiom
            Meaning = $idiom.meaning
        }
        # 修复没有分类的成语
        $idiom.category = "其他"
    }
}

if ($noCategoryCount -gt 0) {
    Write-Host "`n发现 $noCategoryCount 个没有分类的成语！`n" -ForegroundColor Yellow
    
    # 列出问题成语：
    $problematicIdioms | Select-Object -First 20 | ForEach-Object {
        Write-Host "- $($_.Idiom)"
    }
    if ($problematicIdioms.Count -gt 20) {
        Write-Host "...还有 $($problematicIdioms.Count - 20) 个" -ForegroundColor Gray
    }
    
    # 保存修复后的文件
    Write-Host "`n正在保存修复后的文件..." -ForegroundColor Cyan
    $idioms | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8
    Write-Host "✅ idioms.json 已修复并保存成功！" -ForegroundColor Green
    
    # 同时也更新其他位置的文件
    $filesToUpdate = @(
        "d:\桌面\idiom\src\data\idioms.json",
        "d:\桌面\idiom\public\idioms.json"
    )
    
    foreach ($targetPath in $filesToUpdate) {
        try {
            $idioms | ConvertTo-Json -Depth 10 | Set-Content $targetPath -Encoding UTF8
            Write-Host "✅ $targetPath 也已更新！" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️  无法更新 $targetPath" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n🎉 修复完成！" -ForegroundColor Green
} else {
    Write-Host "✅ 所有成语都有分类，无需修复！" -ForegroundColor Green
}
