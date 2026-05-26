import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const { state } = useApp();
  
  const totalLearned = state.learningProgress.filter(p => p.timesReviewed > 0).length;
  const totalMastered = state.learningProgress.filter(p => p.mastered).length;
  const totalQuizzes = state.quizHistory.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(state.quizHistory.reduce((sum, q) => sum + q.score, 0) / totalQuizzes)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-4xl font-bold font-song text-zhuise mb-4">
            关于成语记忆大师
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            一个帮助你高效学习和记忆中文成语的学习平台
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-zhuise mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> 学习功能
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>闪卡学习</strong> - 通过翻转式闪卡加深记忆</li>
              <li>• <strong>智能测验</strong> - 测试你对成语的理解程度</li>
              <li>• <strong>分类浏览</strong> - 按类别系统学习成语</li>
              <li>• <strong>收藏功能</strong> - 收藏重要或喜欢的成语</li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-bold text-zhuise mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> 特色亮点
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>新中式设计</strong> - 融合传统文化与现代美学</li>
              <li>• <strong>真实语境</strong> - 提供真实使用例句</li>
              <li>• <strong>进度追踪</strong> - 可视化学习进度</li>
              <li>• <strong>本地存储</strong> - 数据保存在本地，保护隐私</li>
            </ul>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-zhuise mb-6 text-center">
            我的学习统计
          </h3>
          
          {totalLearned > 0 || totalQuizzes > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-zhuhong mb-2">
                  {state.idioms.length}
                </div>
                <div className="text-gray-600">总成语数</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {totalLearned}
                </div>
                <div className="text-gray-600">已学习</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {totalMastered}
                </div>
                <div className="text-gray-600">已掌握</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {averageScore}%
                </div>
                <div className="text-gray-600">平均得分</div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p className="mb-4">还没有开始学习哦！</p>
              <Link
                to="/learn"
                className="inline-block px-6 py-3 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-colors"
              >
                开始学习
              </Link>
            </div>
          )}
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-zhuise mb-6">
            快速开始
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/learn"
              className="px-8 py-4 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span>🚀</span>
              <span>开始学习</span>
            </Link>
            <Link
              to="/quiz"
              className="px-8 py-4 bg-white text-zhuhong border-2 border-zhuhong rounded-full hover:bg-zhuhong/10 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span>📝</span>
              <span>参加测验</span>
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <span>📖</span>
              <span>浏览成语</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
