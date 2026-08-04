import json
import re
from typing import List
from app.api.schemas import SalesItemSchema
from app.services.llm_router import LLMRouter

SYSTEM_PROMPT_NLP = """
Kamu adalah parser NLP khusus untuk mencatat hasil penjualan warung/UMKM Indonesia.
Tugasmu adalah mengubah teks percakapan/catatan harian pedagang menjadi JSON array dari barang terjual.

Format JSON yang harus dikembalikan (WAJIB HANYA JSON VALID, TANPA TEKS LAIN):
[
  {
    "id": "1",
    "nama": "Nama Barang",
    "jumlah": 10,
    "hargaJual": 5000,
    "hargaModal": 4000
  }
]
"""


class NLPParser:
    @staticmethod
    async def parse_text(text: str) -> List[SalesItemSchema]:
        """
        Mengekstrak teks jualan harian pedagang menjadi SalesItemSchema[].
        """
        if not text or not text.strip():
            return []

        prompt = f"Ekstrak data jualan dari teks berikut ke format JSON:\n\n{text}"
        raw_response = await LLMRouter.generate_response(prompt, SYSTEM_PROMPT_NLP)

        if raw_response:
            parsed = NLPParser._clean_and_parse_json(raw_response)
            if parsed:
                return parsed

        # Rule-based fallback if LLM is unavailable or output invalid JSON
        return NLPParser._fallback_rule_parse(text)

    @staticmethod
    def _clean_and_parse_json(raw: str) -> List[SalesItemSchema]:
        try:
            cleaned = raw.strip()
            if cleaned.startswith("```"):
                cleaned = re.sub(r"^```(?:json)?\n?", "", cleaned)
                cleaned = re.sub(r"\n?```$", "", cleaned)

            data = json.loads(cleaned)
            if isinstance(data, list):
                items = []
                for idx, obj in enumerate(data):
                    items.append(
                        SalesItemSchema(
                            id=str(obj.get("id") or (idx + 1)),
                            nama=str(obj.get("nama") or f"Barang {idx + 1}"),
                            jumlah=int(obj.get("jumlah", 1)),
                            hargaJual=float(obj.get("hargaJual", 0)),
                            hargaModal=float(obj.get("hargaModal", 0)),
                        )
                    )
                if items:
                    return items
        except Exception:
            pass
        return []

    @staticmethod
    def _fallback_rule_parse(text: str) -> List[SalesItemSchema]:
        lines = [line.strip("- *•\t") for line in text.split("\n") if line.strip()]
        items = []

        for idx, line in enumerate(lines):
            match = re.search(
                r"(.+?)\s+(\d+)\s*(?:dus|pcs|ikat|bks|batang|botol|karung)?.*(?:jual|harga)\s*(\d+).*(?:modal|beli)\s*(\d+)",
                line,
                re.IGNORECASE,
            )
            if match:
                nama, jumlah, jual, modal = match.groups()
                items.append(
                    SalesItemSchema(
                        id=str(idx + 1),
                        nama=nama.strip(),
                        jumlah=int(jumlah),
                        hargaJual=float(jual),
                        hargaModal=float(modal),
                    )
                )

        return items
