import datetime
from typing import List, Dict, Any
from app.api.schemas import SalesItemSchema, RecommendationItemSchema

SYSTEM_PROMPT_ADVISOR = """
Kamu adalah penasihat bisnis UMKM warung kelontong Indonesia yang berpengalaman.
Berikan 3-4 saran singkat, praktis, dan berbasis data keuangan pedagang.
Gunakan Bahasa Indonesia yang ramah, lugas, profesional, dan to the point.
"""


class LLMAdvisor:
    @staticmethod
    async def generate_recommendations(
        items: List[SalesItemSchema], analytics: Dict[str, Any]
    ) -> List[RecommendationItemSchema]:
        """
        Menghasilkan rekomendasi bisnis AI berdasarkan data penjualan.
        """
        sorted_items = sorted(
            items,
            key=lambda x: ((x.hargaJual - x.hargaModal) / x.hargaJual * 100) if x.hargaJual > 0 else 0,
            reverse=True,
        )

        top_margin_item = sorted_items[0] if sorted_items else None
        lowest_margin_item = sorted_items[-1] if sorted_items else None

        recs = []
        if top_margin_item:
            margin = ((top_margin_item.hargaJual - top_margin_item.hargaModal) / top_margin_item.hargaJual * 100) if top_margin_item.hargaJual > 0 else 0
            recs.append(
                RecommendationItemSchema(
                    icon="",
                    text=f"{top_margin_item.nama} memiliki margin keuntungan tertinggi ({margin:.1f}%). Pertimbangkan untuk menambah stok barang ini.",
                )
            )

        if lowest_margin_item:
            margin_low = ((lowest_margin_item.hargaJual - lowest_margin_item.hargaModal) / lowest_margin_item.hargaJual * 100) if lowest_margin_item.hargaJual > 0 else 0
            recs.append(
                RecommendationItemSchema(
                    icon="",
                    text=f"{lowest_margin_item.nama} memiliki margin tipis ({margin_low:.1f}%). Coba negosiasi harga ke supplier atau evaluasi harga jual.",
                )
            )

        margin_total = analytics.get("marginPersen", 0)
        if margin_total >= 20:
            recs.append(
                RecommendationItemSchema(
                    icon="",
                    text=f"Total margin usaha Anda {margin_total:.1f}% (Kategori SEHAT). Pertahankan struktur harga saat ini.",
                )
            )
        else:
            recs.append(
                RecommendationItemSchema(
                    icon="",
                    text=f"Total margin usaha Anda {margin_total:.1f}%. Usahakan efisiensi biaya operasional untuk tingkatkan profit.",
                )
            )

        return recs

    @staticmethod
    def generate_financial_summary(
        items: List[SalesItemSchema], analytics: Dict[str, Any]
    ) -> str:
        """
        Menghasilkan format teks ringkasan laporan keuangan yang rapi untuk dicetak/download.
        """
        today_str = datetime.date.today().strftime("%d %B %Y")
        total_omzet = analytics.get("totalOmzet", 0)
        total_modal = analytics.get("totalModal", 0)
        untung_bersih = analytics.get("untungBersih", 0)
        margin_persen = analytics.get("marginPersen", 0)

        lines = [
            "LAPORAN PENJUALAN HARIAN — DAGANGAI",
            "════════════════════════════════",
            f"Tanggal: {today_str}",
            "",
        ]

        for idx, item in enumerate(items, start=1):
            subtotal_omzet = item.jumlah * item.hargaJual
            subtotal_modal = item.jumlah * item.hargaModal
            untung_unit = item.hargaJual - item.hargaModal
            untung_total = untung_unit * item.jumlah
            margin_unit = (untung_unit / item.hargaJual * 100) if item.hargaJual > 0 else 0

            lines.append(f"{idx}. {item.nama}")
            lines.append(f"   {item.jumlah} x Rp {item.hargaJual:,.0f} = Rp {subtotal_omzet:,.0f}")
            lines.append(f"   Modal: {item.jumlah} x Rp {item.hargaModal:,.0f} = Rp {subtotal_modal:,.0f}")
            lines.append(f"   Untung: Rp {untung_total:,.0f} ({margin_unit:.1f}%)")
            lines.append("")

        lines.extend([
            "════════════════════════════════",
            f"TOTAL OMZET   : Rp {total_omzet:,.0f}",
            f"TOTAL MODAL   : Rp {total_modal:,.0f}",
            f"UNTUNG BERSIH : Rp {untung_bersih:,.0f}",
            f"MARGIN        : {margin_persen:.1f}%",
            "════════════════════════════════",
        ])

        return "\n".join(lines)
