from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = ROOT / ".env"


def _load_env() -> None:
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


_load_env()

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://127.0.0.1:27018/?directConnection=true")
MONGO_DB = os.environ.get("MONGO_DB", "covenant")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
JUDGE_MODEL = os.environ.get("JUDGE_MODEL", "nemotron-3-nano:30b")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "nomic-embed-text")
SEC_USER_AGENT = os.environ.get(
    "SEC_USER_AGENT",
    "CovenantHackathon/1.0 (local-airgap)",
)
EMBED_DIM = 768
CHUNK_CHARS = 1800
CHUNK_OVERLAP = 200
EXTRACT_HEAD_CHARS = 24000
EXTRACT_TAIL_CHARS = 8000
