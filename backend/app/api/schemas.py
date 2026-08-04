from typing import List, Literal
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Status layanan API")
    service: str = Field(default="dagangai-api", description="Nama service")
    version: str = Field(default="0.1.0", description="Versi API")


class SalesItemSchema(BaseModel):
    id: str = Field(..., description="ID unik item barang")
    nama: str = Field(..., description="Nama barang/produk warung")
    jumlah: int = Field(..., ge=0, description="Jumlah unit terjual")
    hargaJual: float = Field(..., ge=0, description="Harga jual per unit (Rp)")
    hargaModal: float = Field(..., ge=0, description="Harga modal/beli per unit (Rp)")


CashFlowStatusType = Literal["SEHAT", "PERLU_PERHATIAN", "PERINGATAN"]


class RecommendationItemSchema(BaseModel):
    icon: str = Field(default="💡", description="Emoji icon rekomendasi")
    text: str = Field(..., description="Teks rekomendasi bisnis")


class AnalyzeRequest(BaseModel):
    items: List[SalesItemSchema] = Field(..., min_items=1, description="Daftar item penjualan warung")


class AnalyzeResponse(BaseModel):
    items: List[SalesItemSchema]
    totalOmzet: float = Field(..., description="Total pendapatan kotor (Rp)")
    totalModal: float = Field(..., description="Total biaya modal (Rp)")
    untungBersih: float = Field(..., description="Untung bersih (Rp)")
    marginPersen: float = Field(..., description="Persentase margin keuntungan (%)")
    cashFlowStatus: CashFlowStatusType = Field(..., description="Status kesehatan arus kas")
    rekomendasi: List[RecommendationItemSchema] = Field(..., description="Daftar rekomendasi bisnis AI")
    ringkasanKeuangan: str = Field(..., description="Format teks ringkasan laporan keuangan")


class ParseChatRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Input teks percakapan/catatan jualan harian pedagang")


class ParseChatResponse(BaseModel):
    items: List[SalesItemSchema] = Field(..., description="Hasil ekstraksi daftar barang terjual")
    rawText: str = Field(..., description="Input teks asli yang diproses")


class ChatConsultRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Pesan pertanyaan pedagang")
    contextItems: List[SalesItemSchema] = Field(default=[], description="Konteks item penjualan saat ini")


class ChatConsultResponse(BaseModel):
    reply: str = Field(..., description="Jawaban/saran dari AI Konsultan Bisnis DagangAI")


class OCRScanResponse(BaseModel):
    items: List[SalesItemSchema] = Field(..., description="Daftar item yang diekstrak dari gambar nota/struk")
    filename: str = Field(..., description="Nama file gambar yang di-upload")
