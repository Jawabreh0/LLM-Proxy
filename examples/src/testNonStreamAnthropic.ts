import { generateLLMResponse, OpenAIMessages } from "llm-proxy/dist";
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
        role: "system",
        content: "you are a helpful assistant",
      },
      {
        role: "user",
        content: "tell me short a story",
      },
    ];

    // Ensure AWS credentials are properly formatted
    const credentials = {
      apiKey: process.env.OPENAI_API_KEY,
      awsConfig: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    };

    // Updated function call now uses an object format for parameters
    const response = await generateLLMResponse({
      messages: messages,
      model: "anthropic.claude-3-haiku-20240307-v1:0",
      max_tokens: 1000,
      temperature: 0.7,
      credentials: credentials,
    });

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
        credentials: {
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
