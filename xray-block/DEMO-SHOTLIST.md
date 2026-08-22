# X-ray Demo Shot List (pre-tested on the box, all via live :8801 service)

Films in `~/snehit/xray-block/demo-set/` on the box. All latencies warm.

| Order | Film | Expected output | Point being made |
|---|---|---|---|
| 1 | `test-cxr.png` (normal) | Clean read, red_flags [], escalate false, high conf, ~3s | Baseline: instant offline radiology assist |
| 2 | `pulmonary_tuberculosis_chest_x-ray.jpg` | "Suggestive of pneumonia" → feeds retrieval agent → guideline-grounded plan | Findings + THIS patient's history + WHO/MSF guidance |
| 3 | `gunshot_bullet_chest_x-ray.jpg` | "Foreign body" → red_flags ['foreign body'] → **escalate TRUE** | 🚨 Hard-coded rules overrule the model. ESCALATE banner. War-zone-relevant film. |
| 4 | (Q&A only) `pneumothorax_chest_x-ray.jpg` | Model MISSES the subtle ptx | Honesty answer: "4B misses things — that's why abstention + clinician sign-off + rules exist; Mistral 119B on this box is the recall upgrade path" |

After scene 3: `tail audit.jsonl` on screen — every decision logged with rationale (the NemoClaw/Mongo audit story).

DO NOT live-demo film 4 as a success case. It is the limitations answer, not a scene.
