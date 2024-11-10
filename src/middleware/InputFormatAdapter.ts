import {
  BedrockAnthropicContentType,
  BedrockAnthropicMessage,
  BedrockAnthropicMessageRole,
  Messages,
  OpenAIFunctionMessage,
  OpenAIMessages,
  OpenAIMessagesRoles,
  Providers,
} from "../types";

export class InputFormatAdapter {
  static adaptRequest(
    messages: Messages,
    provider: Providers
  ): OpenAIMessages | BedrockAnthropicMessage[] {
    switch (provider) {
      case Providers.OPENAI:
        return messages.map((msg) => {
          if (msg.role === OpenAIMessagesRoles.FUNCTION) {
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
        }) as OpenAIMessages;

      case Providers.ANTHROPIC_BEDROCK:
        return messages.map((msg) => ({
          role:
            msg.role === OpenAIMessagesRoles.USER
              ? BedrockAnthropicMessageRole.USER
              : BedrockAnthropicMessageRole.ASSISTANT,
          content: [
            {
              type: BedrockAnthropicContentType.TEXT,
              text: msg.content as string,
            },
          ],
        })) as BedrockAnthropicMessage[];

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
