import { BedrockAnthropicParsedChunk, Messages, SupportedLLMs } from "../types";

export interface StreamClientInterface {
  generateStreamCompletion(
    messages: Messages,
    model?: SupportedLLMs,
    maxTokens?: number,
    temperature?: number,
    systemPrompt?: string,
    tools?: any
  ): AsyncGenerator<BedrockAnthropicParsedChunk, void, unknown>;
}
