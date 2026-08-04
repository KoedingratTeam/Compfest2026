import type { SalesItem } from '../../types';
import './SalesAnalysisCard.css';

interface SalesAnalysisCardProps {
  items: SalesItem[];
  totalOmzet: number;
  totalModal: number;
  untungBersih: number;
  marginPersen: number;
}

export default function SalesAnalysisCard({
  items,
  totalOmzet,
  totalModal,
  untungBersih,
  marginPersen,
}: SalesAnalysisCardProps) {
  const sortedByMargin = [...items].sort((a, b) => {
    const marginA = a.hargaJual > 0 ? ((a.hargaJual - a.hargaModal) / a.hargaJual) * 100 : 0;
    const marginB = b.hargaJual > 0 ? ((b.hargaJual - b.hargaModal) / b.hargaJual) * 100 : 0;
    return marginB - marginA;
  });

  return (
    <div className="glass-card sales-card animate-fade-in-up stagger-1">
      <div className="section-title">
        Analisis Penjualan
      </div>

      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">Total Omzet</span>
          <span className="stat-value">Rp {totalOmzet.toLocaleString('id-ID')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Modal</span>
          <span className="stat-value stat-modal">Rp {totalModal.toLocaleString('id-ID')}</span>
        </div>
        <div className="stat-item stat-highlight">
          <span className="stat-label">Untung Bersih</span>
          <span className="stat-value">Rp {untungBersih.toLocaleString('id-ID')}</span>
          <span className={`badge ${marginPersen >= 20 ? 'badge-healthy' : marginPersen >= 10 ? 'badge-warning' : 'badge-danger'}`}>
            Margin {marginPersen.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="product-ranking">
        <p className="ranking-title">Ranking Produk (Margin Tertinggi)</p>
        <div className="ranking-list">
          {sortedByMargin.map((item, idx) => {
            const margin = item.hargaJual > 0 ? ((item.hargaJual - item.hargaModal) / item.hargaJual) * 100 : 0;
            const untung = (item.hargaJual - item.hargaModal) * item.jumlah;
            return (
              <div className="ranking-item" key={item.id}>
                <span className="rank-num">#{idx + 1}</span>
                <div className="rank-info">
                  <span className="rank-name">{item.nama}</span>
                  <span className="rank-detail">
                    {item.jumlah} pcs · Untung Rp {untung.toLocaleString('id-ID')}
                  </span>
                </div>
                <span className={`badge ${margin >= 30 ? 'badge-healthy' : margin >= 15 ? 'badge-warning' : 'badge-danger'}`}>
                  {margin.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
