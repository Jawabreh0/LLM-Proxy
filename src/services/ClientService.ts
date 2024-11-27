import { BedrockAnthropicParsedChunk, LLMResponse, Messages } from "../types";

// for non streaming responses
export interface ClientService {
  generateCompletion(
    messages: Messages,
    model?: string,
    max_tokens?: number,
    temperature?: number,
    functions?: any, // todo: sort out the type
    systemPrompt?: string
  ): Promise<LLMResponse>;

  // For streaming responses
  generateStreamCompletion(
    messages: Messages,
    model?: string,
    max_tokens?: number,
    temperature?: number,
    functions?: any, // todo: sort out the type it might be like this i guess(down)
    systemPrompt?: string
  ): AsyncGenerator<BedrockAnthropicParsedChunk, void, unknown>;
}

//  functions: [
//   {
//     name: "function1",
//     description: "Description of function1",
//     parameters: {/* JSON schema for function1 */}
//   },
