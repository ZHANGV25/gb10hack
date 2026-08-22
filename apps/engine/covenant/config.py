from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = ROOT / ".env"


def _load_env() -> None:
    """Load .env without overriding the real environment; last value wins.

    Reading the first occurrence of a repeated key once pointed the embedder
    at a 768-dim model while the vector index expected 1024, and retrieval
    silently returned nothing.
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
MONGO_DB = os.environ.get("MONGO_DB", "covenant")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
JUDGE_MODEL = os.environ.get("JUDGE_MODEL", "nemotron-3-nano:30b")
EMBED_MODEL = os.environ.get("EMBED_MODEL", "bge-m3")
SEC_USER_AGENT = os.environ.get(
    "SEC_USER_AGENT",
    "CovenantHackathon/1.0 (local-airgap)",
)
# Must match EMBED_MODEL. bge-m3 is 1024, nomic-embed-text is 768. A
# mismatch here builds a vector index the embeddings cannot be searched in.
_DIMS = {"bge-m3": 1024, "nomic-embed-text": 768}
EMBED_DIM = int(os.environ.get("EMBED_DIM") or _DIMS.get(EMBED_MODEL.split(":")[0], 1024))
CHUNK_CHARS = 1800
CHUNK_OVERLAP = 200
EXTRACT_HEAD_CHARS = 24000
EXTRACT_TAIL_CHARS = 8000
