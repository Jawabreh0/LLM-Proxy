import {
  BedrockAnthropicContentType,
  BedrockAnthropicMessage,
  Messages,
  OpenAIFunctionMessage,
  OpenAIMessages,
  Providers,
} from "../types";

export class InputFormatAdapter {
  static adaptMessages(
    messages: Messages,
    provider: Providers
  ): {
    adaptedMessages: OpenAIMessages | BedrockAnthropicMessage[];
    systemPrompt?: string;
  } {
    switch (provider) {
      case Providers.OPENAI:
        return {
          adaptedMessages: messages.map((msg) => {
            if (msg.role === "function") {
              return {
                role: msg.role,
                content: msg.content,
                name: (msg as OpenAIFunctionMessage).name,
              };
            }
            return {
              role: msg.role,
              content: msg.content as string,
            };
          }) as OpenAIMessages,
        };

      case Providers.ANTHROPIC_BEDROCK: {
        if (!messages.length) {
          throw new Error("Messages array cannot be empty for Anthropic.");
        }

        // Extract the first message as the system prompt
        const [firstMessage, ...restMessages] = messages;

        if (firstMessage.role !== "system") {
          throw new Error(
            "The first message must have a role of 'system' for Anthropic."
          );
        }

        const systemPrompt = firstMessage.content as string;

        const adaptedMessages = restMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: [
            {
              type: BedrockAnthropicContentType.TEXT,
              text: msg.content as string,
            },
          ],
        })) as BedrockAnthropicMessage[];

        return { adaptedMessages, systemPrompt };
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
