from __future__ import annotations

import re
from html import unescape
from urllib.parse import quote_plus

import httpx
from bs4 import BeautifulSoup

from covenant.config import SEC_USER_AGENT

SEARCH = "https://efts.sec.gov/LATEST/search-index"
ARCHIVES = "https://www.sec.gov/Archives/edgar/data"


def _headers() -> dict[str, str]:
    return {
        "User-Agent": SEC_USER_AGENT,
        "Accept-Encoding": "gzip, deflate",
    }


def search_exhibits(
    query: str, start: str, end: str, size: int = 80, forms: str | None = None
) -> list[dict]:
    """EDGAR full-text search for EX-10 material contracts.

    Do not pin this to 8-K. Material contracts are filed as exhibits to
    whatever form happens to carry them — 10-K, 10-Q, S-1 — and restricting
    the form returned current-report cover pages instead of agreements.
    """
    params = {
        "q": query,
        "dateRange": "custom",
        "startdt": start,
        "enddt": end,
    }
    if forms:
        params["forms"] = forms
    url = f"{SEARCH}?{ '&'.join(f'{k}={quote_plus(str(v))}' for k,v in params.items()) }"
    with httpx.Client(timeout=60.0, headers=_headers(), follow_redirects=True) as client:
        r = client.get(url)
        r.raise_for_status()
        hits = r.json().get("hits", {}).get("hits", [])
    out = []
    for hit in hits:
        src = hit.get("_source") or {}
        file_type = str(src.get("file_type") or "")
        if not file_type.upper().startswith("EX-10"):
            continue
        _id = str(hit.get("_id") or "")
        if ":" not in _id:
            continue
        adsh, filename = _id.split(":", 1)
        ciks = src.get("ciks") or []
        if not ciks:
            continue
        cik = str(ciks[0]).lstrip("0") or "0"
        adsh_nodash = adsh.replace("-", "")
        out.append(
            {
                "accession": adsh,
                "cik": cik,
                "filename": filename,
                "file_type": file_type,
                "file_description": src.get("file_description"),
                "file_date": src.get("file_date"),
                "issuer": (src.get("display_names") or ["unknown"])[0],
                "form": src.get("form"),
                "url": f"{ARCHIVES}/{cik}/{adsh_nodash}/{filename}",
            }
        )
        if len(out) >= size:
            break
    return out


def fetch_document(url: str) -> str:
    with httpx.Client(timeout=90.0, headers=_headers(), follow_redirects=True) as client:
        r = client.get(url)
        r.raise_for_status()
        raw = r.text
    return html_to_text(raw)


def html_to_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style"]):
        tag.decompose()
    text = soup.get_text("\n")
    text = unescape(text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
