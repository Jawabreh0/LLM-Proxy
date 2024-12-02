import { Providers } from "../types";
import adaptAnthropicMessages from "../utils/inputFormatAdapterUtils/adaptAnthropicMessages";
import adaptOpenAIMessages from "../utils/inputFormatAdapterUtils/adaptOpenAIMessages";

export default class InputFormatAdapter {
  static adaptMessages(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: any,
    provider: Providers
  ): {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adaptedMessages: any;
    systemPrompt?: string;
  } {
    switch (provider) {
      case Providers.OPENAI:
        return {
          adaptedMessages: adaptOpenAIMessages(messages)
        };

      case Providers.ANTHROPIC_BEDROCK:
        return adaptAnthropicMessages(messages);

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
