# 🤝 Panduan Handover & Menjalankan Proyek DagangAI

Dokumen ini berisi panduan ringkas untuk rekan tim/developer baru yang ingin menjalankan proyek **DagangAI** di komputer mereka.

---

## ⚡ Langkah Mudah Menjalankan Aplikasi (3 Langkah)

### Prasyarat di Komputer Teman Anda
1. **Docker Desktop** (Sudah terinstall & berjalan di Windows/Mac/Linux).
2. **Git**.

---

### 1. Clone & Buka Folder Proyek
```bash
git clone <url-repository-github>
cd CompfestWeb
```

### 2. Buat File Environment (`.env`)
Salin template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan masukkan minimal salah satu API Key gratis berikut:
```env
# === LLM API Keys ===
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```
*(Catatan: Gemini API Key gratis bisa didapatkan di https://aistudio.google.com/app/apikey dan Groq di https://console.groq.com/keys).*

### 3. Jalankan Aplikasi dengan Docker Compose
```bash
docker compose up -d --build
```

Setelah perintah di atas selesai, aplikasi **langsung aktif 100%** di:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🛠️ Opsi Alternatif (Menjalankan Tanpa Docker)

Jika teman Anda ingin menjalankan secara lokal tanpa Docker:

### A. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Akses di http://localhost:5173
```

### B. Backend (FastAPI Python)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Akses di http://localhost:8000
```

---

## 🔒 Keamanan API Key
File `.env` sudah masuk dalam `.gitignore` sehingga **API Key rahasia tidak akan pernah bocor ke GitHub**.
