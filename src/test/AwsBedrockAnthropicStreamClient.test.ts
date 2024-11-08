// TODO: this test is fucked up and needs to be fixed

import { AwsBedrockAnthropicService } from "../services/AwsBedrockAnthropicService";
import {
  BedrockAnthropicContentType,
  BedrockAnthropicMessageRole,
  BedrockAnthropicMessages,
  BedrockAnthropicParsedChunk,
  BedrockAnthropicSupportedLLMs,
} from "../types";

describe("AwsBedrockAnthropicService Streaming", () => {
  let client: AwsBedrockAnthropicService;

  beforeAll(() => {
    client = new AwsBedrockAnthropicService();
  });

  it("should stream a valid response based on input messages and system prompt", async () => {
    const messages: BedrockAnthropicMessages = [
      {
        role: BedrockAnthropicMessageRole.USER,
        content: [
          {
            type: BedrockAnthropicContentType.TEXT,
            text: "Can you assist me with a task?",
          },
        ],
      },
    ];

    const systemPrompt = "You are a helpful assistant.";

    const stream = client.generateStreamCompletion(
      messages,
      BedrockAnthropicSupportedLLMs.CLAUDE_3_HAIKU,
      100,
      0.7,
      systemPrompt
    );

    let isFirstChunk = true;
    for await (const chunk of stream) {
      expect(chunk).toBeDefined();
      expect(chunk).toHaveProperty(
        "role",
        BedrockAnthropicMessageRole.ASSISTANT
      );
      expect(Array.isArray(chunk.content)).toBe(true);

      chunk.content.forEach((contentItem) => {
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
        } else if (
          contentItem.type === BedrockAnthropicContentType.TOOL_RESULT
        ) {
          expect(contentItem).toHaveProperty("content");
          expect(typeof contentItem.content).toBe("string");
        }
      });

      if (isFirstChunk) {
        // Verify initial chunk properties
        expect(chunk).toHaveProperty("id");
        expect(chunk).toHaveProperty("model");
        isFirstChunk = false;
      }
    }
  });
});
