import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { shuffleArray } from '../utils/helpers';

export default function FillModePage() {
  const { state } = useApp();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // 随机选择10个成语作为题目
    const shuffled = shuffleArray([...state.idioms]).slice(0, 10);
    const quizQuestions = shuffled.map(idiom => {
      // 为每个题目生成干扰项（3个其他成语的释义）
      const otherIdioms = state.idioms.filter(i => i.idiom !== idiom.idiom);
      const shuffledOthers = shuffleArray(otherIdioms).slice(0, 3);
      const options = [idiom, ...shuffledOthers];
      
      return {
        idiom,
        options: shuffleArray(options),
        correctIndex: shuffleArray(options).findIndex(opt => opt.idiom === idiom.idiom)
      };
    });
    
    // 重新计算正确选项索引
    const questionsWithCorrectIndex = quizQuestions.map(q => ({
      ...q,
      options: shuffleArray([q.idiom, ...shuffleArray(q.options.filter(opt => opt.idiom !== q.idiom.idiom)).slice(0, 3)]),
    })).map(q => ({
      ...q,
      correctIndex: q.options.findIndex(opt => opt.idiom === q.idiom.idiom)
    }));
    
    setQuestions(questionsWithCorrectIndex);
  }, [state.idioms]);

  const currentQuestion = questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / (questions.length || 1)) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestion?.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    // 重新开始
    const shuffled = shuffleArray([...state.idioms]).slice(0, 10);
    const quizQuestions = shuffled.map(idiom => {
      const otherIdioms = state.idioms.filter(i => i.idiom !== idiom.idiom);
      const shuffledOthers = shuffleArray(otherIdioms).slice(0, 3);
      return {
        idiom,
        options: shuffleArray([idiom, ...shuffledOthers]),
        correctIndex: 0 // 稍后重新计算
      };
    }).map(q => ({
      ...q,
      correctIndex: q.options.findIndex(opt => opt.idiom === q.idiom.idiom)
    }));
    
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">正在生成题目...</p>
      </div>
    );
  }

  if (completed) {
    const finalScore = Math.round((score / questions.length) * 100);
    let emoji = '💪';
    let message = '继续努力，多练习几次就能掌握更多成语！';
    
    if (finalScore >= 90) {
      emoji = '🏆';
      message = '太棒了！你对成语的掌握非常出色！';
    } else if (finalScore >= 70) {
      emoji = '👍';
      message = '很不错！继续保持这个学习势头！';
    }
    
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="max-w-2xl mx-auto glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">{emoji}</div>
          <h2 className="text-3xl font-bold font-song text-zhuise mb-6">
            选择题练习完成！
          </h2>
          
          <div className="mb-8">
            <div className="text-6xl font-bold text-zhuhong mb-4">
              {score}/{questions.length}
            </div>
            <p className="text-gray-600">{message}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              再来一次
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
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-song text-zhuise mb-2">
            成语选择题
          </h2>
          <p className="text-gray-600">
            第 {currentIndex + 1} 题 / 共 {questions.length} 题
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-zhuhong h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <h3 className="text-4xl font-bold font-song text-zhuhong mb-4">
              {currentQuestion?.idiom?.idiom}
            </h3>
          </div>

          <div className="space-y-4">
            {currentQuestion?.options.map((option: any, index: number) => {
              let optionClass = 'bg-white hover:bg-zhuhong/10 border-2 border-gray-200';
              
              if (showResult) {
                if (index === currentQuestion.correctIndex) {
                  optionClass = 'bg-green-100 border-2 border-green-500 text-green-800';
                } else if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
                  optionClass = 'bg-red-100 border-2 border-red-500 text-red-800';
                }
              } else if (selectedAnswer === index) {
                optionClass = 'bg-zhuhong/10 border-2 border-zhuhong';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all ${optionClass} ${
                    !showResult ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-semibold w-8 h-8 rounded-full bg-zhuhong/10 text-zhuhong flex items-center justify-center flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1">{option.meaning}</span>
                    {showResult && index === currentQuestion.correctIndex && (
                      <span className="text-green-600 text-xl">✓</span>
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                      <span className="text-red-600 text-xl">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-8 p-6 bg-gradient-to-r from-zhuhong/5 to-zhuhong/10 border-l-4 border-zhuhong rounded-lg animate-fade-in">
              <h4 className="text-lg font-semibold text-zhuhong mb-2">📖 释义</h4>
              <p className="text-gray-700 leading-relaxed">
                {currentQuestion?.idiom?.meaning}
              </p>
              <div className="mt-4 text-center">
                <p className={`mb-4 text-lg font-semibold ${
                  selectedAnswer === currentQuestion?.correctIndex ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedAnswer === currentQuestion?.correctIndex ? '回答正确！🎉' : '回答错误，继续加油！💪'}
                </p>
                <button
                  onClick={handleNext}
                  className="px-12 py-4 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg text-lg"
                >
                  {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-white text-zhuhong border-2 border-zhuhong rounded-full hover:bg-zhuhong/10 transition-colors"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
