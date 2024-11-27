import {
  generateLLMStreamResponse,
  OpenAIMessages,
  OpenAIMessagesRoles,
} from "llm-proxy/dist";
import dotenv from "dotenv";
dotenv.config();

async function testStreamOpenAI() {
  try {
    const messages: OpenAIMessages = [
      {
        role: "user",
        content: "hi",
      },
    ];

    const stream = await generateLLMStreamResponse(
      messages,
      "gpt-4o",
      1000,
      0.7,
      "You are a helpful assistant",
      [],
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
