import {
  BedrockAnthropicSupportedLLMs,
  OpenAISupportedLLMs,
  Providers,
  SupportedLLMs,
} from "../types";

export class ProviderFinder {
  static getProvider(model: SupportedLLMs): Providers {
    if (
      model.type === "OpenAI" &&
      Object.values(OpenAISupportedLLMs).includes(model.model)
    ) {
      return Providers.OPENAI;
    } else if (
      model.type === "BedrockAnthropic" &&
      Object.values(BedrockAnthropicSupportedLLMs).includes(model.model)
    ) {
      return Providers.ANTHROPIC_BEDROCK;
    }
    throw new Error(`Unsupported model: ${model.model}`);
  }
}
