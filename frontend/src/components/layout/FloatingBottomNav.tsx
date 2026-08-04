import { useLocation, useNavigate } from 'react-router-dom';
import './FloatingBottomNav.css';

export default function FloatingBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isResult = location.pathname === '/result';

  return (
    <nav className="floating-bottom-nav">
      <div className="nav-container">
        <button
          className={`nav-item ${isHome ? 'active' : ''}`}
          onClick={() => navigate('/')}
          type="button"
        >
          <span className="nav-text">Input</span>
        </button>

        <button
          className={`nav-item ${isResult ? 'active' : ''}`}
          onClick={() => navigate('/result')}
          type="button"
        >
          <span className="nav-text">Hasil</span>
        </button>
      </div>
    </nav>
  );
}
