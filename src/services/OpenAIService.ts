import OpenAI from "openai";
import { OpenAIMessages, OpenAIResponse } from "../types";
import { ClientService } from "./ClientService";

export class OpenAIService implements ClientService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateCompletion(
    messages: OpenAIMessages,
    model: string, // Updated to string
    maxTokens: number,
    temperature: number,
    systemPrompt?: string, // Optional parameter
    tools?: any // Optional parameter
  ): Promise<OpenAIResponse> {
    if (!model) {
      throw new Error("Model ID is required for OpenAIService.");
    }

    try {
      const response = await this.openai.chat.completions.create({
        model, // Use the string directly
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      return response as OpenAIResponse;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }

  async *generateStreamCompletion(
    messages: OpenAIMessages,
    model: string, // Updated to string
    maxTokens: number,
    temperature: number,
    systemPrompt?: string, // Optional parameter
    tools?: any, // Optional parameter
    stream?: boolean // Optional parameter
  ): AsyncGenerator<any, void, unknown> {
    if (!model) {
      throw new Error("Model ID is required for OpenAIService.");
    }

    try {
      const stream = await this.openai.chat.completions.create({
        model, // Use the string directly
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: true,
      });

      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      console.error("Error in stream completion:", error);
      throw error;
    }
  }
}
