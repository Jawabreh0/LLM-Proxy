import { AwsBedrockAnthropicClient } from "../clients/AwsBedrockAnthropicClient";
import { BedrockAnthropicParsedChunk, Messages, SupportedLLMs } from "../types";

export class AwsBedrockAnthropicChatExample {
  private client: AwsBedrockAnthropicClient;

  constructor() {
    this.client = new AwsBedrockAnthropicClient();
  }

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

  async *sendMessageStream(
    messages: Messages,
    model: SupportedLLMs,
    maxTokens?: number,
    temperature?: number,
    systemPrompt?: string,
    tools?: any
  ): AsyncGenerator<string, void, unknown> {
    const stream = this.client.generateStreamCompletion(
      messages,
      model,
      maxTokens,
      temperature,
      systemPrompt,
      tools,
      true
    );

    for await (const chunk of stream) {
      const content = chunk.delta?.text;
      if (content) {
        yield content;
      }
    }
  }
}
