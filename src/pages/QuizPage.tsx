import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { shuffleArray, generateQuizOptions } from '../utils/helpers';
import { Idiom, QuizQuestion } from '../types';

export default function QuizPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const questions = state.idioms.slice(0, 10).map(idiom => {
      const { options, correctIndex } = generateQuizOptions(idiom, state.idioms, 3);
      return {
        idiom,
        options,
        correctIndex,
      };
    });
    setQuizQuestions(shuffleArray(questions));
  }, [state.idioms]);

  const currentQuestion = quizQuestions[currentIndex];

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const result = {
        date: new Date().toISOString(),
        totalQuestions: quizQuestions.length,
        correctAnswers: score + (selectedAnswer === currentQuestion.correctIndex ? 0 : 0),
        score: ((score + (selectedAnswer === currentQuestion.correctIndex ? 1 : 0)) / quizQuestions.length) * 100,
      };
      dispatch({ type: 'ADD_QUIZ_RESULT', payload: result });
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    const questions = state.idioms.slice(0, 10).map(idiom => {
      const { options, correctIndex } = generateQuizOptions(idiom, state.idioms, 3);
      return {
        idiom,
        options,
        correctIndex,
      };
    });
    setQuizQuestions(shuffleArray(questions));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setScore(0);
  };

  if (quizQuestions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 text-lg">正在生成测验题目...</p>
      </div>
    );
  }

  if (quizComplete) {
    const finalScore = quizQuestions.length > 0 ? Math.round((score / quizQuestions.length) * 100) : 0;
    
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="max-w-2xl mx-auto glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">
            {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '👍' : '💪'}
          </div>
          <h2 className="text-3xl font-bold font-song text-zhuise mb-6">
            测验完成！
          </h2>
          
          <div className="mb-8">
            <div className="text-6xl font-bold text-zhuhong mb-4">
              {finalScore}%
            </div>
            <div className="text-gray-600">
              正确率（{score}/{quizQuestions.length}题）
            </div>
          </div>

          <div className="bg-white/50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold mb-4">评价：</h3>
            <p className="text-gray-700">
              {finalScore >= 90 ? '太棒了！你对成语掌握得非常扎实！' :
               finalScore >= 70 ? '很不错！继续保持这个学习势头！' :
               finalScore >= 50 ? '还可以，建议多复习一下易错的成语。' :
               '加油！多使用闪卡学习模式加强记忆吧！'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              再测一次
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
            成语测验
          </h2>
          <p className="text-gray-600">
            第 {currentIndex + 1} 题 / 共 {quizQuestions.length} 题
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-zhuhong h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-8 mb-6">
          <h3 className="text-2xl font-semibold text-center mb-8">
            成语"<span className="text-zhuhong font-bold">{currentQuestion?.idiom.idiom}</span>"是什么意思？
          </h3>

          <div className="space-y-4">
            {currentQuestion?.options.map((option, index) => {
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
                  <span className="font-semibold mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                  {showResult && index === currentQuestion.correctIndex && (
                    <span className="float-right text-green-600">✓ 正确</span>
                  )}
                  {showResult && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                    <span className="float-right text-red-600">✗ 错误</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div className="text-center animate-fade-in">
            <div className="mb-4 text-lg">
              {selectedAnswer === currentQuestion.correctIndex ? (
                <span className="text-green-600 font-semibold">回答正确！🎉</span>
              ) : (
                <span className="text-red-600 font-semibold">回答错误，继续加油！💪</span>
              )}
            </div>
            <button
              onClick={handleNext}
              className="px-12 py-4 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              {currentIndex < quizQuestions.length - 1 ? '下一题' : '查看结果'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
