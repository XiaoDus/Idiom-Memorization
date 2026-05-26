$filePath = "d:\桌面\idiom\preview_complete.html"
$content = Get-Content $filePath -Raw -Encoding UTF8

# 1. 更新标题和描述
$content = $content -replace '<h1 class="font-song">例题填空</h1>', '<h1 class="font-song">例题选择</h1>'
$content = $content -replace '<p style="font-size:16px;margin-bottom:16px;color:#666">请在空格处填入正确的字</p>', '<p style="font-size:16px;margin-bottom:24px;color:#666;line-height:1.8">请选择以下句子中应填入的成语：</p>'

# 2. 移除成语名称显示
$content = $content -replace '<h4 style="font-size:14px;color:#999;margin-bottom:8px">成语：<span id="fill-idiom-name" style="color:#C73E3A;font-weight:bold">源远流长</span></h4>', ''

# 3. 移除输入框和提交按钮，替换为选项容器
$content = $content -replace '<div style="margin-top:32px">\s*<input type="text" id="fill-input" class="fill-input" placeholder="请填入正确的字\.\.\." maxlength="4">\s*<button id="fill-submit" class="fill-submit-btn" onclick="checkFillAnswer\(\)">提交</button>\s*</div>', '<div class="quiz-options" id="fill-options"></div>'

# 4. 更新结果区域，添加释义显示
$oldResult = @'
                    <div id="fill-result" class="fill-result hidden">
                        <div id="fill-feedback" class="fill-feedback"></div>
                        <div style="margin-top:16px">
                            <p id="fill-correct-answer" style="font-size:16px;color:#666;margin-bottom:12px"></p>
                            <button onclick="nextFillQuestion()" class="fill-next-btn">下一题</button>
                        </div>
                    </div>
'@

$newResult = @'
                    <div id="fill-result" class="fill-result hidden">
                        <div id="fill-feedback" class="fill-feedback"></div>
                        <div id="fill-explanation" style="margin-top:16px;text-align:left;padding:16px;background:#f8f6f1;border-radius:12px;display:none">
                            <h4 style="margin-bottom:8px;color:#2b2b2b">成语释义：</h4>
                            <p id="fill-meaning-text" style="color:#666;line-height:1.6"></p>
                        </div>
                        <button onclick="nextFillQuestion()" class="fill-next-btn" style="margin-top:24px">下一题</button>
                    </div>
'@

$content = $content -replace [regex]::Escape($oldResult), $newResult

# 5. 更新完成页面标题
$content = $content -replace '<h2 class="complete-title">填空练习完成！</h2>', '<h2 class="complete-title">例题选择完成！</h2>'

# 6. 更新导航按钮文字
$content = $content -replace '<span>📄</span><span>例题填空</span>', '<span>📝</span><span>例题选择</span>'

# 保存修改后的内容
$content | Set-Content $filePath -Encoding UTF8

Write-Host "✅ HTML文件结构已更新！" -ForegroundColor Green
