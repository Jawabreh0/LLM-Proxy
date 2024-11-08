import { OpenAIClient } from "../clients/OpenaiClient";
import {
  Messages,
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

  async sendMessage(
    userInput: string,
    model: OpenAISupportedLLMs,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    this.messages.push({ role: OpenAIMessagesRoles.USER, content: userInput });

    const response: OpenAIResponse = await this.client.generateCompletion(
      this.messages,
      model,
      maxTokens,
      temperature
    );

    const responseContent: string = response.choices[0].message.content;
    this.messages.push({
      role: OpenAIMessagesRoles.ASSISTANT,
      content: responseContent,
    });

    return responseContent;
  }

  async *sendMessageStream(
    userInput: string,
    model: OpenAISupportedLLMs,
    maxTokens: number,
    temperature: number
  ): AsyncGenerator<string, void, unknown> {
    this.messages.push({ role: OpenAIMessagesRoles.USER, content: userInput });

    const stream = this.client.generateStreamCompletion(
      this.messages,
      model,
      maxTokens,
      temperature
    );

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
