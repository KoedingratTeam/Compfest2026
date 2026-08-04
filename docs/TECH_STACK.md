# 🛠️ TECH STACK — DagangAI
## Analisis Teknologi Zero-Cost untuk COMPFEST 18 AIC

> **Prinsip**: Semua teknologi HARUS gratis (free tier / open source).
> **Constraint**: Berjalan lokal di laptop via Docker Compose.

---

## 1. RINGKASAN KEPUTUSAN

| Layer | Pilihan | Biaya | Alasan |
|---|---|---|---|
| **Frontend** | React + Vite + TypeScript | 🆓 Free | Fastest DX, modern, ekosistem besar |
| **Backend** | FastAPI (Python) | 🆓 Free | Native Python untuk AI, auto-docs, async |
| **LLM (Utama)** | Gemini API (Free Tier) | 🆓 Free | 15 RPM, 1500 RPD, multimodal, bahasa Indonesia bagus |
| **LLM (Backup)** | Groq API (Free Tier) | 🆓 Free | 30 RPM, super cepat, Llama models |
| **OCR (Final)** | EasyOCR / PaddleOCR | 🆓 Free | Lebih akurat dari Tesseract untuk struk Indonesia |
| **Database** | SQLite | 🆓 Free | Embedded, zero-config |
| **Container** | Docker + Docker Compose | 🆓 Free | WAJIB lomba |
| **Styling** | TailwindCSS v4 atau Vanilla CSS | 🆓 Free | Rapid development |
| **Data Harga** | PIHPS Kemendag (Final) | 🆓 Free | Data publik pemerintah |
| **Data Cuaca** | OpenWeather API (Final) | 🆓 Free | 1000 calls/hari gratis |

**Total biaya: Rp 0**

---

## 2. ANALISIS PER LAYER

---

### 2.1 FRONTEND

| Opsi | Kelebihan | Kekurangan | Biaya | Rekomendasi |
|---|---|---|---|---|
| **React + Vite + TS** | Ekosistem terbesar, banyak library, DX cepat, familiar | Bundle size lebih besar dari Svelte | 🆓 | ⭐ **PILIH INI** |
| Next.js | SSR, API routes built-in | Overkill untuk MVP lokal (Docker), lebih berat | 🆓 | ❌ Terlalu berat |
| Vue + Vite | Mudah dipelajari, ringan | Ekosistem library lebih kecil | 🆓 | ✅ Alternatif bagus |
| Svelte | Paling ringan, paling cepat | Ekosistem kecil, kurang familiar | 🆓 | ⚠️ Risiko kurva belajar |

**Keputusan: React + Vite + TypeScript**
- Paling banyak developer yang familiar
- Library UI/chart berlimpah (kalau butuh di final)
- TypeScript = lebih aman untuk tim

**UI Library (opsional):**
| Opsi | Biaya | Note |
|---|---|---|
| Vanilla CSS | 🆓 | Kontrol penuh, fleksibel |
| TailwindCSS v4 | 🆓 | Rapid prototyping, utility-first |
| shadcn/ui | 🆓 | Komponen rapi, copy-paste |
| Chakra UI | 🆓 | Accessible, ready-made |

---

### 2.2 BACKEND

| Opsi | Kelebihan | Kekurangan | Biaya | Rekomendasi |
|---|---|---|---|---|
| **FastAPI (Python)** | Native Python = AI/ML langsung, auto-docs (Swagger), async, super cepat | Perlu Python ecosystem knowledge | 🆓 | ⭐ **PILIH INI** |
| Express.js (Node) | JavaScript full-stack | Perlu bridge ke Python untuk AI | 🆓 | ❌ Ribet integrasi AI |
| Flask (Python) | Simpel, ringan | Tidak async by default, no auto-docs | 🆓 | ⚠️ Terlalu basic |
| Django | "Batteries included" | Overkill, heavy, lambat startup | 🆓 | ❌ Terlalu berat |

**Keputusan: FastAPI**
- Python = bahasa utama untuk AI/LLM
- Auto-generate API docs (Swagger UI) → juri bisa lihat
- Async native → bisa handle LLM streaming
- Pydantic models → validasi data otomatis

---

### 2.3 LLM (Large Language Model)

Ini komponen **paling kritis** — hampir semua fitur DagangAI bergantung pada LLM.

#### Perbandingan Free Tier LLM API (2026)

