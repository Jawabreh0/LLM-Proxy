import { OpenAIClient } from "../clients/OpenAIClient";
import { config } from "../../src/config/config";
import { OpenAIMessages, OpenAIMessagesRoles } from "../types";
import { OpenAISupportedLLMs } from "../types/SupportedModels";

describe("OpenAIClient", () => {
  let client: OpenAIClient;

  beforeAll(() => {
    client = new OpenAIClient(config.openaiApiKey);
  });

  it("should generate text based on input messages", async () => {
    const messages: OpenAIMessages = [
      {
        role: OpenAIMessagesRoles.SYSTEM,
        content: "You are a helpful assistant.",
      },
      {
        role: OpenAIMessagesRoles.USER,
        content: "Hello, I'm Ahmad, who are you?",
      },
      {
        role: OpenAIMessagesRoles.ASSISTANT,
        content: "I'm Lily, your AI Assistant. Nice to meet you, Ahmad.",
      },
      {
        role: OpenAIMessagesRoles.USER,
        content: "Thank you, how old are you?",
      },
    ];

    const response = await client.generateText(
      messages,
      OpenAISupportedLLMs.GPT_4_O,
      10,
      0.7
    );

    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0); // Check if the response is not empty
  });
});
