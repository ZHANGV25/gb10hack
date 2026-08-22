# GB10 On-Site Runbook — Dell x NVIDIA Hackathon (Aug 22, 2026)

USB layout: `models/` (weights), `llamacpp/` (arm64 binaries + source), `recipes/` (this file).

## ⚡ FIRST MOVES ON THE BOX (no container tar on this drive — Docker corrupted during prep; use these in order)
1. **Check what's preinstalled** (the event mandates NemoClaw, so boxes are likely pre-imaged): `docker images` and `ls /opt` — if an sglang/vllm/NIM image is there, use it with the Option A/B commands below.
2. **pip route** (needs only ~300MB of wifi, do it FIRST THING at 10:00 before 40 teams saturate the network): `pip install "sglang[all]"` (or `uv pip install`), then run the Option A serve command WITHOUT docker (bare `sglang serve ...`).
3. **llama.cpp offline route (zero network, guaranteed)**: `llamacpp/` has ubuntu-arm64 (CPU) and ubuntu-vulkan-arm64 (GPU via Vulkan — works on NVIDIA) prebuilts, plus source. Best perf: build CUDA in ~10 min: `tar xf llama-cpp-source-b10581.tar.gz && cd llama.cpp-b10581 && cmake -B build -DGGML_CUDA=ON && cmake --build build -j --target llama-server`, then Option C below with `build/bin/llama-server`.
4. Ask organizers/neighbor teams for a local image copy — everyone got the same wifi warning; organizers often carry a USB registry.

NOTE: the NVFP4 checkpoints (Qwen + Mistral) need sglang/vllm/TRT. If only llama.cpp is available, use the GGUF (Option C) — Q6_K quality is fine for the demo.
Box: Dell Pro Max GB10 — 128GB unified (CUDA sees ~121.7GiB), 273GB/s bandwidth, arm64 (Grace), Blackwell sm_121a.

## Step 0 — Load containers from USB (no venue wifi needed)
```bash
docker load -i /path/to/usb/containers/sglang-latest-cu130-arm64.tar
docker load -i /path/to/usb/containers/llamacpp-server-cuda-arm64.tar   # if present
```
Copy models to the box's NVMe first (`cp -r /path/to/usb/models ~/models`) — serving from USB will bottleneck load times.

## Option A — Qwen3.8-27B NVFP4 + DSpark (34–38 tok/s, proven recipe)
```bash
docker run -d --name qwen38 --gpus all --network host \
  -v $HOME/models:/models lmsysorg/sglang:latest-cu130 \
  sglang serve \
    --trust-remote-code \
    --model-path /models/Qwen3.8-27B-NVFP4 \
    --tp-size 1 \
    --speculative-algorithm DSPARK \
    --speculative-draft-model-path /models/Qwen3.8-27B-DSpark \
    --speculative-dspark-block-size 7 \
    --speculative-draft-model-quantization unquant \
    --mamba-scheduler-strategy extra_buffer \
    --attention-backend fa3
```
- OpenAI-compatible API on :30000 by default. Point OpenClaw's model endpoint at it.
- Qwen3.8-27B is VISION-capable (native VLM) — images in, text out.
- Dense 27B: leaves ~100GB unified memory free for RAG/other services.

## Option B — Mistral Small 4 119B A6B NVFP4 (~24–27 tok/s single, 73ms TTFT, smarter)
```bash
docker run -d --name mistral119 --gpus all --network host \
  -v $HOME/models:/models lmsysorg/sglang:latest-cu130 \
  sglang serve \
    --model-path /models/Mistral-Small-4-119B-2603-NVFP4 \
    --tp-size 1
```
- Weights 65.8GB + ~19.5GB KV → ~28GB free after load. Do NOT co-run other big services.
- Also multimodal (Pixtral-based). Scales to ~79 tok/s aggregate at concurrency 16.
- MUST be a CUDA-13 Blackwell-fixed build (latest-cu130 nightly has the sm_121a fix; the old stable `mistral-small-4` tag CRASHES with a ptxas error on GB10).

## Option C — llama.cpp GGUF fallback (5-minute path, works anywhere)
```bash
docker run -d --name qwen38-llamacpp --gpus all -p 8091:8091 \
  -v $HOME/models/Qwen3.8-27B-GGUF:/models \
  --entrypoint /app/llama-server \
  ghcr.io/ggml-org/llama.cpp:server-cuda \
  -m /models/Qwen3.8-27B-UD-Q6_K.gguf \
  --mmproj /models/mmproj-BF16.gguf \
  --port 8091 --host 0.0.0.0 -ngl 99 -c 32768 -fa on
```
- ~10–12 tok/s decode (dense, bandwidth-bound) but ~838 t/s prefill. Fine as emergency fallback.

## Embeddings (RAG)
`models/bge-m3` — serve via sglang (`--model-path /models/bge-m3 --is-embedding`) or sentence-transformers.

## ⚠️ LANDMINES (all reproduced by the community on this exact hardware)
1. **NEVER enable MTP on vLLM** — hard-reboots the whole Spark at 16K ctx + 2 concurrent requests (full machine reset, no panic trace).
2. **Silent-garbage risk**: old pinned SGLang dev images load Qwen3.8 fine, pass health checks, and output token soup. Coherence-test EVERY server before benchmarking/demoing ("write one sentence about hotels").
3. **Unified memory fights**: a forgotten container holds its GBs invisibly. `docker ps` + `docker stop` before every big launch. vLLM fails with "Free memory 74/121 GiB" errors when something else is resident.
4. **Edge gestures**: run `docker ps` first, always.
5. llama.cpp `-hf` downloads go to `/root/.cache/huggingface` — but we mount local weights, so N/A unless improvising.
6. If SGLang serve flags error (version drift), drop the speculative flags first — plain `--model-path` serving always works, just slower.

## Demo perf talking points
- 73ms TTFT on a 119B-class model, fully local, $0/token, zero data egress.
- Dense-vs-MoE bandwidth math: 273GB/s ÷ active-param-bytes = decode ceiling.
