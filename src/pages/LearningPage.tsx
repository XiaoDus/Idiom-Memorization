import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FlashCard from '../components/FlashCard';
import { shuffleArray } from '../utils/helpers';
import { Idiom } from '../types';

export default function LearningPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnQueue, setLearnQueue] = useState<Idiom[]>([]);
  const [sessionStats, setSessionStats] = useState({ known: 0, unknown: 0 });
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    const shuffled = shuffleArray([...state.idioms]);
    setLearnQueue(shuffled);
  }, [state.idioms]);

  const currentIdiom = learnQueue[currentIndex];

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleResponse = (known: boolean) => {
    if (!currentIdiom) return;

    const existingProgress = state.learningProgress.find(p => p.idiom === currentIdiom.idiom);
    const newProgress = {
      idiom: currentIdiom.idiom,
      timesReviewed: (existingProgress?.timesReviewed || 0) + 1,
      correctCount: (existingProgress?.correctCount || 0) + (known ? 1 : 0),
      lastReviewed: new Date().toISOString(),
      mastered: known && (existingProgress?.correctCount || 0) >= 2,
    };

    dispatch({ type: 'UPDATE_PROGRESS', payload: newProgress });

    setSessionStats(prev => ({
      known: prev.known + (known ? 1 : 0),
      unknown: prev.unknown + (known ? 0 : 1),
    }));

    if (!known) {
      setLearnQueue(prev => [...prev, currentIdiom]);
    }

    if (currentIndex < learnQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleRestart = () => {
    const shuffled = shuffleArray([...state.idioms]);
    setLearnQueue(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ known: 0, unknown: 0 });
    setSessionComplete(false);
  };

  if (learnQueue.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">正在加载成语数据...</p>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="max-w-2xl mx-auto glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold font-song text-zhuise mb-6">
            学习完成！
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white/50 rounded-xl p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {sessionStats.known}
              </div>
              <div className="text-gray-600">已掌握</div>
            </div>
            <div className="bg-white/50 rounded-xl p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {sessionStats.unknown}
              </div>
              <div className="text-gray-600">需加强</div>
            </div>
          </div>

          <div className="text-lg text-gray-700 mb-8">
            正确率：{Math.round((sessionStats.known / (sessionStats.known + sessionStats.unknown)) * 100)}%
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              再学一轮
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-white text-zhuhong border-2 border-zhuhong rounded-full hover:bg-zhuhong/10 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-song text-zhuise mb-2">
            闪卡学习模式
          </h2>
          <p className="text-gray-600">
            学习进度：{currentIndex + 1} / {learnQueue.length}
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-zhuhong h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / learnQueue.length) * 100}%` }}
            />
          </div>
        </div>

        <FlashCard
          idiom={currentIdiom}
          isFlipped={isFlipped}
          onFlip={handleFlip}
        />

        <div className="flex justify-center gap-4 mt-8">
          {isFlipped ? (
            <>
              <button
                onClick={() => handleResponse(true)}
                className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span className="text-xl">✓</span>
                <span>认识</span>
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span className="text-xl">✗</span>
                <span>不认识</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleFlip}
              className="px-12 py-4 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              显示释义
            </button>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>提示：点击"显示释义"后，根据你的记忆情况选择"认识"或"不认识"</p>
        </div>
      </div>
    </div>
  );
}
