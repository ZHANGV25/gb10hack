#!/usr/bin/env python3
"""FieldMedic X-ray block — MedGemma via Ollama, wrapped in deterministic safety rails.

Zero external dependencies (stdlib only). Serves the contract in PROJECT-CONTEXT.md:

  POST /xray   {"image_b64": ..., "question": ..., "patient_context": ...}
  GET  /health

Safety design: the model NEVER decides escalation alone. A hard-coded rule layer
scans findings for red-flag conditions (negation-aware) and forces escalate=true;
abstention/poor-quality markers also force escalation. Every call is appended to
audit.jsonl (orchestrator mirrors it into MongoDB audit_log).
"""
import json, re, time, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

OLLAMA = "http://localhost:11434/api/generate"
MODEL = "medgemma1.5:4b"
PORT = 8801
AUDIT = "audit.jsonl"

DISCLAIMER = ("Clinical decision support only - NOT a diagnosis. "
              "A qualified clinician must review before any treatment decision.")

# Hard-coded red flags: (label, pattern). If mentioned WITHOUT negation -> escalate.
RED_FLAGS = [
    ("pneumothorax",        r"pneumothorax"),
    ("tension physiology",  r"tension"),
    ("large effusion",      r"(large|massive|extensive)\s+(pleural\s+)?effusion"),
    ("free air",            r"free\s+(intraperitoneal\s+)?air|pneumoperitoneum"),
    ("widened mediastinum", r"widen(ed)?\s+mediastinum"),
    ("large consolidation", r"(extensive|multilobar|bilateral)\s+consolidat"),
    ("foreign body",        r"foreign\s+body|bullet|shrapnel|projectile"),
    ("fracture",            r"fracture"),
    ("cardiomegaly (marked)", r"(marked|severe)\s+cardiomegaly"),
]
NEGATION = r"(no|without|free of|free from|absence of|negative for|not?\s+\w*\s*evidence of|rul(e|ed|ing)\s+out|rather than|unlikely|less likely|not suggestive of)"
ABSTAIN = r"(cannot (assess|determine|exclude)|unclear|non.?diagnostic|poor (image )?quality|inadequate|uninterpretable|not (well )?visuali[sz]ed)"


def negated(text, m):
    """True if the match is negated within its clause (window before the hit)."""
    start = max(0, m.start() - 60)
    window = text[start:m.start()]
    window = re.split(r"[.;:]", window)[-1]  # stay within the clause
    return re.search(NEGATION + r"\s*$|" + NEGATION + r"\b[^.;:]*$", window, re.I) is not None


def scan_red_flags(text):
    hits = []
    low = text.lower()
    for label, pat in RED_FLAGS:
        for m in re.finditer(pat, low, re.I):
            if not negated(low, m):
                hits.append(label)
                break
    return hits


