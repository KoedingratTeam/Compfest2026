import './FinancialSummaryCard.css';

interface FinancialSummaryCardProps {
  ringkasan: string;
}

export default function FinancialSummaryCard({ ringkasan }: FinancialSummaryCardProps) {
  return (
    <div className="glass-card summary-card animate-fade-in-up stagger-4">
      <div className="section-title">
        Ringkasan Keuangan
      </div>
      <pre className="summary-preview">{ringkasan}</pre>
      <div className="summary-actions">
        <button className="btn-secondary" disabled title="Tersedia di versi lengkap">
          Download PDF
        </button>
        <button className="btn-secondary" disabled title="Tersedia di versi lengkap">
          Screenshot
        </button>
      </div>
    </div>
  );
}
