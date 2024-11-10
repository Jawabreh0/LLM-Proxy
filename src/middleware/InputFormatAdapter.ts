import {
  Providers,
  Messages,
  OpenAIMessages,
  BedrockAnthropicMessage,
} from "../types";

export class InputFormatAdapter {
  static adaptRequest(
    messages: Messages,
    provider: Providers
  ): OpenAIMessages | BedrockAnthropicMessage[] {
    switch (provider) {
      case Providers.OPENAI:
        return messages.map((msg) => ({
          role: msg.role, // assuming role mappings are consistent
          content: msg.content,
        }));
      case Providers.ANTHROPIC_BEDROCK:
        return messages.map((msg) => ({
          role: msg.role === "user" ? "USER" : "ASSISTANT", // Map roles to Bedrock's format
          content: { type: "text", text: msg.content },
        }));
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
