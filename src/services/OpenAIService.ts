import OpenAI from "openai";
import { OpenAIMessages, OpenAIResponse, SupportedLLMs } from "../types";
import { ClientService } from "./ClientService";

export class OpenAIService implements ClientService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateCompletion(
    messages: OpenAIMessages,
    model: SupportedLLMs,
    maxTokens: number,
    temperature: number
  ): Promise<OpenAIResponse> {
    // Type-checking for OpenAI model
    if (model.type !== "OpenAI") {
      throw new Error("Unsupported model type for OpenAIService.");
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: model.model, // Use OpenAI-specific model property
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
    model: SupportedLLMs,
    maxTokens: number,
    temperature: number
  ): AsyncGenerator<any, void, unknown> {
    // Type-checking for OpenAI model
    if (model.type !== "OpenAI") {
      throw new Error("Unsupported model type for OpenAIService.");
    }

    try {
      const stream = await this.openai.chat.completions.create({
        model: model.model, // Use OpenAI-specific model property
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
