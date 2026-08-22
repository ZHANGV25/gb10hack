from __future__ import annotations

import httpx

from exitplan.config import EMBED_MODEL, OLLAMA_URL


def embed_text(text: str) -> list[float]:
    payload = {"model": EMBED_MODEL, "prompt": text[:4000]}
    with httpx.Client(timeout=120.0) as client:
        r = client.post(f"{OLLAMA_URL}/api/embeddings", json=payload)
        r.raise_for_status()
        vec = r.json().get("embedding")
    if not vec:
        raise RuntimeError("empty embedding")
    return [float(x) for x in vec]
