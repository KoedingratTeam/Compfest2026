import type { SalesItem, AnalysisResult, ChatMessage, RecommendationItem } from '../types';

export const MOCK_SALES_ITEMS: SalesItem[] = [
  { id: '1', nama: 'Mie Instan Dus', jumlah: 24, hargaJual: 3500, hargaModal: 2800 },
  { id: '2', nama: 'Kangkung Segar', jumlah: 15, hargaJual: 3000, hargaModal: 1500 },
  { id: '3', nama: 'Sabun Mandi Batang', jumlah: 36, hargaJual: 4000, hargaModal: 3200 },
  { id: '4', nama: 'Rokok Filter', jumlah: 20, hargaJual: 28000, hargaModal: 25500 },
];

export const MOCK_REKOMENDASI: RecommendationItem[] = [
  { icon: '📈', text: 'Kangkung Segar punya margin tertinggi (50%). Pertimbangkan untuk menambah stok sayuran segar lainnya.' },
  { icon: '💡', text: 'Rokok Filter dominasi omzet (64%) tapi margin tipis (8.9%). Cari supplier dengan harga lebih rendah.' },
  { icon: '⚠️', text: 'Sabun Mandi Batang marginnya rendah (20%). Evaluasi apakah perlu naikkan harga jual Rp 500.' },
  { icon: '🎯', text: 'Total margin keseluruhan 17.9% — di atas rata-rata warung (15%). Pertahankan komposisi produk ini.' },
];

export const MOCK_CHAT_EXAMPLE_INPUT = `Hari ini jualan:
- Mie instan 24 dus, jual 3500 modal 2800
- Kangkung 15 ikat, jual 3000 modal 1500
- Sabun mandi 36 batang, jual 4000 modal 3200
- Rokok 20 bungkus, jual 28000 modal 25500`;

function calculateAnalysis(items: SalesItem[]): AnalysisResult {
  const totalOmzet = items.reduce((sum, i) => sum + i.jumlah * i.hargaJual, 0);
  const totalModal = items.reduce((sum, i) => sum + i.jumlah * i.hargaModal, 0);
  const untungBersih = totalOmzet - totalModal;
  const marginPersen = totalOmzet > 0 ? (untungBersih / totalOmzet) * 100 : 0;

  let cashFlowStatus: AnalysisResult['cashFlowStatus'];
  if (marginPersen >= 20) cashFlowStatus = 'SEHAT';
  else if (marginPersen >= 10) cashFlowStatus = 'PERLU_PERHATIAN';
  else cashFlowStatus = 'PERINGATAN';

  const ringkasanKeuangan = `LAPORAN PENJUALAN HARIAN
════════════════════════════════
Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

${items.map((i, idx) => `${idx + 1}. ${i.nama}
   ${i.jumlah} x Rp ${i.hargaJual.toLocaleString('id-ID')} = Rp ${(i.jumlah * i.hargaJual).toLocaleString('id-ID')}
   Modal: ${i.jumlah} x Rp ${i.hargaModal.toLocaleString('id-ID')} = Rp ${(i.jumlah * i.hargaModal).toLocaleString('id-ID')}
   Untung: Rp ${((i.hargaJual - i.hargaModal) * i.jumlah).toLocaleString('id-ID')} (${(((i.hargaJual - i.hargaModal) / i.hargaJual) * 100).toFixed(1)}%)`).join('\n\n')}

════════════════════════════════
TOTAL OMZET   : Rp ${totalOmzet.toLocaleString('id-ID')}
TOTAL MODAL   : Rp ${totalModal.toLocaleString('id-ID')}
UNTUNG BERSIH : Rp ${untungBersih.toLocaleString('id-ID')}
MARGIN        : ${marginPersen.toFixed(1)}%
════════════════════════════════`;

  return {
    items,
    totalOmzet,
    totalModal,
    untungBersih,
    marginPersen,
    cashFlowStatus,
    rekomendasi: MOCK_REKOMENDASI,
    ringkasanKeuangan,
  };
}

export const MOCK_ANALYSIS: AnalysisResult = calculateAnalysis(MOCK_SALES_ITEMS);

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Halo! Saya DagangAI, asisten cerdas untuk pedagang kecil. Ada yang ingin ditanyakan tentang hasil analisis penjualan hari ini?',
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'user',
    content: 'Produk mana yang paling menguntungkan?',
    timestamp: new Date(),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Berdasarkan analisis, **Kangkung Segar** adalah produk paling menguntungkan dengan margin 50% (Rp 1.500 per ikat). Meski omzetnya kecil, untung per unit-nya tertinggi. Pertimbangkan menambah variasi sayuran segar!',
    timestamp: new Date(),
  },
];
