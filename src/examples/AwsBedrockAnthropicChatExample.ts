import { AwsBedrockAnthropicClient } from "../clients/AwsBedrockAnthropicClient";
import { BedrockAnthropicParsedChunk, Messages, SupportedLLMs } from "../types";

export class AwsBedrockAnthropicChatExample {
  private client: AwsBedrockAnthropicClient;

  constructor() {
    this.client = new AwsBedrockAnthropicClient();
  }

  // Non-streaming function to send a message and get a full response
  async sendMessage(
    messages: Messages,
    model: SupportedLLMs,
    maxTokens?: number,
    temperature?: number,
    systemPrompt?: string,
    tools?: any
  ) {
    const response = await this.client.generateCompletion(
      messages,
      model,
      maxTokens,
      temperature,
      systemPrompt,
      tools
    );
    console.log("Response:", response);
    return response;
  }

  // Streaming function to send a message and get response tokens incrementally
  async *sendMessageStream(
    messages: Messages,
    model: SupportedLLMs,
    maxTokens?: number,
    temperature?: number,
    systemPrompt?: string,
    tools?: any
  ): AsyncGenerator<string, void, unknown> {
    // Call streaming method from AwsBedrockAnthropicClient
    const stream = this.client.generateStreamCompletion(
      messages,
      model,
      maxTokens,
      temperature,
      systemPrompt,
      tools,
      true // Set to true if it's required to enable streaming
    );

    // Yield each token incrementally as it arrives
    for await (const chunk of stream) {
      const content = chunk.delta?.text;
      if (content) {
        yield content;
      }
    }
  }
}
