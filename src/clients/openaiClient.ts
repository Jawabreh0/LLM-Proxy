import { Messages, SupportedLLMs } from "../types";
import OpenAI from "openai";
import { ClientInterface } from "./ClientInterface";

export class OpenAIClient implements ClientInterface {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateCompletion(
    messages: Messages,
    model: SupportedLLMs,
    maxTokens: number,
    temperature: number
  ): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });

      return response.choices[0].message?.content || "";
    } catch (error) {
      console.error("Error generating text:", error);
      return "";
    }
  }
}
