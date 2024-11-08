import { config } from "../../src/config/config";
import { OpenAIService } from "../services/OpenAIService";
import { Messages, OpenAIMessagesRoles, OpenAISupportedLLMs } from "../types";

describe("OpenAIClient", () => {
  let client: OpenAIService;

  beforeAll(() => {
    client = new OpenAIService(config.openaiApiKey);
  });

  it("should generate text based on input messages", async () => {
    const messages: Messages = [
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

    const response = await client.generateCompletion(
      messages,
      OpenAISupportedLLMs.GPT_4_O,
      10,
      0.7
    );

    // Verify that the response is of type OpenAIResponse
    expect(response).toBeDefined();
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("object", "chat.completion");
    expect(response).toHaveProperty("choices");
    expect(Array.isArray(response.choices)).toBe(true);
    expect(response.choices.length).toBeGreaterThan(0);

    // Verify the content of the first choice in the response
    const firstChoice = response.choices[0];
    expect(firstChoice).toHaveProperty("message");
    expect(firstChoice.message).toHaveProperty("role");
    expect(firstChoice.message).toHaveProperty("content");

    // Check if `usage` data is present and has expected structure
    expect(response).toHaveProperty("usage");
    expect(response.usage).toHaveProperty("total_tokens");
    expect(typeof response.usage.total_tokens).toBe("number");
  });
});
