import type { CashFlowStatus } from '../../types';
import './CashFlowCard.css';

interface CashFlowCardProps {
  status: CashFlowStatus;
  marginPersen: number;
  totalOmzet: number;
  totalModal: number;
}

const STATUS_CONFIG = {
  SEHAT: { label: 'SEHAT', className: 'status-healthy', message: 'Keuangan warung dalam kondisi baik. Margin di atas 20% menunjukkan harga jual sudah optimal.' },
  PERLU_PERHATIAN: { label: 'PERLU PERHATIAN', className: 'status-warning', message: 'Margin antara 10-20%. Pertimbangkan untuk mengevaluasi harga jual atau cari supplier yang lebih murah.' },
  PERINGATAN: { label: 'PERINGATAN', className: 'status-danger', message: 'Margin di bawah 10%. Segera evaluasi harga jual dan biaya operasional agar tidak merugi.' },
};

export default function CashFlowCard({ status, marginPersen, totalOmzet, totalModal }: CashFlowCardProps) {
  const config = STATUS_CONFIG[status];
  const rasioModal = totalOmzet > 0 ? (totalModal / totalOmzet) * 100 : 0;

  return (
    <div className="glass-card cashflow-card animate-fade-in-up stagger-2">
      <div className="section-title">
        Arus Kas
      </div>

      <div className={`status-badge-lg ${config.className}`}>
        <span className="status-dot" />
        <span className="status-label">{config.label} — Margin {marginPersen.toFixed(1)}%</span>
      </div>

      <div className="meter-section">
        <div className="meter-labels">
          <span>Modal ({rasioModal.toFixed(0)}%)</span>
          <span>Untung ({marginPersen.toFixed(1)}%)</span>
        </div>
        <div className="meter-bar">
          <div className="meter-fill" style={{ width: `${Math.min(100, Math.max(0, marginPersen))}%` }} />
        </div>
      </div>

      <p className="cashflow-message">{config.message}</p>
    </div>
  );
}
