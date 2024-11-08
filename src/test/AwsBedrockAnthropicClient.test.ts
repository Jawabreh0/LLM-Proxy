import { AwsBedrockAnthropicService } from "../services/AwsBedrockAnthropicService";
import {
  BedrockAnthropicContentType,
  BedrockAnthropicMessageRole,
  BedrockAnthropicMessages,
  BedrockAnthropicSupportedLLMs,
} from "../types";

describe("AwsBedrockAnthropicService", () => {
  let client: AwsBedrockAnthropicService;

  beforeAll(() => {
    client = new AwsBedrockAnthropicService();
  });

  it("should generate a valid response based on input messages and system prompt", async () => {
    const messages: BedrockAnthropicMessages = [
      {
        role: BedrockAnthropicMessageRole.USER,
        content: [
          {
            type: BedrockAnthropicContentType.TEXT,
            text: "Hello, I'm Ahmad, who are you?",
          },
        ],
      },
      {
        role: BedrockAnthropicMessageRole.ASSISTANT,
        content: [
          {
            type: BedrockAnthropicContentType.TEXT,
            text: "I'm Lily, your AI Assistant. Nice to meet you, Ahmad.",
          },
        ],
      },
      {
        role: BedrockAnthropicMessageRole.USER,
        content: [
          {
            type: BedrockAnthropicContentType.TEXT,
            text: "Thank you, how old are you?",
          },
        ],
      },
    ];

    const systemPrompt = "You are a helpful assistant.";

    const response = await client.generateCompletion(
      messages,
      BedrockAnthropicSupportedLLMs.CLAUDE_3_HAIKU,
      100,
      0.7,
      systemPrompt
    );

    // Validate response structure
    expect(response).toBeDefined();
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("type", "message");
    expect(response).toHaveProperty(
      "role",
      BedrockAnthropicMessageRole.ASSISTANT
    );
    expect(response).toHaveProperty("model");
    expect(Array.isArray(response.content)).toBe(true);
    expect(response.content.length).toBeGreaterThan(0);

    // Check the type and structure of each item in the content array
    response.content.forEach((contentItem) => {
      expect(contentItem).toHaveProperty("type");
      if (contentItem.type === BedrockAnthropicContentType.TEXT) {
        expect(contentItem).toHaveProperty("text");
        expect(typeof contentItem.text).toBe("string");
      } else if (contentItem.type === BedrockAnthropicContentType.IMAGE) {
        expect(contentItem).toHaveProperty("source");
        expect(contentItem.source).toHaveProperty("type");
        expect(contentItem.source).toHaveProperty("media_type");
        expect(contentItem.source).toHaveProperty("data");
      } else if (contentItem.type === BedrockAnthropicContentType.TOOL_USE) {
        expect(contentItem).toHaveProperty("id");
        expect(contentItem).toHaveProperty("name");
        expect(contentItem).toHaveProperty("input");
      } else if (contentItem.type === BedrockAnthropicContentType.TOOL_RESULT) {
        expect(contentItem).toHaveProperty("content");
        expect(typeof contentItem.content).toBe("string");
      }
    });

    // Check usage field for input and output tokens
    if (response.usage) {
      expect(response.usage).toHaveProperty("input_tokens");
      expect(response.usage).toHaveProperty("output_tokens");
      expect(typeof response.usage.input_tokens).toBe("number");
      expect(typeof response.usage.output_tokens).toBe("number");
    }
  });
});
