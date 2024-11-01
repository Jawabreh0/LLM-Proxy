import { OpenAIClient } from "../src/clients/OpenAIClient";
import { config } from "../src/config/config";
import { Messages } from "../src/types";

async function openaiChatCompletionExample(
  messages: Messages,
  model: string,
  maxTokens: number,
  temperature: number
) {
  const openaiClient = new OpenAIClient(config.openaiApiKey);
  try {
    const response = await openaiClient.generateText(
      messages,
      model,
      maxTokens,
      temperature
    );
    return response;
  } catch (error) {
    return error;
  }
}

export default openaiChatCompletionExample;
