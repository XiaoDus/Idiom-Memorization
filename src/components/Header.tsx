import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
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
              to="/favorites" 
              className={`transition-colors ${
                isActive('/favorites') ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
              }`}
            >
              收藏
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${
                isActive('/about') ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
              }`}
            >
              关于
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
