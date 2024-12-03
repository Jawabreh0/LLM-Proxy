import LLM_PROXY_ERROR_MESSAGES from "../constants/errorMessages";
import AwsBedrockAnthropicService from "../services/AwsBedrockAnthropicService";
import OpenAIService from "../services/OpenAIService";
import { ProviderCredentials, Providers } from "../types";
import validateProviderCredentials from "./validateProviderCredentials";

function initializeProviderService(
  provider: Providers,
  credentials: ProviderCredentials
): OpenAIService | AwsBedrockAnthropicService {
  validateProviderCredentials(provider, credentials);

  if (provider === Providers.OPENAI) {
    return new OpenAIService(credentials.apiKey!);
  }

  if (provider === Providers.ANTHROPIC_BEDROCK) {
    const { accessKeyId, secretAccessKey, region } = credentials.awsConfig!;
    return new AwsBedrockAnthropicService(accessKeyId, secretAccessKey, region);
  }

  throw new Error(LLM_PROXY_ERROR_MESSAGES.UNSUPPORTED_PROVIDER);
}

export default initializeProviderService;
