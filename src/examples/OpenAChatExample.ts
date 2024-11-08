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
}
