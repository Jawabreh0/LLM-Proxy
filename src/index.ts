import { Messages, OpenAIResponse, Providers } from "./types";
import OpenAIService from "./services/OpenAIService";
import AwsBedrockAnthropicService from "./services/AwsBedrockAnthropicService";
import ProviderFinder from "./middleware/ProviderFinder";
import InputFormatAdapter from "./middleware/InputFormatAdapter";
import OutputFormatAdapter from "./middleware/OutputFormatAdapter";
import LLM_PROXY_ERROR_MESSAGES from "./constants/errorMessages";

// Define the credentials interface for flexibility
interface Credentials {
  apiKey?: string;
  awsConfig?: { accessKeyId: string; secretAccessKey: string; region: string };
}

// Define the input parameters interface for flexibility
interface GenerateLLMResponseParams {
  messages: Messages;
  model: string;
  functions?: Record<string, unknown>; // Replace 'any' with a more specific type
  max_tokens: number;
  temperature?: number;
  credentials: Credentials;
}

// Utility function to validate credentials
function validateCredentials(
  provider: Providers,
  credentials: Credentials
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

// Factory function to initialize services
function initializeService(
  provider: Providers,
  credentials: Credentials
): OpenAIService | AwsBedrockAnthropicService {
  validateCredentials(provider, credentials);

  if (provider === Providers.OPENAI) {
    return new OpenAIService(credentials.apiKey!);
  }

  if (provider === Providers.ANTHROPIC_BEDROCK) {
    const { accessKeyId, secretAccessKey, region } = credentials.awsConfig!;
    return new AwsBedrockAnthropicService(accessKeyId, secretAccessKey, region);
  }

  throw new Error(LLM_PROXY_ERROR_MESSAGES.UNSUPPORTED_PROVIDER);
}

// Main function for non-streaming requests
export async function generateLLMResponse(
  params: GenerateLLMResponseParams
): Promise<OpenAIResponse> {
  const { messages, model, functions, max_tokens, temperature, credentials } =
    params;

  const provider = ProviderFinder.getProvider(model);
  const service = initializeService(provider, credentials);

  const { adaptedMessages, systemPrompt } = InputFormatAdapter.adaptMessages(
    messages,
    provider
  );

  const response = await service.generateCompletion({
    messages: adaptedMessages,
    model,
    max_tokens,
    temperature: temperature || 0,
    tools: functions,
    systemPrompt,
  });

  return provider === Providers.OPENAI
    ? (response as OpenAIResponse)
    : (OutputFormatAdapter.adaptResponse(response, provider) as OpenAIResponse);
}

// Main function for streaming requests
export async function generateLLMStreamResponse(
  params: GenerateLLMResponseParams
): Promise<AsyncGenerator<OpenAIResponse>> {
  const { messages, model, functions, max_tokens, temperature, credentials } =
    params;

  const provider = ProviderFinder.getProvider(model);
  const service = initializeService(provider, credentials);

  const { adaptedMessages, systemPrompt } = InputFormatAdapter.adaptMessages(
    messages,
    provider
  );

  const stream = service.generateStreamCompletion({
    messages: adaptedMessages,
    model,
    max_tokens,
    temperature: temperature || 0,
    tools: functions,
    systemPrompt,
  });

  async function* streamGenerator(): AsyncGenerator<OpenAIResponse> {
    for await (const chunk of stream) {
      yield provider === Providers.OPENAI
        ? (chunk as OpenAIResponse)
        : (OutputFormatAdapter.adaptResponse(
            chunk,
            provider
          ) as OpenAIResponse);
    }
  }

  return streamGenerator();
}

export * from "./types";
