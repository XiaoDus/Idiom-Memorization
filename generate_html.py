
import json

# 读取idioms.json文件
with open(r'd:\桌面\idiom\idioms.json', 'r', encoding='utf-8') as f:
    idioms_data = json.load(f)

# 读取基本HTML模板
base_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>成语记忆大师</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans SC', sans-serif;
            background: linear-gradient(135deg, #F8F6F1 0%, #E8E4DD 50%, #F8F6F1 100%);
            min-height: 100vh;
            color: #2B2B2B;
        }
        .font-song { font-family: 'Source Serif 4', serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header {
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255,255,255,0.3);
            position: sticky; top: 0; z-index: 100;
        }
        header .container {
            padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;
        }
        .logo { display: flex; align-items: center; gap: 8px; font-size: 24px; font-weight: bold; color: #C73E3A; }
        nav { display: flex; gap: 24px; }
        nav a { color: #2B2B2B; text-decoration: none; cursor: pointer; transition: color 0.3s; }
        nav a:hover, nav a.active { color: #C73E3A; }
        main { padding: 32px 0; }
        .hero { text-align: center; margin-bottom: 32px; }
        .hero h1 { font-size: 36px; margin-bottom: 8px; }
        .hero p { color: #666; font-size: 16px; }
        .search-box { max-width: 600px; margin: 0 auto 32px; }
        .search-box input {
            width: 100%; padding: 12px 24px; border: 2px solid rgba(199,62,58,0.2);
            border-radius: 50px; font-size: 16px; outline: none; transition: border-color 0.3s;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .search-box input:focus { border-color: #C73E3A; }
        .categories {
            display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;
            margin-bottom: 24px; max-height: 150px; overflow-y: auto;
        }
        .category-btn {
            padding: 8px 16px; border-radius: 50px; border: none; cursor: pointer;
            transition: all 0.3s; background: white; color: #666; font-size: 14px;
        }
        .category-btn:hover { background: rgba(199,62,58,0.1); transform: scale(1.05); }
        .category-btn.active { background: #C73E3A; color: white; box-shadow: 0 4px 6px rgba(199,62,58,0.3); transform: scale(1.05); }
        .cards-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px; margin-top: 32px;
        }
        .idiom-card {
            background: white; border-radius: 16px; padding: 24px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s; cursor: pointer;
            animation: fadeIn 0.5s ease-out both;
        }
        .idiom-card:hover { transform: translateY(-4px); box-shadow: 0 8px 12px rgba(0,0,0,0.15); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .card-title { font-size: 24px; font-weight: bold; color: #C73E3A; }
        .card-favorite { font-size: 24px; cursor: pointer; transition: transform 0.3s; }
        .card-favorite:hover { transform: scale(1.2); }
        .card-meaning {
            color: #666; font-size: 14px; margin-bottom: 16px; line-height: 1.6;
            display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .card-footer { display: flex; justify-content: space-between; align-items: center; }
        .card-category {
            font-size: 12px; padding: 4px 12px; background: rgba(199,62,58,0.1);
            color: #C73E3A; border-radius: 50px;
        }
        .card-hint { font-size: 12px; color: #999; transition: color 0.3s; }
        .idiom-card:hover .card-hint { color: #C73E3A; }
        .pagination {
            display: flex; justify-content: center; align-items: center; gap: 8px;
            margin-top: 32px; flex-wrap: wrap;
        }
        .pagination button {
            padding: 8px 16px; border: 2px solid #C73E3A; background: white; color: #C73E3A;
            border-radius: 8px; cursor: pointer; transition: all 0.3s;
        }
        .pagination button:hover:not(:disabled) { background: #C73E3A; color: white; }
        .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
        .pagination .active { background: #C73E3A; color: white; }
        .pagination .info {
            padding: 8px 16px; background: rgba(199,62,58,0.1); color: #C73E3A; border-radius: 8px;
        }
        .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 200; padding: 20px;
        }
        .modal {
            background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
            border-radius: 24px; max-width: 600px; width: 100%;
            max-height: 80vh; overflow-y: auto; padding: 32px;
            animation: bounceIn 0.4s ease-out;
        }
        @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
            display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;
        }
        .modal-title { font-size: 36px; font-weight: bold; color: #C73E3A; }
        .modal-close { font-size: 24px; color: #999; cursor: pointer; transition: color 0.3s; }
        .modal-close:hover { color: #666; }
        .modal-category {
            display: inline-block; padding: 6px 12px; background: rgba(199,62,58,0.1);
            color: #C73E3A; border-radius: 50px; font-size: 14px; margin-bottom: 16px;
        }
        .modal-section { margin-bottom: 24px; }
        .modal-section h3 { font-size: 20px; font-weight: 600; color: #2B2B2B; margin-bottom: 8px; }
        .modal-section p { color: #666; line-height: 1.8; }
        .example-item {
            background: rgba(255,255,255,0.5); padding: 12px; border-radius: 8px;
            margin-bottom: 8px; color: #666; line-height: 1.8;
        }
        .quick-actions {
            display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin: 48px 0;
        }
        .action-btn {
            padding: 16px 32px; border-radius: 50px; display: flex; align-items: center; gap: 8px;
            font-weight: 500; transition: all 0.3s; cursor: pointer; border: none; font-size: 16px;
        }
        .action-btn:hover { transform: scale(1.05); }
        .action-btn.primary {
            background: #C73E3A; color: white; box-shadow: 0 4px 6px rgba(199,62,58,0.3);
        }
        .action-btn.secondary {
            background: white; color: #C73E3A; border: 2px solid #C73E3A;
        }
        .flashcard-container { max-width: 600px; margin: 0 auto; }
        .progress-bar {
            background: #eee; border-radius: 10px; height: 8px; margin-bottom: 32px;
        }
        .progress-fill {
            background: #C73E3A; height: 100%; border-radius: 10px; transition: width 0.3s;
        }
        .flashcard {
            background: white; border-radius: 24px; padding: 48px; text-align: center;
            box-shadow: 0 8px 12px rgba(0,0,0,0.15); cursor: pointer; min-height: 300px;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            border: 4px solid rgba(199,62,58,0.2); transition: all 0.3s;
        }
        .flashcard-flipped {
            background: linear-gradient(135deg, #C73E3A, #a33330);
        }
        .flashcard-idiom {
            font-size: 48px; font-weight: bold; font-family: 'Source Serif 4', serif;
        }
        .flashcard-hint { color: #C73E3A; font-size: 14px; margin-bottom: 16px; }
        .flashcard-flipped .flashcard-idiom {
            color: white; font-size: 32px; margin-bottom: 16px;
        }
        .flashcard-meaning {
            background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px;
            margin-bottom: 16px; color: white; line-height: 1.8; text-align: left; width: 100%;
        }
        .flashcard-examples { width: 100%; text-align: left; }
        .flashcard-examples h4 { color: white; font-size: 16px; margin-bottom: 8px; }
        .flashcard-examples .example-item {
            background: rgba(255,255,255,0.2); color: white;
        }
        .learning-buttons {
            display: flex; justify-content: center; gap: 16px; margin-top: 32px;
        }
        .learning-buttons button {
            padding: 16px 32px; border: none; border-radius: 50px; font-size: 18px;
            cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s;
        }
        .learning-buttons button:hover { transform: scale(1.05); }
        .btn-know { background: #10b981; color: white; }
        .btn-unknow { background: #f97316; color: white; }
        .show-meaning-btn { text-align: center; margin-top: 32px; }
        .show-meaning-btn button {
            padding: 16px 48px; background: #C73E3A; color: white; border: none;
            border-radius: 50px; font-size: 18px; cursor: pointer; transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(199,62,58,0.3);
        }
        .show-meaning-btn button:hover { transform: scale(1.05); background: #a33330; }
        .quiz-container { max-width: 800px; margin: 0 auto; }
        .quiz-question {
            background: rgba(255,255,255,0.9); backdrop-filter: blur(10px);
            border-radius: 24px; padding: 32px; margin-bottom: 24px;
        }
        .quiz-question-text { font-size: 24px; text-align: center; margin-bottom: 32px; }
        .quiz-question-idiom { color: #C73E3A; font-weight: bold; }
        .quiz-options { display: flex; flex-direction: column; gap: 12px; }
        .quiz-option {
            padding: 16px; border-radius: 12px; border: 2px solid #e5e7eb; background: white;
            text-align: left; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 12px;
        }
        .quiz-option:hover { background: rgba(199,62,58,0.1); }
        .quiz-option.correct { background: rgba(16,185,129,0.1); border-color: #10b981; }
        .quiz-option.wrong { background: rgba(239,68,68,0.1); border-color: #ef4444; }
        .quiz-result { text-align: center; margin-top: 24px; }
        .quiz-feedback { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
        .quiz-feedback.correct { color: #10b981; }
        .quiz-feedback.wrong { color: #ef4444; }
        .quiz-next-btn {
            padding: 16px 48px; background: #C73E3A; color: white; border: none;
            border-radius: 50px; font-size: 18px; cursor: pointer; transition: all 0.3s;
            box-shadow: 0 4px 6px rgba(199,62,58,0.3);
        }
        .quiz-next-btn:hover { transform: scale(1.05); }
        .complete-screen { max-width: 600px; margin: 0 auto; text-align: center; padding: 64px 20px; }
        .complete-emoji { font-size: 64px; margin-bottom: 24px; }
        .complete-title {
            font-size: 36px; font-family: 'Source Serif 4', serif;
            margin-bottom: 24px; color: #2B2B2B;
        }
        .complete-score { font-size: 72px; font-weight: bold; color: #C73E3A; }
        .complete-desc { color: #666; margin-bottom: 32px; }
        .complete-message {
            background: rgba(255,255,255,0.5); padding: 24px; border-radius: 16px;
            margin-bottom: 32px; text-align: left;
        }
        .complete-message h3 { font-weight: 600; margin-bottom: 12px; }
        .complete-message p { color: #666; line-height: 1.6; }
        .complete-buttons {
            display: flex; flex-direction: column; gap: 12px; align-items: center;
        }
        .complete-buttons button {
            padding: 16px 32px; border-radius: 50px; cursor: pointer; font-size: 18px;
            transition: all 0.3s;
        }
        .complete-buttons .btn-primary { background: #C73E3A; color: white; border: none; }
        .complete-buttons .btn-secondary { background: white; color: #C73E3A; border: 2px solid #C73E3A; }
        .complete-buttons button:hover { transform: scale(1.05); }
        .stats-bar {
            background: white; border-radius: 12px; padding: 16px; margin-bottom: 24px;
            display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap; gap: 16px;
        }
        .stat-item { text-align: center; }
        .stat-value { font-size: 24px; font-weight: bold; color: #C73E3A; }
        .stat-label { font-size: 14px; color: #666; }
        .empty-favorites { text-align: center; padding: 64px 0; }
        .empty-favorites .emoji { font-size: 64px; margin-bottom: 16px; }
        .empty-favorites h3 { font-size: 24px; color: #666; margin-bottom: 16px; }
        .empty-favorites p { color: #999; margin-bottom: 32px; }
        footer { text-align: center; padding: 32px 0; color: #999; font-size: 14px; }
        .hidden { display: none !important; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <span>📚</span>
                <span class="font-song">成语记忆大师</span>
                <span class="logo-info" id="idiom-count"></span>
            </div>
            <nav>
                <a class="active" onclick="showHome(event)">首页</a>
                <a onclick="showLearningMode(event)">学习</a>
                <a onclick="showQuizMode(event)">测验</a>
                <a onclick="showFavorites(event)">收藏</a>
            </nav>
        </div>
    </header>

    <main>
        <div class="container">
            <div id="home-view">
                <div class="hero">
                    <h1 class="font-song">探索成语的魅力</h1>
                    <p>通过分类浏览、搜索和收藏，系统学习中华文化精髓</p>
                </div>
                <div class="stats-bar">
                    <div class="stat-item">
                        <div class="stat-value" id="stat-total">0</div>
                        <div class="stat-label">总成语</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="stat-categories">0</div>
                        <div class="stat-label">分类</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="stat-favorites">0</div>
                        <div class="stat-label">收藏</div>
                    </div>
                </div>
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="搜索成语或含义..." oninput="handleSearch()">
                </div>
                <div class="categories" id="categories"></div>
                <div class="cards-grid" id="idioms-grid"></div>
                <div class="pagination" id="pagination"></div>
            </div>
            
            <div id="learning-view" class="hidden">
                <div class="hero">
                    <h1 class="font-song">闪卡学习模式</h1>
                    <p>学习进度：<span id="learning-progress">0</span> / <span id="learning-total">0</span></p>
                </div>
                <div class="flashcard-container">
                    <div class="progress-bar"><div class="progress-fill" id="learning-progress-bar" style="width:0%"></div></div>
                    <div class="flashcard" id="flashcard" onclick="flipCard()">
                        <div id="card-front">
                            <div class="flashcard-hint">点击翻转查看释义</div>
                            <div class="flashcard-idiom" id="card-idiom">源远流长</div>
                            <div style="margin-top:24px;font-size:48px">👆</div>
                        </div>
                        <div id="card-back" class="hidden">
                            <div class="flashcard-idiom" id="back-idiom">源远流长</div>
                            <div class="flashcard-meaning">
                                <h4 style="font-size:16px;margin-bottom:8px">释义</h4>
                                <p id="back-meaning" style="line-height:1.8">源头远，水流长。也比喻历史悠久。</p>
                            </div>
                            <div class="flashcard-examples">
                                <h4>例句</h4>
                                <div id="back-examples"></div>
                            </div>
                        </div>
                    </div>
                    <div id="learning-buttons" class="hidden learning-buttons">
                        <button class="btn-know" onclick="handleResponse(true)"><span>✓</span>认识</button>
                        <button class="btn-unknow" onclick="handleResponse(false)"><span>✗</span>不认识</button>
                    </div>
                    <div id="show-meaning-btn" class="show-meaning-btn">
                        <button onclick="flipCard()">显示释义</button>
                    </div>
                </div>
                <div style="text-align:center;margin-top:32px">
                    <button onclick="showHome()" style="padding:12px 24px;background:white;color:#C73E3A;border:2px solid #C73E3A;border-radius:50px;cursor:pointer;transition:all 0.3s">←返回首页</button>
                </div>
            </div>
            
            <div id="quiz-view" class="hidden">
                <div class="hero">
                    <h1 class="font-song">成语测验</h1>
                    <p>第 <span id="quiz-question-num">1</span>题/共<span id="quiz-total">10</span>题</p>
                </div>
                <div class="quiz-container">
                    <div class="progress-bar"><div class="progress-fill" id="quiz-progress-bar" style="width:0%"></div></div>
                    <div class="quiz-question">
                        <h3 class="quiz-question-text">成语"<span id="quiz-idiom" class="quiz-question-idiom">源远流长</span>"是什么意思？</h3>
                        <div class="quiz-options" id="quiz-options"></div>
                    </div>
                    <div id="quiz-result" class="quiz-result hidden">
                        <div id="quiz-feedback" class="quiz-feedback"></div>
                        <button onclick="nextQuestion()" class="quiz-next-btn">下一题</button>
                    </div>
                </div>
                <div style="text-align:center;margin-top:32px">
                    <button onclick="showHome()" style="padding:12px 24px;background:white;color:#C73E3A;border:2px solid #C73E3A;border-radius:50px;cursor:pointer;transition:all 0.3s">←返回首页</button>
                </div>
            </div>
            
            <div id="favorites-view" class="hidden">
                <div class="hero">
                    <h1 class="font-song">我的收藏</h1>
                    <p>共收藏 <span id="favorites-count">0</span> 个成语</p>
                </div>
                <div class="cards-grid" id="favorites-grid"></div>
                <div id="empty-favorites" class="hidden empty-favorites">
                    <div class="emoji">💔</div>
                    <h3>还没有收藏任何成语</h3>
                    <p>快去首页浏览并收藏你喜欢的成语吧！</p>
                    <button onclick="showHome()" style="padding:16px 32px;background:#C73E3A;color:white;border:none;border-radius:50px;cursor:pointer;transition:all 0.3s">去首页看看</button>
                </div>
            </div>
            
            <div class="quick-actions" id="quick-actions">
                <button onclick="showLearningMode(event)" class="action-btn primary">
                    <span>🚀</span><span>开始学习</span>
                </button>
                <button onclick="showQuizMode(event)" class="action-btn secondary">
                    <span>📝</span><span>参加测验</span>
                </button>
                <button onclick="showFavorites(event)" class="action-btn secondary">
                    <span>❤️</span><span>查看收藏</span>
                </button>
            </div>
        </div>
    </main>

    <footer><div class="container"><p>成语记忆大师 - 帮助您高效学习中华文化精髓</p></div></footer>

    <div id="modal" class="modal-overlay hidden" onclick="closeModal(event)">
        <div class="modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h2 id="modal-title" class="modal-title">源远流长</h2>
                <span class="modal-close" onclick="hideModal()">✕</span>
            </div>
            <div id="modal-category" class="modal-category">中华文明 传统文化</div>
            <div class="modal-section">
                <h3>释义</h3>
                <p id="modal-meaning">源头远，水流长。也比喻历史悠久。</p>
            </div>
            <div class="modal-section">
                <h3>例句</h3>
                <div id="modal-examples"></div>
            </div>
        </div>
    </div>

    <script>
        const idiomsData = IDIOMS_DATA_PLACEHOLDER;
        let idioms = idiomsData;
        let favorites = JSON.parse(localStorage.getItem('idiom-favorites') || '[]');
        let learningProgress = JSON.parse(localStorage.getItem('idiom-progress') || '[]');
        let currentCategory = '全部';
        let searchTerm = '';
        let currentPage = 1;
        const itemsPerPage = 24;
        let totalPages = 1;
        let learningQueue = [];
        let currentLearningIndex = 0;
        let isCardFlipped = false;
        let learningStats = { known:0, unknown:0 };
        let quizQuestions = [];
        let currentQuizIndex = 0;
        let selectedAnswer = null;
        let showQuizResult = false;
        let quizScore = 0;
        
        function init() {
            updateStats(); renderCategories(); renderIdioms(); updateFavoritesCount();
        }
        function updateStats() {
            document.getElementById('idiom-count').textContent = `(${idioms.length}个成语)`;
            document.getElementById('stat-total').textContent = idioms.length;
            document.getElementById('stat-categories').textContent = new Set(idioms.map(i => i.category)).size;
            document.getElementById('stat-favorites').textContent = favorites.length;
        }
        function renderCategories() {
            const categories = ['全部', ...new Set(idioms.map(i => i.category))];
            const container = document.getElementById('categories');
            container.innerHTML = categories.map(cat => `<button class="category-btn ${cat === currentCategory ? 'active' : ''}" onclick="selectCategory('${cat}')">${cat}</button>`).join('');
        }
        function selectCategory(category) {
            currentCategory = category; currentPage =1; renderCategories(); renderIdioms();
        }
        let searchTimeout;
        function handleSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchTerm = document.getElementById('search-input').value;
                currentPage =1; renderIdioms();
            },300);
        }
        function getFilteredIdioms() {
            return idioms.filter(idiom => {
                const matchesSearch = idiom.idiom.includes(searchTerm) || idiom.meaning.includes(searchTerm);
                const matchesCategory = currentCategory === '全部' || idiom.category === currentCategory;
                return matchesSearch && matchesCategory;
            });
        }
        function renderIdioms() {
            const filtered = getFilteredIdioms();
            totalPages = Math.ceil(filtered.length / itemsPerPage);
            const startIndex = (currentPage-1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageIdioms = filtered.slice(startIndex, endIndex);
            const container = document.getElementById('idioms-grid');
            container.innerHTML = pageIdioms.map((idiom,index) => 
                `<div class="idiom-card" onclick="showIdiomModal('${idiom.idiom}')" style="animation-delay:${index*0.03}s">
                    <div class="card-header">
                        <h3 class="card-title">${idiom.idiom}</h3>
                        <span class="card-favorite" onclick="event.stopPropagation();toggleFavorite('${idiom.idiom}')">${favorites.includes(idiom.idiom) ? '❤️' : '🤍'}</span>
                    </div>
                    <p class="card-meaning">${idiom.meaning}</p>
                    <div class="card-footer">
                        <span class="card-category">${idiom.category}</span>
                        <span class="card-hint">点击查看详情 →</span>
                    </div>
                </div>`).join('');
            if(filtered.length ===0) container.innerHTML = '<p style="text-align:center;color:#999;grid-column:1/-1;padding:48px">没有找到匹配的成语</p>';
            renderPagination(filtered.length);
        }
        function renderPagination(totalItems) {
            const container = document.getElementById('pagination');
            if(totalPages <=1) { container.innerHTML=''; return; }
            let html = '';
            html += `<button onclick="goToPage(${currentPage-1})" ${currentPage===1?'disabled':''}>上一页</button>`;
            const maxButtons=5;
            let startPage = Math.max(1, currentPage-Math.floor(maxButtons/2));
            let endPage = Math.min(totalPages, startPage+maxButtons-1);
            if(endPage-startPage < maxButtons-1) startPage = Math.max(1, endPage-maxButtons+1);
            if(startPage>1) {
                html += `<button onclick="goToPage(1)">1</button>`;
                if(startPage>2) html += '<span style="padding:8px">...</span>';
            }
            for(let i=startPage;i<=endPage;i++) html += `<button onclick="goToPage(${i})" class="${i===currentPage?'active':''}">${i}</button>`;
            if(endPage < totalPages) {
                if(endPage < totalPages-1) html += '<span style="padding:8px">...</span>';
                html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
            }
            html += `<button onclick="goToPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>下一页</button>`;
            html += `<span class="info">第${currentPage}/${totalPages}页，共${totalItems}个成语</span>`;
            container.innerHTML = html;
        }
        function goToPage(page) { if(page<1 || page>totalPages) return; currentPage=page; renderIdioms(); window.scrollTo({top:0, behavior:'smooth'}); }
        function showIdiomModal(idiomName) {
            const idiom = idioms.find(i => i.idiom === idiomName);
            if(!idiom) return;
            document.getElementById('modal-title').textContent = idiom.idiom;
            document.getElementById('modal-category').textContent = idiom.category;
            document.getElementById('modal-meaning').textContent = idiom.meaning;
            document.getElementById('modal-examples').innerHTML = idiom.examples.map(ex => `<div class="example-item">${ex}</div>`).join('');
            document.getElementById('modal').classList.remove('hidden');
        }
        function hideModal() { document.getElementById('modal').classList.add('hidden'); }
        function closeModal(event) { if(event.target.id === 'modal') hideModal(); }
        function toggleFavorite(idiomName) {
            const idx = favorites.indexOf(idiomName);
            if(idx >-1) favorites.splice(idx,1); else favorites.push(idiomName);
            localStorage.setItem('idiom-favorites', JSON.stringify(favorites));
            renderIdioms(); updateFavoritesCount(); updateStats();
        }
        function updateFavoritesCount() { document.getElementById('favorites-count').textContent = favorites.length; }
        function showHome(event) {
            if(event) { event.preventDefault(); event.stopPropagation(); }
            hideAllViews();
            document.getElementById('home-view').classList.remove('hidden');
            document.getElementById('quick-actions').classList.remove('hidden');
            document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
            document.querySelector('nav a').classList.add('active');
            currentPage=1; renderIdioms();
        }
        function hideAllViews() {
            document.getElementById('home-view').classList.add('hidden');
            document.getElementById('learning-view').classList.add('hidden');
            document.getElementById('quiz-view').classList.add('hidden');
            document.getElementById('favorites-view').classList.add('hidden');
            document.getElementById('quick-actions').classList.add('hidden');
        }
        function showFavorites(event) {
            if(event) { event.preventDefault(); event.stopPropagation(); }
            hideAllViews();
            document.getElementById('favorites-view').classList.remove('hidden');
            document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
            document.querySelectorAll('nav a')[3].classList.add('active');
            renderFavorites();
        }
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
        function showLearningMode(event) {
            if(event) { event.preventDefault(); event.stopPropagation(); }
            hideAllViews();
            document.getElementById('learning-view').classList.remove('hidden');
            document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
            document.querySelectorAll('nav a')[1].classList.add('active');
            initLearning();
        }
        function initLearning() {
            learningQueue = shuffleArray([...idioms]);
            currentLearningIndex =0; learningStats={known:0,unknown:0}; isCardFlipped=false;
            updateLearningCard(); updateLearningProgress();
        }
        function updateLearningCard() {
            const idiom = learningQueue[currentLearningIndex];
            document.getElementById('card-idiom').textContent = idiom.idiom;
            document.getElementById('back-idiom').textContent = idiom.idiom;
            document.getElementById('back-meaning').textContent = idiom.meaning;
            document.getElementById('back-examples').innerHTML = idiom.examples.map(ex => `<div class="example-item" style="background:rgba(255,255,255,0.2);color:white">${ex}</div>`).join('');
            document.getElementById('card-front').classList.remove('hidden');
            document.getElementById('card-back').classList.add('hidden');
            document.getElementById('show-meaning-btn').classList.remove('hidden');
            document.getElementById('learning-buttons').classList.add('hidden');
            document.getElementById('flashcard').classList.remove('flashcard-flipped');
            isCardFlipped = false;
        }
        function updateLearningProgress() {
            document.getElementById('learning-progress').textContent = currentLearningIndex+1;
            document.getElementById('learning-total').textContent = learningQueue.length;
            const percentage = ((currentLearningIndex+1)/learningQueue.length)*100;
            document.getElementById('learning-progress-bar').style.width = percentage + '%';
        }
        function flipCard() {
            if(!isCardFlipped) {
                document.getElementById('card-front').classList.add('hidden');
                document.getElementById('card-back').classList.remove('hidden');
                document.getElementById('show-meaning-btn').classList.add('hidden');
                document.getElementById('learning-buttons').classList.remove('hidden');
                document.getElementById('flashcard').classList.add('flashcard-flipped');
                isCardFlipped=true;
            }
        }
        function handleResponse(known) {
            const idiom = learningQueue[currentLearningIndex];
            const existingProgress = learningProgress.find(p => p.idiom === idiom.idiom);
            const newProgress = {
                idiom: idiom.idiom,
                timesReviewed: (existingProgress?.timesReviewed || 0)+1,
                correctCount: (existingProgress?.correctCount ||0)+(known?1:0),
                lastReviewed: new Date().toISOString(),
                mastered: known && (existingProgress?.correctCount ||0)>=2
            };
            if(existingProgress) { const idx = learningProgress.indexOf(existingProgress); learningProgress[idx]=newProgress; }
            else learningProgress.push(newProgress);
            localStorage.setItem('idiom-progress', JSON.stringify(learningProgress));
            learningStats.known += known?1:0; learningStats.unknown += known?0:1;
            if(!known) learningQueue.push(idiom);
            if(currentLearningIndex < learningQueue.length -1) { currentLearningIndex++; updateLearningCard(); updateLearningProgress(); }
            else showLearningComplete();
        }
        function showLearningComplete() {
            const container = document.getElementById('learning-view');
            const total = learningStats.known + learningStats.unknown;
            const percentage = total>0? Math.round((learningStats.known/total)*100) :0;
            let emoji='💪', message='继续努力，多复习几次就能掌握更多成语！';
            if(percentage>=90) { emoji='🏆'; message='太棒了！你对成语的掌握非常出色！'; }
            else if(percentage>=70) { emoji='👍'; message='很不错！继续保持这个学习势头！'; }
            container.innerHTML = `
                <div class="complete-screen">
                    <div class="complete-emoji">${emoji}</div>
                    <h2 class="complete-title">学习完成！</h2>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px">
                        <div style="background:rgba(16,185,129,0.1);padding:24px;border-radius:16px">
                            <div style="font-size:48px;font-weight:bold;color:#10b981">${learningStats.known}</div>
                            <div style="color:#666">已掌握</div>
                        </div>
                        <div style="background:rgba(249,115,22,0.1);padding:24px;border-radius:16px">
                            <div style="font-size:48px;font-weight:bold;color:#f97316">${learningStats.unknown}</div>
                            <div style="color:#666">需加强</div>
                        </div>
                    </div>
                    <div style="font-size:18px;color:#666;margin-bottom:32px">正确率：${percentage}%</div>
                    <div class="complete-buttons">
                        <button class="btn-primary" onclick="initLearning()">再学一轮</button>
                        <button class="btn-secondary" onclick="showHome()">返回首页</button>
                    </div>
                </div>`;
        }
        function showQuizMode(event) {
            if(event) { event.preventDefault(); event.stopPropagation(); }
            hideAllViews();
            document.getElementById('quiz-view').classList.remove('hidden');
            document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
            document.querySelectorAll('nav a')[2].classList.add('active');
            initQuiz();
        }
        function initQuiz() {
            const shuffled = shuffleArray([...idioms]);
            quizQuestions = shuffled.slice(0, Math.min(10, idioms.length)).map(idiom => {
                const others = idioms.filter(i => i.idiom !== idiom.idiom);
                const wrongOpts = shuffleArray(others).slice(0, Math.min(3, others.length)).map(i => i.meaning);
                const options = shuffleArray([...wrongOpts, idiom.meaning]);
                const correctIndex = options.indexOf(idiom.meaning);
                return { idiom, options, correctIndex };
            });
            currentQuizIndex=0; quizScore=0; selectedAnswer=null; showQuizResult=false;
            updateQuizQuestion();
        }
        function updateQuizQuestion() {
            const q = quizQuestions[currentQuizIndex];
            document.getElementById('quiz-question-num').textContent = currentQuizIndex+1;
            document.getElementById('quiz-total').textContent = quizQuestions.length;
            document.getElementById('quiz-idiom').textContent = q.idiom.idiom;
            const percentage = ((currentQuizIndex+1)/quizQuestions.length)*100;
            document.getElementById('quiz-progress-bar').style.width = percentage+'%';
            const optionsContainer = document.getElementById('quiz-options');
            optionsContainer.innerHTML = q.options.map((opt, idx) => 
                `<div class="quiz-option" onclick="selectQuizAnswer(${idx})">
                    <span style="font-weight:600">${String.fromCharCode(65+idx)}. </span>
                    <span>${opt}</span>
                </div>`).join('');
            document.getElementById('quiz-result').classList.add('hidden');
            selectedAnswer=null; showQuizResult=false;
        }
        function selectQuizAnswer(idx) {
            if(showQuizResult) return;
            selectedAnswer=idx; showQuizResult=true;
            const q = quizQuestions[currentQuizIndex];
            const isCorrect = idx === q.correctIndex;
            if(isCorrect) quizScore++;
            const options = document.querySelectorAll('.quiz-option');
            options.forEach((opt,i) => {
                if(i===q.correctIndex) { opt.classList.add('correct'); opt.innerHTML += '<span style="margin-left:auto;color:#10b981">✓ 正确</span>'; }
                else if(i===selectedAnswer && i!==q.correctIndex) { opt.classList.add('wrong'); opt.innerHTML += '<span style="margin-left:auto;color:#ef4444">✗ 错误</span>'; }
            });
            const feedback = document.getElementById('quiz-feedback');
            feedback.textContent = isCorrect ? '回答正确！🎉' : '回答错误，继续加油！💪';
            feedback.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'wrong');
            document.getElementById('quiz-result').classList.remove('hidden');
        }
        function nextQuestion() {
            if(currentQuizIndex < quizQuestions.length -1) { currentQuizIndex++; updateQuizQuestion(); }
            else showQuizComplete();
        }
        function showQuizComplete() {
            const finalScore = quizQuestions.length>0? Math.round((quizScore/quizQuestions.length)*100):0;
            let emoji='💪', message='加油！多使用闪卡学习模式加强记忆吧！';
            if(finalScore>=90) { emoji='🏆'; message='太棒了！你对成语掌握得非常扎实！'; }
            else if(finalScore>=70) { emoji='👍'; message='很不错！继续保持这个学习势头！'; }
            else if(finalScore>=50) { emoji='💪'; message='还可以，建议多复习一下易错的成语。'; }
            const container = document.getElementById('quiz-view');
            container.innerHTML = `
                <div class="complete-screen">
                    <div class="complete-emoji">${emoji}</div>
                    <h2 class="complete-title">测验完成！</h2>
                    <div class="complete-score">${finalScore}%</div>
                    <div class="complete-desc">正确率（${quizScore}/${quizQuestions.length}题）</div>
                    <div class="complete-message">
                        <h3>评价：</h3>
                        <p>${message}</p>
                    </div>
                    <div class="complete-buttons">
                        <button class="btn-primary" onclick="initQuiz()">再测一次</button>
                        <button class="btn-secondary" onclick="showHome()">返回首页</button>
                    </div>
                </div>`;
        }
        function shuffleArray(arr) {
            const newArr = [...arr];
            for(let i=newArr.length-1;i>0;i--) {
                const j = Math.floor(Math.random()*(i+1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        }
        init();
    </script>
</body>
</html>
'''

# 替换占位符为实际的成语数据
final_html = base_html.replace('IDIOMS_DATA_PLACEHOLDER', json.dumps(idioms_data, ensure_ascii=False))

# 写入到新文件
with open(r'd:\桌面\idiom\preview_complete.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print(f"成功生成包含{len(idioms_data)}个成语的完整HTML文件！")

