import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Idiom, LearningProgress, QuizResult } from '../types';
import idiomsData from '../data/idioms.json';

interface AppState {
  idioms: Idiom[];
  favorites: string[];
  learningProgress: LearningProgress[];
  quizHistory: QuizResult[];
}

type Action =
  | { type: 'SET_IDIOMS'; payload: Idiom[] }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_LEARNING_PROGRESS'; payload: LearningProgress[] }
  | { type: 'UPDATE_PROGRESS'; payload: LearningProgress }
  | { type: 'SET_QUIZ_HISTORY'; payload: QuizResult[] }
  | { type: 'ADD_QUIZ_RESULT'; payload: QuizResult };

const initialState: AppState = {
  idioms: [],
  favorites: [],
  learningProgress: [],
  quizHistory: [],
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_IDIOMS':
      return { ...state, idioms: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(id => id !== action.payload) };
    case 'SET_LEARNING_PROGRESS':
      return { ...state, learningProgress: action.payload };
    case 'UPDATE_PROGRESS':
      const existingIndex = state.learningProgress.findIndex(p => p.idiom === action.payload.idiom);
      if (existingIndex >= 0) {
        const newProgress = [...state.learningProgress];
        newProgress[existingIndex] = action.payload;
        return { ...state, learningProgress: newProgress };
      }
      return { ...state, learningProgress: [...state.learningProgress, action.payload] };
    case 'SET_QUIZ_HISTORY':
      return { ...state, quizHistory: action.payload };
    case 'ADD_QUIZ_RESULT':
      return { ...state, quizHistory: [...state.quizHistory, action.payload] };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isLoading: boolean;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadIdioms = async () => {
      try {
        // 首先尝试从网络请求加载最新数据（防止缓存）
        const timestamp = new Date().getTime();
        const response = await fetch(`/idioms.json?t=${timestamp}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (response.ok) {
          let data = await response.json();
          // 容错处理：确保所有成语都有分类
          data = data.map((idiom: any) => {
            let category = idiom.category;
            // 特别处理“表征”这个成语
            if (idiom.idiom === '表征') {
              category = '代替、代指某物';
            }
            // 其他没有分类的成语
            else if (!idiom.category || idiom.category.trim() === '') {
              category = '其他';
            }
            return { ...idiom, category };
          });
          dispatch({ type: 'SET_IDIOMS', payload: data });
        } else {
          // 如果网络请求失败，使用本地导入的数据（确保有分类）
          const safeData = idiomsData.map((idiom: any) => {
            let category = idiom.category;
            if (idiom.idiom === '表征') {
              category = '代替、代指某物';
            } else if (!idiom.category || idiom.category.trim() === '') {
              category = '其他';
            }
            return { ...idiom, category };
          });
          dispatch({ type: 'SET_IDIOMS', payload: safeData });
        }
      } catch {
        // 出错时使用本地导入的数据作为备份（确保有分类）
        const safeData = idiomsData.map((idiom: any) => {
          let category = idiom.category;
          if (idiom.idiom === '表征') {
            category = '代替、代指某物';
          } else if (!idiom.category || idiom.category.trim() === '') {
            category = '其他';
          }
          return { ...idiom, category };
        });
        dispatch({ type: 'SET_IDIOMS', payload: safeData });
      } finally {
        setIsLoading(false);
      }
    };

    loadIdioms();

    const savedFavorites = localStorage.getItem('idiom-favorites');
    const savedProgress = localStorage.getItem('idiom-progress');
    const savedQuizHistory = localStorage.getItem('idiom-quiz-history');

    if (savedFavorites) {
      dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(savedFavorites) });
    }
    if (savedProgress) {
      dispatch({ type: 'SET_LEARNING_PROGRESS', payload: JSON.parse(savedProgress) });
    }
    if (savedQuizHistory) {
      dispatch({ type: 'SET_QUIZ_HISTORY', payload: JSON.parse(savedQuizHistory) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('idiom-favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem('idiom-progress', JSON.stringify(state.learningProgress));
  }, [state.learningProgress]);

  useEffect(() => {
    localStorage.setItem('idiom-quiz-history', JSON.stringify(state.quizHistory));
  }, [state.quizHistory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-spin">📚</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
