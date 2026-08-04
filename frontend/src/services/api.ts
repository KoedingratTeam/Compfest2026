import type { SalesItem, AnalysisResult, RecommendationItem } from '../types';
import { MOCK_SALES_ITEMS } from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Standardized API Client Layer for DagangAI Frontend
 */

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function analyzeSalesData(items: SalesItem[]): Promise<AnalysisResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data: AnalysisResult = await res.json();
    return data;
  } catch (error) {
    console.warn('Backend API unavailable. Falling back to local calculation.', error);
    return calculateLocalAnalysis(items);
  }
}

export async function parseChatInput(text: string): Promise<SalesItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/parse-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.items || MOCK_SALES_ITEMS;
  } catch (error) {
    console.warn('Backend API unavailable for parse-chat. Falling back to mock.', error);
    return MOCK_SALES_ITEMS;
  }
}

export async function scanReceiptImage(file: File): Promise<SalesItem[]> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/ocr-scan`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`OCR API error: ${res.status}`);
    }

    const data = await res.json();
    return data.items || MOCK_SALES_ITEMS;
  } catch (error) {
    console.warn('Backend API unavailable for OCR scan. Falling back to mock items.', error);
    return MOCK_SALES_ITEMS;
  }
}

export async function sendChatConsultMessage(
  message: string,
  contextItems: SalesItem[]
): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat-consult`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, contextItems }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.warn('Backend API unavailable for chat consult. Falling back to default reply.', error);
    return 'Berdasarkan data penjualan Anda, mengoptimalkan persediaan produk bermargin tinggi adalah langkah paling efisien untuk meningkatkan pendapatan warung!';
  }
}

/**
 * Local fallback calculation engine if Backend API is unreachable
 */
function calculateLocalAnalysis(items: SalesItem[]): AnalysisResult {
  const validItems = items.length > 0 ? items : MOCK_SALES_ITEMS;
  const totalOmzet = validItems.reduce((sum, i) => sum + i.jumlah * i.hargaJual, 0);
  const totalModal = validItems.reduce((sum, i) => sum + i.jumlah * i.hargaModal, 0);
  const untungBersih = totalOmzet - totalModal;
  const marginPersen = totalOmzet > 0 ? (untungBersih / totalOmzet) * 100 : 0;

  let cashFlowStatus: AnalysisResult['cashFlowStatus'];
  if (marginPersen >= 20) cashFlowStatus = 'SEHAT';
  else if (marginPersen >= 10) cashFlowStatus = 'PERLU_PERHATIAN';
  else cashFlowStatus = 'PERINGATAN';

  const rekomendasi: RecommendationItem[] = [
    { icon: '📈', text: 'Produk bermargin tinggi memberikan kontribusi profit terbaik per transaksi. Tingkatkan stok produk ini.' },
    { icon: '💡', text: 'Evaluasi produk dengan margin di bawah 10% untuk menegosiasikan harga beli dengan supplier.' },
    { icon: '🎯', text: `Margin usaha rata-rata ${marginPersen.toFixed(1)}%. Jaga kestabilan arus kas dan perputaran barang.` },
  ];

  const ringkasanKeuangan = `LAPORAN PENJUALAN HARIAN — DAGANGAI
════════════════════════════════
Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

${validItems.map((i, idx) => `${idx + 1}. ${i.nama}
   ${i.jumlah} x Rp ${i.hargaJual.toLocaleString('id-ID')} = Rp ${(i.jumlah * i.hargaJual).toLocaleString('id-ID')}
   Modal: ${i.jumlah} x Rp ${i.hargaModal.toLocaleString('id-ID')} = Rp ${(i.jumlah * i.hargaModal).toLocaleString('id-ID')}
   Untung: Rp ${((i.hargaJual - i.hargaModal) * i.jumlah).toLocaleString('id-ID')}`).join('\n\n')}

════════════════════════════════
TOTAL OMZET   : Rp ${totalOmzet.toLocaleString('id-ID')}
TOTAL MODAL   : Rp ${totalModal.toLocaleString('id-ID')}
UNTUNG BERSIH : Rp ${untungBersih.toLocaleString('id-ID')}
MARGIN        : ${marginPersen.toFixed(1)}%
════════════════════════════════`;

  return {
    items: validItems,
    totalOmzet,
    totalModal,
    untungBersih,
    marginPersen,
    cashFlowStatus,
    rekomendasi,
    ringkasanKeuangan,
  };
}
