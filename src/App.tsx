import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LearningPage from './pages/LearningPage';
import QuizPage from './pages/QuizPage';
import FillModePage from './pages/FillModePage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearningPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/fill" element={<FillModePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