def ask_medgemma(image_b64, question, patient_context):
    prompt = (
        "You are a radiology assistant at a field hospital in a low-resource setting. "
        "A clinician asks about this X-ray.\n"
        + (f"Patient context: {patient_context}\n" if patient_context else "")
        + f"Clinical question: {question or 'General read of this X-ray.'}\n\n"
        "Respond in PLAIN TEXT only - no markdown, no asterisks, no echoing these instructions. "
        "Use exactly these four labeled sections, each starting on its own line:\n"
        "QUALITY:\nFINDINGS:\nIMPRESSION:\nCONFIDENCE:\n"
        "CONFIDENCE must be a single word: low, medium, or high. "
        "If the image is not an X-ray or is unreadable, say so under QUALITY and use CONFIDENCE: low."
    )
    body = json.dumps({
        "model": MODEL, "stream": False, "prompt": prompt,
        "images": [image_b64], "keep_alive": "120m",
        "options": {"temperature": 0.1},
    }).encode()
    req = urllib.request.Request(OLLAMA, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.loads(r.read())["response"]


PANEL = [
    "pneumonia or consolidation", "pleural effusion", "pneumothorax",
    "cardiomegaly", "tuberculosis pattern (upper-lobe patchy or cavitary opacities)",
    "rib fracture", "foreign body (bullet, shrapnel, metallic object)",
    "pulmonary edema",
]
PANEL_ESCALATE = {"pneumothorax", "rib fracture",
                  "foreign body (bullet, shrapnel, metallic object)"}


# Terms that indicate each panel condition in a free-text read.
PANEL_TERMS = {
    "pneumonia or consolidation": r"pneumonia|consolidat|patchy opacit|infiltrat|airspace opacit",
    "pleural effusion": r"(pleural\s+)?effusion",
    "pneumothorax": r"pneumothorax",
    "cardiomegaly": r"cardiomegaly|enlarged (cardiac|heart)|increased cardiothoracic",
    "tuberculosis pattern (upper-lobe patchy or cavitary opacities)": r"tubercul|cavitary|cavitation|upper.lobe (patchy|fibro)",
    "rib fracture": r"(rib\s+)?fracture",
    "foreign body (bullet, shrapnel, metallic object)": r"foreign\s+body|bullet|shrapnel|metallic|radiopaque object|projectile",
    "pulmonary edema": r"(pulmonary\s+)?edema|vascular congestion|kerley",
}


def ask_panel(image_b64, patient_context):
    """Findings panel derived from the (stronger) free-text read: the model describes,
    deterministic matching classifies. One model call; negation-aware; auditable."""
    raw = ask_medgemma(image_b64, "General read. Mention pertinent negatives.", patient_context)
    low = raw.lower()
    results = {}
    for cond in PANEL:
        pat = PANEL_TERMS[cond]
        verdict = "ABSENT"  # radiology convention: unmentioned = pertinent negative
        for m in re.finditer(pat, low, re.I):
            if negated(low, m):
                verdict = "ABSENT"
                break
            verdict = "PRESENT"
            break
        if verdict == "PRESENT" and re.search(ABSTAIN, low, re.I):
            verdict = "UNCERTAIN" if "possibl" in low or "difficult" in low else verdict
        results[cond] = verdict
    return results, raw


def parse_sections(text):
    out = {}
    for key in ("QUALITY", "FINDINGS", "IMPRESSION", "CONFIDENCE"):
        m = re.search(r"\*{0,2}" + key + r"\*{0,2}\s*:\s*(.+?)(?=\n\s*\*{0,2}[A-Z]{5,}\*{0,2}\s*:|\Z)",
                      text, re.S)
        val = re.sub(r"^[\s*]+|[\s*]+$", "", m.group(1)) if m else ""
        out[key.lower()] = val
    cm = re.search(r"\b(low|medium|high)\b", out["confidence"], re.I)
    out["confidence"] = cm.group(1).lower() if cm else "low"
    return out


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):  # quiet
        pass

    def _send(self, code, obj):
        data = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path == "/health":
            self._send(200, {"ok": True, "model": MODEL})
        else:
            self._send(404, {"error": "not found"})

    def do_POST(self):
        if self.path == "/panel":
            t0 = time.time()
            try:
                length = int(self.headers.get("Content-Length", 0))
                req = json.loads(self.rfile.read(length))
                results, raw = ask_panel(req["image_b64"], req.get("patient_context", ""))
                present = [c for c, v in results.items() if v == "PRESENT"]
                uncertain = [c for c, v in results.items() if v == "UNCERTAIN"]
                escalate = bool((set(present) | set(uncertain)) & PANEL_ESCALATE) or len(uncertain) >= 4
                resp = {"panel": results, "present": present, "uncertain": uncertain,
                        "escalate": escalate, "disclaimer": DISCLAIMER, "model": MODEL,
                        "latency_ms": int((time.time() - t0) * 1000)}
                with open(AUDIT, "a") as f:
                    f.write(json.dumps({"ts": time.time(), "endpoint": "panel",
                                        "present": present, "escalate": escalate,
                                        "latency_ms": resp["latency_ms"]}) + "\n")
                return self._send(200, resp)
            except Exception as e:
                return self._send(500, {"error": str(e), "escalate": True,
                                        "disclaimer": DISCLAIMER})
        if self.path != "/xray":
            return self._send(404, {"error": "not found"})
        t0 = time.time()
        try:
            length = int(self.headers.get("Content-Length", 0))
            req = json.loads(self.rfile.read(length))
            raw = ask_medgemma(req["image_b64"], req.get("question", ""),
                               req.get("patient_context", ""))
            sec = parse_sections(raw)
            flags = scan_red_flags(raw)
            abstained = bool(re.search(ABSTAIN, raw, re.I)) or sec["confidence"].lower().startswith("low")
            resp = {
                "findings": sec["findings"] or raw,
                "impression": sec["impression"],
                "quality": sec["quality"],
                "red_flags": flags,
                "escalate": bool(flags) or abstained,   # rules override the model, always
                "confidence": (sec["confidence"].split() or ["low"])[0].lower(),
                "disclaimer": DISCLAIMER,
                "model": MODEL,
                "latency_ms": int((time.time() - t0) * 1000),
            }
            with open(AUDIT, "a") as f:
                f.write(json.dumps({"ts": time.time(), "question": req.get("question", ""),
                                    "red_flags": flags, "escalate": resp["escalate"],
                                    "impression": sec["impression"][:200],
                                    "latency_ms": resp["latency_ms"]}) + "\n")
            self._send(200, resp)
        except Exception as e:
            self._send(500, {"error": str(e), "escalate": True,
                             "disclaimer": DISCLAIMER})


if __name__ == "__main__":
    print(f"FieldMedic X-ray block on :{PORT} (model={MODEL})")
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
