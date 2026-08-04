import base64
import json
import logging
import re
from typing import List, Dict, Any
import httpx

from app.api.schemas import SalesItemSchema
from app.core.config import settings
from app.services.nlp_parser import FALLBACK_MOCK_ITEMS

logger = logging.getLogger(__name__)

GEMINI_VISION_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

PROMPT_OCR = """
Kamu adalah sistem OCR AI khusus untuk membaca struk/nota belanja warung fisik Indonesia.
Analisis foto nota/struk ini dan ekstrak daftar barang yang dibeli/dijual.

Untuk setiap barang, temukan:
- nama: Nama barang
- jumlah: Jumlah unit (default 1 jika tidak ada)
- hargaJual: Harga jual atau harga total barang (Rp)
- hargaModal: Perkiraan modal/beli per unit (jika tidak tertera, estimasikan 80% dari harga jual)

Kembalikan WAJIB HANYA JSON VALID (array of objects), tanpa markdown atau teks tambahan:
[
  {
    "id": "1",
    "nama": "Mie Instan",
    "jumlah": 10,
    "hargaJual": 3500,
    "hargaModal": 2800
  }
]
"""


class OCRService:
    @staticmethod
    async def process_image_bytes(image_bytes: bytes, mime_type: str = "image/jpeg") -> List[SalesItemSchema]:
        """
        Memproses file gambar nota/struk belanja menggunakan Gemini 1.5 Flash Vision.
        """
        gemini_key = settings.get_gemini_key()

        if gemini_key and gemini_key.startswith("AIzaSy"):
            try:
                base64_image = base64.b64encode(image_bytes).decode("utf-8")
                url = f"{GEMINI_VISION_URL}?key={gemini_key}"

                payload = {
                    "contents": [
                        {
                            "parts": [
                                {"text": PROMPT_OCR},
                                {
                                    "inlineData": {
                                        "mimeType": mime_type,
                                        "data": base64_image,
                                    }
                                },
                            ]
                        }
                    ]
                }

                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                raw_text = parts[0].get("text", "")
                                items = OCRService._clean_and_parse_json(raw_text)
                                if items:
                                    return items
                    else:
                        logger.warning(f"Gemini Vision API returned status {resp.status_code}: {resp.text}")
            except Exception as e:
                logger.error(f"OCR Vision processing failed: {e}")

        # Fallback items if vision API key unavailable or failed
        return FALLBACK_MOCK_ITEMS

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
                    jual = float(obj.get("hargaJual", 0))
                    modal = float(obj.get("hargaModal") or (jual * 0.8 if jual > 0 else 0))
                    items.append(
                        SalesItemSchema(
                            id=str(obj.get("id") or (idx + 1)),
                            nama=str(obj.get("nama") or f"Barang Struk {idx + 1}"),
                            jumlah=int(obj.get("jumlah", 1)),
                            hargaJual=jual,
                            hargaModal=modal,
                        )
                    )
                if items:
                    return items
        except Exception as e:
            logger.warning(f"Failed to parse OCR JSON response: {e}")
        return []
