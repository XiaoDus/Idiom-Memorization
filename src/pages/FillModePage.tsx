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
    generateQuestions();
  }, [state.idioms]);

  const generateQuestions = () => {
    const shuffled = shuffleArray([...state.idioms]).slice(0, 10);
    const quizQuestions = shuffled.map(idiom => {
      // 优先从同分类中选择干扰项
      const sameCategory = state.idioms.filter(i => i.category === idiom.category && i.idiom !== idiom.idiom);
      let wrongOptions = shuffleArray(sameCategory).slice(0, 3);
      
      // 如果同分类不足3个，从其他分类补充
      if (wrongOptions.length < 3) {
        const others = state.idioms.filter(i => i.category !== idiom.category && i.idiom !== idiom.idiom);
        const additionalWrong = shuffleArray(others).slice(0, 3 - wrongOptions.length);
        wrongOptions = [...wrongOptions, ...additionalWrong];
      }
      
      const options = shuffleArray([idiom, ...wrongOptions]);
      
      // 随机选择一个例句
      const exampleIdx = Math.floor(Math.random() * idiom.examples.length);
      
      return {
        idiom,
        options,
        correctIndex: options.findIndex((opt: any) => opt.idiom === idiom.idiom),
        example: idiom.examples[exampleIdx]
      };
    });
    
    setQuestions(quizQuestions);
  };

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
    generateQuestions();
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
    return (
      <div className="container mx-auto px-4 py-16 animate-fade-in">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold font-song text-zhuise mb-6">
            选择题练习完成！
          </h2>
          
          <div className="mb-8">
            <div className="text-6xl font-bold text-zhuhong mb-4">
              <span>{score}</span>/<span>{questions.length}</span>
            </div>
            <p className="text-gray-600">做得很棒！继续加油哦~</p>
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

        <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg">
          {/* 显示成语名称 */}
          <div className="text-center mb-6">
            <h3 className="text-4xl font-bold font-song text-zhuhong mb-4">
              {currentQuestion?.idiom?.idiom}
            </h3>
          </div>

          {/* 显示例句，其中包含成语名称 */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
            <p className="text-lg leading-relaxed text-gray-800">
              请选择"<span className="text-zhuhong font-bold">{currentQuestion?.idiom?.idiom}</span>"所属的分类：
              <br />
              <span className="text-zhuhong font-bold text-xl mt-2 inline-block">
                {currentQuestion?.idiom?.category}
              </span>
            </p>
          </div>

          {/* 显示释义 */}
          <div className="bg-gradient-to-r from-zhuhong/5 to-zhuhong/10 border-l-4 border-zhuhong rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-zhuhong mb-2">📖 释义</h4>
            <p className="text-gray-700 leading-relaxed">
              {currentQuestion?.idiom?.meaning}
            </p>
          </div>

          {/* 选项 */}
          <div className="space-y-4">
            {currentQuestion?.options.map((option: any, index: number) => {
              let optionClass = 'bg-white hover:bg-zhuhong/10 border-2 border-gray-200';
              
              if (showResult) {
                if (index === currentQuestion.correctIndex) {
                  optionClass = 'bg-green-100 border-2 border-green-500';
                } else if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
                  optionClass = 'bg-red-100 border-2 border-red-500';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all ${optionClass} ${
                    !showResult ? 'cursor-pointer hover:shadow-md' : 'cursor-default opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      showResult && index === currentQuestion.correctIndex 
                        ? 'bg-green-500 text-white' 
                        : showResult && index === selectedAnswer && index !== currentQuestion.correctIndex
                        ? 'bg-red-500 text-white'
                        : 'bg-zhuhong/10 text-zhuhong'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-lg">{option.idiom}</span>
                    {showResult && index === currentQuestion.correctIndex && (
                      <span className="text-green-600 font-bold">✓ 正确</span>
                    )}
                    {showResult && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                      <span className="text-red-600 font-bold">✗ 错误</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 结果和下一题按钮 */}
          {showResult && (
            <div className="mt-8 animate-fade-in">
              <div className={`mb-4 text-xl font-semibold text-center ${
                selectedAnswer === currentQuestion?.correctIndex ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedAnswer === currentQuestion?.correctIndex ? '回答正确！🎉' : '回答错误，继续加油！💪'}
              </div>
              
              <div className="p-6 bg-gradient-to-r from-zhuhong/5 to-zhuhong/10 border-l-4 border-zhuhong rounded-lg mb-6">
                <h4 className="text-lg font-semibold text-zhuhong mb-2">📖 释义</h4>
                <p className="text-gray-700 leading-relaxed">
                  {currentQuestion?.idiom?.meaning}
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="px-12 py-4 bg-zhuhong text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg text-lg"
                >
                  下一题
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
