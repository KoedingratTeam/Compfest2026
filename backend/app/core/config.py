import os
from pathlib import Path
from pydantic_settings import BaseSettings

# Project root directory: CompfestWeb
CORE_DIR = Path(__file__).resolve().parent  # app/core
APP_DIR = CORE_DIR.parent                   # app
BACKEND_DIR = APP_DIR.parent               # backend
ROOT_DIR = BACKEND_DIR.parent              # CompfestWeb (Project Root)

ENV_PATHS = [
    ROOT_DIR / ".env",
    BACKEND_DIR / ".env",
    Path(".env"),
]


class Settings(BaseSettings):
    app_name: str = "DagangAI API"
    environment: str = "development"
    debug: bool = True

    gemini_api_key: str = ""
    groq_api_key: str = ""

    model_config = {
        "env_file": [str(p) for p in ENV_PATHS],
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }

    def get_gemini_key(self) -> str:
        key = self.gemini_api_key or os.getenv("GEMINI_API_KEY", "")
        return "".join(c for c in key if c.isprintable() and not c.isspace()).strip("'\"")

    def get_groq_key(self) -> str:
        key = self.groq_api_key or os.getenv("GROQ_API_KEY", "")
        return "".join(c for c in key if c.isprintable() and not c.isspace()).strip("'\"")


settings = Settings()