| Provider | Model | RPM | RPD | TPM | Multimodal | Indo? | Biaya |
|---|---|---|---|---|---|---|---|
| **Gemini (Google)** | Gemini 3 Flash | 10-15 | 1,500 | 250K | ✅ (Vision) | ✅ Bagus | 🆓 |
| **Groq** | Llama 3.3 70B | 30 | 1,000 | 12K | ❌ | ⚠️ Cukup | 🆓 |
| **Groq** | Llama 3.1 8B | 30 | 14,400 | 6K | ❌ | ⚠️ Cukup | 🆓 |
| **OpenRouter** | Various (20+ model gratis) | Varies | Varies | Varies | Varies | Varies | 🆓 |
| **Mistral** | Mistral Small | Generous | Generous | Generous | ❌ | ⚠️ | 🆓 |
| **DeepSeek** | DeepSeek-V3 | — | — | Token grant | ❌ | ⚠️ | 🆓* |
| **OpenAI** | GPT-4o | — | — | — | ✅ | ✅ | 💰 **Bayar** |
| **Ollama (lokal)** | Llama/Mistral | ∞ | ∞ | ∞ | ❌ | ⚠️ | 🆓 tapi butuh RAM/GPU |

#### Strategi LLM: Dual Provider

```
┌─────────────────────────────────────────┐
│         STRATEGI LLM DagangAI           │
│                                         │
│  UTAMA: Gemini API (Free Tier)          │
│  • Parsing NLP, analisis, rekomendasi   │
│  • Multimodal (Vision) untuk OCR (final)│
│  • Bahasa Indonesia paling natural      │
│  • 1,500 request/hari cukup untuk MVP   │
│                                         │
│  BACKUP: Groq API (Free Tier)           │
│  • Kalau Gemini rate-limited            │
│  • Llama 3.3 70B cukup capable          │
│  • 30 RPM = lebih toleran              │
│  • Latency sangat rendah               │
│                                         │
│  ARSITEKTUR:                            │
│  Backend → LLM Router → Gemini/Groq    │
│  • Kalau Gemini 429 → auto-switch Groq │
│  • Prompt template sama, model beda    │
└─────────────────────────────────────────┘
```

**Kenapa BUKAN OpenAI?**
- GPT-4o tidak ada free tier
- Harus bayar per token
- Gemini free tier sudah lebih dari cukup

**Kenapa BUKAN Ollama (lokal)?**
- Butuh RAM 8-16GB+ dan GPU
- Laptop biasa mungkin tidak kuat
- Docker container jadi sangat besar
- Kualitas bahasa Indonesia kurang baik dibanding Gemini

---

### 2.4 OCR (Untuk Babak Final)

| Opsi | Akurasi Struk | GPU Needed? | Bahasa Indo | Size | Biaya | Rekomendasi |
|---|---|---|---|---|---|---|
| **EasyOCR** | ⭐⭐⭐⭐ Bagus di noisy images | ⚠️ Optional (CPU bisa) | ✅ | ~150MB | 🆓 | ⭐ **PILIH INI** |
| PaddleOCR | ⭐⭐⭐⭐⭐ Terbaik di tabel/form | ⚠️ Optional | ✅ | ~200MB | 🆓 | ✅ Alternatif terbaik |
| Tesseract | ⭐⭐ Lemah di noisy | ❌ CPU only | ✅ | ~30MB | 🆓 | ⚠️ Akurasi rendah di struk |
| Google Vision | ⭐⭐⭐⭐⭐ Terbaik | ❌ Cloud | ✅ | 0 (API) | 💰 | ❌ Tidak gratis |
| Gemini Vision | ⭐⭐⭐⭐ Bagus | ❌ Cloud | ✅ | 0 (API) | 🆓 | ✅ Bonus: sudah ada free tier |

**Keputusan: EasyOCR (default) + Gemini Vision (bonus)**
- EasyOCR: gratis, akurat untuk struk cetak, Python-native
- Gemini Vision: sudah ada free tier, bisa langsung pakai tanpa install tambahan
- Tesseract: skip — akurasinya kurang untuk struk Indonesia

> **Note**: OCR hanya untuk babak Final. Di penyisihan, input hanya via chat + form.

---

### 2.5 DATABASE

| Opsi | Biaya | Setup | Cocok untuk MVP? |
|---|---|---|---|
| **SQLite** | 🆓 | Zero-config, 1 file | ⭐ **PILIH INI** |
| PostgreSQL | 🆓 | Perlu container tambahan | ⚠️ Overkill |
| MongoDB | 🆓 | Perlu container tambahan | ❌ Tidak perlu NoSQL |
| Supabase | 🆓 (limited) | Cloud, bukan lokal | ❌ Harus lokal (Docker) |

**Keputusan: SQLite**
- Embedded — tidak perlu container database terpisah
- 1 file `.db` — simpel, portable
- Cukup untuk MVP yang tidak simpan history
- Bisa upgrade ke PostgreSQL di final kalau butuh

