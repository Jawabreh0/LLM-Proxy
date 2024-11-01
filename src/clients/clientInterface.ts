import { MessageRoles } from "../types";

export interface ClientInterface {
  generateText(
    messages: { role: MessageRoles; content: string }[],
    model?: string,
    maxTokens?: number,
    temperature?: number // TODO:  maybe we can use a type for this
  ): Promise<string>;
}
