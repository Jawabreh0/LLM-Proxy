// src/middleware/OutputFormatAdapter.ts
import {
  Providers,
  LLMResponse,
  OpenAIResponse,
  BedrockAnthropicResponse,
} from "../types";

export class OutputFormatAdapter {
  static adaptResponse(
    response: OpenAIResponse | BedrockAnthropicResponse,
    provider: Providers
  ): LLMResponse {
    switch (provider) {
      case Providers.OPENAI:
        return {
          id: response.id,
          content: response.choices[0]?.message.content || "",
          model: response.model,
          usage: response.usage,
        };
      case Providers.ANTHROPIC_BEDROCK:
        return {
          id: response.id,
          content: response.messages[0]?.content?.text || "",
          model: response.model,
          usage: {
            prompt_tokens: response.usage?.prompt_tokens,
            completion_tokens: response.usage?.completion_tokens,
            total_tokens: response.usage?.total_tokens,
          },
        };
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