---

### 2.6 EXTERNAL APIs (Untuk Babak Final)

| API | Fungsi | Free Tier | Limit |
|---|---|---|---|
| **PIHPS Kemendag** | Harga bahan pokok Indonesia | 🆓 Gratis (data publik) | Tidak ada limit resmi |
| **OpenWeather** | Data cuaca & forecast | 🆓 Free tier | 1,000 calls/hari |
| **Gemini API** | LLM (sudah di atas) | 🆓 Free tier | 1,500 RPD |
| **Groq API** | LLM backup | 🆓 Free tier | 1,000-14,400 RPD |

---

### 2.7 TOOLING & DEV EXPERIENCE

| Tool | Fungsi | Biaya |
|---|---|---|
| **Docker Desktop** | Container runtime | 🆓 (personal/education) |
| **Git + GitHub** | Version control + repo public | 🆓 |
| **VS Code / Cursor** | IDE | 🆓 |
| **Conventional Commits** | Format commit (wajib lomba) | 🆓 |
| **Swagger UI** | API documentation (auto dari FastAPI) | 🆓 |

---

## 3. ARSITEKTUR DOCKER COMPOSE

```yaml
# docker-compose.yml (rencana)
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - ./data:/app/data  # SQLite DB
```

**Hanya 2 container** (simpel!):
1. `frontend` — React dev server
2. `backend` — FastAPI + AI service (semua dalam 1)

> Kenapa AI tidak container terpisah? Untuk penyisihan, AI cukup sebagai module di dalam backend (FastAPI). Pisahkan hanya kalau butuh scaling (final/production).

---

## 4. STRUKTUR FOLDER (Rencana)

```
DagangAI/
├── docker-compose.yml
├── .env.example          # Template API keys
├── README.md
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── InputPage.tsx      # Chat + Form input
│   │   │   └── ResultPage.tsx     # Analisis + Rekomendasi + Ringkasan + Chat
│   │   ├── components/
│   │   │   ├── ChatInput.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── AnalysisCard.tsx
│   │   │   ├── RecommendationCard.tsx
│   │   │   ├── FinancialSummary.tsx
│   │   │   └── ChatConsultant.tsx
│   │   └── styles/
│   └── public/
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py               # FastAPI entry point
│   │   ├── api/
│   │   │   ├── routes.py          # API endpoints
│   │   │   └── schemas.py         # Pydantic models
│   │   ├── services/
│   │   │   ├── nlp_parser.py      # Chat → structured data (LLM)
│   │   │   ├── analytics.py       # Margin, ranking, cash flow
│   │   │   ├── llm_advisor.py     # Rekomendasi + ringkasan
│   │   │   ├── llm_chat.py        # Chat follow-up
│   │   │   └── llm_router.py      # Gemini ↔ Groq auto-switch
│   │   ├── models/
│   │   │   └── database.py        # SQLite models
│   │   └── core/
│   │       ├── config.py          # Environment variables
│   │       └── prompts.py         # LLM prompt templates
│   │
│   └── modules/                   # 🔮 Extensible untuk Final
│       ├── ocr/                   # (kosong, siap plug-in)
│       │   └── __init__.py
│       ├── prediction/            # (kosong, siap plug-in)
│       │   └── __init__.py
│       └── weather/               # (kosong, siap plug-in)
│           └── __init__.py
│
└── docs/
    ├── LAPORAN_PROYEK.md
    ├── TECH_STACK.md              # (file ini)
    ├── KETENTUAN_LOMBA.md
    └── ANALISIS_SMART_COMMERCE.md
```

**Perhatikan folder `modules/`** — ini arsitektur modular yang disiapkan untuk fitur final (OCR, prediksi, cuaca). Di penyisihan, folder ini berisi interface/placeholder kosong. Di final, tinggal isi implementasinya.

---

## 5. TOTAL BIAYA

| Item | Biaya |
|---|---|
| React + Vite + TypeScript | 🆓 Rp 0 |
| FastAPI + Python | 🆓 Rp 0 |
| Gemini API (Free Tier) | 🆓 Rp 0 |
| Groq API (Free Tier) | 🆓 Rp 0 |
| EasyOCR (Final) | 🆓 Rp 0 |
| SQLite | 🆓 Rp 0 |
| Docker + Docker Compose | 🆓 Rp 0 |
| GitHub (Public Repo) | 🆓 Rp 0 |
| OpenWeather API (Final) | 🆓 Rp 0 |
| PIHPS API (Final) | 🆓 Rp 0 |
| **TOTAL** | **🆓 Rp 0** |
