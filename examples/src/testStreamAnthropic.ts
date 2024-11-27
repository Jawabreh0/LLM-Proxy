import { generateLLMStreamResponse, OpenAIMessages } from "llm-proxy/dist";
import dotenv from "dotenv";
dotenv.config();

async function testStreamAnthropic() {
  try {
    // Verify required environment variables
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.AWS_REGION;

    if (!accessKeyId || !secretAccessKey || !region) {
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
    const stream = await generateLLMStreamResponse(
      messages,
      "anthropic.claude-3-haiku-20240307-v1:0",
      1000,
      0.7,
      {
        apiKey: process.env.OPENAI_API_KEY,
        awsConfig: {
          accessKeyId,
          secretAccessKey,
          region,
        },
      }
    );
    for await (const chunk of stream) {
      if (!chunk) continue; // Skip null chunks
      const deltaContent = (chunk.choices[0] as any)?.delta?.content;
      if (deltaContent) {
        process.stdout.write(deltaContent);
      }
    }

    console.log("\n"); // Add a newline at the end
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

export { testStreamAnthropic };
