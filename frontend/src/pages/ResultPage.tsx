import { useNavigate } from 'react-router-dom';
import { getLatestAnalysis } from '../hooks/useAnalysis';
import SalesAnalysisCard from '../components/result/SalesAnalysisCard';
import CashFlowCard from '../components/result/CashFlowCard';
import RecommendationCard from '../components/result/RecommendationCard';
import FinancialSummaryCard from '../components/result/FinancialSummaryCard';
import ChatConsultant from '../components/result/ChatConsultant';

export default function ResultPage() {
  const navigate = useNavigate();
  const data = getLatestAnalysis();

  return (
    <div className="page-content result-page">
      <div className="result-header animate-fade-in-up">
        <button className="btn-secondary" onClick={() => navigate('/')} type="button">
          ← Kembali
        </button>
        <h1 className="page-title">
          Hasil Analisis
        </h1>
      </div>

      <div className="result-grid">
        <SalesAnalysisCard
          items={data.items}
          totalOmzet={data.totalOmzet}
          totalModal={data.totalModal}
          untungBersih={data.untungBersih}
          marginPersen={data.marginPersen}
        />

        <CashFlowCard
          status={data.cashFlowStatus}
          marginPersen={data.marginPersen}
          totalOmzet={data.totalOmzet}
          totalModal={data.totalModal}
        />

        <div className="full-width">
          <RecommendationCard items={data.rekomendasi} />
        </div>

        <div className="full-width">
          <FinancialSummaryCard ringkasan={data.ringkasanKeuangan} />
        </div>

        <div className="full-width">
          <ChatConsultant contextItems={data.items} />
        </div>
      </div>
    </div>
  );
}
