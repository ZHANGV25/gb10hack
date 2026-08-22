#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from covenant.db import ensure_indexes, client


def main() -> None:
    client().admin.command("ping")
    ensure_indexes()
    print("indexes ready")


if __name__ == "__main__":
    main()
