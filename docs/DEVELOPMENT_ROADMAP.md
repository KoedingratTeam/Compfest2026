# 🛣️ DEVELOPMENT ROADMAP — DagangAI

## Strategi Alur Pengerjaan: Frontend UI First (FE UI Dulu, BE AI Kemudian)

Dokumen ini mengatur alur pengerjaan pengembangan proyek **DagangAI** dengan urutan **Frontend UI First** agar tampilan aplikasi berbasis desain Figma siap di-demo secara visual dengan cepat menggunakan data mock sebelum dihubungkan ke Backend AI Engine.

---

## 📊 OVERVIEW PERBANDINGAN URUTAN FASE

```
  URUTAN LAMA (BE Dulu)                   URUTAN BARU (FE UI Dulu — APPROVED BY USER)
  =====================                   ===========================================
  Fase 1: Setup Foundation                Fase 1: Setup Foundation
  Fase 2: Backend AI Engine               Fase 2: Frontend UI (Desain Figma) 🎨
  Fase 3: Frontend UI (Figma)             Fase 3: Backend AI Engine (Otak AI) 🧠
  Fase 4: Integrasi E2E                   Fase 4: Integrasi E2E & Docker Test
```

### 💡 Keuntungan Urutan Baru (FE UI Dulu):

1. **Demo Visual Instan**: Tampilan aplikasi berbasis desain Figma siap dipamerkan dan diuji secara visual dari awal menggunakan _mock data_ yang interaktif.
2. **Kesesuaian Presisi dengan Figma**: Semua komponen UI React, Glassmorphism, warna, dan layout dibuat persis dengan acuan Figma yang sudah terhubung via API.
3. **Integrasi Mulus**: Saat Backend AI dibuat di Fase 3, API-nya tinggal mempassing data ke komponen Frontend yang sudah berdiri kokoh.

---

## 📌 BREAKDOWN FASE PENGERJAAN DETIL

### ✅ FASE 1: Project Foundation & Environment Setup — SELESAI

_Tujuan_: Memastikan struktur repositori, environment, dan Docker Compose dapat berjalan.

- [x] Inisialisasi folder `frontend/` (React + Vite + TypeScript).
- [x] Inisialisasi folder `backend/` (FastAPI + Python).
- [x] Buat `docker-compose.yml` & `.env.example`.
- [x] Verifikasi `docker compose up` berjalan lancar di Port 3000 (FE) & 8000 (BE).

---

### 🎨 FASE 2: Frontend UI Development (Berdasarkan Desain Figma)

_Tujuan_: Membangun antarmuka web berkelas tinggi (WOW Factor) menggunakan data mock sementara.

1. **Design System & Theme Setup**:
   - Palette: Dark Obsidian (`#0b0f17`), Emerald (`#10b981`), Electric Cyan (`#06b6d4`).
   - Effect: Glassmorphism (`backdrop-filter: blur(12px)`, border semi-transparan).
   - Typography: Font _Plus Jakarta Sans_.

2. **Komponen Halaman Input**:
   - Tab switcher antara **Chat Input** (natural language) dan **Form Input** (tabel manual).
   - Input textarea dengan focus glow effect.
   - Tombol "Analisis Sekarang" dengan loading state.

3. **Komponen Halaman Hasil (4 Grid Core Cards)**:
   - **Sales Analysis Card**: Stat badges Omzet, Total Modal, Untung Bersih.
   - **Cash Flow Insight Card**: Alert box indikator kesehatan keuangan (HEALTHY / WARNING).
   - **Business Recommendation Card**: Actionable bullet list saran bisnis.
   - **Financial Summary Card**: Preview dokumen laporan penjualan rapi + tombol Download PDF/Screenshot.

4. **Widget AI Konsultan Bisnis**:
   - Floating / embedded chat interface di bagian bawah halaman hasil.

5. **Integrasi Mock Data**:
   - Menghubungkan UI dengan mock data penjualan (_Mie Instan Dus_, _Kangkung Segar_, _Sabun Mandi_, _Rokok Filter_) agar UI 100% interaktif dan siap di-demo.

---

### 🧠 FASE 3: Backend AI Engine Development

_Tujuan_: Membangun service AI di FastAPI yang akan menggantikan mock data dari Fase 2.

1. **Setup FastAPI Structure**:
   - Skema Pydantic (`app/api/schemas.py`).
   - Entry point (`app/main.py`) + CORS.

2. **AI Services Implementation**:
   - `services/nlp_parser.py`: Chat teks → JSON data terstruktur via Gemini/Groq LLM.
   - `services/analytics.py`: Kalkulasi omzet, modal, untung bersih, margin %.
   - `services/llm_advisor.py`: Rekomendasi bisnis & generator Ringkasan Keuangan.
   - `services/llm_chat.py`: Conversational AI konsultan bisnis.
   - `services/llm_router.py`: Gemini API ↔ Groq API auto-fallback.

