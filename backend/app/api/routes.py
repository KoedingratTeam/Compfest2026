from fastapi import APIRouter, HTTPException, File, UploadFile
from app.api.schemas import (
    HealthResponse,
    AnalyzeRequest,
    AnalyzeResponse,
    ParseChatRequest,
    ParseChatResponse,
    ChatConsultRequest,
    ChatConsultResponse,
    OCRScanResponse,
)
from app.services.analytics import compute_analytics
from app.services.nlp_parser import NLPParser
from app.services.llm_advisor import LLMAdvisor
from app.services.llm_chat import LLMChatConsultant
from app.modules.ocr.service import OCRService

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint untuk memverifikasi keaktifan service."""
    return HealthResponse(status="ok", service="dagangai-api", version="0.1.0")


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_sales(payload: AnalyzeRequest):
    """
    Menganalisis daftar item penjualan warung.
    Menghitung statistik omzet, modal, untung bersih, margin %,
    klasifikasi arus kas, rekomendasi AI, dan format ringkasan laporan keuangan.
    """
    try:
        analytics = compute_analytics(payload.items)
        recommendations = await LLMAdvisor.generate_recommendations(payload.items, analytics)
        summary_text = LLMAdvisor.generate_financial_summary(payload.items, analytics)

        return AnalyzeResponse(
            items=payload.items,
            totalOmzet=analytics["totalOmzet"],
            totalModal=analytics["totalModal"],
            untungBersih=analytics["untungBersih"],
            marginPersen=analytics["marginPersen"],
            cashFlowStatus=analytics["cashFlowStatus"],
            rekomendasi=recommendations,
            ringkasanKeuangan=summary_text,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses analisis: {str(e)}")


@router.post("/parse-chat", response_model=ParseChatResponse)
async def parse_chat_input(payload: ParseChatRequest):
    """
    Mengubah teks input jualan sehari-hari pedagang menjadi daftar item terstruktur.
    """
    try:
        items = await NLPParser.parse_text(payload.text)
        return ParseChatResponse(items=items, rawText=payload.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengekstraksi teks: {str(e)}")


@router.post("/chat-consult", response_model=ChatConsultResponse)
async def chat_consultant(payload: ChatConsultRequest):
    """
    Konsultan bisnis AI untuk menjawab pertanyaan spesifik dari pedagang.
    """
    try:
        reply = await LLMChatConsultant.get_reply(payload.message, payload.contextItems)
        return ChatConsultResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses konsul AI: {str(e)}")


@router.post("/ocr-scan", response_model=OCRScanResponse)
async def ocr_scan_receipt(file: UploadFile = File(...)):
    """
    Menerima upload foto nota/struk belanja fisik pedagang,
    dan mengekstraksi item barang menggunakan Gemini Vision AI.
    """
    try:
        image_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"
        items = await OCRService.process_image_bytes(image_bytes, mime_type=mime_type)
        return OCRScanResponse(items=items, filename=file.filename or "receipt.jpg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memproses OCR struk: {str(e)}")
