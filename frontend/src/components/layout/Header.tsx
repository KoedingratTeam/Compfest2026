import './Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a href="/" className="logo-link">
          <span className="logo-text">DagangAI</span>
        </a>
        <span className="header-badge">COMPFEST 18</span>
      </div>
    </header>
  );
}
