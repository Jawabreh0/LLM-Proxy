// Custom error classes
export class AdapterError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = "AdapterError";
  }
}

export class UnsupportedProviderError extends AdapterError {
  constructor(provider: string) {
    super(`Unsupported provider: ${provider}`);
    this.name = "UnsupportedProviderError";
  }
}

export class ContentExtractionError extends AdapterError {
  constructor(contentType: string, details?: any) {
    super(`Failed to extract content for type: ${contentType}`, details);
    this.name = "ContentExtractionError";
  }
}

export class ResponseValidationError extends AdapterError {
  constructor(message: string, public response?: any) {
    super(message);
    this.name = "ResponseValidationError";
  }
}
import {
  OpenAIResponse,
  LLMResponse,
  Providers,
  BedrockAnthropicContent,
  BedrockAnthropicContentType,
  BedrockAnthropicTextContent,
  BedrockAnthropicToolResultContent,
  BedrockAnthropicToolUseContent,
  BedrockAnthropicParsedChunk,
  BedrockAnthropicContentBlock,
} from "../types";

export class OutputFormatAdapter {
  static adaptResponse(response: any, provider: Providers): LLMResponse {
    if (!response) {
      throw new ResponseValidationError("Response object is null or undefined");
    }

    try {
      switch (provider) {
        case Providers.OPENAI:
          this.validateOpenAIResponse(response);
          return response as OpenAIResponse;

        case Providers.ANTHROPIC_BEDROCK:
          return this.adaptAnthropicBedrockResponse(response as any);

        default:
          throw new UnsupportedProviderError(provider);
      }
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      throw new AdapterError("Failed to adapt response", {
        provider,
        originalError: error,
      });
    }
  }

  private static validateOpenAIResponse(response: any) {
    if (!response.id || !response.choices) {
      throw new ResponseValidationError(
        "Invalid OpenAI response structure",
        response
      );
    }
  }

  private static adaptAnthropicBedrockResponse(
    response: BedrockAnthropicParsedChunk
  ): OpenAIResponse {
    // Handle streaming content blocks
    // 
    if (response.type === "content_block_start" || response.content_block) {
      return {
        id: `stream-${Date.now()}`,
        object: "text_completion",
        created: Date.now(),
        model: "anthropic.claude-3-haiku", // This will be overwritten in complete response
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: response.content_block?.text || "",
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

    // Handle complete message response
    if (response.message) {
      if (
        !response.message?.id ||
        !response.message.model ||
        !response.message.content ||
        !response.message.usage
      ) {
        throw new ResponseValidationError(
          "Invalid Anthropic Bedrock response structure",
          response
        );
      }

      try {
        const openAIResponse: OpenAIResponse = {
          id: response.message.id,
          object: "text_completion",
          created: Date.now(),
          model: response.message.model,
          choices: response.message.content.map((contentBlock, index) => ({
            index,
            message: {
              role: this.mapRole(contentBlock),
              content: this.extractContent(contentBlock),
            },
            logprobs: null,
            finish_reason: response.message?.stop_reason || "",
          })),
          usage: {
            prompt_tokens: response.message.usage.input_tokens,
            completion_tokens: response.message.usage.output_tokens,
            total_tokens:
              response.message.usage.input_tokens +
              response.message.usage.output_tokens,
            prompt_tokens_details: { cached_tokens: 0 },
            completion_tokens_details: { reasoning_tokens: 0 },
          },
          system_fingerprint: "anthropic_translation",
        };
        return openAIResponse;
      } catch (error) {
        throw new AdapterError("Failed to adapt Anthropic response", {
          responseId: response.message.id,
          originalError: error,
        });
      }
    }

    // Handle other message types (delta updates, metrics, etc.)
    if (response.delta) {
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
              content: response.delta.text || "",
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

    // If none of the above conditions match, throw an error
    throw new ResponseValidationError(
      "Invalid Anthropic Bedrock response structure",
      response
    );
  }

  private static mapRole(content: BedrockAnthropicContent): string {
    if (!content || !content.type) {
      throw new ContentExtractionError("Invalid content block structure");
    }

    switch (content.type) {
      case BedrockAnthropicContentType.TOOL_USE:
      case BedrockAnthropicContentType.TOOL_RESULT:
        return "tool";
      case BedrockAnthropicContentType.TEXT:
        return "assistant";
      default:
        throw new ContentExtractionError(
          `Unknown content type: ${content.type}`
        );
    }
  }

  private static extractContent(content: BedrockAnthropicContent): string {
    if (!content || !content.type) {
      throw new ContentExtractionError("Invalid content block structure");
    }

    try {
      switch (content.type) {
        case BedrockAnthropicContentType.TEXT:
          const textContent = content as BedrockAnthropicTextContent;
          if (!textContent.text) {
            throw new ContentExtractionError("Missing text in TEXT content");
          }
          return textContent.text;
        case BedrockAnthropicContentType.TOOL_RESULT:
          return (content as BedrockAnthropicToolResultContent).content || "";
        case BedrockAnthropicContentType.TOOL_USE:
          return (content as BedrockAnthropicToolUseContent).id || "";
        default:
          throw new ContentExtractionError(
            `Unsupported content type: ${content.type}`
          );
      }
    } catch (error) {
      throw new ContentExtractionError(`Failed to extract content`, {
        contentType: content.type,
        originalError: error,
      });
    }
  }
}
