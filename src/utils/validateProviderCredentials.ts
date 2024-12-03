import { Providers, ProviderCredentials } from "../types";
import LLM_PROXY_ERROR_MESSAGES from "../constants/errorMessages";

function validateProviderCredentials(
  provider: Providers,
  credentials: ProviderCredentials
): void {
  if (provider === Providers.OPENAI && !credentials.apiKey) {
    throw new Error(LLM_PROXY_ERROR_MESSAGES.MISSING_API_KEY);
  }

  if (
    provider === Providers.ANTHROPIC_BEDROCK &&
    (!credentials.awsConfig ||
      !credentials.awsConfig.accessKeyId ||
      !credentials.awsConfig.secretAccessKey ||
      !credentials.awsConfig.region)
  ) {
    throw new Error(LLM_PROXY_ERROR_MESSAGES.MISSING_AWS_CREDENTIALS);
  }
}

export default validateProviderCredentials;
