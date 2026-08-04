import logging
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class LLMRouter:
    """
    Router penyedia prompt LLM dengan Auto-Failover:
    Gemini API ↔ Groq API ↔ Mock/Rule Fallback (Tahan Banting & Tanpa Crash).
    """

    @staticmethod
    async def generate_response(prompt: str, system_instruction: str = "") -> str:
        gemini_key = settings.get_gemini_key()
        groq_key = settings.get_groq_key()

        # Try Gemini API if key is valid (starts with AIzaSy)
        if gemini_key and gemini_key.startswith("AIzaSy"):
            try:
                response = await LLMRouter._call_gemini(gemini_key, prompt, system_instruction)
                if response:
                    return response
            except Exception as e:
                logger.warning(f"Gemini API failed: {e}. Failing over to Groq...")

        # Try Groq API if key is valid (starts with gsk_)
        if groq_key and groq_key.startswith("gsk_"):
            try:
                response = await LLMRouter._call_groq(groq_key, prompt, system_instruction)
                if response:
                    return response
            except Exception as e:
                logger.warning(f"Groq API failed: {e}. Falling back to default response...")

        return ""

    @staticmethod
    async def _call_gemini(api_key: str, prompt: str, system_instruction: str = "") -> str:
        if not api_key:
            return ""
        url = f"{GEMINI_API_URL}?key={api_key}"
        contents = []

        if system_instruction:
            contents.append({"role": "user", "parts": [{"text": f"System Directive: {system_instruction}"}]})
            contents.append({"role": "model", "parts": [{"text": "Diterima. Saya akan mematuhi arahan tersebut."}]})

        contents.append({"role": "user", "parts": [{"text": prompt}]})

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json={"contents": contents})
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
            else:
                logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text}")
        return ""

    @staticmethod
    async def _call_groq(api_key: str, prompt: str, system_instruction: str = "") -> str:
        if not api_key:
            return ""
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "llama-3.3-70b-versatile",
            "messages": messages,
            "temperature": 0.3,
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(GROQ_API_URL, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                choices = data.get("choices", [])
                if choices:
                    return choices[0].get("message", {}).get("content", "")
            else:
                logger.warning(f"Groq API returned status {resp.status_code}: {resp.text}")
        return ""
