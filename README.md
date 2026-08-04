# 🧠 DagangAI — Asisten Cerdas Pedagang Kecil Indonesia

**DagangAI** adalah platform AI pintar yang dirancang khusus untuk memberdayakan **64 juta pelaku UMKM & warung kelontong Indonesia**. Cukup dengan menginput catatan jualan sehari-hari via **chat bahasa alami**, **tabel form**, atau **foto nota/struk belanja**, DagangAI secara otomatis menghitung laporan keuangan, mengklasifikasi arus kas, dan memberikan rekomendasi strategi bisnis berbasis AI secara *real-time*.

> 🏆 **COMPFEST 18 — AI Innovation Challenge (AIC)**  
> 🏷️ **Trek**: Smart Commerce & Economic Empowerment  
> 🌿 **Dampak Sosial**: SDG 8 (Decent Work & Economic Growth) & SDG 12.3 (Food Waste Reduction)

---

## ✨ Fitur Unggulan

- **💬 Natural Language Sales Parsing**: Teks jualan sehari-hari (cth: *"Mie 20 dus 3500 modal 2800, Beras 10 karung 65rb modal 58rb"*) otomatis di-ekstraksi menjadi JSON terstruktur oleh AI.
- **📷 AI OCR Scan Nota/Struk Belanja**: Cukup upload foto nota/struk kertas fisik, **Gemini 1.5 Flash Vision AI** otomatis membaca barang & harga.
- **📊 Real-time Financial Analytics**: Perhitungan Omzet, Total Modal, Untung Bersih, dan Margin Keuntungan (%) secara presisi.
- **💰 Arus Kas Indicator**: Klasifikasi kesehatan keuangan (`SEHAT`, `PERLU_PERHATIAN`, `PERINGATAN`) lengkap dengan visualisasi meter bar.
- **🤖 AI Business Consultant**: Asisten interaktif yang dapat diajak berkonsultasi mengenai strategi profit, persediaan barang, dan negosiasi supplier.
- **🎨 Apple Human Interface Guidelines Design**: Tampilan antarmuka yang sangat bersih, minimalis, dan responsif (*Inter Font, Solid Primary `#0071e3`, Surface `#f5f5f7`*).

---

## ⚡ Arbotektur Teknis (Zero-Crash & Failover)

```
┌─────────────────┐       HTTP / JSON       ┌────────────────────────┐
│  React + Vite   │ ──────────────────────> │  FastAPI Backend Engine│
│   TypeScript    │ <────────────────────── │   (Pydantic V2 Models) │
└────────┬────────┘                         └───────────┬────────────┘
         │                                              │
   Apple Design                                ┌────────┴────────┐
   (NeedMCP Specs)                             │  LLM Router     │
                                               │ (Auto Failover) │
                                               └───┬─────────┬───┘
                                                   │         │
                                             Gemini API   Groq API
                                            (1.5 Flash)  (Llama-3.3-70b)
```

- **Frontend**: React 18 + Vite + TypeScript.
- **Backend Engine**: FastAPI (Python 3.12) dengan validasi Pydantic V2 strict & Global Error Middleware (no 500 crash).
- **LLM Engine**: `LLMRouter` dengan auto-failover sub-500ms antara **Gemini API** ↔ **Groq API (Llama-3.3-70b)** ↔ **Local Fallback**.
- **Vision Engine**: Gemini 1.5 Flash Vision untuk OCR scan struk.

---

## 🚀 Quick Start (Menjalankan Proyek)

### Prasyarat
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v29+)
- [Node.js](https://nodejs.org/) (v20+)
- [Python](https://www.python.org/) (v3.12+)

### Setup 3 Langkah Mudah

```bash
# 1. Clone repository
git clone https://github.com/adibdiabi/CompfestWeb.git
cd CompfestWeb

# 2. Buat file .env dari template & isi API Key
cp .env.example .env
# Edit .env dan isi GEMINI_API_KEY atau GROQ_API_KEY

# 3. Jalankan dengan Docker Compose
docker compose up -d
```

### Akses Service Local

| Service | URL | Keterangan |
|---|---|---|
| **Frontend Web** | [http://localhost:3000](http://localhost:3000) | Antarmuka pengguna DagangAI |
| **Backend REST API** | [http://localhost:8000](http://localhost:8000) | FastAPI Engine Service |
| **Interactive API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Swagger UI Documentation |
| **Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | API Status Verification |

---

## 📁 Struktur Repositori

```
CompfestWeb/
├── frontend/               # React 18 + Vite + TypeScript Web Client
│   ├── src/
│   │   ├── components/     # UI Components (Input, Result, Layout)
│   │   ├── hooks/          # Custom Hooks (useAnalysis, useFormInput, useChatConsultant)
│   │   ├── services/       # Standardized API Client Layer
│   │   ├── styles/         # Apple Design System CSS
│   │   └── types/          # TypeScript Interfaces
├── backend/                # FastAPI Python AI Backend
│   ├── app/
│   │   ├── api/            # Pydantic V2 Schemas & REST Routes
│   │   ├── core/           # Config & Settings Environment Loader
│   │   ├── modules/ocr/    # Vision AI OCR Service
│   │   └── services/       # Analytics, NLP Parser, LLM Advisor, LLM Chat
│   ├── Dockerfile
│   └── requirements.txt
├── docs/                   # Dokumentasi Lomba COMPFEST 18
│   ├── LAPORAN_PROYEK.md   # Laporan Resmi Submisi Lomba
│   ├── DEVELOPMENT_ROADMAP.md
│   └── KETENTUAN_LOMBA.md
├── docker-compose.yml      # Multi-container Orchestration
├── .env.example            # Template Environment Variables
└── README.md
```

---

## 📄 Lisensi & Kredit

Dipersembahkan untuk **COMPFEST 18 AI Innovation Challenge (AIC)** oleh Tim Koedingrat.  
Hak Cipta © 2026 Koedingrat.
