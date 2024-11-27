import { BedrockAnthropicParsedChunk, LLMResponse, Messages } from "../types";

// for non streaming responses
export interface ClientService {
  generateCompletion(
    messages: Messages,
    model?: string,
    max_tokens?: number,
    temperature?: number,
    systemPrompt?: string
  ): Promise<LLMResponse>;

  // For streaming responses
  generateStreamCompletion(
    messages: Messages,
    model?: string,
    max_tokens?: number,
    temperature?: number,
    systemPrompt?: string
  ): AsyncGenerator<BedrockAnthropicParsedChunk, void, unknown>;
}
