import OpenAI from "openai";
import { ClientInterface } from "./ClientInterface";
import { ChatCompletionMessageParam } from "openai/resources";

export class OpenAIClient implements ClientInterface {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateText(
    messages: any[], // TODO: solve this. This is not the correct type
    options?: { model?: string; maxTokens?: number; temperature?: number }
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: options?.model || "gpt-4", // TODO: check again if this is the default model we want to use
      messages,
      max_tokens: options?.maxTokens || 100, // TODO: check again if this is the default maxTokens we want to use
      temperature: options?.temperature || 0.7, // TODO: check again if this is the default temperature we want to use
    });

    return response.choices[0].message?.content || ""; // TODO: let's handle this better
  }
}