3. **REST API Endpoints**:
   - `POST /api/parse-chat`
   - `POST /api/analyze`
   - `POST /api/summary`
   - `POST /api/chat-consult`

4. **Testing via Swagger UI**:
   - Uji coba seluruh endpoint di `http://localhost:8000/docs`.

---

### 🔄 FASE 4: End-to-End Integration & Final Testing

_Tujuan_: Menyambungkan Frontend UI (Fase 2) dengan Backend AI (Fase 3) dan verifikasi Docker.

- [ ] Ganti _mock data_ di Frontend dengan real API calls ke FastAPI Backend.
- [ ] Lakukan E2E visual testing menggunakan skill `agent-browser` (screenshot QA).
- [ ] Pengujian ulang `docker compose up` dari kondisi fresh clone.
- [ ] Finalisasi `README.md` dan panduan penjalanan aplikasi.

---

## ⚠️ RISK REGISTER — Potensi Masalah & Mitigasi

> Dokumen ini mencatat semua potensi masalah yang teridentifikasi di setiap fase.
> Status: `[ ]` = Belum ditangani | `[~]` = Mitigasi diterapkan di pertengahan | `[x]` = Solved

---

### 🟢 Fase 1 — Problem yang Sudah Solved

| #   | Problem                                         | Root Cause                      | Status                                         |
| --- | ----------------------------------------------- | ------------------------------- | ---------------------------------------------- |
| 1.1 | `ModuleNotFoundError: pydantic_settings` di IDE | Package belum ter-install lokal | [x] Solved — `pip install -r requirements.txt` |
| 1.2 | `docker compose up` gagal (engine not running)  | Docker Desktop belum di-start   | [x] Solved — User buka Docker Desktop          |

---

### 🟡 Fase 2 (Frontend UI) — Risiko Sedang

| #   | Potensi Masalah                                                    | Mitigasi                                                                    | Waktu Solve                    |
| --- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------ |
| 2.1 | **Figma API rate limit** saat fetch banyak node                    | Fetch per-frame, cache hasilnya lokal                                       | Selama Fase 2                  |
| 2.2 | **Glassmorphism `backdrop-filter` performance** berat di GPU lemah | Batasi blur hanya di card utama, hindari nesting blur                       | Selama Fase 2                  |
| 2.3 | **Hot-reload lambat di Docker Windows** (file-watching delay)      | `CHOKIDAR_USEPOLLING=true` sudah dipasang. Fallback: dev lokal tanpa Docker | Selama Fase 2                  |
| 2.4 | **Font FOUT (Flash of Unstyled Text)** Plus Jakarta Sans           | `font-display: swap` + `<link preconnect>` sudah di `index.html`            | [x] Sudah dimitigasi di Fase 1 |
| 2.5 | **Routing SPA** belum ada router                                   | Install `react-router-dom` di awal Fase 2                                   | Awal Fase 2                    |
| 2.6 | **State management** bisa membengkak jika props drilling           | Evaluasi React Context atau zustand di awal Fase 2                          | Awal Fase 2                    |

---

### 🔴 Fase 3 (Backend AI) — Risiko Tinggi

| #   | Potensi Masalah                                            | Mitigasi                                                                    | Waktu Solve   |
| --- | ---------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| 3.1 | **Gemini API rate limit (15 RPM)** → HTTP 429              | Auto-failover ke Groq (`llm_router.py`) + frontend debounce tombol          | Selama Fase 3 |
| 3.2 | **LLM JSON parsing tidak konsisten** (backticks, komentar) | Defensive parsing: strip backticks, regex extraction, `json.loads` fallback | Selama Fase 3 |
| 3.3 | **Prompt bahasa Indonesia ambigu** dari user warung        | Prompt engineering ketat + few-shot examples konteks UMKM                   | Selama Fase 3 |
| 3.4 | **Groq/Llama kurang akurat bahasa Indonesia**              | Groq hanya backup, prompt lebih eksplisit untuk Groq                        | Selama Fase 3 |

---

### 🟡 Fase 4 (Integrasi E2E) — Risiko Sedang

| #   | Potensi Masalah                                              | Mitigasi                                                          | Waktu Solve                     |
| --- | ------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------------- |
| 4.1 | **CORS error saat real API call** menggantikan mock data     | CORS 3 origin sudah dikonfigurasi. Debug via DevTools Network tab | Selama Fase 4                   |
| 4.2 | **Docker build lambat saat fresh clone** (download packages) | Layer caching di Dockerfile sudah optimal                         | Post Fase 4 (jika masih lambat) |
| 4.3 | **Data flow InputPage → ResultPage tidak sinkron**           | State management yang dipilih di Fase 2 harus sudah solid         | Selama Fase 4                   |
