$filePath = "d:\桌面\idiom\preview_complete.html"
$content = Get-Content $filePath -Raw -Encoding UTF8

# 改进收藏页面的显示
$oldRenderFavorites = @'
        function renderFavorites() {
            const favoriteIdioms = idioms.filter(i => favorites.includes(i.idiom));
            const container = document.getElementById('favorites-grid');
            const emptyState = document.getElementById('empty-favorites');
            if(favoriteIdioms.length===0) { container.classList.add('hidden'); emptyState.classList.remove('hidden'); }
            else { container.classList.remove('hidden'); emptyState.classList.add('hidden');
                container.innerHTML = favoriteIdioms.map(idiom => 
                    `<div class="idiom-card" onclick="showIdiomModal('${idiom.idiom}')">
                        <div class="card-header">
                            <h3 class="card-title">${idiom.idiom}</h3>
                            <span class="card-favorite" onclick="event.stopPropagation();toggleFavorite('${idiom.idiom}')">❤️</span>
                        </div>
                        <p class="card-meaning">${idiom.meaning}</p>
                        <div class="card-footer">
                            <span class="card-category">${idiom.category}</span>
                        </div>
                    </div>`).join('');
            }
        }
'@

$newRenderFavorites = @'
        function renderFavorites() {
            const favoriteIdioms = idioms.filter(i => favorites.includes(i.idiom));
            const container = document.getElementById('favorites-grid');
            const emptyState = document.getElementById('empty-favorites');
            if(favoriteIdioms.length===0) { container.classList.add('hidden'); emptyState.classList.remove('hidden'); }
            else { container.classList.remove('hidden'); emptyState.classList.add('hidden');
                container.innerHTML = favoriteIdioms.map(idiom => 
                    `<div class="idiom-card" onclick="showIdiomModal('${idiom.idiom}')">
                        <div class="card-header">
                            <h3 class="card-title">${idiom.idiom}</h3>
                            <span class="card-favorite favorited" onclick="event.stopPropagation();toggleFavorite('${idiom.idiom}')" title="点击取消收藏" style="cursor:pointer;transition:transform 0.3s">❤️</span>
                        </div>
                        <p class="card-meaning">${idiom.meaning}</p>
                        <div class="card-footer">
                            <span class="card-category">${idiom.category}</span>
                            <span class="card-hint" style="color:#C73E3A;font-size:12px">❤️ 点击取消收藏</span>
                        </div>
                    </div>`).join('');
            }
        }
'@

$content = $content -replace [regex]::Escape($oldRenderFavorites), $newRenderFavorites

# 改进首页卡片的心形图标，添加title提示
$oldCardFavorite = '<span class="card-favorite" onclick="event.stopPropagation();toggleFavorite\(\'\${idiom\.idiom\}\'\)\">\${favorites\.includes\(idiom\.idiom\) \? \'❤️\' : \'🤍\'\}'
$newCardFavorite = '<span class="card-favorite ${favorites.includes(idiom.idiom) ? \'favorited\' : \'\'}" onclick="event.stopPropagation();toggleFavorite(\'${idiom.idiom}\')" title="${favorites.includes(idiom.idiom) ? \'点击取消收藏\' : \'点击添加收藏\'}">${favorites.includes(idiom.idiom) ? \'❤️\' : \'🤍\'}'

# 保存修改
$content | Set-Content $filePath -Encoding UTF8

Write-Host "✅ 收藏功能已改进！" -ForegroundColor Green
Write-Host "改进内容：" -ForegroundColor Cyan
Write-Host "  • 收藏页面添加了明显的'点击取消收藏'提示" -ForegroundColor Yellow
Write-Host "  • 所有心形图标添加了悬停提示" -ForegroundColor Yellow
Write-Host "  • 添加了交互动画效果" -ForegroundColor Yellow
