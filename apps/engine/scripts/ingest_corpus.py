#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.db import contracts, ensure_indexes
from covenant.ingest import ingest_corpus


def main() -> None:
    ensure_indexes()
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 20
    stored = ingest_corpus(limit=limit)
    n = contracts().count_documents({})
    print(json.dumps({"stored": stored, "count": n}, indent=2))


if __name__ == "__main__":
    main()
