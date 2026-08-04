from typing import List, Dict, Any
from app.api.schemas import SalesItemSchema, CashFlowStatusType


def compute_analytics(items: List[SalesItemSchema]) -> Dict[str, Any]:
    """
    Menghitung statistik keuangan warung secara presisi:
    - Total Omzet
    - Total Modal
    - Untung Bersih
    - Margin Keuntungan (%)
    - Klasifikasi Arus Kas (SEHAT / PERLU_PERHATIAN / PERINGATAN)
    """
    total_omzet = sum(item.jumlah * item.hargaJual for item in items)
    total_modal = sum(item.jumlah * item.hargaModal for item in items)
    untung_bersih = total_omzet - total_modal
    margin_persen = (untung_bersih / total_omzet * 100) if total_omzet > 0 else 0.0

    if margin_persen >= 20.0:
        cash_flow_status: CashFlowStatusType = "SEHAT"
    elif margin_persen >= 10.0:
        cash_flow_status = "PERLU_PERHATIAN"
    else:
        cash_flow_status = "PERINGATAN"

    return {
        "totalOmzet": round(total_omzet, 2),
        "totalModal": round(total_modal, 2),
        "untungBersih": round(untung_bersih, 2),
        "marginPersen": round(margin_persen, 1),
        "cashFlowStatus": cash_flow_status,
    }
