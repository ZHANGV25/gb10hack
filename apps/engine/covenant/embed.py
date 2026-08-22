from __future__ import annotations

import httpx

from covenant.config import EMBED_MODEL, OLLAMA_URL


def embed_text(text: str) -> list[float]:
    payload = {"model": EMBED_MODEL, "prompt": text[:1500]}
    with httpx.Client(timeout=120.0) as client:
        r = client.post(f"{OLLAMA_URL}/api/embeddings", json=payload)
        r.raise_for_status()
        vec = r.json().get("embedding")
    if not vec:
        raise RuntimeError("empty embedding")
    return [float(x) for x in vec]


def chunk_text(text: str, size: int = 1800, overlap: int = 200) -> list[str]:
    text = " ".join(text.split())
    if not text:
        return []
    chunks: list[str] = []
    i = 0
    while i < len(text):
        chunks.append(text[i : i + size])
        if i + size >= len(text):
            break
        i += size - overlap
    return chunks[:40]
