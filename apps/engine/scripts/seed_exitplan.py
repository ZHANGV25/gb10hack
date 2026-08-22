#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from exitplan.seed import seed


def main() -> None:
    print(json.dumps(seed(), indent=2))


if __name__ == "__main__":
    main()
