import type { RecommendationItem } from '../../types';
import './RecommendationCard.css';

interface RecommendationCardProps {
  items: RecommendationItem[];
}

export default function RecommendationCard({ items }: RecommendationCardProps) {
  return (
    <div className="glass-card reco-card animate-fade-in-up stagger-3">
      <div className="section-title">
        Rekomendasi Bisnis
      </div>
      <ul className="reco-list">
        {items.map((item, idx) => (
          <li key={idx} className="reco-item" style={{ animationDelay: `${300 + idx * 100}ms` }}>
            <p className="reco-text">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
