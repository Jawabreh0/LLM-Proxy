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
    //
    /**!SECTION
     * There some strange stuff happened, in a function call assistant message the
     * will be by default null, it must be null, but the openai api was returning error
     * and it cannot be null of fine, but using same api version, from different app (CMND)
     *  it works well !!!!!!!! it works with null content on the same version,
     *  im not convinced with this work to make it empty string instead of null so here is a todo to go back to it
     */

    switch (provider) {
      case Providers.OPENAI:
        return {
          adaptedMessages: messages.map((msg) => {
            if (msg.role === "function") {
              return {
                role: msg.role,
                content: msg.content ?? "",
                name: (msg as OpenAIFunctionMessage).name,
              };
            }
            return {
              role: msg.role,
              content: msg.content ?? "",
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

        const systemPrompt = firstMessage.content ?? "";

        const adaptedMessages = restMessages.map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: [
            {
              type: BedrockAnthropicContentType.TEXT,
              text: msg.content ?? "",
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
