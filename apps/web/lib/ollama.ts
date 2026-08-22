import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434/v1",
  apiKey: "ollama",
});

export const judgeModel = process.env.OLLAMA_MODEL ?? "nemotron-3-nano:30b";
