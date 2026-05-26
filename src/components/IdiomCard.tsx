import { useApp } from '../context/AppContext';
import { Idiom } from '../types';

interface IdiomCardProps {
  idiom: Idiom;
  onClick: () => void;
  style?: React.CSSProperties;
}

export default function IdiomCard({ idiom, onClick, style }: IdiomCardProps) {
  const { state, dispatch } = useApp();
  const isFavorite = state.favorites.includes(idiom.idiom);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: idiom.idiom });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: idiom.idiom });
    }
  };

  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 animate-fade-in group"
      onClick={onClick}
      style={style}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-2xl font-bold font-song text-zhuhong group-hover:text-red-700 transition-colors">
          {idiom.idiom}
        </h3>
        <button
          onClick={toggleFavorite}
          className={`text-2xl transition-transform ${
            isFavorite ? 'text-red-500 scale-110' : 'text-gray-300 hover:text-red-400'
          }`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {idiom.meaning}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs px-3 py-1 bg-zhuhong/10 text-zhuhong rounded-full">
          {idiom.category}
        </span>
        <span className="text-xs text-gray-400 group-hover:text-zhuhong transition-colors">
          点击查看详情 →
        </span>
      </div>
    </div>
  );
}
