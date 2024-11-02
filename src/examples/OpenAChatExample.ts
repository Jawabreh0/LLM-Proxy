import { OpenAIClient } from "../clients/OpenAIClient";
import {
  OpenAIMessage,
  OpenAIMessagesRoles,
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

    const response = await this.client.generateCompletion(
      this.messages,
      model,
      maxTokens,
      temperature
    );

    this.messages.push({
      role: OpenAIMessagesRoles.ASSISTANT,
      content: response,
    });
    console.log("Messages Array", this.messages);

    return response;
  }
}
