import { generateLLMStreamResponse, OpenAIMessages } from "llm-proxy/dist";
import dotenv from "dotenv";
dotenv.config();

async function testStreamOpenAI() {
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

    const stream = await generateLLMStreamResponse(
      messages,
      "gpt-4o",
      1000,
      0.7,
      {
        apiKey: process.env.OPENAI_API_KEY,
      }
    );

    for await (const chunk of stream) {
      if (!chunk) continue;
      const deltaContent = (chunk.choices[0] as any).delta?.content;
      if (deltaContent) {
        process.stdout.write(deltaContent);
      }
    }
    console.log("\n"); // Add a newline at the end
  } catch (error) {
    console.error("Error:", error);
  }
}

export { testStreamOpenAI };
