import { OpenAIClient } from "../clients/OpenaiClient";
import {
  OpenAIMessage,
  OpenAIMessagesRoles,
  OpenAIResponse,
  OpenAISupportedLLMs,
} from "../types";

export class OpenAIChatExample {
  private client: OpenAIClient;
  private messages: OpenAIMessage[] = [];

  constructor(apiKey: string, systemPrompt: string) {
    this.client = new OpenAIClient(apiKey);
    this.messages.push({
      role: OpenAIMessagesRoles.SYSTEM,
      content: systemPrompt,
    });
  }

  // Non-streaming function to send a message and get a full response
  async sendMessage(
    userInput: string,
    model: OpenAISupportedLLMs,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    // Add user input to conversation history
    this.messages.push({ role: OpenAIMessagesRoles.USER, content: userInput });

    // Call non-streaming method from OpenAIClient
    const response: OpenAIResponse = await this.client.generateCompletion(
      this.messages,
      model,
      maxTokens,
      temperature
    );

    // Extract and store assistant's response
    const responseContent: string = response.choices[0].message.content;
    this.messages.push({
      role: OpenAIMessagesRoles.ASSISTANT,
      content: responseContent,
    });

    return responseContent;
  }

  // Streaming function to send a message and get response tokens incrementally
  async *sendMessageStream(
    userInput: string,
    model: OpenAISupportedLLMs,
    maxTokens: number,
    temperature: number
  ): AsyncGenerator<string, void, unknown> {
    // Add user input to conversation history
    this.messages.push({ role: OpenAIMessagesRoles.USER, content: userInput });

    // Call streaming method from OpenAIClient
    const stream = this.client.generateStreamCompletion(
      this.messages,
      model,
      maxTokens,
      temperature
    );

    // Yield each token incrementally as it arrives
    for await (const chunk of stream) {
      if (
        chunk.choices &&
        chunk.choices[0].delta &&
        chunk.choices[0].delta.content
      ) {
        const content = chunk.choices[0].delta.content;
        yield content;
      }
    }
  }
}
