import { generateLLMResponse, OpenAIMessages } from "llm-proxy/dist";
import dotenv from "dotenv";

dotenv.config();

async function testNonStreamOpenAI() {
  console.log("Starting non-streaming test...");

  try {
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

    const response = await generateLLMResponse(
      messages,
      "gpt-4o",
      1000,
      0.7,

      {
        apiKey: process.env.OPENAI_API_KEY,
        awsConfig: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
          region: process.env.AWS_REGION || "",
        },
      }
    );

    console.log("Assistant Response:", response.choices[0].message.content);
    console.log("Usage:");
    console.log("Input", response.usage.prompt_tokens);
    console.log("Output Tokens", response.usage.completion_tokens);
  } catch (error) {
    console.error("OpenAI Error:", error);
  }
}

export { testNonStreamOpenAI };
