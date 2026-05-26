import { useState } from 'react';
import { useApp } from '../context/AppContext';
import IdiomCard from '../components/IdiomCard';
import CategoryFilter from '../components/CategoryFilter';

export default function HomePage() {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedIdiom, setSelectedIdiom] = useState<any>(null);

  const categories = ['全部', ...new Set(state.idioms.map(i => i.category))];

  const filteredIdioms = state.idioms.filter(idiom => {
    const matchesSearch = idiom.idiom.includes(searchTerm) || 
                        idiom.meaning.includes(searchTerm);
    const matchesCategory = selectedCategory === '全部' || idiom.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="搜索成语或含义..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-full border-2 border-zhuhong/20 focus:border-zhuhong outline-none transition-colors shadow-lg"
          />
        </div>
      </div>

      <CategoryFilter 
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredIdioms.map((idiom, index) => (
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
