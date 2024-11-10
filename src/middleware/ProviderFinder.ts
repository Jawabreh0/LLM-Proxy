import {
  BedrockAnthropicSupportedLLMs,
  OpenAISupportedLLMs,
  Providers,
  SupportedLLMs,
} from "../types";

export class ProviderFinder {
  static getProvider(model: SupportedLLMs): Providers {
    if (Object.values(OpenAISupportedLLMs).includes(model)) {
      return Providers.OPENAI;
    } else if (Object.values(BedrockAnthropicSupportedLLMs).includes(model)) {
      return Providers.ANTHROPIC_BEDROCK;
    }
    throw new Error(`Unsupported model: ${model}`);
  }
}
