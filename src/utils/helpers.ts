export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateQuizOptions(correctIdiom: any, allIdioms: any[], count: number = 3): { options: string[]; correctIndex: number } {
  const otherIdioms = allIdioms.filter(i => i.idiom !== correctIdiom.idiom);
  const shuffled = shuffleArray(otherIdioms);
  const wrongOptions = shuffled.slice(0, count).map(i => i.meaning);
  
  const options = [...wrongOptions, correctIdiom.meaning];
  const correctIndex = options.length - 1;
  
  const shuffledWithCorrect = shuffleArray(options.map((opt, idx) => ({ opt, idx })));
  const newCorrectIndex = shuffledWithCorrect.findIndex(item => item.idx === correctIndex);
  
  return {
    options: shuffledWithCorrect.map(item => item.opt),
    correctIndex: newCorrectIndex,
  };
}

export function getCategoryStats(idioms: any[], favorites: string[], progress: any[]) {
  const categories = [...new Set(idioms.map(i => i.category))];
  
  return categories.map(category => {
    const categoryIdioms = idioms.filter(i => i.category === category);
    const learnedCount = categoryIdioms.filter(i => 
      progress.some(p => p.idiom === i.idiom && p.timesReviewed > 0)
    ).length;
    const masteredCount = categoryIdioms.filter(i => 
      progress.some(p => p.idiom === i.idiom && p.mastered)
    ).length;
    
    return {
      category,
      total: categoryIdioms.length,
      learned: learnedCount,
      mastered: masteredCount,
    };
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
