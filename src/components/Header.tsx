import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const location = useLocation();
  const { state } = useApp();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold font-song text-zhuhong">
              成语记忆大师
            </h1>
            <span className="text-sm text-gray-500">({state.idioms.length}个成语)</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${
                isActive('/') ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
              }`}
            >
              首页
            </Link>
            <Link 
              to="/learn" 
              className={`transition-colors ${
                isActive('/learn') ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
              }`}
            >
              学习
            </Link>
            <Link 
              to="/quiz" 
              className={`transition-colors ${
                isActive('/quiz') ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
              }`}
            >
              测验
            </Link>
            <Link 
              to="/fill" 
              className={`transition-colors ${
                isActive('/fill') ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
              }`}
            >
              选择题
            </Link>
            <Link 
              to="/favorites" 
              className={`transition-colors ${
                isActive('/favorites') ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
              }`}
            >
              收藏
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
