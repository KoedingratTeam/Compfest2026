import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingBottomNav from './components/layout/FloatingBottomNav';
import InputPage from './pages/InputPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter>
      <div className="page-shell">
        <Header />
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
        <Footer />
        <FloatingBottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
