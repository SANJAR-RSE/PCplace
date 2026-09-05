import os

from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
API_URL = os.getenv("API_URL", "http://localhost:4000").rstrip("/")
BOT_INTERNAL_SECRET = os.getenv("BOT_INTERNAL_SECRET", "")
SESSIONS_FILE = os.getenv("SESSIONS_FILE", "sessions.json")

if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN .env faylida ko'rsatilmagan")
if not BOT_INTERNAL_SECRET:
    raise RuntimeError("BOT_INTERNAL_SECRET .env faylida ko'rsatilmagan (backend bilan bir xil bo'lishi kerak)")
