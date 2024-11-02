// ClientInterface.ts
import { OpenAIMessages, OpenAISupportedLLMs } from "../types";

export interface ClientInterface {
  generateText(
    messages: OpenAIMessages, // TODO: when we add more providers we need to update this
    model?: OpenAISupportedLLMs, // TODO: when we add more providers we need to update this
    maxTokens?: number,
    temperature?: number
  ): Promise<string>;
}
