from typing import List
from app.api.schemas import SalesItemSchema
from app.services.llm_router import LLMRouter

SYSTEM_PROMPT_CHAT = """
Kamu adalah DagangAI, asisten AI ramah khusus pedagang warung & UMKM Indonesia.
Tugasmu adalah menjawab pertanyaan seputar strategi bisnis, stok, keuangan, dan tips penjualan warung.
Gunakan Bahasa Indonesia yang ramah, jelas, praktis, dan menyemangati pedagang.
"""


class LLMChatConsultant:
    @staticmethod
    async def get_reply(user_message: str, context_items: List[SalesItemSchema] = []) -> str:
        """
        Memberikan tanggapan AI konsultan bisnis warung.
        """
        context_text = ""
        if context_items:
            items_str = ", ".join([f"{item.nama} ({item.jumlah} pcs, margin Rp {item.hargaJual - item.hargaModal:,.0f})" for item in context_items])
            context_text = f"\nData jualan warung hari ini: {items_str}."

        prompt = f"{context_text}\nPertanyaan Pedagang: {user_message}"
        response = await LLMRouter.generate_response(prompt, SYSTEM_PROMPT_CHAT)

        if response:
            return response

        # Deterministic fallback response if LLM API is unavailable
        return (
            "Berdasarkan data penjualan Anda hari ini, strategi terbaik adalah memprioritaskan "
            "produk dengan margin keuntungan terbesar dan memastikan ketersediaan stok barang-barang favorit pelanggan!"
        )
