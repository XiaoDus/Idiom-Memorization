import { useApp } from '../context/AppContext';
import IdiomCard from '../components/IdiomCard';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { state, dispatch } = useApp();
  
  const favoriteIdioms = state.idioms.filter(idiom => 
    state.favorites.includes(idiom.idiom)
  );

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有收藏吗？')) {
      state.favorites.forEach(idiom => {
        dispatch({ type: 'REMOVE_FAVORITE', payload: idiom });
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold font-song text-zhuise mb-2">
            我的收藏
          </h2>
          <p className="text-gray-600">
            共收藏 {favoriteIdioms.length} 个成语
          </p>
        </div>

        {favoriteIdioms.length > 0 ? (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={handleClearAll}
                className="px-6 py-2 text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-200"
              >
                清空收藏
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteIdioms.map((idiom, index) => (
                <IdiomCard
                  key={idiom.idiom}
                  idiom={idiom}
                  onClick={() => {}}
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              还没有收藏任何成语
            </h3>
            <p className="text-gray-500 mb-8">
              快去首页浏览并收藏你喜欢的成语吧！
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              去首页看看
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
