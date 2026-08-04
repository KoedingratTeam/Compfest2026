import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dagangai-backend")

app = FastAPI(
    title=settings.app_name,
    description="Asisten Cerdas untuk Pedagang Kecil Indonesia — Backend AI Engine",
    version="0.1.0",
)

# Global CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev and docker containers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Middleware to prevent 500 crashes
@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        logger.error(f"Unhandled Exception on {request.url.path}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Terjadi kesalahan internal pada server. Silakan coba lagi."},
        )

app.include_router(router, prefix="/api")
