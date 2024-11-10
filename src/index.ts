import { ProviderFinder } from "./middleware/ProviderFinder";
import { InputFormatAdapter } from "./middleware/InputFormatAdapter";
import { OutputFormatAdapter } from "./middleware/OutputFormatAdapter";
import { AwsBedrockAnthropicService } from "./services/AwsBedrockAnthropicService";
import { OpenAIService } from "./services/OpenAIService";
import {
  Messages,
  SupportedLLMs,
  LLMResponse,
  Providers,
  OpenAIMessages,
  BedrockAnthropicMessages,
} from "./types";

// Define the credentials interface for flexibility
interface Credentials {
  apiKey?: string;
  awsConfig?: { accessKeyId: string; secretAccessKey: string; region: string };
}

// Main function to handle both streaming and non-streaming requests
export async function generateLLMResponse(
  messages: Messages,
  model: SupportedLLMs,
  maxTokens: number,
  temperature: number,
  systemPrompt: string,
  tools: any,
  stream: boolean = false,
  credentials: Credentials
): Promise<LLMResponse | AsyncGenerator<LLMResponse>> {
  // Step 2: Identify the provider based on the model
  const provider = ProviderFinder.getProvider(model);

  // Initialize the correct service based on the provider
  let service: OpenAIService | AwsBedrockAnthropicService;
  if (provider === Providers.OPENAI) {
    if (!credentials.apiKey) {
      throw new Error("OpenAI API key is required for OpenAI models.");
    }
    service = new OpenAIService(credentials.apiKey);
  } else if (provider === Providers.ANTHROPIC_BEDROCK) {
    const awsConfig = credentials.awsConfig;
    if (!awsConfig) {
      throw new Error("AWS credentials are required for Bedrock models.");
    }
    service = new AwsBedrockAnthropicService(
      awsConfig.accessKeyId,
      awsConfig.secretAccessKey,
      awsConfig.region
    );
  } else {
    throw new Error("Unsupported provider");
  }

  // Step 3: If the provider is not OpenAI, adapt the input to provider format
  const adaptedMessages =
    provider !== Providers.OPENAI
      ? InputFormatAdapter.adaptMessages(messages, provider)
      : messages;

  // Step 4: Process the response depending on whether streaming is requested
  if (stream) {
    return handleStreamResponse(
      service,
      adaptedMessages,
      model,
      maxTokens,
      temperature,
      systemPrompt,
      tools,
      provider
    );
  } else {
    return handleNonStreamResponse(
      service,
      adaptedMessages,
      model,
      maxTokens,
      temperature,
      systemPrompt,
      tools,
      provider
    );
  }
}

// Helper for non-streaming response
async function handleNonStreamResponse(
  service: OpenAIService | AwsBedrockAnthropicService,
  messages: Messages,
  model: SupportedLLMs,
  maxTokens: number,
  temperature: number,
  systemPrompt: string,
  tools: any,
  provider: Providers
): Promise<LLMResponse> {
  const response = await service.generateCompletion(
    provider === Providers.OPENAI
      ? (messages as OpenAIMessages)
      : (messages as BedrockAnthropicMessages as any),
    model,
    maxTokens,
    temperature,
    systemPrompt,
    tools
  );

  // Step 6: Adapt the response if provider is not OpenAI
  return provider === Providers.OPENAI
    ? response
    : OutputFormatAdapter.adaptResponse(response, provider);
}

// Helper for streaming response
async function* handleStreamResponse(
  service: OpenAIService | AwsBedrockAnthropicService,
  messages: Messages,
  model: SupportedLLMs,
  maxTokens: number,
  temperature: number,
  systemPrompt: string,
  tools: any,
  provider: Providers
): AsyncGenerator<LLMResponse> {
  const stream = service.generateStreamCompletion(
    provider === Providers.OPENAI
      ? (messages as OpenAIMessages)
      : (messages as BedrockAnthropicMessages as any),
    model,
    maxTokens,
    temperature,
    systemPrompt,
    tools,
    true
  );

  // Step 7: Yield adapted chunks if the provider is not OpenAI
  for await (const chunk of stream) {
    yield provider === Providers.OPENAI
      ? chunk
      : OutputFormatAdapter.adaptResponse(chunk, provider);
  }
}
