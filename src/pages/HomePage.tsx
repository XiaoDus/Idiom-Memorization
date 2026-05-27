import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import IdiomCard from '../components/IdiomCard';
import CategoryFilter from '../components/CategoryFilter';

const ITEMS_PER_PAGE = 24;

export default function HomePage() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedIdiom, setSelectedIdiom] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['全部', ...new Set(state.idioms.map(i => i.category))];

  const filteredIdioms = state.idioms.filter(idiom => {
    const matchesSearch = idiom.idiom.includes(searchTerm) || 
                        idiom.meaning.includes(searchTerm);
    const matchesCategory = selectedCategory === '全部' || idiom.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 计算分页
  const totalPages = Math.ceil(filteredIdioms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageIdioms = filteredIdioms.slice(startIndex, endIndex);

  // 统计信息
  const totalIdioms = state.idioms.length;
  const categoryCount = new Set(state.idioms.map(i => i.category)).size;
  const favoritesCount = state.favorites.length;

  // 生成分页按钮
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button key="first" onClick={() => setCurrentPage(1)} className="px-4 py-2 border-2 border-zhuhong bg-white text-zhuhong rounded-lg hover:bg-zhuhong hover:text-white transition-colors">
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2 text-gray-500">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i} 
          onClick={() => setCurrentPage(i)} 
          className={`px-4 py-2 border-2 rounded-lg transition-colors ${
            i === currentPage 
              ? 'bg-zhuhong text-white border-zhuhong' 
              : 'border-zhuhong bg-white text-zhuhong hover:bg-zhuhong hover:text-white'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
      }
      buttons.push(
        <button key="last" onClick={() => setCurrentPage(totalPages)} className="px-4 py-2 border-2 border-zhuhong bg-white text-zhuhong rounded-lg hover:bg-zhuhong hover:text-white transition-colors">
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  // 搜索时重置页码
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold font-song text-zhuise mb-2">
            探索成语的魅力
          </h2>
          <p className="text-gray-600">
            通过分类浏览、搜索和收藏，系统学习中华文化精髓
          </p>
        </div>

        {/* 统计信息栏 */}
        <div className="glass rounded-xl p-6 mb-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-zhuhong mb-1">{totalIdioms}</div>
              <div className="text-sm text-gray-600">总成语</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-zhuhong mb-1">{categoryCount}</div>
              <div className="text-sm text-gray-600">分类</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-zhuhong mb-1">{favoritesCount}</div>
              <div className="text-sm text-gray-600">收藏</div>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto mb-6">
          <input
            type="text"
            placeholder="搜索成语或含义..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-6 py-3 rounded-full border-2 border-zhuhong/20 focus:border-zhuhong outline-none transition-colors shadow-lg"
          />
        </div>
      </div>

      <CategoryFilter 
        categories={categories}
        selected={selectedCategory}
        onSelect={handleCategorySelect}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {pageIdioms.map((idiom, index) => (
          <IdiomCard
            key={idiom.idiom}
            idiom={idiom}
            onClick={() => setSelectedIdiom(idiom)}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>

      {filteredIdioms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">没有找到匹配的成语</p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
            disabled={currentPage === 1}
            className="px-4 py-2 border-2 border-zhuhong rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white text-zhuhong hover:bg-zhuhong hover:text-white"
          >
            上一页
          </button>
          {getPaginationButtons()}
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
            disabled={currentPage === totalPages}
            className="px-4 py-2 border-2 border-zhuhong rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white text-zhuhong hover:bg-zhuhong hover:text-white"
          >
            下一页
          </button>
          <span className="ml-4 px-4 py-2 bg-zhuhong/10 text-zhuhong rounded-lg">
            第{currentPage}/{totalPages}页，共{filteredIdioms.length}个成语
          </span>
        </div>
      )}

      {/* 快速操作按钮 */}
      <div className="flex flex-wrap justify-center gap-4 mt-12">
        <button 
          onClick={() => navigate('/learn')} 
          className="px-8 py-4 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <span className="text-xl">🚀</span>
          <span>开始学习</span>
        </button>
        <button 
          onClick={() => navigate('/quiz')} 
          className="px-8 py-4 bg-white text-zhuhong border-2 border-zhuhong rounded-full hover:bg-zhuhong/10 transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">📝</span>
          <span>参加测验</span>
        </button>
        <button 
          onClick={() => navigate('/fill')} 
          className="px-8 py-4 bg-white text-zhuhong border-2 border-zhuhong rounded-full hover:bg-zhuhong/10 transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">📝</span>
          <span>选择题练习</span>
        </button>
        <button 
          onClick={() => navigate('/favorites')} 
          className="px-8 py-4 bg-white text-zhuhong border-2 border-zhuhong rounded-full hover:bg-zhuhong/10 transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <span className="text-xl">❤️</span>
          <span>查看收藏</span>
        </button>
      </div>

      {selectedIdiom && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIdiom(null)}
        >
          <div 
            className="glass rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-4xl font-bold font-song text-zhuhong">
                  {selectedIdiom.idiom}
                </h3>
                <button 
                  onClick={() => setSelectedIdiom(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-zhuhong/10 text-zhuhong rounded-full text-sm mb-4">
                  {selectedIdiom.category}
                </span>
                <h4 className="text-xl font-semibold text-zhuise mb-2">释义</h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedIdiom.meaning}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-zhuise mb-3">例句</h4>
                <div className="space-y-3">
                  {selectedIdiom.examples.map((example: string, idx: number) => (
                    <p key={idx} className="text-gray-600 bg-white/50 p-3 rounded-lg leading-relaxed">
                      {example}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
