import {
  BedrockAnthropicMessageRole,
  BedrockAnthropicSupportedLLMs,
  generateLLMResponse,
  OpenAIMessages,
  OpenAIMessagesRoles,
} from "llm-proxy/dist";
import dotenv from "dotenv";

dotenv.config();

async function testNonStreamAnthropic() {
  try {
    // Verify AWS credentials are present
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_REGION
    ) {
      throw new Error(
        "Missing required AWS credentials in environment variables"
      );
    }

    const messages: OpenAIMessages = [
      {
        role: OpenAIMessagesRoles.USER,
        content: "Who are you?",
      },
    ];

    // Ensure AWS credentials are properly formatted
    const credentials = {
      awsConfig: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    };

    const response = await generateLLMResponse(
      messages,
      {
        type: "BedrockAnthropic",
        model: BedrockAnthropicSupportedLLMs.CLAUDE_3_HAIKU,
      },
      1000,
      0.7,
      "You are a helpful assistant",
      [],
      credentials
    );

    console.log("Assistant Response:", response.choices[0].message.content);
    console.log("Usage:");
    console.log("Input Tokens:", response.usage.prompt_tokens);
    console.log("Output Tokens:", response.usage.completion_tokens);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        credintials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        },
      });
    } else {
      console.error("Unknown error:", error);
    }
    throw error;
  }
}

export { testNonStreamAnthropic };
