import {
  LLMResponse,
  Providers,
  BedrockAnthropicContent,
  BedrockAnthropicContentType,
  BedrockAnthropicTextContent,
  BedrockAnthropicToolResultContent,
  BedrockAnthropicToolUseContent,
} from "../types";

export class OutputFormatAdapter {
  private static cachedModel: string | null = null; // Cache the model for streaming responses

  static adaptResponse(response: any, provider: Providers): LLMResponse {
    if (!response) {
      throw new Error("Response object is null or undefined");
    }

    try {
      switch (provider) {
        case Providers.OPENAI:
          return response as LLMResponse;
        case Providers.ANTHROPIC_BEDROCK:
          if (response.type === "message" && !response.delta) {
            return this.adaptCompleteResponse(response);
          } else {
            return this.adaptStreamingResponse(response);
          }
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      throw new Error(`Failed to adapt response: ${(error as Error).message}`);
    }
  }

  private static adaptCompleteResponse(response: any): any {
    const model = this.getModel(response);
    return {
      id: response.id,
      object: "text_completion",
      created: Date.now(),
      model,
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
        prompt_tokens: response.usage?.input_tokens || 0,
        completion_tokens: response.usage?.output_tokens || 0,
        total_tokens:
          (response.usage?.input_tokens || 0) +
          (response.usage?.output_tokens || 0),
        prompt_tokens_details: { cached_tokens: 0 },
        completion_tokens_details: { reasoning_tokens: 0 },
      },
      system_fingerprint: response.system_fingerprint || "default_fingerprint",
    };
  }

  private static adaptStreamingResponse(chunk: any): any {
    const metrics = chunk["amazon-bedrock-invocationMetrics"];
    const isStop =
      chunk.type === "content_block_stop" || chunk.type === "message_stop";

    // Cache model on the first message_start chunk
    if (chunk.type === "message_start" && chunk.message?.model) {
      this.cachedModel = chunk.message.model;
    }

    // Extract content properly
    const content = chunk.content_block?.text || chunk.delta?.text || "";

    // Generate the adapted chunk
    return {
      id: `stream-${Date.now()}`,
      object: "chat.completion.chunk",
      created: Date.now(),
      model: this.cachedModel || "unknown-model", // Use cached model if available
      choices: [
        {
          index: 0,
          delta: isStop
            ? {} // Send an empty delta for stop messages
            : { content }, // Append content progressively
          logprobs: null,
          finish_reason: isStop ? "stop" : null, // Properly use `null` or `"stop"`
        },
      ],
      usage: isStop
        ? {
            prompt_tokens: metrics?.inputTokenCount || 0,
            completion_tokens: metrics?.outputTokenCount || 0,
            total_tokens:
              (metrics?.inputTokenCount || 0) +
              (metrics?.outputTokenCount || 0),
            prompt_tokens_details: { cached_tokens: 0 },
            completion_tokens_details: { reasoning_tokens: 0 },
          }
        : null,
      system_fingerprint: "anthropic_translation",
    };
  }

  private static getModel(response: any): string {
    // Try to retrieve the model from the response
    if (response?.message?.model) {
      return response.message.model;
    }
    if (response?.model) {
      return response.model;
    }
    return "unknown-model";
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
        return "assistant";
    }
  }

  private static extractContent(content: BedrockAnthropicContent): string {
    if (!content || !content.type) {
      throw new Error("Invalid content block structure");
    }

    switch (content.type) {
      case BedrockAnthropicContentType.TEXT:
        return (content as BedrockAnthropicTextContent).text || "";
      case BedrockAnthropicContentType.TOOL_RESULT:
        return (content as BedrockAnthropicToolResultContent).content || "";
      case BedrockAnthropicContentType.TOOL_USE:
        return (content as BedrockAnthropicToolUseContent).id || "";
      default:
        return "";
    }
  }
}
