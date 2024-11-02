import { OpenAIClient } from "../clients/OpenAIClient";
import { config } from "../../src/config/config";

describe("OpenAIClient", () => {
  let client: OpenAIClient;

  beforeAll(() => {
    client = new OpenAIClient(config.openaiApiKey);
  });

  it("should generate text based on input messages", async () => {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello, i'm Ahmad, who are you  ?" },
      {
        role: "assistant",
        content: "I'm Lily your AI Assistant,  nice  to meet you Ahmad",
      },
      { role: "user", content: "Thank  you, how old are you ?" },
    ];

    const response = await client.generateText(messages, "gpt-4", 10, 0.7);

    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(0); // Check if the response is not empty
  });
});
