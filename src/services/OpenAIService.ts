import OpenAI from "openai";
import { OpenAIMessages, OpenAIResponse } from "../types";
import { ClientService } from "./ClientService";

export default class OpenAIService implements ClientService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateCompletion({
    messages,
    model,
    max_tokens,
    temperature,
    functions,
  }: {
    messages: OpenAIMessages;
    model: string;
    max_tokens: number;
    temperature: number;
    systemPrompt?: string;
    functions?: any;
  }): Promise<OpenAIResponse> {
    if (!model) {
      return Promise.reject("Model ID is required for OpenAIService.");
    }

    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens,
        temperature,
        functions,
      });
      return response as OpenAIResponse;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async *generateStreamCompletion({
    messages,
    model,
    max_tokens,
    temperature,
    functions,
  }: {
    messages: OpenAIMessages;
    model: string;
    max_tokens: number;
    temperature: number;
    systemPrompt?: string;
    functions?: any;
  }): AsyncGenerator<any, void, unknown> {
    if (!model) {
      return Promise.reject("Model ID is required for OpenAIService.");
    }

    try {
      const stream = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens,
        temperature,
        functions,
        stream: true,
        stream_options: {
          include_usage: true,
        },
      });

      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
