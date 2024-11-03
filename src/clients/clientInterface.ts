import { Messages, SupportedLLMs } from "../types";

export interface ClientInterface {
  generateCompletion(
    messages: Messages,
    model?: SupportedLLMs,
    maxTokens?: number,
    temperature?: number,
    stream?: boolean
  ): Promise<string>;
}
