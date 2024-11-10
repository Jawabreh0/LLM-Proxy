import {
  BedrockAnthropicResponse,
  OpenAIResponse,
  LLMResponse,
  Providers,
  BedrockAnthropicContent,
  BedrockAnthropicContentType,
  BedrockAnthropicTextContent,
  BedrockAnthropicToolResultContent,
  BedrockAnthropicToolUseContent,
} from "../types";

export class OutputFormatAdapter {
  static adaptResponse(response: any, provider: Providers): LLMResponse {
    switch (provider) {
      case Providers.OPENAI:
        return response as OpenAIResponse;

      case Providers.ANTHROPIC_BEDROCK:
        return this.adaptAnthropicBedrockResponse(
          response as BedrockAnthropicResponse
        );

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private static adaptAnthropicBedrockResponse(
    response: BedrockAnthropicResponse
  ): OpenAIResponse {
    const openAIResponse: OpenAIResponse = {
      id: response.id,
      object: "text_completion",
      created: Date.now(),
      model: response.model,
      choices: response.content.map((contentBlock, index) => ({
        index,
        message: {
          role: this.mapRole(contentBlock),
          content: this.extractContent(contentBlock),
        },
        logprobs: null,
        finish_reason: response.stop_reason,
      })),
      usage: {
        prompt_tokens: response.usage.input_tokens,
        completion_tokens: response.usage.output_tokens,
        total_tokens:
          response.usage.input_tokens + response.usage.output_tokens,
        prompt_tokens_details: { cached_tokens: 0 },
        completion_tokens_details: { reasoning_tokens: 0 },
      },
      system_fingerprint: "anthropic_translation",
    };
    return openAIResponse;
  }

  private static mapRole(content: BedrockAnthropicContent): string {
    switch (content.type) {
      case BedrockAnthropicContentType.TOOL_USE:
      case BedrockAnthropicContentType.TOOL_RESULT:
        return "tool";
      case BedrockAnthropicContentType.TEXT:
        return "assistant";
      default:
        return "unknown";
    }
  }

  private static extractContent(content: BedrockAnthropicContent): string {
    switch (content.type) {
      case BedrockAnthropicContentType.TEXT:
        return (content as BedrockAnthropicTextContent).text;
      case BedrockAnthropicContentType.TOOL_RESULT:
        return (content as BedrockAnthropicToolResultContent).content || "";
      case BedrockAnthropicContentType.TOOL_USE:
        return (content as BedrockAnthropicToolUseContent).id || "";
      default:
        return "";
    }
  }
}
