export interface Idiom {
  category: string;
  idiom: string;
  meaning: string;
  examples: string[];
}

export interface LearningProgress {
  idiom: string;
  timesReviewed: number;
  correctCount: number;
  lastReviewed: string;
  mastered: boolean;
}

export interface QuizQuestion {
  idiom: Idiom;
  options: string[];
  correctIndex: number;
}

export interface QuizResult {
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}
