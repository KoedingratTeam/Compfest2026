export interface SalesItem {
  id: string;
  nama: string;
  jumlah: number;
  hargaJual: number;
  hargaModal: number;
}

export interface AnalysisResult {
  items: SalesItem[];
  totalOmzet: number;
  totalModal: number;
  untungBersih: number;
  marginPersen: number;
  cashFlowStatus: CashFlowStatus;
  rekomendasi: RecommendationItem[];
  ringkasanKeuangan: string;
}

export type CashFlowStatus = 'SEHAT' | 'PERLU_PERHATIAN' | 'PERINGATAN';

export interface RecommendationItem {
  icon: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type InputMode = 'chat' | 'form' | 'ocr';
