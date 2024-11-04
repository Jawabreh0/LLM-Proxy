import { Stream } from "stream";
import { LLMResponse, Messages, SupportedLLMs } from "../types";

export interface ClientInterface {
  generateCompletion(
    messages: Messages,
    model?: SupportedLLMs,
    maxTokens?: number,
    temperature?: number,
    systemPrompt?: string,
    tools?: any
  ): Promise<LLMResponse>;
}
