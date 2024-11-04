import {
  BedrockAnthropicParsedChunk,
  Messages,
  OpenAIMessages,
  OpenAIResponse,
  OpenAISupportedLLMs,
  SupportedLLMs,
} from "../types";
import OpenAI from "openai";
import { ClientInterface } from "./ClientInterface";

export class OpenAIClient implements ClientInterface {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateCompletion(
    messages: OpenAIMessages,
    model: OpenAISupportedLLMs,
    maxTokens: number,
    temperature: number
  ): Promise<OpenAIResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      return response as OpenAIResponse;
    } catch (error) {
      console.error("Error generating text:", error);
      return {
        id: "",
        object: "error",
        created: Date.now(),
        model: model,
        choices: [],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          prompt_tokens_details: { cached_tokens: 0 },
          completion_tokens_details: { reasoning_tokens: 0 },
        },
        system_fingerprint: "",
      };
    }
  }
}
