import type { InputMode } from '../../types';
import './TabSwitcher.css';

interface TabSwitcherProps {
  activeTab: InputMode;
  onTabChange: (tab: InputMode) => void;
}

export default function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  const getIndicatorTransform = () => {
    if (activeTab === 'chat') return 'translateX(0%)';
    if (activeTab === 'form') return 'translateX(100%)';
    return 'translateX(200%)';
  };

  return (
    <div className="tab-switcher">
      <button
        className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
        onClick={() => onTabChange('chat')}
        type="button"
      >
        Chat
      </button>
      <button
        className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
        onClick={() => onTabChange('form')}
        type="button"
      >
        Form
      </button>
      <button
        className={`tab-btn ${activeTab === 'ocr' ? 'active' : ''}`}
        onClick={() => onTabChange('ocr')}
        type="button"
      >
        Scan Nota
      </button>
      <div
        className="tab-indicator three-tabs"
        style={{ transform: getIndicatorTransform() }}
      />
    </div>
  );
}
