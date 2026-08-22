from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = ROOT / ".env"


def _load_env() -> None:
    """Load .env without overriding the real environment.

    A repeated key takes its last value, the way dotenv does. Reading the
    first one silently pointed the seeder at a 768-dim embedding model while
    the vector index expected 1024, and retrieval returned nothing.
    """
    if not ENV_FILE.exists():
        return
    values: dict[str, str] = {}
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        values[key.strip()] = value.strip()
    for key, value in values.items():
        os.environ.setdefault(key, value)


_load_env()

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27018/?directConnection=true")
MONGO_DB = os.environ.get("EXITPLAN_DB", "exitplan")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
JUDGE_MODEL = os.environ.get("JUDGE_MODEL", "nemotron-3-nano:30b")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "bge-m3")
EMBED_DIM = 1024
