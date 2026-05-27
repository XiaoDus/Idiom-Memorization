import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useApp();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/learn', label: '学习' },
    { path: '/quiz', label: '测验' },
    { path: '/fill', label: '选择题' },
    { path: '/favorites', label: '收藏' },
  ];

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
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`transition-colors ${
                  isActive(item.path) ? 'text-zhuhong font-semibold' : 'text-zhuise hover:text-zhuhong'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button 
            className="md:hidden text-zhuise hover:text-zhuhong text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <div className="flex flex-col space-y-3">
              {navItems.map(item => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? 'bg-zhuhong/10 text-zhuhong font-semibold' 
                      : 'text-zhuise hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
