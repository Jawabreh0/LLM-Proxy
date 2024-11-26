import {
  LLMResponse,
  Providers,
  BedrockAnthropicContent,
  BedrockAnthropicContentType,
  BedrockAnthropicTextContent,
  BedrockAnthropicToolResultContent,
  BedrockAnthropicToolUseContent,
  BedrockAnthropicParsedChunk,
  BedrockAnthropicResponse,
} from "../types";

export class OutputFormatAdapter {
  static adaptResponse(response: any, provider: Providers): LLMResponse {
    if (!response) {
      throw new Error("Response object is null or undefined");
    }

    try {
      switch (provider) {
        case Providers.OPENAI:
          return response as any;
        case Providers.ANTHROPIC_BEDROCK:
          // Check if it's a streaming chunk or complete response
          if (response.type === "message" && !response.delta) {
            return this.adaptCompleteResponse(response);
          } else {
            return this.adaptStreamingResponse(response);
          }
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      throw new Error(`Failed to adapt response: ${(error as any).message}`);
    }
  }

  private static adaptCompleteResponse(
    response: BedrockAnthropicResponse
  ): any {
    return {
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
        finish_reason: response.stop_reason || null,
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
  }

  private static adaptStreamingResponse(
    chunk: BedrockAnthropicParsedChunk
  ): any {
    // Handle stop messages
    if (chunk.type === "content_block_stop" || chunk.type === "message_stop") {
      const metrics = chunk["amazon-bedrock-invocationMetrics"];
      return {
        id: `stream-${Date.now()}`,
        object: "text_completion",
        created: Date.now(),
        model: "anthropic.claude-3-haiku",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "",
            },
            logprobs: null,
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: metrics?.inputTokenCount || 0,
          completion_tokens: metrics?.outputTokenCount || 0,
          total_tokens:
            (metrics?.inputTokenCount || 0) + (metrics?.outputTokenCount || 0),
          prompt_tokens_details: { cached_tokens: 0 },
          completion_tokens_details: { reasoning_tokens: 0 },
        },
        system_fingerprint: "anthropic_translation",
      };
    }

    // Handle content blocks or deltas
    const content = chunk.content_block?.text || chunk.delta?.text || "";

    return {
      id: `stream-${Date.now()}`,
      object: "text_completion",
      created: Date.now(),
      model: "anthropic.claude-3-haiku",
      choices: [
        {
          index: 0,
          delta: {
            role: "assistant",
            content,
          },
          logprobs: null,
          finish_reason: "null",
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        prompt_tokens_details: { cached_tokens: 0 },
        completion_tokens_details: { reasoning_tokens: 0 },
      },
      system_fingerprint: "anthropic_translation",
    };
  }

  private static mapRole(content: BedrockAnthropicContent): string {
    if (!content || !content.type) {
      throw new Error("Invalid content block structure");
    }

    switch (content.type) {
      case BedrockAnthropicContentType.TOOL_USE:
      case BedrockAnthropicContentType.TOOL_RESULT:
        return "tool";
      case BedrockAnthropicContentType.TEXT:
        return "assistant";
      default:
        return "assistant"; // Default to assistant for unknown types
    }
  }

  private static extractContent(content: BedrockAnthropicContent): string {
    if (!content || !content.type) {
      throw new Error("Invalid content block structure");
    }

    switch (content.type) {
      case BedrockAnthropicContentType.TEXT:
        const textContent = content as BedrockAnthropicTextContent;
        return textContent.text || "";
      case BedrockAnthropicContentType.TOOL_RESULT:
        return (content as BedrockAnthropicToolResultContent).content || "";
      case BedrockAnthropicContentType.TOOL_USE:
        return (content as BedrockAnthropicToolUseContent).id || "";
      default:
        return "";
    }
  }
}
