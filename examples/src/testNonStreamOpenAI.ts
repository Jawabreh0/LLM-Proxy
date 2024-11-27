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

    // The updated function call now uses an object format for parameters
    const response = await generateLLMResponse({
      messages: messages,
      model: "gpt-4o",
      max_tokens: 1000,
      temperature: 0.7,
      credentials: {
        apiKey: process.env.OPENAI_API_KEY,
        awsConfig: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
          region: process.env.AWS_REGION || "",
        },
      },
    });

    console.log("Assistant Response:", response.choices[0].message.content);
    console.log("Usage:");
    console.log("Input Tokens:", response.usage.prompt_tokens);
    console.log("Output Tokens:", response.usage.completion_tokens);
  } catch (error) {
    console.error("OpenAI Error:", error);
  }
}

export { testNonStreamOpenAI };
